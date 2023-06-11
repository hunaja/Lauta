import express from "express";
import cors from "cors";
import errorHandler from "./utils/errorHandlerMiddleware.js";
import { extractToken } from "./utils/authMiddleware.js";

import imageboardController from "./controllers/imageboardController.js";
import boardsController from "./controllers/boardsController.js";
import threadsController from "./controllers/threadsController.js";
import postsController from "./controllers/postsController.js";
import authorizeController from "./controllers/authorizeController.js";
import usersController from "./controllers/usersController.js";

const app = express();

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
