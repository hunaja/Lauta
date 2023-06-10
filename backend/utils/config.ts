import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

dotenv.config({ path: `${__dirname}/../../.env` });

export default {
    port: process.env.PORT ?? 3001,
    mongoUri: process.env.MONGODB_URI!,
    jwtSecret: process.env.JWT_SECRET!,
    hashRounds: 10,

    minioHost: process.env.MINIO_HOST ?? "localhost",
    minioPort: Number(process.env.MINIO_PORT ?? 9000),
    minioAccessKey: process.env.MINIO_ACCESS_KEY!,
    minioSecretKey: process.env.MINIO_SECRET_KEY!,
    minioBucketPrefix: process.env.MINIO_BUCKET_PREFIX ?? "luchan",

    allowedMimeTypes: ["image/jpeg", "image/gif", "image/png"],
};
