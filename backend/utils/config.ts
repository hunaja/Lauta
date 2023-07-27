import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { UserRole } from "../types.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

dotenv.config({ path: `${__dirname}/../../.env` });

export default {
    port: process.env.PORT ?? 3001,
    mongoUri: process.env.MONGODB_URI!,
    jwtSecret: process.env.JWT_SECRET!,
    hashRounds: 10,
    defaultUser: {
        username: "root",
        password: "root",
        role: UserRole.ADMIN,
    },

    minioHost: process.env.MINIO_HOST ?? "localhost",
    minioPort: Number(process.env.MINIO_PORT ?? 9000),
    minioAccessKey: process.env.MINIO_ACCESS_KEY!,
    minioSecretKey: process.env.MINIO_SECRET_KEY!,
    minioBucketPrefix: "lauta",

    pageSize: 8,
    catalogPageSize: 16,
    maxFileSize: 5 * 1024 * 1024,

    allowedMimeTypes: ["image/jpeg", "image/gif", "image/png"],
};
