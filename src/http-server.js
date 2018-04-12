const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const cache = {};

const startHttp = port => {
  http.createServer().on("request", handler).listen(port, () => console.log("server working: http://localhost:" + port));
};

const handler = (request, response) => {
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
}

const sendError = (response, errorCode = 500) => {
  response.writeHead(errorCode, { "Content-Type": "text/plain" });
  response.end("Error " + errorCode);
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

const serveStatic = (response, cache, absPath) => {
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

module.exports = startHttp;
