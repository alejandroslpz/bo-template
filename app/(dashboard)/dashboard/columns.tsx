"use client";

import type { ColumnDef } from "@tanstack/react-table";

export type User = {
	id: number;
	name: string;
	email: string;
	status: "active" | "inactive" | "pending";
	createdAt: string;
};

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
			const status = row.getValue("status") as string;
			return (
				<span
					className={
						status === "active"
							? "text-green-600 dark:text-green-400"
							: status === "inactive"
								? "text-red-600 dark:text-red-400"
								: "text-yellow-600 dark:text-yellow-400"
					}
				>
					{status.charAt(0).toUpperCase() + status.slice(1)}
				</span>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: "Created At",
	},
];
