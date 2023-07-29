import { Router } from "express";
import { bucketUrls } from "../utils/files.js";
import database from "../utils/database.js";

const router = Router();

router.get("/", (_req, res) => {
    res.json({
        thumbnailPath: bucketUrls.thumbnails,
        opThumbnailPath: bucketUrls.opThumbnails,
    });
});

router.get("/latest-images", async (_req, res) => {
    const posts = await database.post.findMany({
        where: {
            file: {
                isNot: null,
            },
        },
        include: {
            file: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
    });

    res.json(
        posts.map((p) => ({
            name: p.file!.name,
            sentAt: p.createdAt,
            id: p.id,
            postNumber: p.id,
        }))
    );
});

export default router;
