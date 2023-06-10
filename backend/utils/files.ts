import { Client } from "minio";
import sharp from "sharp";

import config from "./config.js";
import { UploadedFile } from "../types.js";
import { PostFile } from "../models/PostFile.js";
import { Post } from "../models/Post.js";

const baseUrl = `http://${config.minioHost}:${config.minioPort}`;

const buckets = {
    files: `${config.minioBucketPrefix}-files`,
    opthumbnails: `${config.minioBucketPrefix}-opthumbnails`,
    thumbnails: `${config.minioBucketPrefix}-thumbnails`,
};

export const bucketUrls = {
    files: `${baseUrl}/${buckets.files}`,
    opThumbnails: `${baseUrl}/${buckets.opthumbnails}`,
    thumbnails: `${baseUrl}/${buckets.thumbnails}`,
};

const client = new Client({
    endPoint: config.minioHost,
    port: config.minioPort,
    accessKey: config.minioAccessKey,
    secretKey: config.minioSecretKey,
    useSSL: false,
});

const initializeFiles = async () => {
    const promises = Object.keys(buckets).map(async (name) => {
        const fullName = buckets[name];

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

const uploadFile = async (post, file: UploadedFile, opPost = false) => {
    const uploadPromises = [
        client.putObject(buckets.files, post.file.location, file.buffer),
    ];

    // Creating a thumbnail for the post by resizing the original image
    const thumbnailBuffer = await sharp(file.buffer)
        .resize(165, 125)
        .toFormat("png")
        .toBuffer();
    uploadPromises.push(
        client.putObject(buckets.thumbnails, `${post._id}.png`, thumbnailBuffer)
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
                `${post._id}.png`,
                opThumbnailBuffer
            )
        );
    }

    await Promise.all(uploadPromises);
};

const deleteFile = async (post, opPost = false) => {
    const deletePromises = [
        client.removeObject(buckets.files, post.file.location),
        client.removeObject(buckets.thumbnails, `${post._id}.png`),
    ];

    if (opPost)
        deletePromises.push(
            client.removeObject(buckets.opthumbnails, `${post._id}.png`)
        );

    await Promise.all(deletePromises);
};

const getFileBuffer = async (post) => {
    if (!post.file) throw new Error("Post has no file");
    return client.getObject(buckets.files, post.file.location);
};

export default {
    initializeFiles,
    uploadFile,
    deleteFile,
    getFileBuffer,
};
