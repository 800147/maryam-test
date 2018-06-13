"use strict";

const ws = new WebSocket("ws://" + window.location.hostname + ":" + window.location.port);
ws.onopen = () => {
  setStatus("open");
  sendMessage("hello");
};
ws.onclose = () => {
  setStatus("closed");
};
ws.onmessage = message => {
  body.appendChild(__("div", {}, message.data));
};
ws.onerror = error => {
  body.appendChild(__("div", { "style": "color: red;" }, "Ошибка: " + error.message));
};
const sendMessage = message => ws.send(message);

function setStatus(value) {
  if (statusDiv == null) return;
  statusDiv.innerHTML = value;
}

let statusDiv;
let sayInput;
let sayButton;

const body = __("body", null,
  "hello from index.js",
  __("br"),
  JSON.stringify(getUrlParams()),
  __("br"),
  used(__("div"),
    el => statusDiv = el
  ),
  used(__("input", { "type": "text" }),
    el => sayInput = el
  ),
  used(__("button", {}, "say"),
    el => sayButton = el
  ),
);
document.addEventListener("DOMContentLoaded", () => document.documentElement.replaceChild(body, document.body), false);
sayButton.addEventListener("click", () => sendMessage(sayInput.value));
