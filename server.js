const startHttp = require("./src/http-server.js");
const startWs = require("./src/ws-server.js");

const httpServer = startHttp(8080);
startWs({ server: httpServer });
