import { Request, Response, Router } from "express";
import zod from "zod";

import { requireMinRole } from "../utils/authMiddleware.js";
import filesService from "../utils/files.js";
import NotFoundError from "../errors/NotFoundError.js";
import database from "../utils/database.js";
import { File, Post } from "@prisma/client";

const router = Router();

router.get("/:id", async (req, res) => {
    const id = zod.string().pipe(zod.coerce.number()).parse(req.params.id);

    const post = await database.post.findUnique({
        where: { id },
        include: {
            thread: true,
            file: true,
        },
    });
    res.json(post);
});

router.delete(
    "/:id",
    requireMinRole("MODERATOR"),
    async (req: Request, res: Response) => {
        const id = zod.string().pipe(zod.coerce.number()).parse(req.params.id);

        const post = await database.post.findUnique({
            where: { id },
            include: { thread: true, file: true },
        });
        if (!post?.thread || !post.threadId)
            throw new NotFoundError("Post not found");

        const isOp = post.id === post.threadId;

        await Promise.all([
            database.post.delete({ where: { id } }),
            !isOp &&
                database.thread.update({
                    where: { id: post.threadId },
                    data: {
                        replyCount: post.thread.replyCount - 1,
                        fileReplyCount: post.file
                            ? post.thread.fileReplyCount - 1
                            : post.thread.fileReplyCount,
                    },
                }),
            post.file &&
                filesService.deleteFile({ ...post, file: post.file }, isOp),
        ]);

        res.sendStatus(202);
    }
);

router.get("/:id/file", async (req, res) => {
    const id = zod.string().pipe(zod.coerce.number()).parse(req.params.id);
    const post = await database.post.findUnique({
        where: { id },
        include: { file: true },
    });
    if (!post) throw new NotFoundError("Post not found");
    if (!post.file) throw new NotFoundError("Post file not found");

    res.set({
        "Content-Type": post.file.mime,
        "Content-Disposition": `inline;filename="${post.file.name}"`,
    });

    const dataStream = await filesService.getFileBuffer(
        post as Post & { file: File }
    );

    dataStream.on("data", (chunk) => res.write(chunk));
    dataStream.on("end", () => res.end());
    dataStream.once("error", () => res.sendStatus(500));
});

router.delete(
    "/:id/file",
    requireMinRole("ADMIN"),
    async (req: Request, res: Response) => {
        const id = zod.string().pipe(zod.coerce.number()).parse(req.params.id);

        const post = await database.post.findUnique({
            where: { id },
            include: { thread: true, file: true },
        });
        if (!post?.thread || !post?.threadId)
            throw new NotFoundError("Post not found");

        const isOp = post.threadId === post.id;
        const postFile = post?.file;
        if (!postFile) throw new NotFoundError("Post file not found");

        const promises: Promise<any>[] = [];

        const noText = !post.text?.trim();
        if (noText) {
            // Don't leave empty posts
            promises.push(database.post.delete({ where: { id } }));
        } else {
            promises.push(
                database.post.update({
                    where: { id },
                    data: {
                        file: undefined,
                    },
                })
            );
        }

        if (!isOp) {
            promises.push(
                database.thread.update({
                    where: { id: post.threadId },
                    data: {
                        fileReplyCount: post.thread.fileReplyCount - 1,
                        // Empty posts are deleted
                        replyCount: noText
                            ? post.thread.replyCount - 1
                            : post.thread.replyCount,
                    },
                })
            );
        }

        await Promise.all(promises);
        await filesService.deleteFile({ ...post, file: postFile }, isOp);

        res.sendStatus(202);
    }
);

export default router;
