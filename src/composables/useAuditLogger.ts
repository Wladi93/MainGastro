import { jwtDecode } from "jwt-decode";
import api from "src/boot/axios";

export const useAuditLogger = () => {
  const getCurrentUsername = (): string => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.warn("No JWT token found");
        return "Anonymous";
      }

      const decoded = jwtDecode<Record<string, unknown>>(token);

      const username =
        (decoded.name as string) ||
        (decoded.username as string) ||
        (decoded.sub as string) ||
        (decoded.email as string) ||
        (decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ] as string) ||
        "Anonymous";

      return username;
    } catch (error) {
      console.error("Error extracting username from token:", error);
      return "Anonymous";
    }
  };

  const logAudit = async (
    action: "create" | "update" | "delete",
    entity: string,
    entityId: number,
    changes: unknown
  ) => {
    const currentUser = getCurrentUsername();

    const payload = {
      action,
      entity,
      entityId,
      changes,
      timestamp: new Date().toISOString(),
      username: currentUser,
    };

    try {
      await api.post("/api/auditlog", payload);
    } catch (err) {
      console.warn("Audit log failed", err);
    }
  };

  return { logAudit, getCurrentUsername };
};
