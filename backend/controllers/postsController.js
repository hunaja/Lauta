import { Router } from "express";

import Post from "../models/Post.js";
import Thread from "../models/Thread.js";
import { extractUser } from "../utils/authMiddleware.js";
import { getFileBuffer, deleteFile } from "../utils/files.js";

const router = Router();

router.delete("/:id", extractUser, async (req, res) => {
    if (req.authorizedUser.role !== "SOPSY") return res.status(403).json({ error: "Riittämättömät oikeudet." });

    const post = await Post.findById(req.params.id);
    if (!post) return res.sendStatus(404);

    const thread = await Thread.findById(post.thread);
    if (!thread) return res.sendStatus(404);

    const isOp = thread.number === post.number;

    if (post.file) thread.fileReplyCount = thread.fileReplyCount - 1;
    thread.replyCount = thread.replyCount - 1;
    thread.posts = thread.posts.filter((p) => p.id !== post._id);

    const deletePromises = [post.remove(), thread.save()];
    if (post.file) deletePromises.push(deleteFile(post, isOp));
    await Promise.all(deletePromises);

    res.sendStatus(202);
});

router.get("/:id/file", async (req, res) => {
    const post = await Post.findById(req.params.id, "file");
    const postFile = post.file;
    if (!post || !postFile) return res.sendStatus(404);

    res.set({
        "Content-Type": postFile.mimeType,
        "Content-Disposition": `inline;filename=${postFile.name}`,
    });

    const dataStream = await getFileBuffer(post);
    dataStream.on("data", (chunk) => res.write(chunk));
    dataStream.on("end", () => res.end());
    dataStream.once("error", () => res.sendStatus(500));
});

router.delete("/:id/file", extractUser, async (req, res) => {
    if (req.authorizedUser.role !== "SOPSY") return res.status(403).json({ error: "Riittämättömät oikeudet." });

    const post = await Post.findById(req.params.id);
    const thread = await Thread.findById(post.thread);
    const postFile = post.file;
    if (!post || !thread || !postFile) return res.sendStatus(404);

    const isOp = thread.number === post.number;

    const deletePromises = [deleteFile(post, isOp)];

    thread.fileReplyCount = thread.fileReplyCount - 1;

    // Do not leave empty posts
    if (!post.text?.trim()) {
        deletePromises.push(post.delete());
        thread.posts = thread.posts.filter((p) => p.id !== post._id);
        thread.replyCount = thread.replyCount - 1;
    } else {
        post.file = undefined;
        deletePromises.push(post.save());
    }

    deletePromises.push(thread.save());
    await Promise.all(deletePromises);

    res.sendStatus(202);
});

export default router;
