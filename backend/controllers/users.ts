import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import zod from "zod";

import config from "../utils/config.js";
import { extractUser, requireMinRole } from "../utils/authMiddleware.js";

import InsufficientPermissionsError from "../errors/InsufficentPermissionsError.js";
import NotFoundError from "../errors/NotFoundError.js";
import InsufficentPermissionsError from "../errors/InsufficentPermissionsError.js";
import database from "../utils/database.js";
import userSchema from "../schemas/user.js";
import changePasswordSchema from "../schemas/change_password.js";

const router = Router();

// Getting all users
router.get(
    "/",
    requireMinRole("ADMIN"),
    async (_req: Request, res: Response) => {
        const users = await database.user.findMany();
        res.json(users);
    }
);

// Creating a new user
router.post("/", extractUser, async (req, res) => {
    const { password, username, email } = userSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(password, config.hashRounds);

    const user = await database.user.create({
        data: {
            username,
            email,
            passwordHash,
        },
    });
    res.json(user);
});

// Changing user's own password
router.post("/:id/password", extractUser, async (req, res) => {
    const { oldPassword, newPassword } = changePasswordSchema.parse(req.body);
    const id = zod.string().pipe(zod.coerce.number()).parse(req.params.id);
    const sessionId = req.session!.id;

    // Each user can only edit their own password
    if (id !== sessionId)
        throw new InsufficientPermissionsError(
            "Et voi muokata tätä käyttäjää."
        );

    const targetUser = await database.user.findUnique({
        where: { id: sessionId },
    });
    const oldCorrect =
        targetUser &&
        (await bcrypt.compare(oldPassword, targetUser.passwordHash));
    if (!oldCorrect)
        throw new InsufficentPermissionsError("Väärä entinen salasana.");

    const passwordHash = await bcrypt.hash(newPassword, config.hashRounds);

    await database.user.update({
        where: { id: sessionId },
        data: {
            passwordHash,
        },
    });

    return res.sendStatus(204);
});

// Editing user's username or role
router.put(
    "/:id",
    requireMinRole("ADMIN"),
    async (req: Request, res: Response) => {
        const id = zod.string().pipe(zod.coerce.number()).parse(req.params.id);
        const body = userSchema
            .omit({
                email: true,
            })
            .parse(req.body);

        const targetUser = await database.user.findUnique({ where: { id } });
        if (!targetUser) throw new NotFoundError("Käyttäjää ei löytynyt.");

        // Syops can't edit other syops (or themselves)
        if (targetUser?.role === "ADMIN")
            throw new InsufficientPermissionsError(
                "Et voi muokata toista ylläpitäjää."
            );

        const user = await database.user.update({
            where: { id },
            data: body,
        });
        res.status(200).json(user);
    }
);

// Deleting a user
router.delete(
    "/:id",
    requireMinRole("ADMIN"),
    async (req: Request, res: Response) => {
        const id = zod.string().pipe(zod.coerce.number()).parse(req.params.id);
        const targetUser = await database.user.findUnique({ where: { id } });
        if (!targetUser) throw new NotFoundError("Käyttäjää ei löytynyt.");

        // Syops can't delete other syops (or themselves)
        if (targetUser?.role === "ADMIN")
            throw new InsufficientPermissionsError(
                "Et voi poistaa toista ylläpitäjää."
            );

        res.sendStatus(204);
    }
);

export default router;
