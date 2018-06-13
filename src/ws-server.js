const WebSocket = require("ws");

const { api } = require("./api.js");
const { store, log } = require("./store");

let webSocketServer;

const startWs = params => {
  webSocketServer = new WebSocket.Server(params);
  webSocketServer.on("connection", onConnect);
  return webSocketServer;
};

const onConnect = client => {
  console.log("ws connection");
  client.on("close", () => onClose(client));
  client.on("message", message => onMessage(message, client));
};

const onClose = client => {
  if (client.id != null) {
    store.users[client.id].wsClient = null;
    store.rooms[client.room].users[client.id].connected = false;
    log(store.rooms[client.room], store.rooms[client.room].users[client.id].initName + " отключен");
    notifyRoom(store.rooms[client.room]);
  }
  if (client.room != null) {
    for (let i = 0; i < store.rooms[client.room].observers.length; i++) {
      if (store.rooms[client.room].observers[i] === client) {
        store.rooms[client.room].observers.splice(i);
        return;
      }
    }
  }
};

const onMessage = (message, client) => {
  message = JSON.parse(message);
  console.log("ws message: " + JSON.stringify(message));
  if (message.id != null) {
    if (store.users[message.id] == null || store.users[message.id].key !== message.key) {
      console.log("Authentication failure! id: " + message.id + " key: " + message.key);
      return false;
    }
    client.id = message.id;
    client.room = store.users[client.id].room;
    store.users[client.id].wsClient = client;
    store.rooms[client.room].users[client.id].connected = true;
    log(store.rooms[client.room], store.rooms[client.room].users[client.id].initName + " подключен");
    notifyRoom(store.rooms[client.room]);
  }
  if (message.room != null) {
    if (store.rooms[message.room] == null || store.rooms[message.room].observerKey !== message.key) {
      console.log("Authentication failure! room: " + message.room + " observerKey: " + message.key);
      return false;
    }
    store.rooms[client.room].observers.push(client);
    const logs = {
      actions: [],
      store: {
        users: store.rooms[client.room].users,
        state: store.rooms[client.room].state
      }
    };
    for (let i = 0; i < store.rooms[client.room].logs.length; i++) {
      logs.actions.push({
        message: store.rooms[client.room].logs[i].message,
        time: store.rooms[client.room].logs[i].time
      });
    }
    client.send(JSON.stringify(logs));
  }
};

const notifyRoom = room => {
  console.log("notofy room");
  if (room == null) {
    console.log("room is undefined");
    return null;
  }
  const message = {
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
    user.wsClient.send(JSON.stringify(message));
  }
};

const notifyRoomObservers = (room, logRecord) => {
  console.log("notofy room for observers");
  if (room == null) {
    console.log("room is undefined");
    return null;
  }
  for (let i = 0; i < room.observers.length; i++) {
    room.observers[i].send(JSON.stringify(logRecord));
  }
};

module.exports = {
  startWs,
  notifyRoom,
  notifyRoomObservers
};
