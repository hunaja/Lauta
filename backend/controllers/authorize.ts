import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import config from "../utils/config.js";
import database from "../utils/database.js";

const router = Router();

// Logging in
// TODO: Refresh tokens
router.post("/", async (req, res) => {
    const {
        body: { username, password },
    } = req;

    const user = await database.user.findUnique({
        where: {
            username,
        },
    });

    const correctPassword =
        user && (await bcrypt.compare(password, user.passwordHash));
    if (!correctPassword)
        return res
            .status(401)
            .json({ error: "Virheellinen käyttäjätunnus tai salasana." });

    const signedUser = {
        id: user.id,
        role: user.role,
    };

    const token = jwt.sign(signedUser, config.jwtSecret);

    return res.json({
        id: user.id,
        username: user.username,
        role: user.role,
        token,
    });
});

export default router;
