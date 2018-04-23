const WebSocket = require("ws");

const store = require("./store");

let webSocketServer;

const startWs = params => {
  webSocketServer = new WebSocket.Server(params);
  webSocketServer.on("connection", ws => {
    console.log("ws connection");
    ws.on("message", onMessage);
    ws.send("hi");
  });
  return webSocketServer;
};

const onMessage = message => {
  console.log("ws message: " + message);
  webSocketServer.clients.forEach(client => {
    //console.log(client);
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          message: "someone said: " + message,
          store: store
        })
      );
    }
  });
};

module.exports = startWs;
