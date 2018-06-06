"use strict";

const params = getUrlParams();
const asBridge = new ASBridge();

document.addEventListener("flash-app-connected", () => {
  const ws = new WebSocket("ws://" + window.location.hostname + ":" + window.location.port);

  ws.onopen = () => {
    console.log("status: open");
    ws.send(JSON.stringify({ id: params.id, key: params.key }));
  };

  ws.onclose = () => {
    document.getElementById("flashContent").style.display = "none";
    document.getElementById("disconnected").style.display = "block";
    //alert("no connection");
  };

  ws.onmessage = message => {
    asBridge.call(message.data);
  };

  ws.onerror = error => {
    console.log("error: " + error.message);
  };

});
