"use client";

import {
	BuildingIcon,
	CheckIcon,
	ChevronsUpDownIcon,
	PlusCircleIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import type { OrgRole } from "@/lib/types/organization";

type OrgItem = {
	id: string;
	name: string;
	slug: string;
	logoUrl: string | null;
	role: OrgRole;
};

const MOCK_ORGANIZATIONS: OrgItem[] = [
	{
		id: "org-1",
		name: "Acme Corp",
		slug: "acme-corp",
		logoUrl: null,
		role: "owner",
	},
	{
		id: "org-2",
		name: "Globex Inc",
		slug: "globex-inc",
		logoUrl: null,
		role: "admin",
	},
	{
		id: "org-3",
		name: "Initech",
		slug: "initech",
		logoUrl: null,
		role: "member",
	},
];

function setCurrentOrgCookie(orgId: string) {
	if ("cookieStore" in window) {
		(
			window as unknown as { cookieStore: { set: (opts: object) => void } }
		).cookieStore.set({
			name: "current-org",
			value: orgId,
			path: "/",
			maxAge: 60 * 60 * 24 * 365,
			sameSite: "lax",
		});
	} else {
		// biome-ignore lint/suspicious/noDocumentCookie: Fallback for browsers without Cookie Store API
		document.cookie = `current-org=${orgId};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
	}
}

export function OrgSwitcher() {
	const { isMobile } = useSidebar();
	const router = useRouter();
	const [currentOrg, setCurrentOrg] = useState<OrgItem>(MOCK_ORGANIZATIONS[0]);

	function handleSwitch(org: OrgItem) {
		setCurrentOrg(org);
		setCurrentOrgCookie(org.id);
		router.refresh();
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
								<BuildingIcon className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{currentOrg.name}</span>
								<span className="truncate text-xs capitalize text-muted-foreground">
									{currentOrg.role}
								</span>
							</div>
							<ChevronsUpDownIcon className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="start"
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-xs text-muted-foreground">
							Organizations
						</DropdownMenuLabel>
						{MOCK_ORGANIZATIONS.map((org) => (
							<DropdownMenuItem
								key={org.id}
								onClick={() => handleSwitch(org)}
								className="gap-2 p-2"
							>
								<div className="flex size-6 items-center justify-center rounded-sm border">
									<BuildingIcon className="size-4 shrink-0" />
								</div>
								<span className="flex-1 truncate">{org.name}</span>
								{org.id === currentOrg.id && (
									<CheckIcon className="ml-auto size-4" />
								)}
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem className="gap-2 p-2">
							<div className="flex size-6 items-center justify-center rounded-md border bg-background">
								<PlusCircleIcon className="size-4" />
							</div>
							<span className="text-muted-foreground">Create organization</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
