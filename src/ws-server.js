const WebSocket = require("ws");

const startWs = port => {
  const webSocketServer = new WebSocket.Server({ port: port });
  webSocketServer.on("connection", ws => {
    console.log("ws connection");
    ws.on("message", message => {
      console.log("ws message: " + message);
      webSocketServer.clients.forEach(client => {
        //console.log(client);
        if (client.readyState === WebSocket.OPEN) {
          client.send("someone said: " + message);
        }
      });
    });
    ws.send("hi");
  });
};

module.exports = startWs;
