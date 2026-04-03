// ==UserScript==
// @name         2026 智慧树自动浇水收肥料 - Enhanced
// @namespace    auto-wisdom-tree
// @version      0.1.0
// @description  自动答题、屏蔽异常上报与异常检测、自动续播共享课视频
// @match        *://studyvideoh5.zhihuishu.com/*
// @run-at       document-start
// @noframes
// @grant        unsafeWindow
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.addStyle
// @grant        GM.registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";

  const PAGE = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const SCRIPT_TAG = "[auto-wisdom-tree]";
  const PageResponse = PAGE.Response || Response;
  const PageEvent = PAGE.Event || Event;

  const state = {
    config: {
      autoQuiz: true,
      blockReportApis: true,
      blockDetectApis: true,
      antiAntiDebug: true,
    },
    uiReady: false,
    uiNode: null,
    uiBodyNode: null,
    uiLogNode: null,
    uiSummaryNode: null,
    uiStatusNode: null,
    uiStatusText: "等待初始化",
    uiMinimized: false,
    uiLogs: [],
    uiRestoreStyle: null,
    studyVm: null,
    lastVideoId: null,
    lastAdvanceTargetId: null,
    lastAdvanceAt: 0,
    lastReplayAt: 0,
    lastToastAt: 0,
    runtimeTimerId: 0,
    vmProbeTimerId: 0,
    logKeys: new Set(),
    antiDebug: {
      installed: false,
      hotkeysInstalled: false,
      strippedCount: 0,
      lastStripLogAt: 0,
    },
    progressDebug: {
      hooksInstalled: false,
      hiddenSnapshot: null,
      lastTickLoggedAt: 0,
      lastSnapshot: null,
    },
  };

  const STORAGE_KEYS = {
    autoQuiz: "awt:autoQuiz",
    blockReportApis: "awt:blockReportApis",
    blockDetectApis: "awt:blockDetectApis",
    antiAntiDebug: "awt:antiAntiDebug",
  };

  const REPORT_RULES = [
    /collector\.zhihuishu\.com\/public\/collect/i,
    /collector2c\.zhihuishu\.com\/public\/collect/i,
    /collector2c\.zhihuishu\.com\/public\/jsonp\/collect/i,
    /collector2c\.zhihuishu\.com\/public\/kafkaCollect/i,
  ];

  const DETECT_RULES = [
    /\/cheat\/exceptionActionDetail/i,
    /\/cheat\/agreeExceptionActionDetail/i,
    /studentexam-api\.zhihuishu\.com\/studentExam.*\/app\/queryIsLimitFlow/i,
  ];

  const WRAP_MARK = "__awt_wrapped__";

  const LOG_STYLES = {
    brand: "background:#111827;color:#f8fafc;padding:2px 6px;border-radius:4px;font-weight:700;",
    debug: "background:#475569;color:#f8fafc;padding:2px 6px;border-radius:4px;font-weight:700;",
    info: "background:#2563eb;color:#f8fafc;padding:2px 6px;border-radius:4px;font-weight:700;",
    success: "background:#059669;color:#f8fafc;padding:2px 6px;border-radius:4px;font-weight:700;",
    warn: "background:#f59e0b;color:#111827;padding:2px 6px;border-radius:4px;font-weight:700;",
    error: "background:#dc2626;color:#f8fafc;padding:2px 6px;border-radius:4px;font-weight:700;",
    scope: "color:#94a3b8;font-weight:700;",
    text: "color:#e5e7eb;",
  };

  function emitLog(level, scope, message, payload) {
    const method = level === "error" ? "error" : level === "warn" ? "warn" : "log";
    const scopeLabel = scope ? `[${scope}]` : "[runtime]";
    enqueueUiLog(level, scope || "runtime", message, payload);
    if (typeof payload === "undefined") {
      console[method](
        `%cAWT%c${level.toUpperCase()}%c${scopeLabel}%c ${message}`,
        LOG_STYLES.brand,
        LOG_STYLES[level],
        LOG_STYLES.scope,
        LOG_STYLES.text,
      );
      return;
    }
    console[method](
      `%cAWT%c${level.toUpperCase()}%c${scopeLabel}%c ${message}`,
      LOG_STYLES.brand,
      LOG_STYLES[level],
      LOG_STYLES.scope,
      LOG_STYLES.text,
      payload,
    );
  }

  function log(scope, message, payload) {
    emitLog("info", scope, message, payload);
  }

  function logDebug(scope, message, payload) {
    emitLog("debug", scope, message, payload);
  }

  function logSuccess(scope, message, payload) {
    emitLog("success", scope, message, payload);
  }

  function logWarn(scope, message, payload) {
    emitLog("warn", scope, message, payload);
  }

  function logError(scope, message, payload) {
    emitLog("error", scope, message, payload);
  }

  function logOnce(key, level, scope, message, payload) {
    if (state.logKeys.has(key)) return;
    state.logKeys.add(key);
    emitLog(level, scope, message, payload);
  }

  function safeCall(fn, fallback) {
    try {
      return fn();
    } catch (error) {
      logError("runtime", "safeCall failed", error);
      return fallback;
    }
  }

  async function gmGetValue(key, defaultValue) {
    try {
      if (typeof GM !== "undefined" && GM && typeof GM.getValue === "function") {
        return await GM.getValue(key, defaultValue);
      }
      if (typeof GM_getValue === "function") {
        return GM_getValue(key, defaultValue);
      }
    } catch (error) {
      logWarn("gm", `GM getValue failed: ${key}`, error);
    }
    return defaultValue;
  }

  async function gmSetValue(key, value) {
    try {
      if (typeof GM !== "undefined" && GM && typeof GM.setValue === "function") {
        await GM.setValue(key, value);
        return;
      }
      if (typeof GM_setValue === "function") {
        GM_setValue(key, value);
      }
    } catch (error) {
      logWarn("gm", `GM setValue failed: ${key}`, error);
    }
  }

  function gmAddStyleCompat(css) {
    if (!css) return null;
    try {
      if (typeof GM !== "undefined" && GM && typeof GM.addStyle === "function") {
        return GM.addStyle(css);
      }
      if (typeof GM_addStyle === "function") {
        return GM_addStyle(css);
      }
    } catch (error) {
      logWarn("gm", "GM addStyle failed", error);
    }
    const style = document.createElement("style");
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
    return style;
  }

  function gmRegisterMenuCommandCompat(label, callback) {
    try {
      if (typeof GM !== "undefined" && GM && typeof GM.registerMenuCommand === "function") {
        return GM.registerMenuCommand(label, callback);
      }
      if (typeof GM_registerMenuCommand === "function") {
        return GM_registerMenuCommand(label, callback);
      }
    } catch (error) {
      logWarn("gm", `GM registerMenuCommand failed: ${label}`, error);
    }
    return null;
  }

  function getConfigSummary() {
    return [
      `自动答题:${state.config.autoQuiz ? "开" : "关"}`,
      `上报拦截:${state.config.blockReportApis ? "开" : "关"}`,
      `检测拦截:${state.config.blockDetectApis ? "开" : "关"}`,
      `反反调试:${state.config.antiAntiDebug ? "开" : "关"}`,
    ].join(" | ");
  }

  function now() {
    return Date.now();
  }

  function isRuleMatched(url, rules) {
    return rules.some((rule) => rule.test(url));
  }

  function shouldBlockUrl(url) {
    if (!url || document.readyState === "loading") return null;
    if (state.config.blockReportApis && isRuleMatched(url, REPORT_RULES)) {
      return "report";
    }
    if (state.config.blockDetectApis && isRuleMatched(url, DETECT_RULES)) {
      return "detect";
    }
    return null;
  }

  function buildMockBody(url, kind) {
    if (/exceptionActionDetail/i.test(url)) {
      return {
        code: 0,
        data: {
          popWindow: false,
          lock: false,
          exceptionId: null,
        },
      };
    }
    if (/agreeExceptionActionDetail/i.test(url)) {
      return {
        code: 0,
        data: {},
      };
    }
    if (/queryIsLimitFlow/i.test(url)) {
      return {
        status: 200,
        rt: {
          isOpen: false,
          time: 0,
        },
      };
    }
    return {
      code: 0,
      status: 200,
      kind,
      message: "blocked by auto-wisdom-tree",
    };
  }

  function stripDebuggerStatements(source) {
    if (typeof source !== "string" || !source) return source;
    const replaced = source.replace(/\bdebugger\b\s*;?/gi, "");
    if (replaced !== source) {
      state.antiDebug.strippedCount += 1;
      const timestamp = now();
      if (document.readyState !== "loading" && timestamp - state.antiDebug.lastStripLogAt > 5000) {
        state.antiDebug.lastStripLogAt = timestamp;
        logWarn("anti-debug", "stripped debugger statement from dynamic code", {
          strippedCount: state.antiDebug.strippedCount,
        });
      }
    }
    return replaced;
  }

  function isDevtoolsKeyEvent(event) {
    if (!event) return false;
    const key = String(event.key || "").toLowerCase();
    const code = String(event.code || "").toLowerCase();
    const keyCode = Number(event.keyCode || event.which || 0);
    const ctrlShift = Boolean(event.ctrlKey && event.shiftKey);

    if (keyCode === 123 || key === "f12" || code === "f12") return true;
    if (ctrlShift && ["i", "j", "c"].includes(key)) return true;
    if (ctrlShift && ["keyi", "keyj", "keyc"].includes(code)) return true;
    if (event.ctrlKey && key === "u") return true;
    if (event.ctrlKey && code === "keyu") return true;
    return false;
  }

  function installDevtoolsHotkeyGuard() {
    if (state.antiDebug.hotkeysInstalled) return;
    state.antiDebug.hotkeysInstalled = true;
    const swallowDevtoolsHotkeys = (event) => {
      if (!state.config.antiAntiDebug || !isDevtoolsKeyEvent(event)) return;
      safeCall(() => event.stopImmediatePropagation());
      safeCall(() => event.stopPropagation());
      logWarn("anti-debug", "captured devtools hotkey", {
        key: event.key,
        code: event.code,
        keyCode: event.keyCode,
      });
    };

    window.addEventListener("keydown", swallowDevtoolsHotkeys, true);
    document.addEventListener("keydown", swallowDevtoolsHotkeys, true);
    logSuccess("anti-debug", "devtools hotkey guard installed");
  }

  function installAntiDebugGuards() {
    if (state.antiDebug.installed || !state.config.antiAntiDebug) return;
    state.antiDebug.installed = true;

    try {
      const OriginalFunction = PAGE.Function;
      const FunctionProxy = new Proxy(OriginalFunction, {
        construct(target, args) {
          if (state.config.antiAntiDebug && args.length > 0) {
            args[args.length - 1] = stripDebuggerStatements(args[args.length - 1]);
          }
          return Reflect.construct(target, args);
        },
        apply(target, thisArg, args) {
          if (state.config.antiAntiDebug && args.length > 0) {
            args[args.length - 1] = stripDebuggerStatements(args[args.length - 1]);
          }
          return Reflect.apply(target, thisArg, args);
        },
      });

      PAGE.Function = FunctionProxy;
      logSuccess("anti-debug", "Function proxy installed");
    } catch (error) {
      logError("anti-debug", "Function proxy install failed", error);
    }

    try {
      const originalEval = PAGE.eval;
      PAGE.eval = new Proxy(originalEval, {
        apply(target, thisArg, args) {
          if (state.config.antiAntiDebug && args.length > 0) {
            args[0] = stripDebuggerStatements(args[0]);
          }
          return Reflect.apply(target, thisArg, args);
        },
      });
      logSuccess("anti-debug", "eval proxy installed");
    } catch (error) {
      logError("anti-debug", "eval proxy install failed", error);
    }

    const installTimerProxy = (name) => {
      try {
        if (typeof PAGE[name] !== "function") return;
        PAGE[name] = new Proxy(PAGE[name], {
          apply(target, thisArg, args) {
            if (state.config.antiAntiDebug && args.length > 0) {
              args[0] = stripDebuggerStatements(args[0]);
            }
            return Reflect.apply(target, thisArg, args);
          },
        });
        logSuccess("anti-debug", `${name} proxy installed`);
      } catch (error) {
        logError("anti-debug", `${name} proxy install failed`, error);
      }
    };

    installTimerProxy("setTimeout");
    installTimerProxy("setInterval");
  }

  function normalizeUrl(input) {
    if (!input) return "";
    try {
      return String(input);
    } catch (_error) {
      return "";
    }
  }

  function createAjaxStub(data) {
    const stub = {
      readyState: 4,
      status: 200,
      responseJSON: data,
      responseText: JSON.stringify(data),
      abort() { },
      then(resolve) {
        if (typeof resolve === "function") {
          resolve(data);
        }
        return stub;
      },
      catch() {
        return stub;
      },
      done(callback) {
        if (typeof callback === "function") {
          callback(data, "success", stub);
        }
        return stub;
      },
      fail() {
        return stub;
      },
      always(callback) {
        if (typeof callback === "function") {
          callback(data, "success", stub);
        }
        return stub;
      },
    };
    return stub;
  }

  function patchFetch() {
    if (!PAGE.fetch || PAGE.fetch[WRAP_MARK]) return;
    const originalFetch = PAGE.fetch.bind(PAGE);
    const wrappedFetch = function (...args) {
      const url = normalizeUrl(args[0] && args[0].url ? args[0].url : args[0]);
      const kind = shouldBlockUrl(url);
      if (!kind) {
        return originalFetch(...args);
      }
      const body = buildMockBody(url, kind);
      logWarn("network", `fetch fallback blocked [${kind}]`, url);
      return Promise.resolve(
        new PageResponse(JSON.stringify(body), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );
    };
    Object.defineProperty(wrappedFetch, WRAP_MARK, {
      value: true,
    });
    PAGE.fetch = wrappedFetch;
    logOnce("patch-fetch", "success", "network", "fetch interceptor installed");
  }

  function patchXhr() {
    const XHR = PAGE.XMLHttpRequest;
    if (!XHR || XHR.prototype.send?.[WRAP_MARK]) return;

    const originalOpen = XHR.prototype.open;
    const originalSend = XHR.prototype.send;

    function setReadableValue(target, key, value) {
      try {
        Object.defineProperty(target, key, {
          configurable: true,
          value,
        });
        return true;
      } catch (_error) {
        try {
          target[key] = value;
          return true;
        } catch (_error2) {
          return false;
        }
      }
    }

    XHR.prototype.open = function (method, url, ...rest) {
      this.__awt_method = method;
      this.__awt_url = normalizeUrl(url);
      return originalOpen.call(this, method, url, ...rest);
    };

    const wrappedSend = function (body) {
      const url = this.__awt_url || "";
      const kind = shouldBlockUrl(url);
      if (!kind) {
        return originalSend.call(this, body);
      }

      const payload = buildMockBody(url, kind);
      const responseText = JSON.stringify(payload);
      logWarn("network", `xhr fallback blocked [${kind}]`, url);

      setReadableValue(this, "readyState", 4);
      setReadableValue(this, "status", 200);
      setReadableValue(this, "statusText", "OK");
      setReadableValue(this, "responseURL", url);
      setReadableValue(this, "responseText", responseText);
      setReadableValue(this, "response", responseText);

      this.getAllResponseHeaders = function () {
        return "content-type: application/json\r\n";
      };
      this.getResponseHeader = function (name) {
        return name && String(name).toLowerCase() === "content-type" ? "application/json" : null;
      };

      setTimeout(() => {
        safeCall(() => this.onreadystatechange && this.onreadystatechange(new PageEvent("readystatechange")));
        safeCall(() => this.onload && this.onload(new PageEvent("load")));
        safeCall(() => this.onloadend && this.onloadend(new PageEvent("loadend")));
        safeCall(() => this.dispatchEvent && this.dispatchEvent(new PageEvent("readystatechange")));
        safeCall(() => this.dispatchEvent && this.dispatchEvent(new PageEvent("load")));
        safeCall(() => this.dispatchEvent && this.dispatchEvent(new PageEvent("loadend")));
      }, 0);

      return undefined;
    };

    Object.defineProperty(wrappedSend, WRAP_MARK, {
      value: true,
    });
    XHR.prototype.send = wrappedSend;
    logOnce("patch-xhr", "success", "network", "XMLHttpRequest interceptor installed");
  }

  function patchJqueryAjax() {
    const jq = PAGE.jQuery || PAGE.$;
    if (!jq || !jq.ajax || jq.ajax[WRAP_MARK]) return;

    const originalAjax = jq.ajax.bind(jq);
    const wrappedAjax = function (...args) {
      const options = typeof args[0] === "string" ? { url: args[0], ...(args[1] || {}) } : (args[0] || {});
      const url = normalizeUrl(options.url);
      const kind = shouldBlockUrl(url);
      if (!kind) {
        return originalAjax(...args);
      }
      const payload = buildMockBody(url, kind);
      logWarn("network", `$.ajax fallback blocked [${kind}]`, url);
      setTimeout(() => {
        safeCall(() => typeof options.success === "function" && options.success(payload, "success", createAjaxStub(payload)));
        safeCall(() => typeof options.complete === "function" && options.complete(createAjaxStub(payload), "success"));
      }, 0);
      return createAjaxStub(payload);
    };
    Object.defineProperty(wrappedAjax, WRAP_MARK, {
      value: true,
    });
    jq.ajax = wrappedAjax;
    logOnce("patch-jquery", "success", "network", "$.ajax interceptor installed");
  }

  function patchSendBeacon() {
    const navigatorObject = PAGE.navigator;
    if (!navigatorObject || typeof navigatorObject.sendBeacon !== "function" || navigatorObject.sendBeacon[WRAP_MARK]) {
      return;
    }

    const originalSendBeacon = navigatorObject.sendBeacon.bind(navigatorObject);
    const wrappedSendBeacon = function (url, data) {
      const normalizedUrl = normalizeUrl(url);
      const kind = shouldBlockUrl(normalizedUrl);
      if (!kind) {
        return originalSendBeacon(url, data);
      }
      logWarn("network", `sendBeacon fallback blocked [${kind}]`, normalizedUrl);
      return true;
    };

    Object.defineProperty(wrappedSendBeacon, WRAP_MARK, {
      value: true,
    });
    navigatorObject.sendBeacon = wrappedSendBeacon;
    logOnce("patch-beacon", "success", "network", "sendBeacon interceptor installed");
  }

  function patchMonitorUtil() {
    if (!PAGE.MonitorUtil || PAGE.MonitorUtil.__awt_patched__) return;
    const monitor = PAGE.MonitorUtil;
    const originalErrorLog = typeof monitor.errorLog === "function" ? monitor.errorLog.bind(monitor) : null;
    monitor.errorLog = function (...args) {
      if (state.config.blockReportApis) {
        logWarn("network", "MonitorUtil.errorLog blocked");
        return undefined;
      }
      return originalErrorLog ? originalErrorLog(...args) : undefined;
    };
    Object.defineProperty(monitor, "__awt_patched__", {
      value: true,
    });
    logOnce("patch-monitor", "success", "network", "MonitorUtil interceptor installed");
  }

  function isStudyVm(candidate) {
    return (
      candidate &&
      typeof candidate === "object" &&
      typeof candidate.popupAnswer === "function" &&
      typeof candidate.testDotClick === "function" &&
      typeof candidate.topicClickQot === "function" &&
      typeof candidate.videoNext === "function" &&
      Array.isArray(candidate.videoList)
    );
  }

  function findStudyVm() {
    if (state.studyVm && isStudyVm(state.studyVm)) {
      return state.studyVm;
    }

    const queue = [];
    if (document.documentElement) queue.push(document.documentElement);
    if (document.body) queue.push(document.body);

    const visited = new Set();
    for (let index = 0; index < queue.length; index += 1) {
      const node = queue[index];
      if (!node || visited.has(node)) continue;
      visited.add(node);

      const vm = node.__vue__ || node.__vueParentComponent?.proxy;
      if (vm) {
        let current = vm;
        for (let i = 0; i < 8 && current; i += 1, current = current.$parent) {
          if (isStudyVm(current)) {
            state.studyVm = current;
            return current;
          }
        }
      }

      if (node.children && node.children.length) {
        for (const child of node.children) {
          queue.push(child);
        }
      }
    }
    return null;
  }

  function markWrapped(fn) {
    Object.defineProperty(fn, WRAP_MARK, {
      value: true,
    });
    return fn;
  }

  function wrapVmMethod(vm, original, factory) {
    const wrapped = factory(original.bind(vm)).bind(vm);
    return markWrapped(wrapped);
  }

  function patchStudyVm(vm) {
    if (!vm || vm.__awt_patched__) return;

    safeCall(() => {
      PAGE.OCS = true;
    });

    if (typeof vm.notTrustScript === "function" && !vm.notTrustScript[WRAP_MARK]) {
      vm.notTrustScript = wrapVmMethod(vm, vm.notTrustScript, (original) => function (...args) {
        if (state.config.blockDetectApis) {
          logWarn("detect", "notTrustScript blocked");
          return false;
        }
        return original(...args);
      });
    }

    if (typeof vm.collectLog === "function" && !vm.collectLog[WRAP_MARK]) {
      vm.collectLog = wrapVmMethod(vm, vm.collectLog, (original) => function (...args) {
        if (state.config.blockReportApis) {
          logWarn("detect", "collectLog blocked");
          return false;
        }
        return original(...args);
      });
    }

    if (typeof vm.checkout === "function" && !vm.checkout[WRAP_MARK]) {
      vm.checkout = wrapVmMethod(vm, vm.checkout, (original) => function (...args) {
        if (state.config.blockDetectApis) {
          return true;
        }
        return original(...args);
      });
    }

    if (typeof vm.checkoutNotTrustScript === "function" && !vm.checkoutNotTrustScript[WRAP_MARK]) {
      vm.checkoutNotTrustScript = wrapVmMethod(vm, vm.checkoutNotTrustScript, (original) => function (...args) {
        if (state.config.blockDetectApis) {
          clearInterval(this.checkTimer);
          return true;
        }
        return original(...args);
      });
    }

    if (typeof vm.aberrantFun === "function" && !vm.aberrantFun[WRAP_MARK]) {
      vm.aberrantFun = wrapVmMethod(vm, vm.aberrantFun, (original) => function (...args) {
        if (state.config.blockDetectApis) {
          this.aberrantDialog = false;
          this.aberrantTimeDialog = false;
          return Promise.resolve({
            code: 0,
            data: {
              popWindow: false,
              lock: false,
            },
          });
        }
        return original(...args);
      });
    }

    if (typeof vm.aberrantCloseBtn === "function" && !vm.aberrantCloseBtn[WRAP_MARK]) {
      vm.aberrantCloseBtn = wrapVmMethod(vm, vm.aberrantCloseBtn, (original) => function (...args) {
        if (state.config.blockDetectApis) {
          this.aberrantDialog = false;
          this.aberrantTimeDialog = false;
          logWarn("detect", "aberrantCloseBtn blocked");
          return Promise.resolve({
            code: 0,
            data: {},
          });
        }
        return original(...args);
      });
    }

    if (typeof vm.chapterExamEntry === "function" && !vm.chapterExamEntry[WRAP_MARK]) {
      vm.chapterExamEntry = wrapVmMethod(vm, vm.chapterExamEntry, (original) => function (studentExam, ...rest) {
        if (state.config.blockDetectApis && typeof this.judgeLookAnswer === "function") {
          return this.judgeLookAnswer(studentExam, ...rest);
        }
        return original(studentExam, ...rest);
      });
    }

    if (typeof vm.goToExamJudge === "function" && !vm.goToExamJudge[WRAP_MARK]) {
      vm.goToExamJudge = wrapVmMethod(vm, vm.goToExamJudge, (original) => function (...args) {
        if (state.config.blockDetectApis && typeof this.goToExamListUrl === "function") {
          return this.goToExamListUrl();
        }
        return original(...args);
      });
    }

    if (typeof vm.secondKafkaCollect === "function" && !vm.secondKafkaCollect[WRAP_MARK]) {
      vm.secondKafkaCollect = wrapVmMethod(vm, vm.secondKafkaCollect, (original) => function (...args) {
        if (state.config.blockReportApis) {
          logWarn("network", "secondKafkaCollect blocked");
          return undefined;
        }
        return original(...args);
      });
    }

    if (typeof vm.fetchLogData === "function" && !vm.fetchLogData[WRAP_MARK]) {
      vm.fetchLogData = wrapVmMethod(vm, vm.fetchLogData, (original) => function (url, ...args) {
        const normalizedUrl = normalizeUrl(url);
        if (state.config.blockReportApis && shouldBlockUrl(normalizedUrl) === "report") {
          logWarn("network", "fetchLogData blocked [report]", normalizedUrl);
          return Promise.resolve(buildMockBody(normalizedUrl, "report"));
        }
        if (state.config.blockDetectApis && shouldBlockUrl(normalizedUrl) === "detect") {
          logWarn("network", "fetchLogData blocked [detect]", normalizedUrl);
          return Promise.resolve(buildMockBody(normalizedUrl, "detect"));
        }
        return original(url, ...args);
      });
    }

    Object.defineProperty(vm, "__awt_patched__", {
      value: true,
    });
    logSuccess("vm", "study vm patched");
  }

  function getPlayableVideo() {
    return document.querySelector("#container video") || document.querySelector("video");
  }

  function snapshotProgressState(vm, reason) {
    const video = getPlayableVideo();
    const lesson = findCurrentLesson(vm);
    return {
      timestamp: now(),
      reason,
      hidden: document.hidden,
      visibilityState: document.visibilityState,
      videoId: vm?.lastViewVideoId || null,
      currentTime: Number(video?.currentTime || 0),
      duration: Number(video?.duration || 0),
      paused: Boolean(video?.paused),
      ended: Boolean(video?.ended),
      playbackRate: Number(video?.playbackRate || vm?.playRate || 1),
      totalStudyTime: Number(vm?.totalStudyTime || 0),
      totalTimeFinish: Number(vm?.totalTimeFinish || 0),
      playTimes: Number(vm?.playTimes || 0),
      watchPointPost: String(vm?.watchPointPost || "").slice(-80),
      isStudiedLesson: lesson?.isStudiedLesson,
      percentage: Number(lesson?.percentage || 0),
      hasFinishIcon: hasFinishIcon(),
    };
  }

  function trackProgressTrend(vm, reason) {
    const snapshot = snapshotProgressState(vm, reason);
    const previous = state.progressDebug.lastSnapshot;
    if (previous) {
      snapshot.delta = {
        elapsedMs: snapshot.timestamp - previous.timestamp,
        currentTime: snapshot.currentTime - previous.currentTime,
        totalStudyTime: snapshot.totalStudyTime - previous.totalStudyTime,
        playTimes: snapshot.playTimes - previous.playTimes,
        totalTimeFinish: snapshot.totalTimeFinish - previous.totalTimeFinish,
      };
    }
    state.progressDebug.lastSnapshot = snapshot;
    logDebug("progress", "progress trend snapshot", snapshot);
  }

  function installProgressDebugHooks() {
    if (state.progressDebug.hooksInstalled) return;
    state.progressDebug.hooksInstalled = true;

    const emitVisibilityLog = (reason) => {
      const vm = findStudyVm();
      if (!vm) return;

      const snapshot = snapshotProgressState(vm, reason);
      if (document.hidden) {
        state.progressDebug.hiddenSnapshot = {
          ...snapshot,
          timestamp: now(),
        };
        logWarn("progress", "page hidden snapshot captured", snapshot);
        return;
      }

      const previous = state.progressDebug.hiddenSnapshot;
      if (previous) {
        snapshot.delta = {
          currentTime: snapshot.currentTime - previous.currentTime,
          totalStudyTime: snapshot.totalStudyTime - previous.totalStudyTime,
          playTimes: snapshot.playTimes - previous.playTimes,
        };
      }
      logWarn("progress", "page visible snapshot captured", snapshot);
      state.progressDebug.hiddenSnapshot = null;
    };

    document.addEventListener("visibilitychange", () => emitVisibilityLog("visibilitychange"), true);
    window.addEventListener("focus", () => emitVisibilityLog("focus"), true);
    window.addEventListener("blur", () => emitVisibilityLog("blur"), true);
    logSuccess("progress", "progress debug hooks installed");
  }

  function startRuntimeLoop() {
    if (state.runtimeTimerId) return;
    runtimeTick();
    state.runtimeTimerId = setInterval(runtimeTick, 800);
    logSuccess("bootstrap", "runtime loop started");
  }

  function startVmPatchProbe() {
    if (state.vmProbeTimerId) return;

    const probe = () => {
      const vm = findStudyVm();
      if (!vm) return;
      patchStudyVm(vm);
      if (!vm.__awt_patched__) return;
      if (state.vmProbeTimerId) {
        clearInterval(state.vmProbeTimerId);
        state.vmProbeTimerId = 0;
      }
      logSuccess("vm", "early vm patch probe completed");
    };

    probe();
    if (state.studyVm && state.studyVm.__awt_patched__) return;
    state.vmProbeTimerId = setInterval(probe, 100);
    logSuccess("bootstrap", "vm patch probe started");
  }

  function ensureVideoState(vm) {
    const video = getPlayableVideo();
    if (!video) return;

    safeCall(() => {
      video.muted = true;
      video.volume = 0;
      if (video.playbackRate !== 1) {
        video.playbackRate = 1;
      }
    });

    if (vm.testDialog || vm.imgDialog || vm.aberrantDialog || vm.aberrantTimeDialog || vm.FaceVisible) {
      return;
    }

    safeCall(() => {
      if (video.paused) {
        const playResult = video.play();
        if (playResult && typeof playResult.catch === "function") {
          playResult.catch(() => { });
        }
      }
    });
  }

  function closeTransientDialogs(vm) {
    if (vm.imgDialog && typeof vm.closeImg === "function") {
      safeCall(() => vm.closeImg());
      logSuccess("player", "image dialog auto-closed");
      safeCall(() => {
        const video = getPlayableVideo();
        if (video && video.paused) {
          const playResult = video.play();
          if (playResult && typeof playResult.catch === "function") {
            playResult.catch(() => { });
          }
        }
      });
    }

    if (state.config.blockDetectApis) {
      if (vm.aberrantDialog) vm.aberrantDialog = false;
      if (vm.aberrantTimeDialog) vm.aberrantTimeDialog = false;
    }
  }

  function getCorrectOptions(questionItem) {
    const options = questionItem?.testQuestion?.questionOptions || [];
    return options.filter((option) => Number(option?.result) === 1);
  }

  function answerDialog(vm) {
    if (!state.config.autoQuiz || !vm.testDialog) return false;
    const questions = vm.topicInfo?.lessonTestQuestionUseInterfaceDtos;
    if (!Array.isArray(questions) || !questions.length) return false;

    let answeredAny = false;

    for (const item of questions) {
      if (!item || item.isCheck) continue;

      const correctOptions = getCorrectOptions(item);
      if (!correctOptions.length) continue;

      const allOptions = item.testQuestion?.questionOptions || [];
      const inputType = item.testQuestion?.questionType?.inputType || "radio";
      vm.pageList = item;

      for (const option of allOptions) {
        option.isClick = false;
      }

      if (inputType === "checkbox" && correctOptions.length > 1) {
        for (let index = 1; index < correctOptions.length; index += 1) {
          correctOptions[index].isClick = true;
        }
      }

      safeCall(() => vm.topicClickQot(correctOptions[0], 2));
      logSuccess(
        "answer",
        `question auto-submitted: ${item?.testQuestion?.questionId || "unknown"} (${correctOptions.length} correct option(s))`,
      );
      answeredAny = true;
    }

    if (questions.every((question) => question && question.isCheck) && typeof vm.closeTest === "function") {
      logSuccess("answer", "dialog completed, scheduling close");
      setTimeout(() => {
        safeCall(() => vm.closeTest({ isTrusted: true }));
      }, 120);
    }

    return answeredAny;
  }

  function normalizeVideoId(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed || null;
    }
    return null;
  }

  function resolveCurrentVideoId(vm) {
    return normalizeVideoId(vm?.lastViewVideoId);
  }

  function findCurrentLesson(vm) {
    const currentVideoId = resolveCurrentVideoId(vm);
    if (!Array.isArray(vm.videoList) || !currentVideoId) return null;

    for (const chapter of vm.videoList) {
      const lessons = chapter?.videoLessons || [];
      for (const lesson of lessons) {
        const smallLessons = lesson?.videoSmallLessons || [];
        if (smallLessons.length) {
          for (const smallLesson of smallLessons) {
            if (normalizeVideoId(smallLesson?.videoId) === currentVideoId) {
              return smallLesson;
            }
          }
        } else if (normalizeVideoId(lesson?.videoId) === currentVideoId) {
          return lesson;
        }
      }
    }
    return null;
  }

  function collectVideoEntries(vm) {
    if (!Array.isArray(vm?.videoList)) return [];

    const entries = [];
    vm.videoList.forEach((chapter, chapterIndex) => {
      const lessons = chapter?.videoLessons || [];
      lessons.forEach((lesson, lessonIndex) => {
        const smallLessons = lesson?.videoSmallLessons || [];
        if (smallLessons.length) {
          smallLessons.forEach((smallLesson, smallLessonIndex) => {
            if (!smallLesson?.videoId) return;
            entries.push({
              chapter,
              chapterIndex,
              lesson,
              lessonIndex,
              smallLesson,
              smallLessonIndex,
              videoId: normalizeVideoId(smallLesson.videoId),
              progressTarget: smallLesson,
            });
          });
          return;
        }

        if (!lesson?.videoId) return;
        entries.push({
          chapter,
          chapterIndex,
          lesson,
          lessonIndex,
          smallLesson: null,
          smallLessonIndex: -1,
          videoId: normalizeVideoId(lesson.videoId),
          progressTarget: lesson,
        });
      });
    });

    return entries;
  }

  function isLessonPendingForAdvance(lesson) {
    if (!lesson) return false;
    const studied = Number(lesson.isStudiedLesson || 0);
    const percentage = Number(lesson.percentage || 0);
    return studied === 0 || (studied === 2 && percentage <= 50);
  }

  function findNextPendingVideoEntry(vm, currentVideoId = resolveCurrentVideoId(vm)) {
    const entries = collectVideoEntries(vm);
    if (!entries.length) return null;
    if (!currentVideoId) return null;

    const currentIndex = entries.findIndex((entry) => entry.videoId === currentVideoId);
    if (currentIndex < 0) return null;
    const startIndex = currentIndex >= 0 ? currentIndex + 1 : 0;
    for (let index = startIndex; index < entries.length; index += 1) {
      if (isLessonPendingForAdvance(entries[index].progressTarget)) {
        return entries[index];
      }
    }
    return null;
  }

  function jumpToVideoEntry(vm, entry) {
    if (!entry || typeof vm?.videoClick !== "function") return false;

    if (entry.smallLesson) {
      vm.videoClick(
        entry.chapter,
        entry.chapterIndex,
        entry.lesson,
        entry.lessonIndex,
        entry.smallLesson,
        entry.smallLessonIndex,
      );
      return true;
    }

    vm.videoClick(entry.chapter, entry.chapterIndex, entry.lesson, entry.lessonIndex);
    return true;
  }

  function hasFinishIcon() {
    return Boolean(document.querySelector(".clearfix.video.current_play .fl.time_icofinish"));
  }

  function isRecordedProgressComplete(vm) {
    const currentLesson = findCurrentLesson(vm);
    if (!currentLesson) {
      return hasFinishIcon();
    }
    return currentLesson.isStudiedLesson === 1 || hasFinishIcon();
  }

  function isVideoNaturallyFinished(video) {
    if (!video) return false;
    if (video.ended) return true;
    const duration = Number(video.duration || 0);
    const currentTime = Number(video.currentTime || 0);
    if (!Number.isFinite(duration) || duration <= 0) return false;
    return duration - currentTime <= 1;
  }

  function retryCurrentVideoIfNeeded(vm) {
    const video = getPlayableVideo();
    if (!isVideoNaturallyFinished(video)) return false;
    if (isRecordedProgressComplete(vm)) return false;
    if (now() - state.lastReplayAt < 3000) return true;

    state.lastReplayAt = now();
    logWarn("player", "video ended but recorded progress is incomplete, retry from start", {
      videoId: vm.lastViewVideoId,
      lesson: findCurrentLesson(vm)?.name || "unknown",
    });
    safeCall(() => {
      if (typeof video.currentTime === "number") {
        video.currentTime = 0;
      }
      const player = safeCall(() => PAGE.ablePlayerX && PAGE.ablePlayerX("container"));
      if (player && typeof player.seek === "function") {
        player.seek(0);
      }
      const playResult = video.play();
      if (playResult && typeof playResult.catch === "function") {
        playResult.catch(() => {});
      }
    });
    toast("检测到记录进度未完成，已回到开头重试");
    updateUi("进度未完成，重播当前视频");
    return true;
  }

  function shouldAdvance(vm) {
    const video = getPlayableVideo();
    return isVideoNaturallyFinished(video) && isRecordedProgressComplete(vm);
  }

  function hasRecentAdvanceAttempt(currentVideoId, targetVideoId) {
    const sourceId = normalizeVideoId(currentVideoId);
    const nextId = normalizeVideoId(targetVideoId);
    if (!sourceId || !nextId) return false;
    if (sourceId === state.lastAdvanceTargetId) return false;
    return state.lastVideoId === sourceId
      && state.lastAdvanceTargetId === nextId
      && now() - state.lastAdvanceAt < 8000;
  }

  function jumpToNextPendingVideo(vm, reason) {
    const currentVideoId = resolveCurrentVideoId(vm);
    const nextPendingEntry = findNextPendingVideoEntry(vm, currentVideoId);
    if (!nextPendingEntry) return false;
    if (hasRecentAdvanceAttempt(currentVideoId, nextPendingEntry.videoId)) {
      return true;
    }
    if (!safeCall(() => jumpToVideoEntry(vm, nextPendingEntry), false)) {
      return false;
    }

    state.lastVideoId = currentVideoId;
    state.lastAdvanceTargetId = nextPendingEntry.videoId;
    state.lastAdvanceAt = now();
    logSuccess("player", "jump to next unfinished video", {
      fromVideoId: currentVideoId,
      toVideoId: nextPendingEntry.videoId,
      reason,
    });
    toast("当前视频已完成，已跳到下一个未完成视频");
    updateUi("已跳到下一个未完成视频");
    return true;
  }

  function advanceVideo(vm) {
    if (vm.testDialog || vm.imgDialog) return;
    if (retryCurrentVideoIfNeeded(vm)) return;
    if (isRecordedProgressComplete(vm) && jumpToNextPendingVideo(vm, "recorded progress completed")) return;
    if (!shouldAdvance(vm)) return;

    const currentVideoId = resolveCurrentVideoId(vm);
    if (state.lastVideoId === currentVideoId && !state.lastAdvanceTargetId && now() - state.lastAdvanceAt < 3000) {
      return;
    }

    state.lastVideoId = currentVideoId;
    state.lastAdvanceTargetId = null;
    state.lastAdvanceAt = now();
    logSuccess("player", "advance to next video", {
      videoId: currentVideoId,
      reason: "recorded progress completed",
    });
    safeCall(() => vm.videoNext());
  }

  function formatLogPayload(payload) {
    if (typeof payload === "undefined") return "";
    if (typeof payload === "string") return payload;
    try {
      return JSON.stringify(payload);
    } catch (_error) {
      return String(payload);
    }
  }

  function formatLogTime(value) {
    const date = value instanceof Date ? value : new Date(value);
    return date.toLocaleTimeString("zh-CN", { hour12: false });
  }

  function formatDuration(seconds) {
    const value = Number(seconds || 0);
    if (!Number.isFinite(value) || value < 0) return "--:--";
    const totalSeconds = Math.floor(value);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainSeconds = totalSeconds % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainSeconds).padStart(2, "0")}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(remainSeconds).padStart(2, "0")}`;
  }

  function clampPercent(value) {
    const numeric = Number(value || 0);
    if (!Number.isFinite(numeric)) return 0;
    return Math.max(0, Math.min(100, numeric));
  }

  function formatPercent(value) {
    return `${clampPercent(value).toFixed(1)}%`;
  }

  function toUiLevelLabel(level) {
    if (level === "success") return "成功";
    if (level === "warn") return "提醒";
    if (level === "error") return "异常";
    return "状态";
  }

  function summarizeBlockedKind(message) {
    if (/\[detect\]/i.test(message)) return "检测";
    if (/\[report\]/i.test(message)) return "上报";
    return "风险";
  }

  function shortenUiUrl(value) {
    if (typeof value !== "string") return "";
    return value.replace(/^https?:\/\//i, "").replace(/^\/\//, "");
  }

  function buildUiLogMessage(level, scope, message, payload) {
    if (level === "debug") return null;

    if (scope === "answer" && /question auto-submitted:/i.test(message)) {
      return "已自动提交当前弹题";
    }
    if (scope === "answer" && /dialog completed, scheduling close/i.test(message)) {
      return "弹题已完成，准备自动关闭";
    }
    if (scope === "player" && /image dialog auto-closed/i.test(message)) {
      return "已自动关闭图片弹窗";
    }
    if (scope === "player" && /video ended but recorded progress is incomplete, retry from start/i.test(message)) {
      return "视频已播完，但记录进度未满，正在回到开头重播";
    }
    if (scope === "player" && /jump to next unfinished video/i.test(message)) {
      return "当前视频已完成，已跳到下一个未完成视频";
    }
    if (scope === "player" && /advance to next video/i.test(message)) {
      return "当前视频已完成，已切换到下一节";
    }
    if (scope === "detect" && /notTrustScript blocked/i.test(message)) {
      return "已绕过异常脚本检测";
    }
    if (scope === "detect" && /collectLog blocked/i.test(message)) {
      return "已拦截异常日志上报";
    }
    if (scope === "detect" && /aberrantCloseBtn blocked/i.test(message)) {
      return "已忽略异常弹窗确认回传";
    }
    if (scope === "network" && /fallback blocked/i.test(message)) {
      const kind = summarizeBlockedKind(message);
      const shortUrl = shortenUiUrl(payload);
      return shortUrl ? `已拦截${kind}请求：${shortUrl}` : `已拦截${kind}请求`;
    }
    if (scope === "network" && /MonitorUtil\.errorLog blocked/i.test(message)) {
      return "已拦截播放器异常上报";
    }
    if (scope === "network" && /secondKafkaCollect blocked/i.test(message)) {
      return "已拦截课程埋点上报";
    }
    if (scope === "network" && /fetchLogData blocked/i.test(message)) {
      return `已拦截日志请求（${summarizeBlockedKind(message)}）`;
    }
    if (scope === "config" && /toggled /i.test(message)) {
      return "脚本配置已更新";
    }
    if (scope === "bootstrap" && /bootstrapped|runtime loop started/i.test(message)) {
      return "脚本已完成初始化";
    }
    if (scope === "vm" && /study vm patched|early vm patch probe completed/i.test(message)) {
      return "学习页已接管";
    }
    if (scope === "progress" && /page hidden snapshot captured/i.test(message)) {
      return "已记录后台切换前的进度快照";
    }
    if (scope === "progress" && /page visible snapshot captured/i.test(message)) {
      return "已记录切回前台后的进度快照";
    }
    if (level === "error") {
      return "脚本运行出现异常，请查看控制台日志";
    }
    if (level === "warn") {
      return "脚本已处理一个异常情况";
    }
    return null;
  }

  function getUiLogEntry(level, scope, message, payload) {
    const displayMessage = buildUiLogMessage(level, scope, message, payload);
    if (!displayMessage) return null;
    return {
      time: new Date(),
      level,
      levelLabel: toUiLevelLabel(level),
      message: displayMessage,
    };
  }

  function getCurrentVideoProgress(vm) {
    if (!vm) return null;
    const video = getPlayableVideo();
    const currentLesson = findCurrentLesson(vm);
    const duration = Number(video?.duration || 0);
    const currentTime = Number(video?.currentTime || 0);
    const playbackPercent = duration > 0
      ? clampPercent((currentTime / duration) * 100)
      : clampPercent(currentLesson?.percentage || 0);
    const recordPercent = currentLesson?.isStudiedLesson === 1
      ? 100
      : clampPercent(currentLesson?.percentage || 0);

    return {
      currentTime,
      duration,
      playbackPercent,
      recordPercent,
    };
  }

  function getCourseProgress(vm) {
    const entries = collectVideoEntries(vm);
    if (!entries.length) return null;

    let completedCount = 0;
    let totalPercent = 0;
    for (const entry of entries) {
      const studied = Number(entry.progressTarget?.isStudiedLesson || 0);
      const percentage = clampPercent(entry.progressTarget?.percentage || 0);
      if (studied === 1) {
        completedCount += 1;
        totalPercent += 100;
      } else {
        totalPercent += percentage;
      }
    }

    return {
      completedCount,
      totalCount: entries.length,
      percent: entries.length ? totalPercent / entries.length : 0,
    };
  }

  function buildUiStatusText(message, vm) {
    const lines = [message || state.uiStatusText || "运行中"];
    const currentVideoProgress = getCurrentVideoProgress(vm);
    if (currentVideoProgress) {
      lines.push(
        `当前视频：${formatDuration(currentVideoProgress.currentTime)} / ${formatDuration(currentVideoProgress.duration)}（播放 ${formatPercent(currentVideoProgress.playbackPercent)}，记录 ${formatPercent(currentVideoProgress.recordPercent)}）`,
      );
    }

    const courseProgress = getCourseProgress(vm);
    if (courseProgress) {
      lines.push(
        `总课程进度：${courseProgress.completedCount}/${courseProgress.totalCount}（${formatPercent(courseProgress.percent)}）`,
      );
    }

    return lines.join("\n");
  }

  function renderUiLogEntry(entry) {
    if (!state.uiLogNode) return;
    const item = document.createElement("div");
    item.className = `awt-log-entry awt-log-${entry.level}`;

    const meta = document.createElement("div");
    meta.className = "awt-log-meta";
    meta.textContent = `${formatLogTime(entry.time)} ${entry.levelLabel}`;

    const text = document.createElement("div");
    text.className = "awt-log-text";
    text.textContent = entry.message;

    item.appendChild(meta);
    item.appendChild(text);

    state.uiLogNode.appendChild(item);
    while (state.uiLogNode.children.length > 300) {
      state.uiLogNode.removeChild(state.uiLogNode.firstChild);
    }
    state.uiLogNode.scrollTop = state.uiLogNode.scrollHeight;
  }

  function enqueueUiLog(level, scope, message, payload) {
    const entry = getUiLogEntry(level, scope, message, payload);
    if (!entry) return;
    state.uiLogs.push(entry);
    if (state.uiLogs.length > 300) {
      state.uiLogs.shift();
    }
    if (state.uiLogNode) {
      renderUiLogEntry(entry);
    }
  }

  function setPanelMinimized(minimized) {
    if (!state.uiNode) return;
    state.uiMinimized = minimized;
    if (minimized) {
      if (!state.uiRestoreStyle) {
        state.uiRestoreStyle = {
          top: state.uiNode.style.top,
          left: state.uiNode.style.left,
          right: state.uiNode.style.right,
          bottom: state.uiNode.style.bottom,
          width: state.uiNode.style.width,
          height: state.uiNode.style.height,
        };
      }
      state.uiNode.classList.add("awt-minimized");
      state.uiNode.style.top = "auto";
      state.uiNode.style.left = "auto";
      state.uiNode.style.right = "16px";
      state.uiNode.style.bottom = "16px";
      state.uiNode.style.width = "360px";
      state.uiNode.style.height = "52px";
      if (state.uiBodyNode) {
        state.uiBodyNode.style.display = "none";
      }
    } else {
      state.uiNode.classList.remove("awt-minimized");
      if (state.uiRestoreStyle) {
        Object.assign(state.uiNode.style, state.uiRestoreStyle);
      }
      state.uiNode.style.bottom = "auto";
      if (state.uiBodyNode) {
        state.uiBodyNode.style.display = "grid";
      }
      state.uiRestoreStyle = null;
    }
  }

  function installPanelInteractions(panel, header, minimizeButton, clearButton) {
    let dragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    const onMouseMove = (event) => {
      if (!dragging || state.uiMinimized) return;
      panel.style.right = "auto";
      panel.style.bottom = "auto";
      panel.style.left = `${Math.max(8, event.clientX - dragOffsetX)}px`;
      panel.style.top = `${Math.max(8, event.clientY - dragOffsetY)}px`;
    };

    const stopDragging = () => {
      dragging = false;
      document.removeEventListener("mousemove", onMouseMove, true);
      document.removeEventListener("mouseup", stopDragging, true);
    };

    header.addEventListener("mousedown", (event) => {
      if (state.uiMinimized) return;
      if (event.target.closest(".awt-action-btn")) return;
      const rect = panel.getBoundingClientRect();
      dragging = true;
      dragOffsetX = event.clientX - rect.left;
      dragOffsetY = event.clientY - rect.top;
      document.addEventListener("mousemove", onMouseMove, true);
      document.addEventListener("mouseup", stopDragging, true);
      event.preventDefault();
    });

    minimizeButton.addEventListener("click", () => {
      setPanelMinimized(!state.uiMinimized);
      updateUi();
      logDebug("ui", state.uiMinimized ? "panel minimized" : "panel restored");
    });

    clearButton.addEventListener("click", () => {
      state.uiLogs = [];
      if (state.uiLogNode) {
        state.uiLogNode.innerHTML = "";
      }
      logDebug("ui", "log panel cleared");
    });
  }

  function ensureUi() {
    if (state.uiReady || !document.body) return;

    gmAddStyleCompat(`
      #awt-panel {
        position: fixed;
        top: 16px;
        right: 16px;
        width: 440px;
        height: 320px;
        z-index: 2147483646;
        display: grid;
        grid-template-rows: 52px minmax(0, 1fr);
        border: 1px solid rgba(148, 163, 184, 0.28);
        border-radius: 14px;
        background: rgba(15, 23, 42, 0.96);
        color: #f8fafc;
        font: 12px/1.5 Consolas, Monaco, monospace;
        box-shadow: 0 14px 40px rgba(15, 23, 42, 0.36);
        backdrop-filter: blur(12px);
        resize: both;
        overflow: hidden;
        min-width: 320px;
        min-height: 180px;
      }
      #awt-panel.awt-minimized {
        grid-template-rows: 52px;
        resize: none;
        min-height: 52px;
      }
      #awt-panel .awt-header {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.18);
        background: linear-gradient(90deg, rgba(30, 41, 59, 0.98), rgba(15, 23, 42, 0.98));
        cursor: move;
        user-select: none;
      }
      #awt-panel .awt-header-main {
        min-width: 0;
      }
      #awt-panel .awt-title {
        font: 700 13px/1.2 "Segoe UI", "Microsoft YaHei", sans-serif;
        letter-spacing: 0.04em;
      }
      #awt-panel .awt-summary {
        margin-top: 4px;
        color: #94a3b8;
        font: 11px/1.4 Consolas, Monaco, monospace;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      #awt-panel .awt-actions {
        display: flex;
        gap: 6px;
      }
      #awt-panel .awt-action-btn {
        width: 28px;
        height: 28px;
        border: 0;
        border-radius: 8px;
        background: rgba(51, 65, 85, 0.85);
        color: #f8fafc;
        cursor: pointer;
        font: 700 13px/1 "Segoe UI", sans-serif;
      }
      #awt-panel .awt-action-btn:hover {
        background: rgba(71, 85, 105, 0.96);
      }
      #awt-panel .awt-body {
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        min-height: 0;
      }
      #awt-panel .awt-status {
        padding: 10px 12px 8px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.14);
        color: #cbd5e1;
        font: 12px/1.4 "Microsoft YaHei", sans-serif;
        white-space: pre-line;
      }
      #awt-panel .awt-log-list {
        min-height: 0;
        overflow: auto;
        padding: 10px 12px 12px;
        background:
          linear-gradient(rgba(148, 163, 184, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(148, 163, 184, 0.05) 1px, transparent 1px);
        background-size: 12px 12px;
      }
      #awt-panel .awt-log-entry {
        margin-bottom: 10px;
        padding: 8px 10px;
        border-radius: 10px;
        border: 1px solid rgba(148, 163, 184, 0.14);
        background: rgba(15, 23, 42, 0.78);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02);
      }
      #awt-panel .awt-log-debug { border-left: 3px solid #64748b; }
      #awt-panel .awt-log-info { border-left: 3px solid #3b82f6; }
      #awt-panel .awt-log-success { border-left: 3px solid #10b981; }
      #awt-panel .awt-log-warn { border-left: 3px solid #f59e0b; }
      #awt-panel .awt-log-error { border-left: 3px solid #ef4444; }
      #awt-panel .awt-log-meta {
        color: #93c5fd;
        font-size: 11px;
        margin-bottom: 4px;
        letter-spacing: 0.04em;
      }
      #awt-panel .awt-log-text {
        color: #f8fafc;
        white-space: pre-wrap;
        word-break: break-word;
      }
      #awt-toast {
        position: fixed;
        left: 50%;
        top: 24px;
        transform: translateX(-50%);
        z-index: 2147483647;
        padding: 10px 16px;
        border-radius: 999px;
        background: rgba(2, 6, 23, 0.92);
        color: #f8fafc;
        font: 13px/1.4 "Microsoft YaHei", sans-serif;
        box-shadow: 0 8px 24px rgba(2, 6, 23, 0.28);
        opacity: 0;
        transition: opacity 0.18s ease;
        pointer-events: none;
      }
      #awt-toast.awt-visible {
        opacity: 1;
      }
    `);

    const panel = document.createElement("section");
    panel.id = "awt-panel";
    panel.innerHTML = `
      <div class="awt-header">
        <div class="awt-header-main">
          <div class="awt-title">auto-wisdom-tree</div>
          <div class="awt-summary"></div>
        </div>
        <div class="awt-actions">
          <button class="awt-action-btn" data-action="clear" title="清空日志">C</button>
          <button class="awt-action-btn" data-action="minimize" title="最小化">—</button>
        </div>
      </div>
      <div class="awt-body">
        <div class="awt-status"></div>
        <div class="awt-log-list"></div>
      </div>
    `;
    document.body.appendChild(panel);

    state.uiNode = panel;
    state.uiBodyNode = panel.querySelector(".awt-body");
    state.uiLogNode = panel.querySelector(".awt-log-list");
    state.uiSummaryNode = panel.querySelector(".awt-summary");
    state.uiStatusNode = panel.querySelector(".awt-status");
    state.uiReady = true;

    installPanelInteractions(
      panel,
      panel.querySelector(".awt-header"),
      panel.querySelector('[data-action="minimize"]'),
      panel.querySelector('[data-action="clear"]'),
    );

    for (const entry of state.uiLogs) {
      renderUiLogEntry(entry);
    }
    updateUi("已注入");
  }

  function updateUi(message, vm = state.studyVm || findStudyVm()) {
    if (typeof message === "string" && message) {
      state.uiStatusText = message;
    }
    if (!state.uiNode) return;
    if (state.uiSummaryNode) {
      state.uiSummaryNode.textContent = getConfigSummary();
    }
    if (state.uiStatusNode) {
      state.uiStatusNode.textContent = buildUiStatusText(state.uiStatusText || "运行中", vm);
    }
  }

  function toast(message) {
    const timestamp = now();
    if (timestamp - state.lastToastAt < 500) return;
    state.lastToastAt = timestamp;

    logDebug("ui", message);
    if (!document.body) return;

    let node = document.getElementById("awt-toast");
    if (!node) {
      node = document.createElement("div");
      node.id = "awt-toast";
      document.body.appendChild(node);
    }
    node.textContent = message;
    node.classList.add("awt-visible");
    setTimeout(() => {
      node.classList.remove("awt-visible");
    }, 1800);
  }

  async function loadConfig() {
    state.config.autoQuiz = await gmGetValue(STORAGE_KEYS.autoQuiz, true);
    state.config.blockReportApis = await gmGetValue(STORAGE_KEYS.blockReportApis, true);
    state.config.blockDetectApis = await gmGetValue(STORAGE_KEYS.blockDetectApis, true);
    state.config.antiAntiDebug = await gmGetValue(STORAGE_KEYS.antiAntiDebug, true);
    logSuccess("config", "loaded config", { ...state.config });
  }

  function getConfigLabel(key) {
    if (key === "autoQuiz") return "自动答题";
    if (key === "blockReportApis") return "异常上报拦截";
    if (key === "blockDetectApis") return "异常检测拦截";
    if (key === "antiAntiDebug") return "反反调试/F12";
    return key;
  }

  async function toggleConfig(key) {
    state.config[key] = !state.config[key];
    await gmSetValue(STORAGE_KEYS[key], state.config[key]);
    if (key === "antiAntiDebug" && state.config[key]) {
      installDevtoolsHotkeyGuard();
      installAntiDebugGuards();
    }
    const label = getConfigLabel(key);
    updateUi(`${label}已${state.config[key] ? "开启" : "关闭"}`);
    toast(`${label}已${state.config[key] ? "开启" : "关闭"}`);
    logSuccess("config", `toggled ${key}`, state.config[key]);
  }

  function registerMenus() {
    gmRegisterMenuCommandCompat(`自动答题: ${state.config.autoQuiz ? "开" : "关"}`, () => {
      void toggleConfig("autoQuiz");
    });
    gmRegisterMenuCommandCompat(`屏蔽异常上报: ${state.config.blockReportApis ? "开" : "关"}`, () => {
      void toggleConfig("blockReportApis");
    });
    gmRegisterMenuCommandCompat(`屏蔽异常检测: ${state.config.blockDetectApis ? "开" : "关"}`, () => {
      void toggleConfig("blockDetectApis");
    });
    gmRegisterMenuCommandCompat(`反反调试/F12: ${state.config.antiAntiDebug ? "开" : "关"}`, () => {
      void toggleConfig("antiAntiDebug");
    });
    logSuccess("gm", "menu commands registered", { ...state.config });
  }

  function runtimeTick() {
    if (document.readyState === "loading") return;

    patchJqueryAjax();
    patchMonitorUtil();
    patchSendBeacon();

    const vm = findStudyVm();
    if (!vm) {
      updateUi("等待学习页初始化");
      logOnce("vm-wait", "debug", "vm", "waiting for study page initialization");
      return;
    }

    installAntiDebugGuards();
    patchStudyVm(vm);
    closeTransientDialogs(vm);
    ensureVideoState(vm);

    if (now() - state.progressDebug.lastTickLoggedAt > 8000) {
      state.progressDebug.lastTickLoggedAt = now();
      trackProgressTrend(vm, "runtimeTick");
    }

    if (answerDialog(vm)) {
      updateUi("已自动作答并提交");
    } else if (state.config.autoQuiz && vm.testDialog) {
      updateUi("等待题组数据");
    } else {
      updateUi("运行中");
    }

    advanceVideo(vm);
  }

  async function bootstrap() {
    safeCall(() => {
      PAGE.OCS = true;
    });

    installDevtoolsHotkeyGuard();
    installAntiDebugGuards();
    patchFetch();
    patchXhr();
    patchSendBeacon();
    startVmPatchProbe();

    await loadConfig();
    registerMenus();

    const ready = () => {
      installProgressDebugHooks();
      ensureUi();
      updateUi("运行中");
      startRuntimeLoop();
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", ready, { once: true });
    } else {
      ready();
    }

    logSuccess("bootstrap", "bootstrapped", { ...state.config });
  }

  void bootstrap();
})();
