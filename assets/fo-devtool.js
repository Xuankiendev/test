class FuckDevtool {
  constructor() {
    this.interval = 100;
    this.redirectURL = "https://cloudflare.com";
    this._intervalID = null;
  }

  #generateRandomValue(windowObj) {
    return Math.floor(1000 * windowObj.Math.random());
  }

  #detectDevTools(windowObj) {
    let userAgent = navigator.userAgent.toLowerCase();
    let supportedBrowsers = ["chrome", "coc coc", "safari", "firefox", "edge"].some(browser => 
      userAgent.includes(browser)
    );

    if (!supportedBrowsers) {
      this.#showWarningMessage();
      return true;
    }

    if (windowObj.chrome) {
      let randomValue1 = this.#generateRandomValue(windowObj);
      let randomValue2 = this.#generateRandomValue(windowObj);
      let stackCheckValue = randomValue1;
      let devToolsDetected = false;

      try {
        let errorObj = new windowObj.Error;
        if (typeof Object.defineProperty === "function") {
          Object.defineProperty(errorObj, "stack", {
            configurable: false,
            enumerable: false,
            get: () => {
              stackCheckValue += randomValue2;
              return "";
            }
          });
        }
        console.debug(errorObj);
        errorObj.stack;
        if (randomValue1 + randomValue2 !== stackCheckValue) {
          devToolsDetected = true;
        }
      } catch (error) {
        devToolsDetected = true;
      }
      return devToolsDetected;
    }

    let startTime = performance.now();
    debugger;
    let endTime = performance.now();
    if (endTime - startTime > 100) {
      return true;
    }

    return false;
  }

  #preventKeyboardShortcuts() {
    document.addEventListener("contextmenu", event => {
      event.preventDefault();
    });

    document.addEventListener("keydown", event => {
      let keyPressed = event.key.toLowerCase();
      let isCtrlOrCmd = event.ctrlKey || event.metaKey;
      
      if ((isCtrlOrCmd && ["f12", "u", "s", "p", "i"].includes(keyPressed)) || 
          event.keyCode === 123) {
        event.preventDefault();
        this.#showWarningMessage();
      }
    });
  }

  checkForDevTools() {
    if (!window) return false;

    let devToolsFound = this.#detectDevTools(window);
    if (devToolsFound) {
      this.#showWarningMessage();
      this.stop();
    }
    return false;
  }

  #showWarningMessage() {
    document.body.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #ff4757, #ff3838);
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: Arial, sans-serif;
        z-index: 999999;
      ">
        <div style="
          text-align: center;
          color: white;
          animation: shake 0.5s ease-in-out infinite alternate;
        ">
          <h1 style="
            font-size: 48px;
            margin: 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            user-select: none;
            pointer-events: none;
          ">
            Quay Dau La Bo
          </h1>
          <p style="
            font-size: 24px;
            margin: 20px 0;
            user-select: none;
            pointer-events: none;
          ">
            Mau Tat Dev Tool
          </p>
        </div>
      </div>
      <style>
        @keyframes shake {
          0% { transform: translateX(0px); }
          100% { transform: translateX(10px); }
        }
      </style>`;
    
    setTimeout(() => {
      window.location.replace(this.redirectURL);
    }, 2000);
  }

  init() {
    this.checkForDevTools();
    this._intervalID = setInterval(() => this.checkForDevTools(), this.interval);
    this.#preventKeyboardShortcuts();
  }

  stop() {
    if (this._intervalID) {
      clearInterval(this._intervalID);
      this._intervalID = null;
    }
  }
}
