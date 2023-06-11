import http from "http";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import app from "./app.js";
import filesService from "./utils/files.js";
import config from "./utils/config.js";
import User from "./models/User.js";

const server = http.createServer(app);

filesService.initializeFiles().then(() => console.log("Configured Minio."));

mongoose
    .connect(config.mongoUri)
    .then(async () => {
        console.log("Connected to MongoDB.");

        const createDefaultUser = !(await User.estimatedDocumentCount());

        if (createDefaultUser) {
            const { username, password, role } = config.defaultUser;

            const defaultUser = new User({
                passwordHash: await bcrypt.hash(password, config.hashRounds),
                username,
                role,
            });
            await defaultUser.save();

            console.log(
                `Created a default ${role} user with credentials ${username}:${password}.`
            );
        }
    })
    .catch((error) => console.log("Can't connect to MongoDB:", error.message));

server.listen(config.port, () =>
    console.log(`Server running on ${config.port}`)
);
