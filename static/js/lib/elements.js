"use strict";

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
