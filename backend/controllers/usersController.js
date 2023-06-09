import { Router } from "express";
import bcrypt from "bcrypt";

import config from "../utils/config.js";
import { extractUser } from "../utils/authMiddleware.js";

import User from "../models/User.js";

const router = Router();

// Getting all users
router.get("/", extractUser, async (req, res) => {
    if (req.authorizedUser.role !== "SOPSY")
        return res.status(403).json({ error: "Riittämättömät oikeudet." });

    const users = await User.find({});
    res.json(users);
});

// Creating a new user
router.post("/", extractUser, async (req, res) => {
    if (req.authorizedUser.role !== "SOPSY")
        return res.status(403).json({ error: "Riittämättömät oikeudet." });

    const { body } = req;

    const passwordHash = await bcrypt.hash(body.password, config.hashRounds);

    const user = new User({
        username: body.username,
        role: body.role,
        passwordHash,
    });
    await user.save();

    res.json(user);
});

// Changing user's own password
router.post("/:id/password", extractUser, async (req, res) => {
    const {
        body: { oldPassword, newPassword },
    } = req;

    // Each user can only edit their own password
    if (req.params.id !== req.authorizedUser.id)
        return res.status(403).json({ error: "Riittämättömät oikeudet." });

    const targetUser = await User.findById(req.authorizedUser.id);
    const oldCorrect =
        targetUser &&
        (await bcrypt.compare(oldPassword, targetUser.passwordHash));
    if (!oldCorrect)
        return res.status(403).json({ error: "Virheellinen vanha salasana." });

    targetUser.passwordHash = await bcrypt.hash(newPassword, config.hashRounds);
    await targetUser.save();
});

// Editing user's username or role
router.put("/:id", extractUser, async (req, res) => {
    if (req.authorizedUser.role !== "SOPSY")
        return res.status(403).json({ error: "Riittämättömät oikeudet." });

    const { body } = req;

    const targetUser = await User.findById(req.params.id);

    // Syops can't edit other syops (or themselves)
    if (targetUser.role === "SOPSY")
        return res.status(403).json({ error: "Riittämättömät oikeudet. " });

    targetUser.username = body.username;
    targetUser.role = body.role;
    await targetUser.save();
});

// Deleting a user
router.delete("/:id", extractUser, async (req, res) => {
    if (req.authorizedUser.role !== "SOPSY")
        return res.status(403).json({ error: "Riittämättömät oikeudet." });

    await User.findByIdAndDelete(req.params.id);
});

export default router;
