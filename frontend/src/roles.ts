import { UserRole } from "./types";

const roles: Record<UserRole, string> = {
    [UserRole.ADMIN]: "Ylläpitäjä",
    [UserRole.MODERATOR]: "Moderaattori",
    [UserRole.TRAINEE]: "Harjoittelija",
};

export default roles;
