"use client";

import {
	LogIn,
	LogOut,
	type LucideIcon,
	Pencil,
	Shield,
	Trash2,
	Upload,
	UserPlus,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { AuditLog } from "@/lib/types/audit";

type MockAuditEntry = AuditLog & {
	userName: string;
};

const ACTION_CONFIG: Record<string, { label: string; icon: LucideIcon }> = {
	"user.created": { label: "Created a new user", icon: UserPlus },
	"user.deleted": { label: "Deleted a user", icon: Trash2 },
	"user.role_updated": { label: "Updated user role", icon: Shield },
	"user.login": { label: "Signed in", icon: LogIn },
	"user.logout": { label: "Signed out", icon: LogOut },
	"profile.updated": { label: "Updated profile", icon: Pencil },
	"file.uploaded": { label: "Uploaded a file", icon: Upload },
};

function getActionConfig(action: string): { label: string; icon: LucideIcon } {
	return ACTION_CONFIG[action] ?? { label: action, icon: Pencil };
}

function formatTimeAgo(dateString: string): string {
	const now = new Date();
	const date = new Date(dateString);
	const diffMs = now.getTime() - date.getTime();
	const diffSeconds = Math.floor(diffMs / 1000);
	const diffMinutes = Math.floor(diffSeconds / 60);
	const diffHours = Math.floor(diffMinutes / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffSeconds < 60) return "just now";
	if (diffMinutes < 60) return `${diffMinutes}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	return `${diffDays}d ago`;
}

const now = new Date();

const MOCK_ACTIVITIES: MockAuditEntry[] = [
	{
		id: "1",
		userId: "u1",
		action: "user.created",
		entityType: "user",
		entityId: "u10",
		metadata: { email: "newuser@example.com" },
		createdAt: new Date(now.getTime() - 2 * 60 * 1000).toISOString(),
		userName: "Alice Johnson",
	},
	{
		id: "2",
		userId: "u2",
		action: "profile.updated",
		entityType: "profile",
		entityId: "u2",
		metadata: {},
		createdAt: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
		userName: "Bob Smith",
	},
	{
		id: "3",
		userId: "u1",
		action: "user.role_updated",
		entityType: "user",
		entityId: "u5",
		metadata: { from: "viewer", to: "editor" },
		createdAt: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
		userName: "Alice Johnson",
	},
	{
		id: "4",
		userId: "u3",
		action: "file.uploaded",
		entityType: "file",
		entityId: "f1",
		metadata: { filename: "report.pdf" },
		createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
		userName: "Charlie Brown",
	},
	{
		id: "5",
		userId: "u4",
		action: "user.login",
		entityType: "user",
		entityId: "u4",
		metadata: {},
		createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
		userName: "Diana Prince",
	},
	{
		id: "6",
		userId: "u1",
		action: "user.deleted",
		entityType: "user",
		entityId: "u9",
		metadata: { email: "removed@example.com" },
		createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
		userName: "Alice Johnson",
	},
	{
		id: "7",
		userId: "u5",
		action: "profile.updated",
		entityType: "profile",
		entityId: "u5",
		metadata: {},
		createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
		userName: "Edward Norton",
	},
	{
		id: "8",
		userId: "u2",
		action: "user.login",
		entityType: "user",
		entityId: "u2",
		metadata: {},
		createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
		userName: "Bob Smith",
	},
	{
		id: "9",
		userId: "u3",
		action: "user.logout",
		entityType: "user",
		entityId: "u3",
		metadata: {},
		createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
		userName: "Charlie Brown",
	},
	{
		id: "10",
		userId: "u1",
		action: "user.role_updated",
		entityType: "user",
		entityId: "u7",
		metadata: { from: "editor", to: "admin" },
		createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
		userName: "Alice Johnson",
	},
];

export function ActivityFeed() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Activity</CardTitle>
				<CardDescription>Latest actions from the audit log.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="relative space-y-0">
					{MOCK_ACTIVITIES.map((activity, index) => {
						const config = getActionConfig(activity.action);
						const Icon = config.icon;
						const isLast = index === MOCK_ACTIVITIES.length - 1;

						return (
							<div
								key={activity.id}
								className="relative flex gap-3 pb-6 last:pb-0"
							>
								{!isLast && (
									<div className="bg-border absolute top-8 bottom-0 left-4 w-px" />
								)}
								<Avatar size="sm" className="relative z-10 mt-0.5 shrink-0">
									<AvatarFallback className="bg-muted">
										<Icon className="size-3" />
									</AvatarFallback>
								</Avatar>
								<div className="flex-1 min-w-0">
									<p className="text-sm leading-tight">
										<span className="font-medium">{activity.userName}</span>
										<span className="text-muted-foreground">
											{" "}
											{config.label.toLowerCase()}
										</span>
									</p>
									<p className="text-muted-foreground mt-0.5 text-xs">
										{formatTimeAgo(activity.createdAt)}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
