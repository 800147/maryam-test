"use strict";

const getUrlParams = () => {
  const params = { };
  if (window.location.search == "") return params;
  window.location.search.substr(1).split('&').forEach(param => {
    let p = param.split('=', 2);
    params[p[0]] = p.length == 1? "": decodeURIComponent(p[1].replace(/\+/g, " "));
  });
  return params;
};
