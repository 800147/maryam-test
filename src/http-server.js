const http = require("http");
const { URL } = require("url");
const querystring = require('querystring');

const serveStatic = require("./static-server");
const store = require("./store");

const startHttp = port => {
  server = http.createServer();
  server.on("request", onRequest);
  server.listen(port, () => console.log("server working on " + port));
  return server;
};

const onRequest = (request, response) => {
  console.log(request.method + " " + request.url);
  const pathName = new URL("http://" + request.headers.host + request.url).pathname;
  if (request.url.startsWith("/api/")) {
    if (request.method == 'POST') {
      var body = '';
    }

    request.on('data', function (data) {
      body += data;
    });

    request.on('end', function () {
      var post = querystring.parse(body);
      console.log(post);
    });
    response.writeHead(200, { "Content-Type": "text/json" });
    response.end(JSON.stringify(
      {
        message: "hello, world!",
        store: store
      }
    ));
    //console.log(request);
    console.log(request.data);
    console.log(response.statusCode);
  } else {
    const filePath = "./static" + (pathName != "/"? pathName: "/index.html");
    console.log(filePath);
    serveStatic(response, filePath);
  }
};

module.exports = startHttp;
