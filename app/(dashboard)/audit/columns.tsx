"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { AuditLog } from "@/lib/types/audit";

export const columns: ColumnDef<AuditLog>[] = [
	{
		accessorKey: "createdAt",
		header: "Date",
		cell: ({ row }) => {
			const date = row.getValue("createdAt") as string;
			if (!date) return "---";
			return new Date(date).toLocaleString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
		},
	},
	{
		accessorKey: "userId",
		header: "User",
		cell: ({ row }) => {
			const userId = row.getValue("userId") as string | null;
			if (!userId) return <span className="text-muted-foreground">System</span>;
			return (
				<span className="font-mono text-xs" title={userId}>
					{userId.slice(0, 8)}...
				</span>
			);
		},
	},
	{
		accessorKey: "action",
		header: "Action",
		cell: ({ row }) => {
			const action = row.getValue("action") as string;
			return <Badge variant="outline">{action}</Badge>;
		},
	},
	{
		accessorKey: "entityType",
		header: "Entity",
		cell: ({ row }) => {
			const entityType = row.original.entityType;
			const entityId = row.original.entityId;
			return (
				<span>
					{entityType}
					{entityId ? (
						<span className="text-muted-foreground ml-1 font-mono text-xs">
							({entityId.slice(0, 8)}...)
						</span>
					) : null}
				</span>
			);
		},
	},
	{
		id: "details",
		header: "Details",
		cell: ({ row }) => {
			const metadata = row.original.metadata;
			if (!metadata || Object.keys(metadata).length === 0) {
				return <span className="text-muted-foreground">---</span>;
			}
			const summary = Object.entries(metadata)
				.map(([key, value]) => `${key}: ${String(value)}`)
				.join(", ");
			return (
				<span
					className="text-muted-foreground max-w-[300px] truncate text-xs"
					title={summary}
				>
					{summary}
				</span>
			);
		},
		enableSorting: false,
	},
];
