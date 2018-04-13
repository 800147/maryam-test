const WebSocket = require("ws");

const startWs = params => {
  const webSocketServer = new WebSocket.Server(params);
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
  return webSocketServer;
};

module.exports = startWs;
