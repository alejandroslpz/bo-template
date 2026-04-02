"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
	{
		value: "light",
		label: "Light",
		description: "A clean, bright appearance.",
		icon: SunIcon,
	},
	{
		value: "dark",
		label: "Dark",
		description: "Easy on the eyes in low light.",
		icon: MoonIcon,
	},
	{
		value: "system",
		label: "System",
		description: "Follows your operating system setting.",
		icon: MonitorIcon,
	},
] as const;

export default function AppearanceSettingsPage() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Appearance</CardTitle>
					<CardDescription>
						Customize how the application looks on your device.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 sm:grid-cols-3">
						{THEME_OPTIONS.map((option) => (
							<button
								key={option.value}
								type="button"
								onClick={() => setTheme(option.value)}
								className={cn(
									"border-input hover:bg-accent/50 flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-colors",
									theme === option.value &&
										"border-primary bg-accent ring-primary/20 ring-2",
								)}
							>
								<option.icon
									className={cn(
										"size-8",
										theme === option.value
											? "text-primary"
											: "text-muted-foreground",
									)}
								/>
								<div className="space-y-1">
									<p className="text-sm font-medium">{option.label}</p>
									<p className="text-muted-foreground text-xs">
										{option.description}
									</p>
								</div>
							</button>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
