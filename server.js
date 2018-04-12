const startHttp = require("./src/http-server.js");
const startWs = require("./src/ws-server.js");

startHttp(3000);
startWs(3001);
