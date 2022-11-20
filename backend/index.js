import http from "http";

import app from "./app.js";
import config from "./utils/config.js";

const server = http.createServer(app);

server.listen(config.port, () => console.log(`Server running on ${config.port}`));
