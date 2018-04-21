const http = require("http");
const { URL } = require("url");

const serveStatic = require("./static-server");
const store = require("./store");

const startHttp = port => {
  server = http.createServer();
  server.on("request", onRequest);
  server.listen(port, () => console.log("server working: http://localhost:" + port));
  return server;
};

const onRequest = (request, response) => {
  store.httpRequests++;
  console.log(request.method + " " + request.url);
  const pathName = new URL("http://" + request.headers.host + request.url).pathname;
  if (request.url.startsWith("/api/")) {
    response.writeHead(200, { "Content-Type": "text/json" });
    response.end(JSON.stringify(
      {
        message: "hello, world!",
        store: store
      }
    ));
    console.log(response.statusCode);
  } else {
    const filePath = "./static" + (pathName != "/"? pathName: "/index.html");
    console.log(filePath);
    serveStatic(response, filePath);
  }
};

module.exports = startHttp;
