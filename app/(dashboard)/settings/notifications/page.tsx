"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "app-settings-notifications";

interface NotificationSettings {
	emailNotifications: boolean;
	pushNotifications: boolean;
	marketingEmails: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
	emailNotifications: true,
	pushNotifications: false,
	marketingEmails: false,
};

const NOTIFICATION_OPTIONS: {
	key: keyof NotificationSettings;
	title: string;
	description: string;
}[] = [
	{
		key: "emailNotifications",
		title: "Email Notifications",
		description:
			"Receive email notifications about account activity, security alerts, and important updates.",
	},
	{
		key: "pushNotifications",
		title: "Push Notifications",
		description:
			"Get real-time push notifications in your browser for new messages and events.",
	},
	{
		key: "marketingEmails",
		title: "Marketing Emails",
		description:
			"Receive occasional emails about new features, tips, and product announcements.",
	},
];

function loadSettings(): NotificationSettings {
	if (typeof window === "undefined") {
		return DEFAULT_SETTINGS;
	}
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
		}
	} catch {
		// ignore parse errors
	}
	return DEFAULT_SETTINGS;
}

function Toggle({
	checked,
	onCheckedChange,
}: {
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
}) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			onClick={() => onCheckedChange(!checked)}
			className={cn(
				"inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
				checked ? "bg-primary" : "bg-input",
			)}
		>
			<span
				className={cn(
					"pointer-events-none block size-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
					checked ? "translate-x-5" : "translate-x-0",
				)}
			/>
		</button>
	);
}

export default function NotificationSettingsPage() {
	const [settings, setSettings] =
		useState<NotificationSettings>(DEFAULT_SETTINGS);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setSettings(loadSettings());
		setMounted(true);
	}, []);

	const handleToggle = useCallback(
		(key: keyof NotificationSettings, value: boolean) => {
			setSettings((prev) => ({ ...prev, [key]: value }));
		},
		[],
	);

	const handleSave = useCallback(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
			toast.success("Notification preferences saved.");
		} catch {
			toast.error("Failed to save preferences.");
		}
	}, [settings]);

	if (!mounted) {
		return null;
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Notifications</CardTitle>
					<CardDescription>
						Choose how you want to be notified about activity and updates.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						{NOTIFICATION_OPTIONS.map((option) => (
							<div
								key={option.key}
								className="flex items-start justify-between gap-4"
							>
								<div className="space-y-1">
									<p className="text-sm font-medium">{option.title}</p>
									<p className="text-muted-foreground text-sm">
										{option.description}
									</p>
								</div>
								<Toggle
									checked={settings[option.key]}
									onCheckedChange={(value) => handleToggle(option.key, value)}
								/>
							</div>
						))}
						<div className="pt-2">
							<Button onClick={handleSave}>Save Preferences</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
