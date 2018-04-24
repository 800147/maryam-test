"use strict";

const __userRow = (n) => {
  let __nameInput;
  let __xButton;

  const block = __row({ },
    used(__lineInput({ form: "form-0" }),
      el => el.classList.add("flex-grow_1"),
      el => __nameInput = el
    ),
    used(__button({ short: true }, "X"),
      el => __xButton = el
    )
  );

  block.__nameInput = __nameInput;
  block.__xButton = __xButton;
  block.__setN = n => {
    block.__nameInput.placeholder = "Пользователь " + n;
    block.__nameInput.name = "user-" + n;
    block.__n = n;
  }

  block.__setN(n);
  block.__xButton.addEventListener("click", e => removeUser(block.__n));
  return block;
};

let users;
let addUserCountInput;
let addUserButton;
let generateButton;
let form;

const body = __("body", null,
  used(__("form", { class: "form", id: "form-0", action: "/api/", method: "POST" }),
    el => form = el
  ),
  used(
    __("div", {},
      __userRow(0),
      __userRow(1)
    ),
    el => users = el
  ),
  __row({ panel: true },
    used(
      __subRow({},
        used(__button({}, "Сгенерировать ссылки"),
          el => generateButton = el
        )
      ),
      el => el.classList.add("flex-grow_1")
    ),
    __subRow({},
      used(__numberInput({ preText: "+", value: 1, integer: true, min: 1 }),
        el => addUserCountInput = el
      ),
      used(__button({ short: true }, "+"),
        el => addUserButton = el
      )
    )
  )
);
document.addEventListener("DOMContentLoaded", () => document.documentElement.replaceChild(body, document.body), false);

addUserButton.addEventListener("click", e => addNewUser(addUserCountInput.__input.value));
generateButton.addEventListener("click", e => generate());

const addNewUser = (n = 1) => {
  for (let i = 0; i < n; i++) {
    users.appendChild(__userRow(users.childNodes.length))
  }
};

const removeUser = n => {
  if (users.childNodes.length <= 2) {
    return;
  }
  let removed = false;
  Array.from(users.childNodes).forEach(el => {
    if (removed) {
      el.__setN(el.__n - 1);
    } else if (el.__n == n) {
      users.removeChild(el);
      removed = true;
    }
  });
};

const generate = () =>
fetch("/api/newRoom", {
  method: "post",
  headers: {
    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
  },
  body: formToUrlParams(form)
})
.then(rs => rs.json())
.then(json => alert(JSON.stringify(json)));

const formToUrlParams = form => {
  const params = [];
  new FormData(form).forEach((value, key) => {
    params.push(key + "=" + encodeURIComponent(value));
  });
  return params.join("&");
};
