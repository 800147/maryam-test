const WebSocket = require("ws");

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
    logAndNotify(store.rooms[client.room], store.rooms[client.room].users[client.id].initName + " отключен");
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
    logAndNotify(store.rooms[client.room], store.rooms[client.room].users[client.id].initName + " подключен");
    return;
  }
  if (message.room != null) {
    if (store.rooms[message.room] == null || store.rooms[message.room].observerKey !== message.key) {
      console.log("Authentication failure! room: " + message.room + " observerKey: " + message.key);
      return false;
    }
    client.room = message.room;
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
        time: store.rooms[client.room].logs[i].time.toLocaleString()
      });
    }
    client.send(JSON.stringify(logs));
    return;
  }
  console.log("wrong message");
};

const notifyRoom = room => {
  console.log("notify room");
  if (room == null) {
    console.log("room is undefined");
    return null;
  }
  const message = JSON.stringify({
    users: room.users,
    state: room.state
  });
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
    user.wsClient.send(message);
  }
};

const notifyRoomObservers = (room, logRecord) => {
  console.log("notofy room for observers");
  if (room == null) {
    console.log("room is undefined");
    return null;
  }
  const logs = JSON.stringify({
    actions: [{
      message: logRecord.message,
      time: logRecord.time.toLocaleString()
    }],
    store: {
      users: logRecord.users,
      state: logRecord.state
    }
  });
  for (let i = 0; i < room.observers.length; i++) {
    room.observers[i].send(logs);
  }
};

const logAndNotify = (room, message) => {
  const logRecord = log(room, message);
  notifyRoom(room);
  notifyRoomObservers(room, logRecord);
};

module.exports = {
  startWs,
  logAndNotify
};
