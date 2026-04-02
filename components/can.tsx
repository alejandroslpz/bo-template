import type { ReactNode } from "react";
import {
	hasPermission,
	hasRole,
	type Permission,
	type UserRole,
} from "@/lib/types/roles";

type CanProps = {
	role: UserRole;
	permission?: Permission;
	requiredRole?: UserRole;
	fallback?: ReactNode;
	children: ReactNode;
};

export function Can({
	role,
	permission,
	requiredRole,
	fallback = null,
	children,
}: CanProps) {
	const hasAccess =
		(permission != null && hasPermission(role, permission)) ||
		(requiredRole != null && hasRole(role, requiredRole));

	return hasAccess ? children : fallback;
}
