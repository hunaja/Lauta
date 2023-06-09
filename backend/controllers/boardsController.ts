import { Request, Response, Router } from "express";
import mongoose from "mongoose";

import { extractUser, requireMinRole } from "../utils/authMiddleware.js";
import Board from "../models/Board.js";
import Post from "../models/Post.js";
import Thread from "../models/Thread.js";
import uploadMiddleware from "../utils/uploadMiddleware.js";
import { uploadFile } from "../utils/files.js";
import { UserRole } from "../types.js";

const router = Router();

// Getting all boards
router.get("/", async (req, res) => {
    const boards = await Board.find({});
    res.json(boards);
});

// Getting a board by its id
router.get("/:id", async (req, res) => {
    const board = await Board.findById(req.params.id);
    if (!board) return res.sendStatus(404);
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
router.put("/:id", extractUser, async (req, res) => {
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
});

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
    // TODO: Implement different thread list modes here
    const perDocumentLimit = 1;

    const threads = await Thread.find({
        board: new mongoose.Types.ObjectId(req.params.id),
    }).populate({
        path: "posts",
        perDocumentLimit,
    });

    res.json(threads);
});

// Creating a new thread
router.post(
    "/:id/threads",
    uploadMiddleware,
    async (req: Request, res: Response) => {
        const { body } = req;

        const board = await Board.findById(req.params.id);
        if (!board) return res.sendStatus(404);

        const { email } = body;
        const text = req.body.text?.trim();
        const author = req.body.author?.trim() || undefined;
        const createdAt = Date.now();

        // Both file and text are required
        if (!req.file || !body.text?.trim()) {
            const field = req.file ? "text" : "file";
            return res.status(400).json({
                error: "Lanka vaatii sekä kuvan että tekstin.",
                field,
            });
        }

        const newOpPost = new Post({
            text,
            email,
            author,
            createdAt,
        });
        const opPost = await newOpPost.save();

        // Create a thread for the OP post
        const thread = new Thread({
            number: opPost.number,
            board: board._id,
            title: body.title,
            posts: [opPost._id],
            bumpedAt: createdAt,
            createdAt,
        });
        const savedThread = await thread.save();

        const postFile = await uploadFile(opPost, req.file, true);
        opPost.file = { ...postFile, spoiler: false };

        // Make the OP post point to the thread
        opPost.thread = savedThread._id;

        await opPost.save();
        await savedThread.populate("posts");
        res.json(savedThread);
    }
);

export default router;
