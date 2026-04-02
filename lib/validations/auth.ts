import { z } from "zod";

export const loginSchema = z.object({
	email: z.email("Please enter a valid email address."),
	password: z.string().min(1, "Password is required."),
});

export const signupSchema = z
	.object({
		email: z.email("Please enter a valid email address."),
		password: z.string().min(8, "Password must be at least 8 characters long."),
		"confirm-password": z
			.string()
			.min(8, "Password must be at least 8 characters long."),
	})
	.refine((data) => data.password === data["confirm-password"], {
		message: "Passwords do not match.",
	});

export const forgotPasswordSchema = z.object({
	email: z.email("Please enter a valid email address."),
});

export const resetPasswordSchema = z
	.object({
		password: z.string().min(8, "Password must be at least 8 characters long."),
		"confirm-password": z
			.string()
			.min(8, "Password must be at least 8 characters long."),
	})
	.refine((data) => data.password === data["confirm-password"], {
		message: "Passwords do not match.",
	});

export const updateProfileSchema = z.object({
	full_name: z.string().min(1, "Name is required."),
});
