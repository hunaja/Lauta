import { Router } from "express";

import Thread from "../models/Thread.js";
import Post from "../models/Post.js";
import { uploadFile } from "../utils/files.js";
import uploadMiddleware from "../utils/uploadMiddleware.js";
import { extractUser } from "../utils/authMiddleware.js";

const router = Router();

// Get a thread by its number
router.get("/number/:number", async (req, res) => {
    const number = Number(req.params.number);
    if (Number.isNaN(number)) return res.sendStatus(400);

    const thread = await Thread.findOne({ number }).populate("posts");
    if (!thread) return res.sendStatus(404);

    res.json(thread);
});

// Temp solution
router.get("/withReplyNumber/:number", async (req, res) => {
    const number = Number(req.params.number);
    if (Number.isNaN(number)) return res.sendStatus(400);

    const post = await Post.findOne({ number }).populate("thread");
    if (!post) return res.sendStatus(404);

    res.json({
        ...post.thread.toJSON(),
        posts: [post.toJSON()],
    });
});

// Delete a thread
router.delete("/:id", extractUser, async (req, res) => {
    if (req.authorizedUser.role !== "SOPSY")
        return res.status(403).json({ error: "Riittämättömät oikeudet." });

    const thread = await Thread.findByIdAndDelete(req.params.id);
    if (!thread) return res.sendStatus(404);

    // TODO Remove the threads' posts from the database
    // res.sendStatus(202);
});

// Reply to a thread
router.post("/:id/replies", uploadMiddleware, async (req, res) => {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.sendStatus(404);

    const text = req.body.text?.trim();
    const author = req.body.author?.trim() || undefined;
    const saging = req.body.email?.split(" ").includes("sage");
    const createdAt = Date.now();

    if (author?.length < 3)
        return res
            .status(400)
            .json({ error: "Käyttäjännimi on liian lyhyt.", field: "author" });
    if (!text && !req.file)
        return res.status(400).json({
            error: "Joko kuva tai tiedosto on annettava.",
            field: "text",
        });

    // Create a post
    const newPost = new Post({
        thread: thread._id,
        text,
        author,
        saging,
        createdAt,
    });
    const post = await newPost.save();

    // Handle post uploads
    if (req.file) {
        const postFile = await uploadFile(post, req.file);
        post.file = postFile;
        await post.save();
        thread.fileReplyCount = thread.fileReplyCount + 1;
    }

    // Add the post to its thread
    thread.posts = thread.posts.concat(post._id);
    thread.replyCount = thread.replyCount + 1;
    // Bump the thread if it's needed
    if (!saging) thread.bumpedAt = Date.now();

    await thread.save();
    res.json(post);
});

export default router;
