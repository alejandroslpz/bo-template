"use client";

import {
	LayoutDashboardIcon,
	ScrollTextIcon,
	Settings2Icon,
	UsersIcon,
} from "lucide-react";
import type * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";

const data = {
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: <LayoutDashboardIcon />,
			isActive: true,
			items: [],
		},
		{
			title: "Users",
			url: "/users",
			icon: <UsersIcon />,
			items: [],
		},
		{
			title: "Audit Log",
			url: "/audit",
			icon: <ScrollTextIcon />,
			items: [],
		},
		{
			title: "Settings",
			url: "#",
			icon: <Settings2Icon />,
			items: [{ title: "General", url: "/profile" }],
		},
	],
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
	user: {
		name: string;
		email: string;
		avatar: string;
		role: string;
	};
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader />
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
