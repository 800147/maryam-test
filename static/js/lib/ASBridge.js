class ASBridge {
  constructor() {
    this._loaded = false;
    this._connected = false;
    this._element;

    window.document.addEventListener("DOMContentLoaded", () => {
      this._loaded = true;
    });
  }

  isLoaded() {
    return this._loaded;
  }

  check(elementId) {
    if (elementId == null) {
      console.log("check: передаётся null вместо elementId");
      return false;
    }
    const element = window.document.getElementById(elementId);
    if (element.wsCallback == undefined) {
      return false;
    }
    if (this._element === element) {
      return true;
    }
    this._element = element;
    this._connected = true;
    console.log("check OK (" + elementId + ")");
    document.dispatchEvent(new Event("flash-app-connected"));
    return true;
  }

  call(param) {
    if (this._element == undefined || this._element.wsCallback == undefined) {
      console.log("call: _callback is undefined");
      return;
    }
    console.log("call: " + param);
    this._element.wsCallback(param);
  }

}
