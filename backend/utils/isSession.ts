import { Session } from "../types";

export default function isSession(s: unknown): s is Session {
    return (
        !!s &&
        typeof s === "object" &&
        "username" in s &&
        typeof s.username === "string" &&
        "role" in s &&
        typeof s.role === "string"
    );
}
