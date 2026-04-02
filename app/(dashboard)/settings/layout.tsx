"use client";

import { BellIcon, MonitorIcon, PaletteIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const settingsNav = [
	{
		title: "General",
		href: "/settings/general",
		icon: MonitorIcon,
	},
	{
		title: "Appearance",
		href: "/settings/appearance",
		icon: PaletteIcon,
	},
	{
		title: "Notifications",
		href: "/settings/notifications",
		icon: BellIcon,
	},
];

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	return (
		<div className="mx-auto w-full max-w-4xl space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Settings</h1>
				<p className="text-muted-foreground text-sm">
					Manage your application preferences and configuration.
				</p>
			</div>
			<div className="flex flex-col gap-6 md:flex-row">
				<nav className="flex shrink-0 flex-row gap-1 md:w-48 md:flex-col">
					{settingsNav.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
								pathname === item.href
									? "bg-accent text-accent-foreground"
									: "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
							)}
						>
							<item.icon className="size-4" />
							{item.title}
						</Link>
					))}
				</nav>
				<div className="flex-1">{children}</div>
			</div>
		</div>
	);
}
