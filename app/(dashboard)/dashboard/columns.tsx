"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type User = {
	id: number;
	name: string;
	email: string;
	status: "active" | "inactive" | "pending";
	createdAt: string;
};

const statusConfig = {
	active: {
		label: "Active",
		className:
			"bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
	},
	inactive: {
		label: "Inactive",
		className: "bg-muted text-muted-foreground border-border",
	},
	pending: {
		label: "Pending",
		className:
			"bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
	},
} as const;

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.getValue("status") as User["status"];
			const config = statusConfig[status];
			return (
				<Badge variant="outline" className={config.className}>
					{config.label}
				</Badge>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: "Created At",
	},
];
