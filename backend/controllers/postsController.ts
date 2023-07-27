import { Request, Response, Router } from "express";

import Post from "../models/Post.js";
import Thread from "../models/Thread.js";
import { requireMinRole } from "../utils/authMiddleware.js";
import filesService from "../utils/files.js";
import { UserRole } from "../types.js";
import NotFoundError from "../errors/NotFoundError.js";

const router = Router();

router.get("/number/:number", async (req, res) => {
    const post = await Post.findOne({
        number: req.params.number,
    }).populate("thread", "-posts");
    if (!post) throw new NotFoundError("Post not found");

    res.json({
        ...post.toJSON(),
        thread: post.thread?.toJSON(),
        file: post.file?.toJSON(), // TODO: The type of this
    });
});

router.delete(
    "/:id",
    requireMinRole(UserRole.MODERATOR),
    async (req: Request, res: Response) => {
        const post = await Post.findById(req.params.id);
        if (!post) throw new NotFoundError("Post not found");

        const thread = await Thread.findById(post.thread);
        if (!thread) throw new NotFoundError("Thread not found");

        const isOp = thread.number === post.number;
        if (!isOp) {
            if (post.file) thread.fileReplyCount = thread.fileReplyCount - 1;
            thread.replyCount = thread.replyCount - 1;
        }

        thread.posts = thread.posts.filter((p) => p.toString() !== post._id);

        await Promise.all([post.remove(), thread.save()]);

        if (post.file)
            await filesService.deleteFile({ ...post, file: post.file }, isOp);

        res.sendStatus(202);
    }
);

router.get("/:id/file", async (req, res) => {
    const post = await Post.findById(req.params.id, "file");
    if (!post) throw new NotFoundError("Post not found");

    const postFile = post?.file;
    if (!postFile) throw new NotFoundError("Post file not found");

    res.set({
        "Content-Type": postFile.mimeType,
        "Content-Disposition": `inline;filename="${postFile.name}"`,
    });

    const dataStream = await filesService.getFileBuffer(post);
    dataStream.on("data", (chunk) => res.write(chunk));
    dataStream.on("end", () => res.end());
    dataStream.once("error", () => res.sendStatus(500));
});

router.delete(
    "/:id/file",
    requireMinRole(UserRole.ADMIN),
    async (req: Request, res: Response) => {
        const post = await Post.findById(req.params.id);
        if (!post) throw new NotFoundError("Post not found");

        const thread = await Thread.findById(post.thread);
        if (!thread) throw new NotFoundError("Thread not found");

        const postFile = post?.file;
        if (!postFile) throw new NotFoundError("Post file not found");

        const isOp = thread.number === post.number;
        const promises: Promise<any>[] = [];

        if (!isOp) thread.fileReplyCount = thread.fileReplyCount - 1;

        // Do not leave empty posts
        if (!post.text?.trim()) {
            promises.push(post.delete());
            thread.posts = thread.posts.filter(
                (p) => p.toString() !== post._id
            );
            if (!isOp) thread.replyCount = thread.replyCount - 1;
        } else {
            post.file = undefined;
            promises.push(post.save());
        }

        promises.push(thread.save());
        await Promise.all(promises);

        await filesService.deleteFile({ ...post, file: postFile }, isOp);

        res.sendStatus(202);
    }
);

export default router;
