const addClickAndHoldEvent = el => {
  const PERIOD_IN_MILLISECONDS = 50;
  const IDLE_STEPS = 10;

  let idleSteps = 0;
  let preventMouse = false;
  let preventClick = false;
  let interval = null;

  const dispatch = () => el.dispatchEvent(new Event("click-and-hold"));
  const tick = () => (idleSteps > 0? idleSteps--: dispatch());
  const clear = () => {
    if (interval != null) {
      clearInterval(interval);
      interval = null;
    }
  };
  const set = () => {
    clear();
    dispatch();
    idleSteps = IDLE_STEPS;
    interval = setInterval(tick, PERIOD_IN_MILLISECONDS);
  };

  el.addEventListener("touchstart", e => {
    preventClick = true;
    preventMouse = true;
    set();
  });
  el.addEventListener("touchend", e => clear());
  el.addEventListener("touchcancel", e => clear());

  el.addEventListener("mousedown", e => {
    if (!preventMouse) {
      preventClick = true;
      set();
    }
    preventMouse = false;
  });
  el.addEventListener("mouseup", e => clear());
  el.addEventListener("mouseleave", e => clear());

  el.addEventListener("click", e => {
    if (!preventClick) {
      dispatch();
    }
    preventClick = false;
  });
};
