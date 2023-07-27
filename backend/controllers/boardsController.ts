import { Request, Response, Router } from "express";
import mongoose, { LeanDocument } from "mongoose";

import { requireMinRole } from "../utils/authMiddleware.js";
import Board from "../models/Board.js";
import Post from "../models/Post.js";
import Thread from "../models/Thread.js";
import uploadMiddleware from "../utils/uploadMiddleware.js";
import filesService from "../utils/files.js";
import { UserRole } from "../types.js";
import NotFoundError from "../errors/NotFoundError.js";
import InvalidRequestError from "../errors/InvalidRequestError.js";
import config from "../utils/config.js";
import { PostFileInterface } from "../models/PostFile.js";

const router = Router();

// Getting all boards
router.get("/", async (_req, res) => {
    const boards = await Board.find({});
    res.json(boards);
});

// Getting a board by its id
router.get("/:id", async (req, res) => {
    const board = await Board.findById(req.params.id);
    if (!board) throw new NotFoundError("Lautaa ei löytynyt.");
    res.json(board);
});

// Creating a board
router.post(
    "/",
    requireMinRole(UserRole.ADMIN),
    async (req: Request, res: Response) => {
        const { body } = req;

        const board = new Board({
            name: body.name,
            path: body.path,
            title: body.title,
        });

        const savedBoard = await board.save();
        res.status(201).json(savedBoard);
    }
);

// Editing a board
router.put(
    "/:id",
    requireMinRole(UserRole.ADMIN),
    async (req: Request, res: Response) => {
        // TODO: Make it possible for moderators to change board titles
        const { body } = req;

        const board = {
            name: body.name,
            path: body.path,
            title: body.title,
        };

        const savedBoard = await Board.findByIdAndUpdate(req.params.id, board, {
            new: true,
        });
        res.json(savedBoard);
    }
);

// Deleting a board
router.delete(
    "/:id",
    requireMinRole(UserRole.ADMIN),
    async (req: Request, res: Response) => {
        await Board.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    }
);

// Getting threads of a board
router.get("/:id/threads", async (req, res) => {
    const mode = req.query.mode === "catalog" ? "catalog" : "default";

    // TODO: Enum for this
    const pageSize =
        mode === "catalog" ? config.catalogPageSize : config.pageSize;
    const postsPerThread = mode === "catalog" ? 1 : 6;

    // TODO: Implement different thread list modes here
    const page = Number(req.query.page) || 2;
    if (page < 1)
        throw new InvalidRequestError(
            "page",
            "Sivunumero ei voi olla pienempi kuin 1."
        );

    const threads = await Thread.find({
        board: new mongoose.Types.ObjectId(req.params.id),
    })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate({
            path: "posts",
            perDocumentLimit: postsPerThread,
        })
        .sort({
            bumpedAt: -1,
        });

    res.json(threads);
});

// Creating a new thread
router.post(
    "/:id/threads",
    uploadMiddleware,
    async (req: Request, res: Response) => {
        const { body } = req;

        const { email } = body;
        const text = body.text?.trim();
        const author = body.author?.trim() || undefined;
        const createdAt = Date.now();
        const file = req.uploadedFile!;

        const board = await Board.findById(req.params.id);
        if (!board) throw new NotFoundError("Lautaa ei löytynyt.");

        // Both file and text are required
        if (!req.file || !text) {
            const field = req.file ? "text" : "file";
            throw new InvalidRequestError(
                field,
                "Lanka vaatii sekä kuvan että tekstin."
            );
        }

        const newPost = new Post(
            {
                text,
                email,
                author,
                createdAt,
            },
            undefined
        );
        const post = await newPost.save();

        // Create a thread for the OP post
        const newThread = new Thread({
            number: post.number,
            board: board._id,
            title: body.title,
            posts: [post._id],
            bumpedAt: createdAt,
            createdAt,
        });
        const thread = await newThread.save();

        const postFile: LeanDocument<PostFileInterface> = {
            size: Math.floor(file.size / 1000),
            // Name should be truncated to 50 characters
            name: file.originalname.substring(0, 50),
            mimeType: file.actualMimetype,
            location: `${post._id}.${file.actualExt || "unknown"}`,
            // TODO: Support spoilers
            spoiler: false,
        };

        post.thread = thread._id;
        post.set("file", postFile);
        await post.save();

        await thread.populate("posts");

        await filesService.uploadFile(post, file, true);

        res.json(thread);
    }
);

export default router;
