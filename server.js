const http = require("http");

const server = http.createServer();

server.on("request", (request, response) => {
    response.end("hello world");
});

server.listen(3000, () => console.log("server working"));
