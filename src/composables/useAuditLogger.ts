import { jwtDecode } from "jwt-decode";

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

      console.log("Extracted username from token:", username);
      console.log("Available claims in token:", Object.keys(decoded));

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
      const token = localStorage.getItem("authToken");

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      await fetch("http://localhost:5008/api/auditlog", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn("Audit log failed", err);
    }
  };

  return { logAudit, getCurrentUsername };
};
