import { UsersTable } from "@/components/users-table";
import { getUsers } from "@/lib/supabase/admin-actions";
import { requireAdmin } from "@/lib/supabase/auth";

export default async function UsersPage() {
	const currentUser = await requireAdmin();
	const { data: users, error } = await getUsers();

	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Users</h1>
				<p className="text-muted-foreground">Manage user accounts and roles.</p>
			</div>
			{error ? (
				<div className="bg-destructive/10 text-destructive rounded-lg border p-4 text-sm">
					{error}
				</div>
			) : (
				<UsersTable users={users} currentUserId={currentUser.id} />
			)}
		</div>
	);
}
