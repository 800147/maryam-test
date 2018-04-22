const startHttp = require("./src/http-server.js");
const startWs = require("./src/ws-server.js");

const port = 8080;
const httpServer = startHttp(port);
startWs({ server: httpServer });

//console.log("http://localhost:" + port);
console.log("http://localhost:" + port + "/new-room.html");
