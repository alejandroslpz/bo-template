import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { CommandPalette } from "@/components/command-palette";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { RoleProvider } from "@/hooks/use-role";
import { getAuthUser } from "@/lib/supabase/auth";

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const authUser = await getAuthUser();

	if (!authUser) {
		redirect("/login");
	}

	const sidebarUser = {
		name: authUser.fullName,
		email: authUser.email,
		avatar: authUser.avatarUrl,
		role: authUser.role,
	};

	return (
		<SidebarProvider>
			<RoleProvider role={authUser.role}>
				<AppSidebar user={sidebarUser} />
				<SidebarInset>
					<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
						<div className="flex items-center gap-2 px-4">
							<SidebarTrigger className="-ml-1" />
							<Separator
								orientation="vertical"
								className="mr-2 data-vertical:h-4 data-vertical:self-auto"
							/>
							<DynamicBreadcrumb />
						</div>
					</header>
					<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
						{children}
					</div>
				</SidebarInset>
				<CommandPalette />
			</RoleProvider>
		</SidebarProvider>
	);
}
