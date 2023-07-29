import bcrypt from "bcrypt";

import config from "../utils/config.js";
import database from "../utils/database.js";

const seed = async () => {
    const root = await database.user.upsert({
        where: { username: "root" },
        update: {},
        create: {
            username: "root",
            passwordHash: await bcrypt.hash("root", config.hashRounds),
            email: "root@root.com",
            role: "ADMIN",
        },
    });

    console.log("Root user created:", root);

    const firstBoard = await database.board.upsert({
        where: { path: "b" },
        update: {},
        create: {
            name: "Random",
            path: "b",
            title: "Random board",
        },
    });

    const secondBoard = await database.board.upsert({
        where: { path: "g" },
        update: {},
        create: {
            name: "Technology",
            path: "g",
            title: "Technology board",
        },
    });

    console.log("Boards created:", firstBoard, secondBoard);
};

seed()
    .then(async () => {
        console.log("Seed successful.");
        return database.$disconnect();
    })
    .catch((e) => console.error(e))
    .finally(() => process.exit(0));
