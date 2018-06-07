const WebSocket = require("ws");

const { store } = require("./store");

let webSocketServer;

const startWs = params => {
  webSocketServer = new WebSocket.Server(params);
  webSocketServer.on("connection", client => {
    console.log("ws connection");
    client.on("message", message => onMessage(message, client));
  });
  return webSocketServer;
};

const onMessage = (message, client) => {
  message = JSON.parse(message);
  console.log("ws message: " + JSON.stringify(message));
  if (store.users[message.id] == null || store.users[message.id].key !== message.key) {
    console.log("Authentication failure! id: " + message.id + "key: " + message.key);
    return false;
  }
  client.id = message.id;
  client.room = store.users[client.id].room;
  store.users[client.id].wsClient = client;
  store.rooms[client.room].users[client.id].connected = true;
  notifyRoom(store.rooms[client.room]);
};

const notifyRoom = room => {
  console.log("notofy room");
  if (room == null) {
    console.log("room is undefined");
    return null;
  }
  const state = {
    users: room.users,
    state: room.state
  };
  for (userId in room.users) {
    const user = store.users[userId];
    if (user.wsClient == null) {
      console.log("no wsClient");
      continue;
    }
    if (user.wsClient.readyState !== WebSocket.OPEN) {
      console.log("user not ready");
      continue;
    }
    user.wsClient.send(JSON.stringify(state));
  }
};

module.exports = {
  startWs,
  notifyRoom
};
