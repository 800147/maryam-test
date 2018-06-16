const { store } = require("./store");
const { uuidv4 } = require("./lib/uuidv4.js");
const { logAndNotify } = require("./ws-server");

const api = (path, data, sendJson) => {
  //console.log("API \"" + path + "\" " + JSON.stringify(data));
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
    case "chooseFigure":
      chooseFigure(data, sendJson);
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
    observerKey: uuidv4(),
    observers: [],
    state: {
      scene: 0
    }
  };
  store.rooms[roomId] = room;
  let userIndex = 0;

  const response = {
    roomId: roomId,
    observerKey: room.observerKey,
    users: []
  };

  while (data["user-" + userIndex] != null) {
    const userId = uuidv4();
    room.users[userId] = {
      initNumber: userIndex,
      initName: data["user-" + userIndex],
      id: userId
    };
    store.users[userId] = {
      key: uuidv4(),
      room: roomId
    };
    response.users.push({
      initNumber: userIndex,
      initName: room.users[userId].initName,
      id: userId,
      key: store.users[userId].key
    });
    
    userIndex++;
  }
  logAndNotify(room, "Комната создана");
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
  if (room.users[data.id].ready != null) {
    sendJson({ error: "ready already" });
    return;
  }
  room.users[data.id].ready = true;
  logAndNotify(room, room.users[data.id].initName + " готов!");
  if (Object.keys(room.users).every(userId => room.users[userId].ready)) {
    room.state.scene = 1;
    room.state.step = 0;
    logAndNotify(room, "Переход к шагу 1");
  }
  sendJson({});
};

const chooseFigure = (data, sendJson) => {
  const room = getRoom(data);
  if (room == null) {
    sendJson({ error: "access denied" });
    return;
  }
  room.users[data.id].figure = { type: data.type, circle: data.circle };
  logAndNotify(room, room.users[data.id].initName + " выбрал фигуру " + data.type + data.circle);
  /*
  if (Object.keys(room.users).every(userId => room.users[userId].figure != null)) {
    room.state.scene = Math.max(room.state.scene, 1);
    room.state.step = 1;
    logAndNotify(room, "Все выбрали фигуры");
  }
  */
  sendJson({});
};

module.exports = {
  api,
  logAndNotify
};
