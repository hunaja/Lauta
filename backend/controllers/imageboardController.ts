import { Router } from "express";
import Post from "../models/Post.js";
import { bucketUrls } from "../utils/files.js";

const router = Router();

router.get("/", (_req, res) => {
    res.json({
        thumbnailPath: bucketUrls.thumbnails,
        opThumbnailPath: bucketUrls.opThumbnails,
    });
});

router.get("/latest-images", async (_req, res) => {
    const posts = await Post.find(
        { file: { $exists: true } },
        "file createdAt number"
    )
        .sort("-createdAt")
        .limit(5);

    res.json(
        posts.map((p) => ({
            name: p.file!.name,
            sentAt: p.createdAt,
            id: p.id,
            postNumber: p.number,
        }))
    );
});

export default router;
