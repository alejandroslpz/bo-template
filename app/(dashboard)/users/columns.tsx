"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UserRecord } from "@/lib/supabase/admin-actions";
import { ROLE_LABELS, type UserRole } from "@/lib/types/roles";

export const columns: ColumnDef<UserRecord>[] = [
	{
		accessorKey: "fullName",
		header: "Name",
		cell: ({ row }) => {
			const name = row.getValue("fullName") as string;
			return <span className="font-medium">{name || "---"}</span>;
		},
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => {
			const role = row.getValue("role") as UserRole;
			const variant =
				role === "admin"
					? "default"
					: role === "editor"
						? "secondary"
						: "outline";
			return <Badge variant={variant}>{ROLE_LABELS[role] ?? role}</Badge>;
		},
	},
	{
		accessorKey: "createdAt",
		header: "Created At",
		cell: ({ row }) => {
			const date = row.getValue("createdAt") as string;
			if (!date) return "---";
			return new Date(date).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
			});
		},
	},
	{
		id: "actions",
		header: "",
		cell: () => {
			return (
				<Button variant="ghost" size="sm" className="size-8 p-0">
					<MoreHorizontalIcon className="size-4" />
					<span className="sr-only">Actions</span>
				</Button>
			);
		},
		enableSorting: false,
	},
];
