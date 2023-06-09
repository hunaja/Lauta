import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import { initializeFiles } from "./utils/files.js";
import config from "./utils/config.js";
import errorHandler from "./utils/errorHandlerMiddleware.js";
import { extractToken } from "./utils/authMiddleware.js";
import User from "./models/User.js";

import imageboardController from "./controllers/imageboardController.js";
import boardsController from "./controllers/boardsController.js";
import threadsController from "./controllers/threadsController.js";
import postsController from "./controllers/postsController.js";
import authorizeController from "./controllers/authorizeController.js";
import usersController from "./controllers/usersController.js";

const app = express();

initializeFiles().then(() => console.log("Configured Minio."));

mongoose
    .connect(config.mongoUri)
    .then(async () => {
        console.log("Connected to MongoDB.");

        const createDefaultUser = !(await User.estimatedDocumentCount());

        if (createDefaultUser) {
            const defaultUser = new User({
                username: "root",
                passwordHash: await bcrypt.hash("root", config.hashRounds),
                role: "SOPSY",
            });
            await defaultUser.save();
            console.log(
                "Created a default sysop user with credentials root:root."
            );
        }
    })
    .catch((error) => console.log("Can't connect to MongoDB:", error.message));

app.use(express.json());
app.use(cors());
app.use(extractToken);

app.use("/api/imageboard", imageboardController);
app.use("/api/boards", boardsController);
app.use("/api/threads", threadsController);
app.use("/api/posts", postsController);
app.use("/api/authorize", authorizeController);
app.use("/api/users", usersController);

app.use(errorHandler);

export default app;
