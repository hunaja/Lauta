import { Request, Response, Router } from "express";
import zod from "zod";

import filesService from "../utils/files.js";
import uploadMiddleware from "../utils/uploadMiddleware.js";
import { requireMinRole } from "../utils/authMiddleware.js";
import NotFoundError from "../errors/NotFoundError.js";
import config from "../utils/config.js";
import database from "../utils/database.js";
import { File, Post } from "@prisma/client";
import postSchema from "../schemas/post.js";

const router = Router();

router.get("/", async (req, res) => {
    const postsPerThread = 1;

    const page = Number(req.query.page) || 1;

    const threads = await database.thread.findMany({
        skip: (page - 1) * config.pageSize,
        take: config.pageSize,
        orderBy: {
            bumpedAt: "desc",
        },
        include: {
            posts: {
                take: postsPerThread,
                orderBy: {
                    id: "desc",
                },
                include: {
                    file: true,
                },
            },
        },
    });

    res.json(threads);
});

// Get a thread by its number
router.get("/:id", async (req, res) => {
    const id = zod.string().pipe(zod.coerce.number()).parse(req.params.id);
    const preview = zod
        .string()
        .pipe(zod.coerce.boolean())
        .parse(req.query.preview);

    const thread = await database.thread.findUnique({
        where: { id },
        include: {
            posts: {
                take: preview ? 6 : undefined,
                include: {
                    file: true,
                },
            },
        },
    });
    if (!thread) throw new NotFoundError("Thread not found");

    return res.json(thread);
});

// Delete a thread
router.delete(
    "/:id",
    requireMinRole("MODERATOR"),
    async (req: Request, res: Response) => {
        const id = zod.string().pipe(zod.coerce.number()).parse(req.params.id);

        const thread = await database.thread.findUnique({ where: { id } });
        if (!thread) throw new NotFoundError("Thread not found");

        const posts = await database.post.findMany({
            where: { threadId: thread.id },
            include: { file: true },
        });

        // Delete  all of the posts and images in the thread
        const promises = [
            ...posts
                .filter((p): p is Post & { file: File } => p.file !== null)
                .map((post) =>
                    filesService.deleteFile(post, post.threadId === post.id)
                ),
            database.post.deleteMany({ where: { threadId: thread.id } }),
        ];
        await Promise.all(promises);

        // Delete the thread
        await database.thread.delete({ where: { id } });

        res.sendStatus(202);
    }
);

// Reply to a thread
router.post(
    "/:id/replies",
    uploadMiddleware,
    async (req: Request, res: Response) => {
        const { email, ...data } = postSchema.parse(req.body);
        const actions = email?.split(" ");
        const saging = actions?.includes("sage") ?? false;
        const spoiler = actions?.includes("spoiler") ?? false;

        const id = zod.string().pipe(zod.coerce.number()).parse(req.params.id);
        const uploadedFile = req.uploadedFile!;

        const thread = await database.thread.findUnique({ where: { id } });
        if (!thread) throw new NotFoundError("Thread not found");

        const post = await database.post.create({
            data: {
                thread: {
                    connect: {
                        id,
                    },
                },
                ...data,
            },
        });

        // Update thread's reply count
        await database.thread.update({
            where: { id },
            data: {
                replyCount: thread.replyCount + 1,
                bumpedAt: saging ? thread.bumpedAt : new Date(),
                fileReplyCount: req.file
                    ? thread.fileReplyCount + 1
                    : thread.fileReplyCount,
            },
        });

        // Handle post uploads
        if (req.file) {
            const file = await database.file.create({
                data: {
                    postId: post.id,
                    size: Math.floor(uploadedFile.size / 1000),
                    // Name should be truncated to 50 characters
                    name: uploadedFile.originalname.substring(0, 50),
                    mime: uploadedFile.actualMimetype,
                    location: `${post.id}.${
                        uploadedFile.actualExt || "unknown"
                    }`,
                    // TODO: Support spoilers
                    spoiler,
                },
            });

            await filesService.uploadFile(
                { ...post, file },
                uploadedFile,
                false
            );

            return res.json({ ...post, file });
        }

        res.json(post);
    }
);

export default router;
