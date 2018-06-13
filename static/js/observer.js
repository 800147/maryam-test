"use strict";

const body = __("body", null,
  "I am observer! :)"
);
document.addEventListener("DOMContentLoaded", () => document.documentElement.replaceChild(body, document.body), false);
