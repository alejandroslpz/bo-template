import { z } from "zod";
import { USER_ROLES } from "@/lib/types/roles";

export const updateRoleSchema = z.object({
	userId: z.string().uuid("Invalid user ID."),
	role: z.enum(USER_ROLES, {
		error: "Invalid role.",
	}),
});

export const deleteUserSchema = z.object({
	userId: z.string().uuid("Invalid user ID."),
});
