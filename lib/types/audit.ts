export type AuditLog = {
	id: string;
	userId: string | null;
	action: string;
	entityType: string;
	entityId: string | null;
	metadata: Record<string, unknown>;
	createdAt: string;
};
