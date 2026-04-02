"use server";

import { createClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
] as const;

export type StorageResult = {
	url?: string;
	error?: string;
};

export type DeleteResult = {
	success?: boolean;
	error?: string;
};

export async function uploadFile(formData: FormData): Promise<StorageResult> {
	const file = formData.get("file") as File | null;
	const bucket = (formData.get("bucket") as string) || "uploads";

	if (!file || file.size === 0) {
		return { error: "No file provided." };
	}

	if (file.size > MAX_FILE_SIZE) {
		return { error: "File size exceeds the 5MB limit." };
	}

	if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
		return {
			error: "Invalid file type. Allowed: JPG, PNG, GIF, WEBP.",
		};
	}

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { error: "You must be logged in to upload files." };
	}

	const timestamp = Date.now();
	const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
	const path = `${user.id}/${timestamp}-${sanitizedName}`;

	const { error } = await supabase.storage.from(bucket).upload(path, file, {
		cacheControl: "3600",
		upsert: false,
	});

	if (error) {
		return { error: error.message };
	}

	const {
		data: { publicUrl },
	} = supabase.storage.from(bucket).getPublicUrl(path);

	return { url: publicUrl };
}

export async function deleteFile(path: string): Promise<DeleteResult> {
	const bucket = "uploads";

	if (!path) {
		return { error: "No file path provided." };
	}

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { error: "You must be logged in to delete files." };
	}

	const { error } = await supabase.storage.from(bucket).remove([path]);

	if (error) {
		return { error: error.message };
	}

	return { success: true };
}
