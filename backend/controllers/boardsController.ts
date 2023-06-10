import { Request, Response, Router } from "express";
import mongoose from "mongoose";

import { requireMinRole } from "../utils/authMiddleware.js";
import Board from "../models/Board.js";
import Post from "../models/Post.js";
import Thread from "../models/Thread.js";
import uploadMiddleware from "../utils/uploadMiddleware.js";
import filesService from "../utils/files.js";
import { UserRole } from "../types.js";
import NotFoundError from "../errors/NotFoundError.js";
import InvalidRequestError from "../errors/InvalidRequestError.js";
import { PostFile } from "../models/PostFile.js";

const router = Router();

// Getting all boards
router.get("/", async (req, res) => {
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

        const { email } = body;
        const text = body.text?.trim();
        const author = body.author?.trim() || undefined;
        const createdAt = Date.now();
        const file = req.uploadedFile!;

        const session = await mongoose.startSession();

        try {
            const board = await Board.findById(req.params.id, null, {
                session,
            });
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
                undefined,
                { session }
            );
            const post = await newPost.save({ session });

            // Create a thread for the OP post
            const newThread = new Thread(
                {
                    number: post.number,
                    board: board._id,
                    title: body.title,
                    posts: [post._id],
                    bumpedAt: createdAt,
                    createdAt,
                },
                undefined,
                { session }
            );
            const thread = await newThread.save({ session });

            const postFile: PostFile = {
                size: Math.floor(file.size / 1000),
                name: file.originalname,
                mimeType: file.actualMimetype,
                location: `${post._id}.${file.actualExt || "unknown"}`,
                // TODO: Support spoilers
                spoiler: false,
            };

            post.thread = thread._id;
            post.file = postFile;
            await post.save({ session });

            await thread.populate("posts", undefined, undefined, {
                session,
            });

            await filesService.uploadFile(post, file, true);
            // await session.commitTransaction();

            res.json(thread);
        } catch (error) {
            // await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
);

export default router;
