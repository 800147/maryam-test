"use strict";

const __userRow = (n) => {
  let __nameInput;
  let __xButton;
  let b__label;

  const block = __row({ },
    used(__label({ minWidth: "85pt" }, ""),
      el => b__label = el
    ),
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
  block.__label = b__label;

  block.__setN = n => {
    block.__nameInput.placeholder = "Пользователь " + n;
    block.__nameInput.name = "user-" + n;
    block.__nameInput.id = "user-" + n;
    block.__label.replaceChild(
      document.createTextNode("Имя " + n + ": "),
      block.__label.firstChild
    );
    block.__label.htmlFor = block.__nameInput.id;
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
.then(showCodes);

const __codeRow = user => {
  const link = window.location.href.substring(0,
    window.location.href.length - "new-room.html".length
  ) + "game.html?id=" + user.id + "&key=" + user.key;
  let label;
  return __row({},
    used(__label({ textAlign: "left" }, user.initName),
      el => el.classList.add("flex-grow_1")
    ),
    used(__label({ textAlign: "left" }, link),
      el => el.classList.add("visually-hidden"),
      el => label = el
    ),
    used(__button({}, "Скопировать ссылку"),
      el => el.addEventListener("click", e => copyToClipboard(label))
    ),
    used(__button({}, "Отправить по email"),
      el => el.addEventListener("click", e =>
        window.open("mailto:?subject=Ссылка на тестирование&body=" + encodeURIComponent(link))
      )
    )
  );
};

const showCodes = json => {
  document.documentElement.replaceChild(
    __("body", {},
      used(__("div"),
        el => json.forEach(user => el.appendChild(__codeRow(user)))
      )
    ), 
    document.body
  );
};

const formToUrlParams = form => {
  const params = [];
  new FormData(form).forEach((value, key) => {
    params.push(key + "=" + encodeURIComponent(value));
  });
  return params.join("&");
};

const copyToClipboard = el => {
  document.getSelection().selectAllChildren(el);
  document.execCommand("Copy");
  document.getSelection().empty();
};
