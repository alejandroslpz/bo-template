"use server";

import { getAuthUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types/roles";
import { deleteUserSchema, updateRoleSchema } from "@/lib/validations/admin";

export type AdminActionResult = {
	error?: string;
	success?: string;
};

export type UserRecord = {
	id: string;
	email: string;
	fullName: string;
	role: UserRole;
	createdAt: string;
};

export async function getUsers(): Promise<{
	data: UserRecord[];
	error?: string;
}> {
	const currentUser = await getAuthUser();

	if (!currentUser || currentUser.role !== "admin") {
		return { data: [], error: "Unauthorized. Admin access required." };
	}

	const supabase = await createClient();

	const { data: profiles, error } = await supabase
		.from("profiles")
		.select("id, email, full_name, role, created_at")
		.order("created_at", { ascending: false });

	if (error) {
		return { data: [], error: error.message };
	}

	const users: UserRecord[] = (profiles ?? []).map((profile) => ({
		id: profile.id,
		email: profile.email ?? "",
		fullName: profile.full_name ?? "",
		role: (profile.role as UserRole) ?? "viewer",
		createdAt: profile.created_at ?? "",
	}));

	return { data: users };
}

export async function updateUserRole(
	formData: FormData,
): Promise<AdminActionResult> {
	const currentUser = await getAuthUser();

	if (!currentUser || currentUser.role !== "admin") {
		return { error: "Unauthorized. Admin access required." };
	}

	const result = updateRoleSchema.safeParse({
		userId: formData.get("userId"),
		role: formData.get("role"),
	});

	if (!result.success) {
		const firstError = result.error.issues[0];
		return { error: firstError?.message ?? "Validation failed." };
	}

	if (result.data.userId === currentUser.id) {
		return { error: "You cannot change your own role." };
	}

	const supabase = await createClient();

	const { error } = await supabase
		.from("profiles")
		.update({ role: result.data.role })
		.eq("id", result.data.userId);

	if (error) {
		return { error: error.message };
	}

	return { success: "User role updated successfully." };
}

export async function deleteUser(
	formData: FormData,
): Promise<AdminActionResult> {
	const currentUser = await getAuthUser();

	if (!currentUser || currentUser.role !== "admin") {
		return { error: "Unauthorized. Admin access required." };
	}

	const result = deleteUserSchema.safeParse({
		userId: formData.get("userId"),
	});

	if (!result.success) {
		const firstError = result.error.issues[0];
		return { error: firstError?.message ?? "Validation failed." };
	}

	if (result.data.userId === currentUser.id) {
		return { error: "You cannot delete your own account." };
	}

	const supabase = await createClient();

	const { error } = await supabase
		.from("profiles")
		.delete()
		.eq("id", result.data.userId);

	if (error) {
		return { error: error.message };
	}

	return { success: "User deleted successfully." };
}
