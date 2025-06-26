export interface AuditLog {
  id: number;
  timestamp: string;
  action: "create" | "update" | "delete";
  entity: string;
  entityId: number;
  changes: unknown;
  username: string;
}
