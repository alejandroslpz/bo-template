import { DataTable } from "@/components/data-table";
import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import type { AuditLog } from "@/lib/types/audit";
import { columns } from "./columns";

export default async function AuditPage() {
	await requireAdmin();

	const supabase = await createClient();

	const { data: logs, error } = await supabase
		.from("audit_logs")
		.select("id, user_id, action, entity_type, entity_id, metadata, created_at")
		.order("created_at", { ascending: false })
		.limit(100);

	const auditLogs: AuditLog[] = (logs ?? []).map((log) => ({
		id: log.id,
		userId: log.user_id,
		action: log.action,
		entityType: log.entity_type,
		entityId: log.entity_id,
		metadata: (log.metadata as Record<string, unknown>) ?? {},
		createdAt: log.created_at,
	}));

	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Audit Log</h1>
				<p className="text-muted-foreground">
					Track user actions and system events.
				</p>
			</div>
			{error ? (
				<div className="bg-destructive/10 text-destructive rounded-lg border p-4 text-sm">
					{error.message}
				</div>
			) : (
				<DataTable
					columns={columns}
					data={auditLogs}
					searchKey="action"
					searchPlaceholder="Filter by action..."
				/>
			)}
		</div>
	);
}
