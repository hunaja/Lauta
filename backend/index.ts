import http from "http";

import app from "./app.js";
import filesService from "./utils/files.js";
import config from "./utils/config.js";

const server = http.createServer(app);

filesService.initializeFiles().then(() => console.log("Configured Minio."));

server.listen(config.port, () =>
    console.log(`Server running on ${config.port}`)
);
