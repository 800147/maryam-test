const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

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
    const filePath = "./static" + pathName;
    console.log(filePath);
    serveStatic(response, cache, filePath);
  }
}).listen(3000, () => console.log("server working: http://localhost:3000"));

function send404(response) {
  response.writeHead(404, { "Content-Type": "text/plain" });
  response.write("Error 404: resource not found.");
  response.end();
}

function sendFile(response, filePath, fileContents) {
  let type;
  switch (path.extname(filePath)) {
    case ".html":
      type = "text/html";
      break;
    case ".js":
      type = "text/javascript";
      break;
    case ".css":
      type = "text/css";
      break;
    default:
      type = "text/plain";
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
            send404(response);
          } else {
            cache[absPath] = data;
            sendFile(response, absPath, data);
          }
        });
      } else {
        send404(response);
      }
    });
  }
}