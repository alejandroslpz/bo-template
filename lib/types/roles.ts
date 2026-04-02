export type UserRole = "admin" | "editor" | "viewer";

export const USER_ROLES: UserRole[] = ["admin", "editor", "viewer"];

export const ROLE_LABELS: Record<UserRole, string> = {
	admin: "Admin",
	editor: "Editor",
	viewer: "Viewer",
};

export type Profile = {
	id: string;
	role: UserRole;
	created_at: string;
	updated_at: string;
};

// Permission map: what each role can do
export const ROLE_PERMISSIONS = {
	admin: [
		"manage_users",
		"edit_content",
		"view_content",
		"manage_settings",
	] as const,
	editor: ["edit_content", "view_content"] as const,
	viewer: ["view_content"] as const,
} as const;

export type Permission = (typeof ROLE_PERMISSIONS)[UserRole][number];

export function hasPermission(role: UserRole, permission: Permission): boolean {
	return (ROLE_PERMISSIONS[role] as readonly string[]).includes(permission);
}

export function hasRole(role: UserRole, requiredRole: UserRole): boolean {
	const hierarchy: Record<UserRole, number> = {
		admin: 3,
		editor: 2,
		viewer: 1,
	};
	return hierarchy[role] >= hierarchy[requiredRole];
}
