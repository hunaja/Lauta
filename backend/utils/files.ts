import { Client } from "minio";
import sharp from "sharp";

import config from "./config.js";
import { UploadedFile } from "../types.js";
import { File, Post } from "@prisma/client";
const baseUrl = `http://${config.minioHost}:${config.minioPort}`;

const buckets = {
    files: `${config.minioBucketPrefix}-files`,
    opthumbnails: `${config.minioBucketPrefix}-opthumbnails`,
    thumbnails: `${config.minioBucketPrefix}-thumbnails`,
} as const;

export const bucketUrls = {
    files: `${baseUrl}/${buckets.files}`,
    opThumbnails: `${baseUrl}/${buckets.opthumbnails}`,
    thumbnails: `${baseUrl}/${buckets.thumbnails}`,
} as const;

const client = new Client({
    endPoint: config.minioHost,
    port: config.minioPort,
    accessKey: config.minioAccessKey,
    secretKey: config.minioSecretKey,
    useSSL: false,
});

const initializeFiles = async () => {
    const promises = Object.entries(buckets).map(async ([name, fullName]) => {
        // Create the bucket if it does not exist
        if (!(await client.bucketExists(fullName))) {
            console.log(`Making a brand new bucket ${fullName}...`);
            await client.makeBucket(fullName);
        }

        return client.setBucketPolicy(
            fullName,
            JSON.stringify({
                Version: "2012-10-17",
                Statement: [
                    {
                        // Disallow direct access to files
                        Effect: name === "files" ? "Deny" : "Allow",
                        Principal: { AWS: ["*"] },
                        Action: ["s3:GetObject"],
                        Resource: [`arn:aws:s3:::${fullName}/*`],
                    },
                ],
            })
        );
    });

    return Promise.all(promises);
};

const uploadFile = async (
    post: Post & { file: File },
    file: UploadedFile,
    opPost = false
) => {
    if (!file.buffer) throw new Error("File has no buffer");

    const uploadPromises = [
        client.putObject(buckets.files, post.file.location, file.buffer),
    ];

    // Creating a thumbnail for the post by resizing the original image
    const thumbnailBuffer = await sharp(file.buffer)
        .resize(165, 125)
        .toFormat("png")
        .toBuffer();
    uploadPromises.push(
        client.putObject(buckets.thumbnails, `${post.id}.png`, thumbnailBuffer)
    );

    // Creating an another, bigger thumbnail for the post (if it starts a thread)
    if (opPost) {
        const opThumbnailBuffer = await sharp(file.buffer)
            .resize(295, 295)
            .toFormat("png")
            .toBuffer();

        uploadPromises.push(
            client.putObject(
                buckets.opthumbnails,
                `${post.id}.png`,
                opThumbnailBuffer
            )
        );
    }

    await Promise.all(uploadPromises);
};

const deleteFile = async (post: Post & { file: File }, opPost = false) => {
    const deletePromises = [
        client.removeObject(buckets.files, post.file.location),
        client.removeObject(buckets.thumbnails, `${post.id}.png`),
    ];

    if (opPost)
        deletePromises.push(
            client.removeObject(buckets.opthumbnails, `${post.id}.png`)
        );

    await Promise.all(deletePromises);
};

const getFileBuffer = async (post: Post & { file: File }) => {
    return client.getObject(buckets.files, post.file.location);
};

export default {
    initializeFiles,
    uploadFile,
    deleteFile,
    getFileBuffer,
};
