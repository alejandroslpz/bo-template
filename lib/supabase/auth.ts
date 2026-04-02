import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types/roles";

export type AuthUser = {
	id: string;
	email: string;
	fullName: string;
	avatarUrl: string;
	role: UserRole;
};

export async function getAuthUser(): Promise<AuthUser | null> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return null;

	const { data: profile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();

	return {
		id: user.id,
		email: user.email ?? "",
		fullName:
			user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "User",
		avatarUrl: user.user_metadata?.avatar_url ?? "",
		role: (profile?.role as UserRole) ?? "viewer",
	};
}

export async function requireAdmin(): Promise<AuthUser> {
	const user = await getAuthUser();
	if (!user || user.role !== "admin") {
		redirect("/dashboard");
	}
	return user;
}
