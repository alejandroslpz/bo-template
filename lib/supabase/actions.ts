"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
	forgotPasswordSchema,
	loginSchema,
	resetPasswordSchema,
	signupSchema,
	updateProfileSchema,
} from "@/lib/validations/auth";

export type AuthResult = {
	error?: string;
	fieldErrors?: Record<string, string>;
	success?: string;
};

export async function login(
	_prevState: AuthResult,
	formData: FormData,
): Promise<AuthResult> {
	const result = loginSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!result.success) {
		const fieldErrors: Record<string, string> = {};
		for (const issue of result.error.issues) {
			const key = issue.path[0]?.toString();
			if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
		}
		return { fieldErrors };
	}

	const supabase = await createClient();

	const { error } = await supabase.auth.signInWithPassword({
		email: result.data.email,
		password: result.data.password,
	});

	if (error) {
		return { error: error.message };
	}

	redirect("/dashboard");
}

export async function signup(
	_prevState: AuthResult,
	formData: FormData,
): Promise<AuthResult> {
	const result = signupSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
		"confirm-password": formData.get("confirm-password"),
	});

	if (!result.success) {
		const fieldErrors: Record<string, string> = {};
		for (const issue of result.error.issues) {
			const key = issue.path[0]?.toString() ?? "_root";
			if (!fieldErrors[key]) fieldErrors[key] = issue.message;
		}
		return { fieldErrors };
	}

	const supabase = await createClient();

	const { error } = await supabase.auth.signUp({
		email: result.data.email,
		password: result.data.password,
	});

	if (error) {
		return { error: error.message };
	}

	redirect("/login?message=Check your email to confirm your account");
}

export async function logout(): Promise<void> {
	const supabase = await createClient();
	await supabase.auth.signOut();
	redirect("/login");
}

export async function forgotPassword(
	_prevState: AuthResult,
	formData: FormData,
): Promise<AuthResult> {
	const result = forgotPasswordSchema.safeParse({
		email: formData.get("email"),
	});

	if (!result.success) {
		const fieldErrors: Record<string, string> = {};
		for (const issue of result.error.issues) {
			const key = issue.path[0]?.toString();
			if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
		}
		return { fieldErrors };
	}

	const supabase = await createClient();
	const headerStore = await headers();

	const origin = headerStore.get("origin");

	const { error } = await supabase.auth.resetPasswordForEmail(
		result.data.email,
		{
			redirectTo: `${origin}/callback?next=/reset-password`,
		},
	);

	if (error) {
		return { error: error.message };
	}

	return { success: "Check your email for a password reset link." };
}

export async function updateProfile(
	_prevState: AuthResult,
	formData: FormData,
): Promise<AuthResult> {
	const result = updateProfileSchema.safeParse({
		full_name: formData.get("full_name"),
	});

	if (!result.success) {
		const fieldErrors: Record<string, string> = {};
		for (const issue of result.error.issues) {
			const key = issue.path[0]?.toString();
			if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
		}
		return { fieldErrors };
	}

	const supabase = await createClient();

	const { error } = await supabase.auth.updateUser({
		data: { full_name: result.data.full_name },
	});

	if (error) {
		return { error: error.message };
	}

	return { success: "Profile updated successfully." };
}

export async function resetPassword(
	_prevState: AuthResult,
	formData: FormData,
): Promise<AuthResult> {
	const result = resetPasswordSchema.safeParse({
		password: formData.get("password"),
		"confirm-password": formData.get("confirm-password"),
	});

	if (!result.success) {
		const fieldErrors: Record<string, string> = {};
		for (const issue of result.error.issues) {
			const key = issue.path[0]?.toString() ?? "_root";
			if (!fieldErrors[key]) fieldErrors[key] = issue.message;
		}
		return { fieldErrors };
	}

	const supabase = await createClient();

	const { error } = await supabase.auth.updateUser({
		password: result.data.password,
	});

	if (error) {
		return { error: error.message };
	}

	redirect("/dashboard");
}
