import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { OrganizationWithRole } from "@/lib/types/organization";

const CURRENT_ORG_COOKIE = "current-org";

/**
 * Get all organizations the current user belongs to, with their role.
 */
export async function getUserOrganizations(): Promise<OrganizationWithRole[]> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return [];

	const { data: memberships } = await supabase
		.from("memberships")
		.select(
			"role, organization:organizations(id, name, slug, logo_url, created_at)",
		)
		.eq("user_id", user.id);

	if (!memberships) return [];

	return memberships
		.filter((m) => m.organization !== null)
		.map((m) => {
			const org = m.organization as unknown as {
				id: string;
				name: string;
				slug: string;
				logo_url: string | null;
				created_at: string;
			};
			return {
				id: org.id,
				name: org.name,
				slug: org.slug,
				logoUrl: org.logo_url,
				createdAt: org.created_at,
				role: m.role as OrganizationWithRole["role"],
			};
		});
}

/**
 * Get a specific organization by ID.
 */
export async function getCurrentOrganization(
	orgId: string,
): Promise<OrganizationWithRole | null> {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return null;

	const { data: membership } = await supabase
		.from("memberships")
		.select(
			"role, organization:organizations(id, name, slug, logo_url, created_at)",
		)
		.eq("user_id", user.id)
		.eq("organization_id", orgId)
		.single();

	if (!membership?.organization) return null;

	const org = membership.organization as unknown as {
		id: string;
		name: string;
		slug: string;
		logo_url: string | null;
		created_at: string;
	};

	return {
		id: org.id,
		name: org.name,
		slug: org.slug,
		logoUrl: org.logo_url,
		createdAt: org.created_at,
		role: membership.role as OrganizationWithRole["role"],
	};
}

/**
 * Store the current organization ID in a cookie.
 */
export async function switchOrganization(orgId: string): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.set(CURRENT_ORG_COOKIE, orgId, {
		path: "/",
		maxAge: 60 * 60 * 24 * 365, // 1 year
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
	});
}

/**
 * Get the current organization ID from the cookie.
 */
export async function getCurrentOrgId(): Promise<string | null> {
	const cookieStore = await cookies();
	return cookieStore.get(CURRENT_ORG_COOKIE)?.value ?? null;
}
