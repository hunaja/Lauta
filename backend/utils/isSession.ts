import { Session, UserRole } from "../types.js";

export default function isSession(s: unknown): s is Session {
    return (
        !!s &&
        typeof s === "object" &&
        "id" in s &&
        typeof s.id === "string" &&
        "role" in s &&
        typeof s.role === "string" &&
        Object.values(UserRole).includes(s.role as UserRole)
    );
}
