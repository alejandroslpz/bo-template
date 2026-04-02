"use client";

import { createContext, useContext } from "react";
import type { UserRole } from "@/lib/types/roles";

const RoleContext = createContext<UserRole>("viewer");

export function RoleProvider({
	role,
	children,
}: {
	role: UserRole;
	children: React.ReactNode;
}) {
	return <RoleContext value={role}>{children}</RoleContext>;
}

export function useRole() {
	return useContext(RoleContext);
}
