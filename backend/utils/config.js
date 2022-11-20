import dotenv from "dotenv";

dotenv.config();

export default {
    port: process.env.PORT ?? 3001,
    mongoUri: process.env.MONGODB_URI,
    secret: process.env.SECRET,
    hashRounds: 10,

    minioHost: process.env.MINIO_HOST ?? "localhost",
    minioPort: process.env.MINIO_PORT ?? 9000,
    minioAccessKey: process.env.MINIO_ACCESS_KEY ?? "lauta",
    minioSecretKey: process.env.MINIO_SECRET_KEY ?? "lautaPassword",
    minioBucketPrefix: process.env.MINIO_BUCKET_PREFIX ?? "lauta",

    allowedMimeTypes: ["image/jpeg", "image/gif", "image/png"],
};
