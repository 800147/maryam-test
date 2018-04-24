const fs = require("fs");
const path = require("path");

const cache = {};

const serveStatic = (response, absPath) => {
  if (cache[absPath]) {
    sendFile(response, absPath, cache[absPath]);
  } else {
    fs.exists(absPath, exists => {
      if (exists) {
        fs.readFile(absPath, (err, data) => {
          if (err) {
            sendError(response, 404);
          } else {
            cache[absPath] = data;
            sendFile(response, absPath, data);
          }
        });
      } else {
        sendError(response, 404);
      }
    });
  }
};

const sendFile = (response, filePath, fileContents) => {
  let type;
  switch (path.extname(filePath)) {
    case ".html": type = "text/html";       break;
    case ".js":   type = "text/javascript"; break;
    case ".css":  type = "text/css";        break;
    default:      type = "text/plain";
  }
  response.writeHead(200, { "content-type": type });
  response.end(fileContents);
};

const sendError = (response, errorCode = 500) => {
  response.writeHead(errorCode, { "Content-Type": "text/plain" });
  response.end("Error " + errorCode);
};

module.exports = {
  serveStatic
};
