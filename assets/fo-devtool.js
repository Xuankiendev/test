class FuckDevtool {
  constructor(options = {}) {
    this.interval = options.interval || 100;
    this.redirectURL = options.redirectURL || "https://cloudflare.com";
    this.debug = options.debug || false;
    this.preventDevTools = options.preventDevTools !== false;
    this.checkBrowser = options.checkBrowser !== false;
    this.enableDebugger = options.enableDebugger || false;
    this.checkShortcuts = options.checkShortcuts !== false;
    this._intervalID = null;
    this.#checkConfig();
  }

  #generateRandomValue(windowObj) {
    return Math.floor(1000 * windowObj.Math.random());
  }

  #detectDevTools(windowObj) {
    let userAgent = navigator.userAgent.toLowerCase();
    let supportedBrowsers = ["chrome", "coc coc", "safari"].some(browser => 
      userAgent.includes(browser)
    );

    if (!supportedBrowsers) {
      this.#showBrowserNotSupported();
      return false;
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
        if (this.debug) {
          console.error("Error In Catch:", error);
        }
      }
      return devToolsDetected;
    }

    if (this.enableDebugger) {
      let startTime = new Date();
      let endTime = new Date();
      if (endTime - startTime > 100) {
        return true;
      }
    }

    return false;
  }

  #preventKeyboardShortcuts() {
    if (this.checkShortcuts) {
      document.addEventListener("contextmenu", event => {
        event.preventDefault();
      });

      document.addEventListener("keydown", event => {
        let keyPressed = event.key.toLowerCase();
        let isCtrlOrCmd = event.ctrlKey || event.metaKey;
        
        if ((isCtrlOrCmd && ["f12", "u", "s", "p", "i"].includes(keyPressed)) || 
            event.keyCode === 123) {
          event.preventDefault();
        }
      });
    }
  }

  #logMessage(message) {
    if (this.debug) {
      console.clear();
      console.log(
        `%c ✨ [Fuck-Devtool] %c ${message} `,
        "color: #ffffff; background: rgb(255, 112, 67); padding:5px 0; border-radius: 5px 0 0 5px;",
        "background:rgba(66, 66, 66, 0.85); padding:5px 0; border-radius: 0 5px 5px 0;"
      );
    }
  }

  #checkConfig() {
    if (typeof window !== 'undefined' && !window.fuckDevtoolConfig) {
      this.#injectConfigScript();
    }
  }

  #injectConfigScript() {
    let scriptElement = document.createElement('script');
    scriptElement.textContent = `
const config = {
  interval: 100,
  redirectURL: "https://cloudflare.com",
  debug: false,
  preventDevTools: true,
  checkBrowser: true,
  enableDebugger: false,
  checkShortcuts: true
};

window.fuckDevtoolConfig = config;

if (typeof FuckDevtool !== 'undefined') {
  const devtoolProtection = new FuckDevtool(config);
  devtoolProtection.init();
}
    `;
    document.head.appendChild(scriptElement);
  }

  checkForDevTools() {
    if (!window) return false;

    if (this.checkBrowser) {
      let devToolsFound = this.#detectDevTools(window);
      if (devToolsFound) {
        this.#logMessage("DevTools Detected!");
        window.location.replace(this.redirectURL);
        this.stop();
      }
    }
    return false;
  }

  #showBrowserNotSupported() {
    document.body.innerHTML = `
      <h1 style="text-align: center; margin-top: 20%; font-size: 40px; color: red; pointer-events: none; user-select: none">
        Browser Not Supported
      </h1>`;
  }

  init() {
    this.#logMessage("Initializing Fuck-Devtool...");
    this.checkForDevTools();
    this._intervalID = setInterval(() => this.checkForDevTools(), this.interval);
    if (this.preventDevTools) {
      this.#preventKeyboardShortcuts();
    }
  }

  stop() {
    if (this._intervalID) {
      clearInterval(this._intervalID);
      this._intervalID = null;
    }
  }

  debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
}
