import { getAuthUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export async function logAction(params: {
	action: string;
	entityType: string;
	entityId?: string;
	metadata?: Record<string, unknown>;
}): Promise<void> {
	try {
		const user = await getAuthUser();
		const supabase = await createClient();

		await supabase.from("audit_logs").insert({
			user_id: user?.id ?? null,
			action: params.action,
			entity_type: params.entityType,
			entity_id: params.entityId ?? null,
			metadata: params.metadata ?? {},
		});
	} catch {
		// Silently fail — audit logging should never break the main action
	}
}
