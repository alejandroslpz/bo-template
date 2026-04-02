"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Loader2Icon, TrashIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	deleteUser,
	type UserRecord,
	updateUserRole,
} from "@/lib/supabase/admin-actions";
import { ROLE_LABELS, USER_ROLES } from "@/lib/types/roles";

function RoleCell({
	user,
	currentUserId,
}: {
	user: UserRecord;
	currentUserId: string;
}) {
	const [isPending, startTransition] = useTransition();
	const isCurrentUser = user.id === currentUserId;

	function handleRoleChange(newRole: string) {
		startTransition(async () => {
			const formData = new FormData();
			formData.set("userId", user.id);
			formData.set("role", newRole);
			const result = await updateUserRole(formData);

			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success(result.success);
			}
		});
	}

	if (isCurrentUser) {
		return <Badge variant="default">{ROLE_LABELS[user.role]}</Badge>;
	}

	return (
		<Select
			defaultValue={user.role}
			onValueChange={handleRoleChange}
			disabled={isPending}
		>
			<SelectTrigger size="sm" className="w-28">
				{isPending ? (
					<Loader2Icon className="size-3 animate-spin" />
				) : (
					<SelectValue />
				)}
			</SelectTrigger>
			<SelectContent>
				{USER_ROLES.map((role) => (
					<SelectItem key={role} value={role}>
						{ROLE_LABELS[role]}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

function ActionsCell({
	user,
	currentUserId,
}: {
	user: UserRecord;
	currentUserId: string;
}) {
	const [confirmOpen, setConfirmOpen] = useState(false);
	const isCurrentUser = user.id === currentUserId;

	async function handleDelete() {
		const formData = new FormData();
		formData.set("userId", user.id);
		const result = await deleteUser(formData);

		if (result.error) {
			toast.error(result.error);
		} else {
			toast.success(result.success);
		}
	}

	if (isCurrentUser) {
		return null;
	}

	return (
		<>
			<Button
				variant="ghost"
				size="sm"
				className="size-8 p-0 text-destructive hover:text-destructive"
				onClick={() => setConfirmOpen(true)}
			>
				<TrashIcon className="size-4" />
				<span className="sr-only">Delete user</span>
			</Button>
			<ConfirmDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title="Delete user"
				description={`Are you sure you want to delete ${user.fullName || user.email}? This action cannot be undone.`}
				confirmLabel="Delete"
				variant="destructive"
				onConfirm={handleDelete}
			/>
		</>
	);
}

function buildColumns(currentUserId: string): ColumnDef<UserRecord>[] {
	return [
		{
			accessorKey: "fullName",
			header: "Name",
			cell: ({ row }) => {
				const name = row.original.fullName;
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
			cell: ({ row }) => (
				<RoleCell user={row.original} currentUserId={currentUserId} />
			),
			enableSorting: false,
		},
		{
			accessorKey: "createdAt",
			header: "Created At",
			cell: ({ row }) => {
				const date = row.original.createdAt;
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
			cell: ({ row }) => (
				<ActionsCell user={row.original} currentUserId={currentUserId} />
			),
			enableSorting: false,
		},
	];
}

type UsersTableProps = {
	users: UserRecord[];
	currentUserId: string;
};

export function UsersTable({ users, currentUserId }: UsersTableProps) {
	const columns = buildColumns(currentUserId);

	return (
		<DataTable
			columns={columns}
			data={users}
			searchKey="email"
			searchPlaceholder="Search by email..."
		/>
	);
}
