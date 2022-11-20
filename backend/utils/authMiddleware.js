import jwt from "jsonwebtoken";
import config from "./config.js";

export const extractToken = (req, res, next) => {
    const authorization = req.get("Authorization");

    if (authorization && authorization.toLowerCase().startsWith("bearer ")) req.token = authorization.substring(7);

    next();
};

export const extractUser = (req, res, next) => {
    const decodedUser = req.token && jwt.verify(req.token, config.secret);
    if (!decodedUser?.id || !decodedUser.role) return res.status(401).json({ error: "Virheellinen istunto." });

    req.authorizedUser = decodedUser;
    next();
};
