import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";

import config from "../utils/config.js";
import { extractUser, requireMinRole } from "../utils/authMiddleware.js";

import User from "../models/User.js";
import { UserRole } from "../types.js";
import InsufficientPermissionsError from "../errors/InsufficentPermissionsError.js";
import NotFoundError from "../errors/NotFoundError.js";
import InsufficentPermissionsError from "../errors/InsufficentPermissionsError.js";

const router = Router();

// Getting all users
router.get(
    "/",
    requireMinRole(UserRole.ADMIN),
    async (req: Request, res: Response) => {
        const users = await User.find({});
        res.json(users);
    }
);

// Creating a new user
router.post("/", extractUser, async (req, res) => {
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
    if (req.params.id !== req.session!.id)
        return new InsufficientPermissionsError(
            "Et voi muokata tätä käyttäjää."
        );

    const targetUser = await User.findById(req.session!.id);
    const oldCorrect =
        targetUser &&
        (await bcrypt.compare(oldPassword, targetUser.passwordHash));
    if (!oldCorrect)
        return new InsufficentPermissionsError("Väärä entinen salasana.");

    targetUser.passwordHash = await bcrypt.hash(newPassword, config.hashRounds);
    await targetUser.save();
});

// Editing user's username or role
router.put(
    "/:id",
    requireMinRole(UserRole.ADMIN),
    async (req: Request, res: Response) => {
        const { body } = req;

        const targetUser = await User.findById(req.params.id);
        if (!targetUser) throw new NotFoundError("Käyttäjää ei löytynyt.");

        // Syops can't edit other syops (or themselves)
        if (targetUser?.role === "SOPSY")
            throw new InsufficientPermissionsError(
                "Et voi muokata toista ylläpitäjää."
            );

        targetUser.username = body.username;
        targetUser.role = body.role;
        const user = await targetUser.save();
        res.status(200).json(user);
    }
);

// Deleting a user
router.delete(
    "/:id",
    requireMinRole(UserRole.ADMIN),
    async (req: Request, res: Response) => {
        await User.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    }
);

export default router;
