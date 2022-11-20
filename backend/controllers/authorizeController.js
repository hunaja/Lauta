import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import config from "../utils/config.js";
import User from "../models/User.js";

const router = Router();

// Logging in
router.post("/", async (req, res) => {
    const { body: { username, password } } = req;
    const user = await User.findOne({ username });

    const correctPassword = user && await bcrypt.compare(password, user.passwordHash);
    if (!correctPassword) return res.status(401).json({ error: "Virheellinen käyttäjätunnus tai salasana." });

    const signedUser = {
        id: user._id.toString(),
        role: user.role,
    };

    const token = jwt.sign(signedUser, config.secret);

    res.json({
        id: user._id,
        username: user.username,
        role: user.role,
        token,
    });
});

export default router;
