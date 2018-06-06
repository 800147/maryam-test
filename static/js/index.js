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


//custom elements
const used = (obj, ...funcs) => (funcs.forEach(func => func(obj)), obj);
const appendChildren = (el, ...children) =>
  children.forEach(child => {
    if (child != null) {
      el.appendChild(typeof(child) === "string"? document.createTextNode(child): child)
    }
  })
;
const __ = (tagName, attrs = null, ...children) => {
  const el = document.createElement(tagName);
  if (attrs != null) {
    Object.keys(attrs).forEach(name => el.setAttribute(name, attrs[name]));
  }
  appendChildren(el, ...children);
  return el;
};

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
