import type { AuditLog } from "src/types/AuditLog";

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  const response = await fetch("http://localhost:5008/api/auditlog");
  if (!response.ok) throw new Error("Failed to load audit logs");
  return await response.json();
}
