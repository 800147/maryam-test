"use strict";

//urlParams
const getUrlParams = () => {
  const params = { };
  if (window.location.search == "") return params;
  window.location.search.substr(1).split("&").forEach(param => {
    let p = param.split("=", 2);
    params[p[0]] = p.length == 1? "": decodeURIComponent(p[1].replace(/\+/g, " "));
  });
  return params;
};

//custom elements
const modified = (obj, ...funcs) => (funcs.forEach(func => func(obj)), obj);
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

const body = __("body", null,
  "hello from index.js",
  __("br"),
  JSON.stringify(getUrlParams())
);
document.addEventListener("DOMContentLoaded", () => document.documentElement.replaceChild(body, document.body), false);
