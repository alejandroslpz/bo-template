export type OrgRole = "owner" | "admin" | "member";

export type Organization = {
	id: string;
	name: string;
	slug: string;
	logoUrl: string | null;
	createdAt: string;
};

export type Membership = {
	id: string;
	userId: string;
	organizationId: string;
	role: OrgRole;
	createdAt: string;
};

export type OrganizationWithRole = Organization & {
	role: OrgRole;
};
