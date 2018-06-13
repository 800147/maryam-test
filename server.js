const { startHttp } = require("./src/http-server.js");
const { startWs } = require("./src/ws-server.js");

const port = 8080;
const httpServer = startHttp(port);
startWs({ server: httpServer });

console.log("new room: http://localhost:" + port + "/new-room.html");
console.log("   Alice: http://localhost:" + port + "/game.html?id=user0&key=key0");
console.log("     Bob: http://localhost:" + port + "/game.html?id=user1&key=key1");
console.log("observer: http://localhost:" + port + "/game.html?room=room0&key=observerKey0");
