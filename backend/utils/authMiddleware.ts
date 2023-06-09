import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import config from "./config.js";
import { UserRole } from "../types.js";
import isSession from "./isSession.js";
import assertNever from "./assertNever.js";
import AuthRequiredError from "../errors/AuthRequiredError.js";

export const extractToken = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const authorization = req.get("Authorization");

    if (authorization?.toLowerCase().startsWith("bearer "))
        req.token = authorization.substring(7);

    next();
};

export const extractUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const session = req.token && jwt.verify(req.token, config.jwtSecret);
    if (!isSession(session))
        throw new AuthRequiredError("Kirjautuminen vaaditaan.");

    req.session = session;
    next();
};

const requireMinRole0 =
    (role: UserRole) => (req: Request, res: Response, next: NextFunction) => {
        if (!req.session)
            throw new AuthRequiredError("Kirjautuminen vaaditaan.");

        switch (role) {
            case UserRole.ADMIN:
                if (req.session.role !== UserRole.ADMIN)
                    throw new AuthRequiredError(
                        "Sinun täytyy olla ylläpitäjä tehdäksesi tämän."
                    );
                break;
            case UserRole.MODERATOR:
                if (
                    req.session.role !== UserRole.ADMIN &&
                    req.session.role !== UserRole.MODERATOR
                )
                    throw new AuthRequiredError(
                        "Sinun täytyy olla vähintään moderaattori tehdäksesi tämän."
                    );
                break;
            case UserRole.TRAINEE:
                if (
                    req.session.role !== UserRole.ADMIN &&
                    req.session.role !== UserRole.MODERATOR &&
                    req.session.role !== UserRole.TRAINEE
                )
                    throw new AuthRequiredError(
                        "Sinun täytyy olla vähintään jannu tehdäksesi tämän."
                    );
                break;
            default:
                assertNever(role);
        }

        next();
    };

export const requireMinRole = (role: UserRole) => [
    extractUser,
    requireMinRole0(role),
];