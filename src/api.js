const { store } = require("./store");

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
  sendJson(data);
}

module.exports = {
  api
};
