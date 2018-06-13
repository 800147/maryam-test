"use strict";

const body = __("body");
document.addEventListener("DOMContentLoaded", () => document.documentElement.replaceChild(body, document.body), false);

const params = getUrlParams();

const ws = new WebSocket("ws://" + window.location.hostname + ":" + window.location.port);
ws.onopen = () => {
  console.log("WS status: open");
  ws.send(JSON.stringify({ room: params.room, key: params.key }));
};
ws.onclose = () => {
  console.log("WS status: closed");
};
ws.onmessage = message => {
  const json = JSON.parse(message.data);
  console.log(JSON.stringify(json, null, "  "));
  if (json.actions != null) {
    for (let i = 0; i < json.actions.length; i++) {
      body.appendChild(
        __("div", null, json.actions[i].time + " " + json.actions[i].message)
      );
    }
  }
};
ws.onerror = error => {
  console.log("WS error: " + error.message);
};
