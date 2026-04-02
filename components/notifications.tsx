"use client";

import { Bell } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Notification } from "@/lib/types/notification";
import { cn } from "@/lib/utils";

const MOCK_NOTIFICATIONS: Notification[] = [
	{
		id: "1",
		type: "info",
		title: "System Update",
		message: "A new version of the platform is available.",
		read: false,
		createdAt: new Date(Date.now() - 1000 * 60 * 5),
	},
	{
		id: "2",
		type: "success",
		title: "Export Complete",
		message: "Your CSV export has finished processing.",
		read: false,
		createdAt: new Date(Date.now() - 1000 * 60 * 15),
	},
	{
		id: "3",
		type: "warning",
		title: "Storage Limit",
		message: "You are approaching your storage quota.",
		read: false,
		createdAt: new Date(Date.now() - 1000 * 60 * 30),
	},
	{
		id: "4",
		type: "error",
		title: "Upload Failed",
		message: "The file upload encountered an error.",
		read: false,
		createdAt: new Date(Date.now() - 1000 * 60 * 60),
	},
	{
		id: "5",
		type: "info",
		title: "New User Registered",
		message: "A new user has signed up for the platform.",
		read: true,
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
	},
	{
		id: "6",
		type: "success",
		title: "Backup Complete",
		message: "Daily database backup completed successfully.",
		read: true,
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
	},
	{
		id: "7",
		type: "warning",
		title: "Slow Query Detected",
		message: "A query took longer than 5 seconds to execute.",
		read: true,
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
	},
	{
		id: "8",
		type: "info",
		title: "Maintenance Scheduled",
		message: "Scheduled maintenance window on Saturday.",
		read: false,
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
	},
	{
		id: "9",
		type: "success",
		title: "Role Updated",
		message: "User role was updated to editor.",
		read: true,
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
	},
	{
		id: "10",
		type: "error",
		title: "API Rate Limit",
		message: "External API rate limit exceeded.",
		read: true,
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
	},
];

const TYPE_COLORS: Record<Notification["type"], string> = {
	info: "bg-blue-500",
	success: "bg-green-500",
	warning: "bg-yellow-500",
	error: "bg-red-500",
};

function formatTimeAgo(date: Date): string {
	const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
	if (seconds < 60) return "just now";
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	return `${days}d ago`;
}

export function Notifications() {
	const [notifications, setNotifications] =
		useState<Notification[]>(MOCK_NOTIFICATIONS);
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const unreadCount = notifications.filter((n) => !n.read).length;

	const handleMarkAllRead = useCallback(() => {
		setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
	}, []);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		}

		if (open) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [open]);

	return (
		<div ref={containerRef} className="relative">
			<Button
				variant="ghost"
				size="icon"
				className="relative h-8 w-8"
				onClick={() => setOpen((prev) => !prev)}
				aria-label="Notifications"
			>
				<Bell className="h-4 w-4" />
				{unreadCount > 0 && (
					<span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
						{unreadCount}
					</span>
				)}
			</Button>

			{open && (
				<div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-md border bg-popover text-popover-foreground shadow-md">
					<div className="flex items-center justify-between border-b px-4 py-3">
						<h4 className="text-sm font-semibold">Notifications</h4>
						{unreadCount > 0 && (
							<button
								type="button"
								onClick={handleMarkAllRead}
								className="text-xs text-muted-foreground hover:text-foreground transition-colors"
							>
								Mark all as read
							</button>
						)}
					</div>

					<div className="max-h-80 overflow-y-auto">
						{notifications.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
								<Bell className="mb-2 h-8 w-8 opacity-50" />
								<p className="text-sm">No notifications</p>
							</div>
						) : (
							notifications.map((notification) => (
								<div
									key={notification.id}
									className={cn(
										"flex gap-3 border-b px-4 py-3 last:border-b-0",
										!notification.read && "bg-muted/50",
									)}
								>
									<span
										className={cn(
											"mt-1.5 h-2 w-2 shrink-0 rounded-full",
											TYPE_COLORS[notification.type],
										)}
									/>
									<div className="min-w-0 flex-1">
										<p className="text-sm font-medium leading-tight">
											{notification.title}
										</p>
										<p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
											{notification.message}
										</p>
										<p className="mt-1 text-xs text-muted-foreground/70">
											{formatTimeAgo(notification.createdAt)}
										</p>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
}
