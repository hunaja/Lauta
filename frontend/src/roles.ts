import { Role } from "./types";

const roles = [
    {
        name: "SOPSY",
        weight: 3,
        pretty: "Järjestelmänvalvoja",
    },
    {
        name: "MODERATOR",
        weight: 2,
        pretty: "Moderaattori",
    },
    {
        name: "JANNY",
        weight: 1,
        pretty: "Harjoittelija",
    },
] as Role[];

export const defaultRole = roles.find((v) => v.weight === 1)!;

export default roles;
