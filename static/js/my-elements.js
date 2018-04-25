const __checkboxButton = ({
  short = false, 
  name = "",
  title = null,
  form = "",
  specialId = null,
  checked = false
}, ...content) =>
__("div", { "class": "checkbox-button" + (short? " checkbox-button_short": "") },
  used(__("input", { "type": "checkbox", "class": "checkbox-button__checkbox", "id": (specialId != null? specialId: (form + "_" + name)), "name": name, "form": form }),
    el => { if (checked) el.checked = true; }
  ),
  used(__("label", { "class": "checkbox-button__label", "for": (specialId != null? specialId: (form + "_" + name)) }, ...content),
    el => { if (title != null) el.title = title; }
  )
);

const __label = ({ minWidth = null, textAlign = null }, ...content) => used(
  __("label", {
      class: "label"
    },
    ...content
  ),
  el => { if (minWidth != null) { el.style.minWidth = minWidth; } },
  el => { if (textAlign != null) { el.style.textAlign = textAlign; } }
);

const __lineInput = ({
  name = "",
  form = "",
  value = "",
  placeholder = ""
}) =>
__("input", { "class": "line-input", "type": "text", "name": name, "value": value, "placeholder": placeholder, "form": form });

const __multilineInput = ({
  name = "",
  form = "",
  placeholder = "",
  rows = 3
}, ...content) =>
__("textarea", { "rows": rows, "class": "multiline-input", "name": name, "placeholder": placeholder, "form": form }, ...content);

const __button = ({
  short = false
}, ...content) =>
__("button", { "class": "button" + (short? " button_short": "") }, ...content);

const __submit = ({
  short = false,
  name = "",
  title = null,
  form = "",
  value = "",
  specialId = ""
}) =>
used(__("input", { "type": "submit", "class": "submit" + (short? " submit_short": ""), "name": name, "value": value, "form": form, "id": (specialId != null? specialId: (form + "_" + name)) }),
  el => { if (title != null) el.title = title; }
);

const __numberInput = ({
  name = "",
  title = null,
  form = "",
  preText = null,
  integer = false,
  postText = null,
  value = "",
  min = null,
  max = null
}) => {
  let __input;
  const block = used(
    __("div", { "class": "number-input" }, 
      __("div", { "class": "number-input__pre-text" }, String(preText)), 
      used(__lineInput({ "value": value, "form": form, "name": name }),
        el => { 
          el.type = "number";
          if (min != null) el.min = min;
          if (max != null) el.max = max;
          if (integer) el.step = 1;
          else el.step = "any";
        },
        el => el.classList.add("number-input__input"),
        el => __input = el,
        el => el.addEventListener("change", e => change(0)),
      ),
      __("div", { "class": "number-input__post-text" }, String(postText)),
      __("div", { "class": "number-input__buttons" }, 
        used(__button({}, "+"),
          el => el.classList.add("number-input__plus"),
          el => addClickAndHoldEvent(el),
          el => el.addEventListener("click-and-hold", e => change(1))
        ),
        used(__button({}, "-"),
          el => el.classList.add("number-input__minus"),
          el => addClickAndHoldEvent(el),
          el => el.addEventListener("click-and-hold", e => change(-1))
        )
      )
    ),
    el => { if (preText != null) el.classList.add("number-input_with-pretext"); },
    el => { if (postText != null) el.classList.add("number-input_with-posttext"); }
  );
  block.__input = __input;

  const change = n => {
    let value = Number(block.__input.value) + n;
    if (min != null && value < min) value = min;
    if (max != null && value > max) value = max;
    if (integer) value = Math.round(value);
    block.__input.value = value;
  };

  return block;
};


const __ruleRow = (n, find = "", replace = "", registerSensitive = false, multiline = false, firstOnly = false, loop = false) =>
__row({},
  used(__lineInput({ "name": "f" + n, "placeholder": "write find RegExp here", "form": "form-0", "value": find }),
    el => el.classList.add("flex-grow_1")
  ),
  used(__lineInput({ "name": "r" + n, "placeholder": "write replace RegExp here", "form": "form-0", "value": replace }),
    el => el.classList.add("flex-grow_1")
  ),
  __("div", { "class": "row__subflex justify-content_flex-end" },
    __checkboxButton({ "name": "s" + n, "title": "register-sensitive", "form": "form-0", "short": true, "checked": registerSensitive }, "aA"),
    __checkboxButton({ "name": "m" + n, "title": "multilene search", "form": "form-0", "short": true, "checked": multiline }, "^$"),
    __checkboxButton({ "name": "o" + n, "title": "first only", "form": "form-0", "short": true, "checked": firstOnly }, "=1"),
    __checkboxButton({ "name": "l" + n, "title": "looped", "form": "form-0", "short": true, "checked": loop }, "↻"),
    __submit({ "short": true, "value": "˄", "title": "move up", "form": "form-0", "name": "up-" + n }),
    __submit({ "short": true, "value": "˅", "title": "move down", "form": "form-0", "name": "down-" + n }),
    __submit({ "short": true, "value": "╳", "title": "remove rule", "form": "form-0", "name": "remove-" + n })
  )
);

const __row = ({ panel = false }, ...content) => {
  let container;
  return used(
    __("div", { "class": "row" },
      used(
        __("div", { "class": "row__flex justify-content_flex-end" },
          ...content
        ),
        el => container = el
      )
    ),
    el => { if (panel) el.classList.add("row_panel"); },
    el => el.__container = container
  )
};

const __subRow = ({ }, ...content) => __("div", { "class": "row__subflex" }, ...content);
