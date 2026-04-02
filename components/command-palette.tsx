"use client";

import {
	LayoutDashboardIcon,
	LogOutIcon,
	MonitorIcon,
	MoonIcon,
	SunIcon,
	UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { logout } from "@/lib/supabase/actions";

export function CommandPalette() {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const { setTheme } = useTheme();

	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((prev) => !prev);
			}
		}

		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, []);

	function runCommand(command: () => void) {
		setOpen(false);
		command();
	}

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<CommandInput placeholder="Type a command or search..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Navigation">
					<CommandItem
						onSelect={() => runCommand(() => router.push("/dashboard"))}
					>
						<LayoutDashboardIcon />
						<span>Dashboard</span>
					</CommandItem>
					<CommandItem
						onSelect={() => runCommand(() => router.push("/profile"))}
					>
						<UserIcon />
						<span>Profile</span>
					</CommandItem>
				</CommandGroup>
				<CommandGroup heading="Auth">
					<CommandItem onSelect={() => runCommand(() => logout())}>
						<LogOutIcon />
						<span>Log out</span>
					</CommandItem>
				</CommandGroup>
				<CommandGroup heading="Settings">
					<CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
						<SunIcon />
						<span>Light theme</span>
					</CommandItem>
					<CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
						<MoonIcon />
						<span>Dark theme</span>
					</CommandItem>
					<CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
						<MonitorIcon />
						<span>System theme</span>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
