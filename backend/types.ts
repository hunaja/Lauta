import { User } from "./models/User";

export enum UserRole {
    ADMIN = "SOPSY",
    MODERATOR = "MODERATOR",
    TRAINEE = "JANNY",
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
        export interface Request {
            token?: string;
            session?: Session;
        }
    }
}

export type Session = {
    id: User["id"];
    role: User["role"];
};
