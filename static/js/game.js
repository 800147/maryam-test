"use strict";

const params = getUrlParams();

const body = __("body", {},
  "id: " + params.id,
  __("br"),
  "key: " + params.key
);
document.addEventListener("DOMContentLoaded", () => document.documentElement.replaceChild(body, document.body), false);
