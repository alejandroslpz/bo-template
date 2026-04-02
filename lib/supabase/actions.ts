"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthResult = {
	error?: string;
	success?: string;
};

export async function login(
	_prevState: AuthResult,
	formData: FormData,
): Promise<AuthResult> {
	const supabase = await createClient();

	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	if (!email || !password) {
		return { error: "Email and password are required." };
	}

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
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
	const supabase = await createClient();

	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const confirmPassword = formData.get("confirm-password") as string;

	if (!email || !password || !confirmPassword) {
		return { error: "All fields are required." };
	}

	if (password.length < 8) {
		return { error: "Password must be at least 8 characters long." };
	}

	if (password !== confirmPassword) {
		return { error: "Passwords do not match." };
	}

	const { error } = await supabase.auth.signUp({
		email,
		password,
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
	const supabase = await createClient();
	const headerStore = await headers();

	const email = formData.get("email") as string;

	if (!email) {
		return { error: "Email is required." };
	}

	const origin = headerStore.get("origin");

	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${origin}/callback?next=/reset-password`,
	});

	if (error) {
		return { error: error.message };
	}

	return { success: "Check your email for a password reset link." };
}

export async function updateProfile(
	_prevState: AuthResult,
	formData: FormData,
): Promise<AuthResult> {
	const supabase = await createClient();

	const fullName = formData.get("full_name") as string;

	if (!fullName) {
		return { error: "Full name is required." };
	}

	const { error } = await supabase.auth.updateUser({
		data: { full_name: fullName },
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
	const supabase = await createClient();

	const password = formData.get("password") as string;
	const confirmPassword = formData.get("confirm-password") as string;

	if (!password || !confirmPassword) {
		return { error: "All fields are required." };
	}

	if (password.length < 8) {
		return { error: "Password must be at least 8 characters long." };
	}

	if (password !== confirmPassword) {
		return { error: "Passwords do not match." };
	}

	const { error } = await supabase.auth.updateUser({ password });

	if (error) {
		return { error: error.message };
	}

	redirect("/dashboard");
}
