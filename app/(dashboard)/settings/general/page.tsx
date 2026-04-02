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
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const TIMEZONES = [
	{ value: "UTC", label: "UTC" },
	{ value: "America/New_York", label: "Eastern Time (US)" },
	{ value: "America/Chicago", label: "Central Time (US)" },
	{ value: "America/Denver", label: "Mountain Time (US)" },
	{ value: "America/Los_Angeles", label: "Pacific Time (US)" },
	{ value: "America/Mexico_City", label: "Mexico City" },
	{ value: "America/Sao_Paulo", label: "São Paulo" },
	{ value: "America/Buenos_Aires", label: "Buenos Aires" },
	{ value: "Europe/London", label: "London" },
	{ value: "Europe/Paris", label: "Paris" },
	{ value: "Europe/Berlin", label: "Berlin" },
	{ value: "Europe/Madrid", label: "Madrid" },
	{ value: "Asia/Tokyo", label: "Tokyo" },
	{ value: "Asia/Shanghai", label: "Shanghai" },
	{ value: "Asia/Kolkata", label: "Kolkata" },
	{ value: "Australia/Sydney", label: "Sydney" },
];

const LANGUAGES = [
	{ value: "en", label: "English" },
	{ value: "es", label: "Spanish" },
];

const STORAGE_KEY = "app-settings-general";

interface GeneralSettings {
	appName: string;
	timezone: string;
	language: string;
}

const DEFAULT_SETTINGS: GeneralSettings = {
	appName: "Backoffice",
	timezone: "UTC",
	language: "en",
};

function loadSettings(): GeneralSettings {
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

export default function GeneralSettingsPage() {
	const [settings, setSettings] = useState<GeneralSettings>(DEFAULT_SETTINGS);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setSettings(loadSettings());
		setMounted(true);
	}, []);

	const handleSave = useCallback(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
			toast.success("General settings saved.");
		} catch {
			toast.error("Failed to save settings.");
		}
	}, [settings]);

	if (!mounted) {
		return null;
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>General</CardTitle>
					<CardDescription>
						Configure basic application settings.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="app-name">Application Name</FieldLabel>
							<FieldDescription>
								The name displayed in the browser tab and sidebar.
							</FieldDescription>
							<Input
								id="app-name"
								value={settings.appName}
								onChange={(e) =>
									setSettings((prev) => ({
										...prev,
										appName: e.target.value,
									}))
								}
								placeholder="My Backoffice"
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="timezone">Timezone</FieldLabel>
							<FieldDescription>
								Select your preferred timezone for dates and times.
							</FieldDescription>
							<Select
								value={settings.timezone}
								onValueChange={(value) =>
									setSettings((prev) => ({ ...prev, timezone: value }))
								}
							>
								<SelectTrigger id="timezone" className="w-full">
									<SelectValue placeholder="Select timezone" />
								</SelectTrigger>
								<SelectContent>
									{TIMEZONES.map((tz) => (
										<SelectItem key={tz.value} value={tz.value}>
											{tz.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>
						<Field>
							<FieldLabel htmlFor="language">Language</FieldLabel>
							<FieldDescription>
								Choose the display language for the application.
							</FieldDescription>
							<Select
								value={settings.language}
								onValueChange={(value) =>
									setSettings((prev) => ({ ...prev, language: value }))
								}
							>
								<SelectTrigger id="language" className="w-full">
									<SelectValue placeholder="Select language" />
								</SelectTrigger>
								<SelectContent>
									{LANGUAGES.map((lang) => (
										<SelectItem key={lang.value} value={lang.value}>
											{lang.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>
						<Field>
							<Button onClick={handleSave}>Save Changes</Button>
						</Field>
					</FieldGroup>
				</CardContent>
			</Card>
		</div>
	);
}
