import { Request, Response, Router } from "express";
import zod from "zod";

import { requireMinRole } from "../utils/authMiddleware.js";
import uploadMiddleware from "../utils/uploadMiddleware.js";
import filesService from "../utils/files.js";
import NotFoundError from "../errors/NotFoundError.js";
import InvalidRequestError from "../errors/InvalidRequestError.js";
import config from "../utils/config.js";
import database from "../utils/database.js";
import boardSchema from "../schemas/board.js";
import threadsQuery from "../schemas/threads_query.js";
import threadSchema from "../schemas/thread.js";
import postSchema from "../schemas/post.js";

const router = Router();

// Getting all boards
router.get("/", async (_req, res) => {
    const boards = await database.board.findMany();
    res.json(boards);
});

// Creating a board
router.post(
    "/",
    requireMinRole("ADMIN"),
    async (req: Request, res: Response) => {
        const data = boardSchema.parse(req.body);

        const board = await database.board.create({ data });
        res.status(201).json(board);
    }
);

// Editing a board, TODO: Make it possible for moderators to change board titles
router.put(
    "/:id",
    requireMinRole("ADMIN"),
    async (req: Request, res: Response) => {
        const data = boardSchema.parse(req.body);
        const id = zod.string().pipe(zod.coerce.number()).parse(req.params.id);

        const savedBoard = await database.board.update({
            where: { id },
            data,
        });
        res.json(savedBoard);
    }
);

// Deleting a board
router.delete(
    "/:id",
    requireMinRole("ADMIN"),
    async (req: Request, res: Response) => {
        const id = zod.string().pipe(zod.coerce.number()).parse(req.params.id);

        await database.board.delete({
            where: { id },
        });
        res.sendStatus(204);
    }
);

// Getting threads of a board
router.get("/:id/threads", async (req, res) => {
    const { mode, page } = threadsQuery.parse(req.query);
    const id = zod.string().pipe(zod.coerce.number()).parse(req.params.id);

    const pageSize =
        mode === "catalog" ? config.catalogPageSize : config.pageSize;
    const postsPerThread = mode === "catalog" ? 1 : 6;

    const threads = await database.thread.findMany({
        where: {
            boardId: id,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
            posts: {
                take: postsPerThread,
                include: {
                    file: true,
                },
            },
        },
        orderBy: {
            bumpedAt: "desc",
        },
    });

    res.json(threads);
});

// Creating a new thread
router.post(
    "/:id/threads",
    uploadMiddleware,
    async (req: Request, res: Response) => {
        const { email, title, ...postData } = threadSchema
            .merge(postSchema)
            .parse(req.body);
        const uploadedFile = req.uploadedFile!;
        const id = zod.string().pipe(zod.coerce.number()).parse(req.params.id);

        const actions = email?.split(" ");
        const spoiler = actions?.includes("spoiler") ?? false;

        const board = await database.board.findUnique({
            where: { id },
        });
        if (!board) throw new NotFoundError("Lautaa ei löytynyt.");

        // Both file and text are required
        if (!req.file) {
            const field = req.file ? "text" : "file";
            throw new InvalidRequestError(field, "Kuva on annettava.");
        }

        const post = await database.post.create({
            data: postData,
        });

        const thread = await database.thread.create({
            data: {
                id: post.id,
                boardId: board.id,
                bumpedAt: post.createdAt,
                title,
            },
        });

        // Update thread ID
        await database.post.update({
            where: { id: post.id },
            data: {
                threadId: thread.id,
            },
        });

        const file = await database.file.create({
            data: {
                size: Math.floor(uploadedFile.size / 1000),
                // TODO: Support
                name: uploadedFile.originalname.substring(0, 50),
                mime: uploadedFile.actualMimetype,
                location: `${post.id}.${uploadedFile.actualExt || "unknown"}`,
                postId: post.id,
                spoiler,
            },
        });

        await filesService.uploadFile({ ...post, file }, uploadedFile, true);

        res.json(thread);
    }
);

export default router;
