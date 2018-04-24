const { store } = require("./store");
const { uuidv4 } = require("./lib/uuidv4.js");

const api = (path, data, sendJson) => {
  console.log("API \"" + path + "\" " + JSON.stringify(data));
  switch (path) {
    case "newRoom":
      newRoom(data, sendJson);
      break;
    default:
      sendJson({ error: 404 });
  }
};

const newRoom = (data, sendJson) => {
  const roomId = uuidv4();
  const room = {
    logs: [],
    users: {}
  };
  store.rooms[roomId] = room;
  let userIndex = 0;

  const response = [];

  while (data["user-" + userIndex] != null) {
    const userId = uuidv4();
    room.users[userId] = {
      initNumber: userIndex,
      initName: data["user-" + userIndex],
      name: ""
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

module.exports = {
  api
};
