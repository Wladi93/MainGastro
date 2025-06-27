import type { AuditLog } from "src/types/AuditLog";
import api from "src/boot/axios";

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  try {
    const response = await api.get<AuditLog[]>("/api/auditlog");
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Failed to load audit logs");
  }
}
