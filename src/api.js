const { store } = require("./store");
const { uuidv4 } = require("./lib/uuidv4.js");
const { notifyRoom } = require("./ws-server");

const api = (path, data, sendJson) => {
  console.log("API \"" + path + "\" " + JSON.stringify(data));
  switch (path) {
    case "newRoom":
      newRoom(data, sendJson);
      break;
    case "checkout":
      checkout(data, sendJson);
      break;
    case "ready":
      ready(data, sendJson);
      break;
    default:
      sendJson({ error: 404 });
  }
};

const newRoom = (data, sendJson) => {
  const roomId = uuidv4();
  const room = {
    logs: [],
    users: {},
    state: {
      scene: 0
    }
  };
  store.rooms[roomId] = room;
  let userIndex = 0;

  const response = [];

  while (data["user-" + userIndex] != null) {
    const userId = uuidv4();
    room.users[userId] = {
      initNumber: userIndex,
      initName: data["user-" + userIndex]
    };
    store.users[userId] = {
      key: uuidv4(),
      room: roomId
    };
    response.push({
      initNumber: userIndex,
      initName: room.users[userId].initName,
      id: userId,
      key: store.users[userId].key
    });
    
    userIndex++;
  }
  sendJson(response);
};

const getRoom = data => {
  if (store.users[data.id].key !== data.key) {
    return null;
  }
  return store.rooms[store.users[data.id].room];
};

const checkout = (data, sendJson) => {
  const room = getRoom(data);
  if (room == null) {
    sendJson({ error: "access denied" });
    return;
  }
  sendJson({
    users: room.users,
    state: room.state
  });
};

const ready = (data, sendJson) => {
  const room = getRoom(data);
  if (room == null) {
    sendJson({ error: "access denied" });
    return;
  }
  room.users[data.id].ready = true;
  if (Object.keys(room.users).every(userId => room.users[userId].ready)) {
    room.state.scene = Math.max(room.state.scene, 1);
  }
  notifyRoom(room);
};

module.exports = {
  api
};
