const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const WebSocket = require("ws");

const cache = {};

http.createServer().on("request", (request, response) => {
  console.log(request.method + " " + request.url);
  const pathName = new URL("http://" + request.headers.host + request.url).pathname;
  if (request.url.startsWith("/api/")) {
    response.writeHead(200, { "Content-Type": "text/json" });
    response.end(JSON.stringify(
      {
        "message": "hello, world!"
      }
    ));
    console.log(response.statusCode);
  } else {
    const filePath = "./static" + (pathName != "/"? pathName: "/index.html");
    console.log(filePath);
    serveStatic(response, cache, filePath);
  }
}).listen(3000, () => console.log("server working: http://localhost:3000"));

function sendError(response, errorCode = 500) {
  response.writeHead(errorCode, { "Content-Type": "text/plain" });
  response.end("Error " + errorCode);
}

function sendFile(response, filePath, fileContents) {
  let type;
  switch (path.extname(filePath)) {
    case ".html": type = "text/html";       break;
    case ".js":   type = "text/javascript"; break;
    case ".css":  type = "text/css";        break;
    default:      type = "text/plain";
  }
  response.writeHead(200, { "content-type": type });
  response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
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
}

const webSocketServer = new WebSocket.Server({ port: 3001 });
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
