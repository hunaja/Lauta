import { Request, Response, Router } from "express";
import mongoose, { LeanDocument } from "mongoose";

import Thread from "../models/Thread.js";
import Post from "../models/Post.js";
import filesService from "../utils/files.js";
import uploadMiddleware from "../utils/uploadMiddleware.js";
import { requireMinRole } from "../utils/authMiddleware.js";
import { UserRole } from "../types.js";
import InvalidRequestError from "../errors/InvalidRequestError.js";
import NotFoundError from "../errors/NotFoundError.js";
import config from "../utils/config.js";
import { PostFileInterface } from "../models/PostFile.js";

const router = Router();

router.get("/", async (req, res) => {
    const postsPerThread = 1;

    const page = Number(req.query.page) || 1;

    const threads = await Thread.find()
        .sort({ bumpedAt: -1 })
        .skip((page - 1) * config.pageSize)
        .limit(config.pageSize)
        .populate({
            path: "posts",
            perDocumentLimit: postsPerThread,
        });

    res.json(threads);
});

// Get a thread by its number
router.get("/number/:number", async (req, res) => {
    const number = Number(req.params.number);
    if (Number.isNaN(number)) return res.sendStatus(400);

    const thread = await Thread.findOne({ number }).populate("posts");
    if (!thread) throw new NotFoundError("Thread not found");

    return res.json(thread);
});

// Delete a thread
router.delete(
    "/:id",
    requireMinRole(UserRole.MODERATOR),
    async (req: Request, res: Response) => {
        const thread = await Thread.findById(req.params.id);
        if (!thread) throw new NotFoundError("Thread not found");

        const posts = await Post.find({ thread: req.params.id }).populate(
            "file"
        );

        const promises = [
            ...posts
                .filter((p) => p.file)
                .map((post) =>
                    filesService.deleteFile(
                        { ...post.toObject(), file: post.file },
                        thread?.number === post.number
                    )
                ),
            ...posts.map((post) => post.delete()),
        ];
        await Promise.all(promises);

        await thread.delete();

        res.sendStatus(202);
    }
);

// Reply to a thread
router.post(
    "/:id/replies",
    uploadMiddleware,
    async (req: Request, res: Response) => {
        const thread = await Thread.findById(req.params.id);
        if (!thread) throw new NotFoundError("Thread not found");

        const { body } = req;

        const text = body.text?.trim();
        const author = body.author?.trim() || undefined;
        const saging = body.email?.split(" ").includes("sage");
        const createdAt = Date.now();
        const file = req.uploadedFile!;

        if (author?.length < 3)
            throw new InvalidRequestError(
                "author",
                "Nimimerkin tulee olla vähintään 3 merkkiä pitkä."
            );
        if (!text && !req.file)
            throw new InvalidRequestError(
                "message",
                "Lanka vaatii joko kuvan tai tekstin."
            );

        // Create a post
        const newPost = new Post({
            thread: thread._id,
            text,
            author,
            saging,
            createdAt,
        });
        const post = await newPost.save();

        // Add the post to its thread
        thread.posts = thread.posts.concat(
            new mongoose.Types.ObjectId(post._id)
        );
        thread.replyCount = thread.replyCount + 1;
        if (!saging) thread.bumpedAt = Date.now();
        if (req.file) thread.fileReplyCount = thread.fileReplyCount + 1;

        await thread.save();

        // Handle post uploads
        if (req.file) {
            const postFile: LeanDocument<PostFileInterface> = {
                size: Math.floor(file.size / 1000),
                // Name should be truncated to 50 characters
                name: file.originalname.substring(0, 50),
                mimeType: file.actualMimetype,
                location: `${post._id}.${file.actualExt || "unknown"}`,
                // TODO: Support spoilers
                spoiler: false,
            };

            post.set("file", postFile);
            await post.save();

            await filesService.uploadFile(post, file);
        }

        res.json(post);
    }
);

export default router;
