const http = require("http");
const { URL } = require("url");
const querystring = require('querystring');

const { serveStatic } = require("./static-server");
const { api } = require("./api");

const startHttp = port => {
  server = http.createServer();
  server.on("request", onRequest);
  server.listen(port, () => console.log("server working on " + port));
  return server;
};

const onRequest = (request, response) => {
  const pathName = new URL("http://" + request.headers.host + request.url).pathname;
  if (request.url.startsWith("/api/")) {
    if (request.method == 'POST') {
      let body = '';
      request.on('data', data => body += data);
      request.on('end', () => {
        const postObj = querystring.parse(body);
        console.log("\r\n" + new Date().toLocaleString() + " " + request.method + " " + request.url + ": " + JSON.stringify(postObj));
        api(request.url.substring("/api/".length), postObj, json => sendJson(response, json));
      });
    } else {
      sendJson(response, { error: "use POST method please" });
    }
  } else {
    const filePath = "./static" + (pathName != "/"? pathName: "/index.html");
    //console.log(filePath);
    serveStatic(response, filePath);
  }
};

const sendJson = (response, obj) => {
  response.writeHead(200, { "Content-Type": "text/json" });
  console.log(JSON.stringify(obj));
  response.end(JSON.stringify(obj));
};

module.exports = {
  startHttp
};
