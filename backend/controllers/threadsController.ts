import { Request, Response, Router } from "express";

import Thread from "../models/Thread.js";
import Post from "../models/Post.js";
import filesService from "../utils/files.js";
import uploadMiddleware from "../utils/uploadMiddleware.js";
import { requireMinRole } from "../utils/authMiddleware.js";
import { UserRole } from "../types.js";
import InvalidRequestError from "../errors/InvalidRequestError.js";
import { PostFile } from "../models/PostFile.js";
import NotFoundError from "../errors/NotFoundError.js";
import mongoose from "mongoose";

const router = Router();

// Get a thread by its number
router.get("/number/:number", async (req, res) => {
    const number = Number(req.params.number);
    if (Number.isNaN(number)) return res.sendStatus(400);

    const thread = await Thread.findOne({ number }).populate("posts");
    if (!thread) throw new NotFoundError("Thread not found");

    res.json(thread);
});

// Delete a thread
router.delete("/:id", requireMinRole(UserRole.MODERATOR), async (req, res) => {
    const thread = await Thread.findByIdAndDelete(req.params.id);
    if (!thread) throw new NotFoundError("Thread not found");

    // TODO Remove the threads' posts from the database
    // res.sendStatus(202);
});

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

        const session = await mongoose.startSession();

        try {
            // await session.startTransaction();

            // Create a post
            const newPost = new Post(
                {
                    thread: thread._id,
                    text,
                    author,
                    saging,
                    createdAt,
                },
                undefined,
                { session }
            );
            const post = await newPost.save({ session });

            // Add the post to its thread
            thread.posts = thread.posts.concat(post._id);
            thread.replyCount = thread.replyCount + 1;
            if (!saging) thread.bumpedAt = Date.now();
            if (req.file) thread.fileReplyCount = thread.fileReplyCount + 1;

            await thread.save({ session });

            // Handle post uploads
            if (req.file) {
                const postFile: PostFile = {
                    size: Math.floor(file.size / 1000),
                    name: file.originalname,
                    mimeType: file.actualMimetype,
                    location: `${post._id}.${file.actualExt || "unknown"}`,
                    // TODO: Support spoilers
                    spoiler: false,
                };

                post.file = postFile;
                await post.save({ session });

                await filesService.uploadFile(post, file);
            }

            // await session.commitTransaction();

            res.json(post);
        } catch (error) {
            // await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }
);

export default router;
