"use strict";
let store = __("plaintext", { class: "store" });
const actions = __("div", { class: "actions" });
const body = __("body", null,
  store,
  actions
);
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
  const scrolledToBottom = (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight;
  const json = JSON.parse(message.data);
  const newStore = __("plaintext", { class: "store" },
    JSON.stringify(json.store, null, "  ")
  );
  body.replaceChild(newStore, store);
  store = newStore;
  for (let i = 0; i < json.actions.length; i++) {
    actions.appendChild(
      __("div", null, json.actions[i].time + " " + json.actions[i].message)
    );
    console.log(json.actions[i].time + " " + json.actions[i].message);
  }
  console.log(json);
  if (scrolledToBottom) {
    window.scrollTo(window.scrollX, document.body.scrollHeight);
  }
};

ws.onerror = error => {
  console.log("WS error: " + error.message);
};
