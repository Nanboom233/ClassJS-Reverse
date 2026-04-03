// ==UserScript==
// @name         2026 智慧树自动浇水施肥开花结果 - Enhanced
// @namespace    auto-wisdom-tree
// @version      0.1.6
// @description  智慧树是一棵树
// @match        *://studyvideoh5.zhihuishu.com/*
// @match        *://onlineexamh5new.zhihuishu.com/*
// @match        *://studentexambaseh5.zhihuishu.com/*
// @match        *://exam.zhihuishu.com/*
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
  const PAGE_HOST = String(PAGE.location?.host || location.host || "").toLowerCase();
  const ANSWER_INTERVAL_MS = 5000;
  const STUDY_HOST_RE = /(^|\.)studyvideoh5\.zhihuishu\.com$/i;
  const EXAM_HOST_RE_LIST = [
    /(^|\.)onlineexamh5new\.zhihuishu\.com$/i,
    /(^|\.)studentexambaseh5\.zhihuishu\.com$/i,
    /(^|\.)exam\.zhihuishu\.com$/i,
  ];

  const state = {
    config: {
      autoQuiz: true,
      autoOpenRegularExam: true,
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
    currentVideoId: null,
    currentVideoChangedAt: 0,
    lastVideoId: null,
    lastAdvanceTargetId: null,
    lastAdvanceAt: 0,
    advanceCooldownUntil: 0,
    lastReplayVideoId: null,
    lastReplayAt: 0,
    lastToastAt: 0,
    runtimeTimerId: 0,
    vmProbeTimerId: 0,
    examVmProbeTimerId: 0,
    logKeys: new Set(),
    antiDebug: {
      installed: false,
      hotkeysInstalled: false,
      strippedCount: 0,
    },
    progressSync: {
      videoId: null,
      currentTime: 0,
      totalStudyTime: 0,
      observedAt: 0,
    },
    progressDebug: {
      hooksInstalled: false,
      hiddenSnapshot: null,
      lastTickLoggedAt: 0,
      lastSnapshot: null,
    },
    answerFlow: {
      lastPopupAnswerAt: 0,
    },
    exam: {
      answerBank: {},
      session: null,
      rootVm: null,
      store: null,
      pageVm: null,
      routeName: "",
      routeParams: null,
      captureMode: "",
      captureAt: 0,
      recoveredThisPage: false,
      lastSignature: "",
      lastAnsweredAt: 0,
      lastAdvancedAt: 0,
      unresolvedSignature: "",
      lastUnresolvedAt: 0,
      lastDetectTriggerAt: 0,
      lastLaunchKey: "",
      lastLaunchAt: 0,
    },
  };

  const STORAGE_KEYS = {
    autoQuiz: "awt:autoQuiz",
    autoOpenRegularExam: "awt:autoOpenRegularExam",
    blockReportApis: "awt:blockReportApis",
    blockDetectApis: "awt:blockDetectApis",
    antiAntiDebug: "awt:antiAntiDebug",
    examAnswerBank: "awt:examAnswerBank",
    examSession: "awt:examSession",
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
      `自动开测:${state.config.autoOpenRegularExam ? "开" : "关"}`,
      `上报拦截:${state.config.blockReportApis ? "开" : "关"}`,
      `检测拦截:${state.config.blockDetectApis ? "开" : "关"}`,
      `反反调试:${state.config.antiAntiDebug ? "开" : "关"}`,
    ].join(" | ");
  }

  function now() {
    return Date.now();
  }

  function isStudyPage() {
    return STUDY_HOST_RE.test(PAGE_HOST);
  }

  function isExamPage() {
    return EXAM_HOST_RE_LIST.some((rule) => rule.test(PAGE_HOST));
  }

  function normalizeText(value) {
    return String(value || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeQuestionText(value) {
    return normalizeText(value)
      .replace(/^[\d一二三四五六七八九十]+[\s.、:：）)]*/, "")
      .replace(/^第[\d一二三四五六七八九十]+题[\s:：.]*/, "")
      .trim();
  }

  function normalizeAnswerText(value) {
    return normalizeText(value)
      .replace(/^[A-H][\s.、:：-]+/i, "")
      .trim();
  }

  function getLetterByIndex(index) {
    return String.fromCharCode(65 + index);
  }

  function isElementVisible(element) {
    if (!element || typeof element.getBoundingClientRect !== "function") return false;
    const rect = element.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    const style = PAGE.getComputedStyle ? PAGE.getComputedStyle(element) : null;
    if (!style) return true;
    return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
  }

  function queryAllBySelectors(selectors, root = document) {
    const results = [];
    const seen = new Set();
    for (const selector of selectors) {
      if (!selector) continue;
      let nodes = [];
      try {
        nodes = root.querySelectorAll(selector);
      } catch (error) {
        logWarn("exam", `selector query failed: ${selector}`, error);
        continue;
      }
      for (const node of nodes) {
        if (seen.has(node)) continue;
        seen.add(node);
        results.push(node);
      }
    }
    return results;
  }

  function queryFirstBySelectors(selectors, root = document, visibleOnly = false) {
    const nodes = queryAllBySelectors(selectors, root);
    if (!visibleOnly) return nodes[0] || null;
    return nodes.find((node) => isElementVisible(node)) || null;
  }

  function queryFirstMatchingSet(selectors, root = document) {
    for (const selector of selectors) {
      const nodes = queryAllBySelectors([selector], root).filter((node) => isElementVisible(node) && normalizeText(node.innerText || node.textContent));
      if (nodes.length) return nodes;
    }
    return [];
  }

  function getNodeText(node) {
    return normalizeText(node?.innerText || node?.textContent || "");
  }

  function isActionableElementDisabled(element) {
    if (!element) return true;
    if ("disabled" in element && element.disabled) return true;
    const ariaDisabled = String(element.getAttribute?.("aria-disabled") || "").toLowerCase();
    return ariaDisabled === "true";
  }

  function clickElement(element) {
    if (!element || isActionableElementDisabled(element)) return false;
    safeCall(() => {
      element.scrollIntoView?.({
        block: "center",
        inline: "center",
      });
    });
    safeCall(() => element.click());
    return true;
  }

  function setNativeInputValue(element, value) {
    if (!element) return false;
    const prototype = Object.getPrototypeOf(element);
    const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
    if (descriptor?.set) {
      descriptor.set.call(element, value);
    } else {
      element.value = value;
    }
    element.dispatchEvent(new PageEvent("input", {
      bubbles: true,
    }));
    element.dispatchEvent(new PageEvent("change", {
      bubbles: true,
    }));
    return true;
  }

  function buildExamQuestionSignature(questionText, options = []) {
    const normalizedQuestion = normalizeQuestionText(questionText);
    const normalizedOptions = options.map((option) => normalizeAnswerText(option)).filter(Boolean);
    return [normalizedQuestion, normalizedOptions.join(" | ")].filter(Boolean).join(" || ");
  }

  function isDelayElapsed(lastAt, timestamp = now(), interval = ANSWER_INTERVAL_MS) {
    return !lastAt || timestamp - lastAt >= interval;
  }

  function storeExamAnswer(questionInfo, answers, source = "page") {
    if (!questionInfo || !Array.isArray(answers) || !answers.length) return false;
    const signature = questionInfo.signature || buildExamQuestionSignature(questionInfo.text, questionInfo.options?.map((option) => option.text));
    const normalizedAnswers = [...new Set(answers.map((item) => normalizeAnswerText(item)).filter(Boolean))];
    if (!signature || !normalizedAnswers.length) return false;

    const questionKey = `q:${normalizeQuestionText(questionInfo.text)}`;
    const existing = state.exam.answerBank[signature];
    if (existing && JSON.stringify(existing.answers) === JSON.stringify(normalizedAnswers)) {
      return false;
    }

    const record = {
      question: normalizeQuestionText(questionInfo.text),
      answers: normalizedAnswers,
      updatedAt: now(),
      source,
    };
    state.exam.answerBank[signature] = record;
    if (questionKey && questionKey !== "q:") {
      state.exam.answerBank[questionKey] = record;
    }
    void gmSetValue(STORAGE_KEYS.examAnswerBank, state.exam.answerBank);
    return true;
  }

  function lookupExamAnswer(questionInfo) {
    if (!questionInfo) return [];
    const signature = questionInfo.signature || buildExamQuestionSignature(questionInfo.text, questionInfo.options?.map((option) => option.text));
    const questionKey = `q:${normalizeQuestionText(questionInfo.text)}`;
    const record = state.exam.answerBank[signature] || state.exam.answerBank[questionKey];
    if (!record || !Array.isArray(record.answers)) return [];
    return record.answers.map((item) => normalizeAnswerText(item)).filter(Boolean);
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
    if (state.antiDebug.hotkeysInstalled || !state.config.antiAntiDebug) return;
    state.antiDebug.hotkeysInstalled = true;
    try {
      const EventTargetCtor = PAGE.EventTarget || EventTarget;
      const eventTargetPrototype = EventTargetCtor?.prototype;
      if (!eventTargetPrototype || eventTargetPrototype.addEventListener?.[WRAP_MARK]) {
        logSuccess("anti-debug", "page devtools hotkey bypass installed");
        return;
      }

      const listenerMap = new WeakMap();
      const originalAddEventListener = eventTargetPrototype.addEventListener;
      const originalRemoveEventListener = eventTargetPrototype.removeEventListener;

      const wrapListener = (listener) => {
        if (!listener) return listener;
        if (listenerMap.has(listener)) {
          return listenerMap.get(listener);
        }

        let wrappedListener = listener;
        if (typeof listener === "function") {
          wrappedListener = function (event) {
            if (state.config.antiAntiDebug && isDevtoolsKeyEvent(event)) {
              return undefined;
            }
            return listener.apply(this, arguments);
          };
        } else if (typeof listener?.handleEvent === "function") {
          wrappedListener = {
            handleEvent(event) {
              if (state.config.antiAntiDebug && isDevtoolsKeyEvent(event)) {
                return undefined;
              }
              return listener.handleEvent.call(listener, event);
            },
          };
        }

        listenerMap.set(listener, wrappedListener);
        return wrappedListener;
      };

      const wrappedAddEventListener = function (type, listener, options) {
        if (/^key(?:down|press|up)$/i.test(String(type || ""))) {
          return originalAddEventListener.call(this, type, wrapListener(listener), options);
        }
        return originalAddEventListener.call(this, type, listener, options);
      };

      const wrappedRemoveEventListener = function (type, listener, options) {
        if (/^key(?:down|press|up)$/i.test(String(type || "")) && listenerMap.has(listener)) {
          return originalRemoveEventListener.call(this, type, listenerMap.get(listener), options);
        }
        return originalRemoveEventListener.call(this, type, listener, options);
      };

      Object.defineProperty(wrappedAddEventListener, WRAP_MARK, {
        value: true,
      });
      Object.defineProperty(wrappedRemoveEventListener, WRAP_MARK, {
        value: true,
      });

      eventTargetPrototype.addEventListener = wrappedAddEventListener;
      eventTargetPrototype.removeEventListener = wrappedRemoveEventListener;

      const wrapKeyHandlerProperty = (prototype, propertyName) => {
        if (!prototype) return;
        const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);
        if (!descriptor || !descriptor.configurable || typeof descriptor.set !== "function") return;

        const assignedHandlers = new WeakMap();
        Object.defineProperty(prototype, propertyName, {
          configurable: true,
          enumerable: descriptor.enumerable,
          get() {
            return assignedHandlers.get(this) || (descriptor.get ? descriptor.get.call(this) : null);
          },
          set(handler) {
            if (typeof handler !== "function") {
              assignedHandlers.delete(this);
              descriptor.set.call(this, handler);
              return;
            }

            const wrappedHandler = function (event) {
              if (state.config.antiAntiDebug && isDevtoolsKeyEvent(event)) {
                return undefined;
              }
              return handler.apply(this, arguments);
            };

            assignedHandlers.set(this, wrappedHandler);
            descriptor.set.call(this, wrappedHandler);
          },
        });
      };

      const WindowCtor = PAGE.Window || window.Window;
      const DocumentCtor = PAGE.Document || window.Document;
      const HTMLElementCtor = PAGE.HTMLElement || window.HTMLElement;
      ["onkeydown", "onkeypress", "onkeyup"].forEach((propertyName) => {
        wrapKeyHandlerProperty(WindowCtor?.prototype, propertyName);
        wrapKeyHandlerProperty(DocumentCtor?.prototype, propertyName);
        wrapKeyHandlerProperty(HTMLElementCtor?.prototype, propertyName);
      });

      logSuccess("anti-debug", "page devtools hotkey bypass installed");
    } catch (error) {
      logError("anti-debug", "page devtools hotkey bypass install failed", error);
    }
  }

  function getTimerCallbackSource(callback) {
    if (typeof callback === "string") {
      return normalizeText(callback);
    }
    if (typeof callback === "function") {
      try {
        return normalizeText(Function.prototype.toString.call(callback));
      } catch (_error) {
        return normalizeText(String(callback));
      }
    }
    return "";
  }

  function isSuspiciousExamDetectCallback(callback) {
    if (!isExamPage() || !state.config.blockDetectApis) return false;
    const source = getTimerCallbackSource(callback);
    if (!source) return false;
    if (/检测到异常脚本/.test(source)) return true;
    if (/collectLog\s*\(/i.test(source) && /window\.XMLHttpRequest/i.test(source)) return true;
    if (/\$alert\s*\(/i.test(source) && /window\.close\s*\(/i.test(source)) return true;
    return false;
  }

  function markExamDetectTriggered(reason, payload) {
    state.exam.lastDetectTriggerAt = now();
    if (reason) {
      logOnce(`exam-detect:${reason}`, "warn", "detect", reason, payload);
    }
    return true;
  }

  function shouldBlockExamWindowClose(stackText = "") {
    if (!isExamPage() || !state.config.blockDetectApis) return false;
    const lastDetectTriggerAt = Number(state.exam.lastDetectTriggerAt || 0);
    if (lastDetectTriggerAt > 0 && now() - lastDetectTriggerAt < 5000) {
      return true;
    }
    const normalizedStack = normalizeText(stackText).toLowerCase();
    if (!normalizedStack) return false;
    return /checkout/.test(normalizedStack)
      || (/collectlog/.test(normalizedStack) && /close/.test(normalizedStack));
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

      const constructorDescriptor = Object.getOwnPropertyDescriptor(OriginalFunction.prototype, "constructor");
      if (!constructorDescriptor || constructorDescriptor.value !== FunctionProxy) {
        Object.defineProperty(OriginalFunction.prototype, "constructor", {
          configurable: true,
          writable: true,
          value: FunctionProxy,
        });
      }
      logSuccess("anti-debug", "Function constructor proxy installed");
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
              if (isSuspiciousExamDetectCallback(args[0])) {
                const blockedReason = `homework detect timer blocked (${name})`;
                args[0] = markWrapped(function awtBlockedExamDetectTimerCallback() {
                  markExamDetectTriggered(blockedReason, {
                    timer: name,
                  });
                  return true;
                });
              } else {
                args[0] = stripDebuggerStatements(args[0]);
              }
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

    try {
      if (typeof PAGE.close === "function") {
        const originalClose = PAGE.close.bind(PAGE);
        PAGE.close = markWrapped(new Proxy(originalClose, {
          apply(target, thisArg, args) {
            const stack = safeCall(() => String(new Error().stack || ""), "");
            if (shouldBlockExamWindowClose(stack)) {
              markExamDetectTriggered("homework detect window.close blocked", {
                stack,
              });
              return false;
            }
            return Reflect.apply(target, thisArg, args);
          },
        }));
        logSuccess("anti-debug", "window.close guard installed");
      }
    } catch (error) {
      logError("anti-debug", "window.close guard install failed", error);
    }
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
        if (state.config.autoQuiz) {
          armExamSession(buildExamSessionPayload(this, studentExam));
        }
        if (state.config.blockDetectApis && typeof this.judgeLookAnswer === "function") {
          return this.judgeLookAnswer(studentExam, ...rest);
        }
        return original(studentExam, ...rest);
      });
    }

    if (typeof vm.goToExamJudge === "function" && !vm.goToExamJudge[WRAP_MARK]) {
      vm.goToExamJudge = wrapVmMethod(vm, vm.goToExamJudge, (original) => function (...args) {
        if (state.config.autoQuiz) {
          armExamSession(buildExamSessionPayload(this, {
            studentExamDto: {
              examUrl: "",
            },
          }));
        }
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

  function resetProgressSyncState(currentVideoId, video, vm, timestamp = now()) {
    state.progressSync.videoId = normalizeVideoId(currentVideoId);
    state.progressSync.currentTime = Number(video?.currentTime || 0);
    state.progressSync.totalStudyTime = Number(vm?.totalStudyTime || 0);
    state.progressSync.observedAt = timestamp;
  }

  function appendWatchPointRange(vm, startStudyTime, endStudyTime) {
    const start = Number(startStudyTime || 0);
    const end = Number(endStudyTime || 0);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return;

    const points = typeof vm?.watchPointPost === "string" && vm.watchPointPost
      ? vm.watchPointPost.split(",").filter(Boolean)
      : ["0", "1"];
    const startIndex = Math.max(2, Math.floor(start / 5) + 2);
    const endIndex = Math.max(startIndex, Math.floor(end / 5) + 2);
    for (let index = startIndex; index <= endIndex; index += 1) {
      const marker = String(index);
      if (points[points.length - 1] !== marker) {
        points.push(marker);
      }
    }
    vm.watchPointPost = points.join(",");
  }

  function getActualPlaybackPercent(vm, video = getPlayableVideo(), lesson = findCurrentLesson(vm)) {
    const duration = Number(video?.duration || lesson?.videoSec || 0);
    const currentTime = Number(video?.currentTime || 0);
    if (!Number.isFinite(duration) || duration <= 0 || !Number.isFinite(currentTime) || currentTime <= 0) {
      return clampPercent(lesson?.percentage || 0);
    }
    return clampPercent((currentTime / duration) * 100);
  }

  function syncProgressFromPlayback(vm, reason = "runtimeTick", timestamp = now()) {
    const video = getPlayableVideo();
    const currentVideoId = resolveCurrentVideoId(vm);
    if (!video || !currentVideoId) return false;

    const currentTime = Number(video.currentTime || 0);
    const totalStudyTime = Number(vm.totalStudyTime || 0);
    if (!Number.isFinite(currentTime) || !Number.isFinite(totalStudyTime)) {
      resetProgressSyncState(currentVideoId, video, vm, timestamp);
      return false;
    }

    if (state.progressSync.videoId !== currentVideoId || !state.progressSync.observedAt) {
      resetProgressSyncState(currentVideoId, video, vm, timestamp);
      return false;
    }

    const elapsedSeconds = Math.max(0, (timestamp - state.progressSync.observedAt) / 1000);
    const playbackDelta = currentTime - state.progressSync.currentTime;
    const recordedDelta = totalStudyTime - state.progressSync.totalStudyTime;
    const playbackRate = Number(video.playbackRate || vm.playRate || 1) || 1;
    const naturalFinish = isVideoNaturallyFinished(video);

    if (playbackDelta < -3) {
      resetProgressSyncState(currentVideoId, video, vm, timestamp);
      return false;
    }

    const seekThreshold = Math.max(12, elapsedSeconds * Math.max(playbackRate, 1) * 2 + 6);
    if (playbackDelta > seekThreshold) {
      logDebug("progress", "progress sync baseline reset after playback jump", {
        reason,
        videoId: currentVideoId,
        playbackDelta: Number(playbackDelta.toFixed(2)),
        elapsedSeconds: Number(elapsedSeconds.toFixed(2)),
      });
      resetProgressSyncState(currentVideoId, video, vm, timestamp);
      return false;
    }

    let changed = false;
    const lagDelta = playbackDelta - Math.max(0, recordedDelta);
    const minLag = naturalFinish ? 0.5 : document.hidden ? 2 : 5;
    if (lagDelta >= minLag) {
      const previousTotalStudyTime = Number(vm.totalStudyTime || 0);
      vm.totalStudyTime = previousTotalStudyTime + lagDelta;
      vm.totalTimeFinish = Number(vm.totalTimeFinish || 0) + lagDelta;
      vm.playTimes = Number(vm.playTimes || 0) + lagDelta;
      appendWatchPointRange(vm, previousTotalStudyTime, vm.totalStudyTime);
      if (typeof vm.computeProgree === "function") {
        safeCall(() => vm.computeProgree());
      }
      changed = true;
      logWarn("progress", "compensated throttled progress lag", {
        reason,
        videoId: currentVideoId,
        hidden: document.hidden,
        playbackDelta: Number(playbackDelta.toFixed(2)),
        recordedDelta: Number(Math.max(0, recordedDelta).toFixed(2)),
        compensatedDelta: Number(lagDelta.toFixed(2)),
      });
    }

    if (naturalFinish) {
      const currentLesson = findCurrentLesson(vm);
      const actualPercent = getActualPlaybackPercent(vm, video, currentLesson);
      if (currentLesson && actualPercent > Number(currentLesson.percentage || 0)) {
        currentLesson.percentage = actualPercent;
        changed = true;
      }
      if (currentLesson && actualPercent >= 50 && Number(currentLesson.isStudiedLesson || 0) !== 1) {
        currentLesson.isStudiedLesson = 1;
        vm.playTimes = Math.max(Number(vm.playTimes || 0), 6);
        if (typeof vm.computeProgree === "function") {
          safeCall(() => vm.computeProgree());
        }
        if (typeof vm.saveDdsjkTimeInWhileFn === "function" && !vm.isSaving) {
          safeCall(() => vm.saveDdsjkTimeInWhileFn(null, null, null, 8));
        }
        changed = true;
        logWarn("progress", "forced final progress flush at natural end", {
          videoId: currentVideoId,
          actualPercent: Number(actualPercent.toFixed(2)),
          playTimes: Number(vm.playTimes || 0),
        });
      }
    }

    resetProgressSyncState(currentVideoId, video, vm, timestamp);
    return changed;
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

  function startExamVmPatchProbe() {
    if (state.examVmProbeTimerId) return;

    const probe = () => {
      const pageVm = findHomeworkExamVm();
      if (!pageVm || !pageVm.__awt_exam_patched__) return;
      if (state.examVmProbeTimerId) {
        clearInterval(state.examVmProbeTimerId);
        state.examVmProbeTimerId = 0;
      }
      logSuccess("exam", "homework exam probe completed", {
        captureMode: state.exam.captureMode || "unknown",
      });
    };

    probe();
    if (state.exam.pageVm && state.exam.pageVm.__awt_exam_patched__) return;
    state.examVmProbeTimerId = setInterval(probe, 100);
    logSuccess("bootstrap", "exam vm patch probe started");
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

    if (questions.every((question) => question && question.isCheck) && typeof vm.closeTest === "function") {
      logSuccess("answer", "dialog completed, scheduling close");
      setTimeout(() => {
        safeCall(() => vm.closeTest({ isTrusted: true }));
      }, 120);
      return false;
    }

    if (!isDelayElapsed(state.answerFlow.lastPopupAnswerAt)) {
      return false;
    }

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
      state.answerFlow.lastPopupAnswerAt = now();
      logSuccess(
        "answer",
        `question auto-submitted: ${item?.testQuestion?.questionId || "unknown"} (${correctOptions.length} correct option(s))`,
      );
      answeredAny = true;
      break;
    }

    if (questions.every((question) => question && question.isCheck) && typeof vm.closeTest === "function") {
      logSuccess("answer", "dialog completed, scheduling close");
      setTimeout(() => {
        safeCall(() => vm.closeTest({ isTrusted: true }));
      }, 120);
    }

    return answeredAny;
  }

  function buildExamSessionPayload(vm, lessonLike) {
    const studentExamDto = lessonLike?.studentExamDto || lessonLike || {};
    return {
      host: PAGE_HOST,
      recruitId: normalizeVideoId(vm?.recruitId),
      lessonId: normalizeVideoId(vm?.lessonId || lessonLike?.id),
      studentExamId: normalizeVideoId(studentExamDto?.id),
      examId: normalizeVideoId(studentExamDto?.exam?.id),
      examUrl: studentExamDto?.examUrl || "",
      armedAt: now(),
    };
  }

  function armExamSession(sessionPayload) {
    if (!sessionPayload || typeof sessionPayload !== "object") return;
    state.exam.session = {
      ...(state.exam.session && typeof state.exam.session === "object" ? state.exam.session : {}),
      ...sessionPayload,
      armedAt: now(),
    };
    void gmSetValue(STORAGE_KEYS.examSession, state.exam.session);
  }

  function isStudentExamPending(studentExamDto) {
    if (!studentExamDto || typeof studentExamDto !== "object") return false;
    const examState = Number(studentExamDto.state);
    return examState !== 3 && examState !== 4;
  }

  function buildExamRouteParams(routeLike) {
    const params = routeLike?.params || {};
    const session = state.exam.session && typeof state.exam.session === "object" ? state.exam.session : {};
    return {
      recruitId: normalizeVideoId(params.recruitId) || normalizeVideoId(session.recruitId),
      stuExamId: normalizeVideoId(params.stuExamId) || normalizeVideoId(session.studentExamId || session.stuExamId),
      examId: normalizeVideoId(params.examId) || normalizeVideoId(session.examId),
      courseId: normalizeVideoId(params.courseId) || normalizeVideoId(session.courseId),
      schoolId: normalizeVideoId(params.schoolId) || normalizeVideoId(session.schoolId),
      meetCourseType: normalizeVideoId(params.meetCourseType) || normalizeVideoId(session.meetCourseType),
    };
  }

  function isHomeworkExamVm(candidate) {
    return Boolean(
      candidate
      && typeof candidate === "object"
      && typeof candidate.openHomework === "function"
      && typeof candidate.switchQuestion === "function"
      && typeof candidate.beforeTemporarySave === "function"
      && typeof candidate.beforeDirectSubmit === "function"
      && typeof candidate.saveSuccessChild === "function"
      && candidate.$store
      && candidate.$route
    );
  }

  function getHomeworkAnswerRefs(pageVm) {
    const answerRefs = pageVm?.$refs?.answerData;
    if (Array.isArray(answerRefs)) {
      return answerRefs.filter(Boolean);
    }
    return answerRefs ? [answerRefs] : [];
  }

  function getHomeworkQuestionTotal(pageVm) {
    const answerRefs = getHomeworkAnswerRefs(pageVm);
    if (answerRefs.length) return answerRefs.length;

    if (Array.isArray(pageVm?.allQuestionIdArray)) {
      const total = pageVm.allQuestionIdArray.reduce((count, part) => {
        return count + (Array.isArray(part?.questionDtos) ? part.questionDtos.length : 0);
      }, 0);
      if (total > 0) return total;
    }

    if (Array.isArray(pageVm?.alllQuestionTest) && pageVm.alllQuestionTest.length) {
      return pageVm.alllQuestionTest.length;
    }

    const problemNum = Number(pageVm?.examinationArr?.problemNum || 0);
    return problemNum > 0 ? problemNum : 0;
  }

  function isHomeworkExamLastQuestion(pageVm) {
    const currentQuestionIndex = Number(pageVm?.currentQuestionIndex);
    const total = getHomeworkQuestionTotal(pageVm);
    return Number.isFinite(currentQuestionIndex) && total > 0 && currentQuestionIndex >= total - 1;
  }

  function resolveHomeworkExamVmFromStore(store) {
    const pageVm = store?.state?.doHomeWorkObj?.doHomeWorkPointerObj;
    return isHomeworkExamVm(pageVm) ? pageVm : null;
  }

  function patchHomeworkExamVm(vm) {
    if (!vm || vm.__awt_exam_patched__) return;

    if (typeof vm.hijackAllEls === "function" && !vm.hijackAllEls[WRAP_MARK]) {
      vm.hijackAllEls = wrapVmMethod(vm, vm.hijackAllEls, (original) => function (...args) {
        if (state.config.blockDetectApis) {
          logWarn("detect", "homework hijackAllEls blocked");
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

    if (typeof vm.checkout === "function" && !vm.checkout[WRAP_MARK]) {
      vm.checkout = wrapVmMethod(vm, vm.checkout, (original) => function (...args) {
        if (state.config.blockDetectApis) {
          clearInterval(this.checkTimer);
          return true;
        }
        return original(...args);
      });
    }

    if (typeof vm.collectLog === "function" && !vm.collectLog[WRAP_MARK]) {
      vm.collectLog = wrapVmMethod(vm, vm.collectLog, (original) => function (...args) {
        if (state.config.blockDetectApis || state.config.blockReportApis) {
          logWarn("detect", "collectLog blocked");
          return false;
        }
        return original(...args);
      });
    }

    if (typeof vm.$alert === "function" && !vm.$alert[WRAP_MARK]) {
      vm.$alert = wrapVmMethod(vm, vm.$alert, (original) => function (message, ...rest) {
        if (state.config.blockDetectApis && /检测到异常脚本/.test(normalizeText(message))) {
          markExamDetectTriggered("homework detect alert blocked");
          return Promise.resolve(false);
        }
        return original(message, ...rest);
      });
    }

    if (typeof vm.saveLog === "function" && !vm.saveLog[WRAP_MARK]) {
      vm.saveLog = wrapVmMethod(vm, vm.saveLog, (original) => function (...args) {
        if (state.config.blockReportApis) {
          logWarn("network", "saveLog blocked");
          return Promise.resolve({
            code: 0,
            status: 200,
            rt: {},
          });
        }
        return original(...args);
      });
    }

    if (state.config.blockDetectApis) {
      safeCall(() => clearInterval(vm.checkTimer));
    }

    Object.defineProperty(vm, "__awt_exam_patched__", {
      value: true,
    });
  }

  function captureHomeworkExamContext(pageVm, captureMode = "page-vm") {
    if (!isHomeworkExamVm(pageVm)) return null;

    const rootVm = pageVm.$root || state.exam.rootVm || null;
    const store = pageVm.$store || rootVm?.$store || state.exam.store || null;
    const route = pageVm.$route || rootVm?.$route || null;
    const routeName = normalizeText(route?.name);
    const routeParams = buildExamRouteParams(route);
    const routeChanged = JSON.stringify(state.exam.routeParams || {}) !== JSON.stringify(routeParams || {});
    const captureChanged = (
      state.exam.pageVm !== pageVm
      || state.exam.captureMode !== captureMode
      || state.exam.routeName !== routeName
      || routeChanged
    );

    state.exam.rootVm = rootVm || state.exam.rootVm;
    state.exam.store = store || state.exam.store;
    state.exam.pageVm = pageVm;
    state.exam.routeName = routeName || state.exam.routeName;
    state.exam.routeParams = routeParams;
    state.exam.captureMode = captureMode;
    state.exam.captureAt = now();

    patchHomeworkExamVm(pageVm);

    if (captureChanged) {
      armExamSession({
        ...(state.exam.session && typeof state.exam.session === "object" ? state.exam.session : {}),
        host: PAGE_HOST,
        recruitId: routeParams.recruitId,
        studentExamId: routeParams.stuExamId,
        examId: routeParams.examId,
        courseId: routeParams.courseId,
        schoolId: routeParams.schoolId,
        meetCourseType: routeParams.meetCourseType,
        routeName: routeName || "doHomework",
        captureMode,
        capturedAt: now(),
      });
      logSuccess("exam", "homework exam runtime captured", {
        captureMode,
        routeName: routeName || "doHomework",
      });
    }

    return pageVm;
  }

  function findHomeworkExamVm() {
    if (state.exam.pageVm && isHomeworkExamVm(state.exam.pageVm)) {
      return captureHomeworkExamContext(state.exam.pageVm, state.exam.captureMode || "cached-page-vm");
    }

    if (state.exam.store) {
      const cachedPageVm = resolveHomeworkExamVmFromStore(state.exam.store);
      if (cachedPageVm) {
        return captureHomeworkExamContext(cachedPageVm, "store-pointer");
      }
    }

    const queue = [];
    if (document.documentElement) queue.push(document.documentElement);
    if (document.body && document.body !== document.documentElement) queue.push(document.body);

    const visited = new Set();
    for (let index = 0; index < queue.length; index += 1) {
      const node = queue[index];
      if (!node || visited.has(node)) continue;
      visited.add(node);

      const vm = node.__vue__ || node.__vueParentComponent?.proxy;
      if (vm) {
        let current = vm;
        for (let depth = 0; depth < 12 && current; depth += 1, current = current.$parent) {
          const rootVm = current.$root || null;
          const store = current.$store || rootVm?.$store || null;
          if (rootVm) state.exam.rootVm = rootVm;
          if (store) state.exam.store = store;

          const storePointer = resolveHomeworkExamVmFromStore(store);
          if (storePointer) {
            return captureHomeworkExamContext(storePointer, "store-pointer");
          }

          if (isHomeworkExamVm(current)) {
            return captureHomeworkExamContext(current, "dom-ancestor");
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

  function advanceHomeworkExam(pageVm, options) {
    const normalizedOptions = options && typeof options === "object" ? options : {};
    const force = Boolean(normalizedOptions.force);
    if (!isHomeworkExamVm(pageVm)) return false;
    const minAdvanceDelay = force ? 250 : 1200;
    if (now() - state.exam.lastAdvancedAt < minAdvanceDelay) return false;
    if (!force && !isDelayElapsed(state.exam.lastAnsweredAt)) return false;
    if (isHomeworkExamLastQuestion(pageVm)) return false;

    const currentQuestionIndex = Number(pageVm.currentQuestionIndex || 0);
    const advanced = safeCall(() => {
      pageVm.switchQuestion(1, 0);
      return true;
    }, false);
    if (!advanced) return false;

    state.exam.lastAdvancedAt = now();
    logSuccess("answer", force ? "regular exam unresolved question skipped" : "regular exam action clicked", {
      driver: "page-vm",
      currentQuestionIndex,
      nextQuestionIndex: currentQuestionIndex + 1,
    });
    return true;
  }

  function extractQuestionTextFromRoot(root) {
    const candidates = queryFirstMatchingSet([
      ".questionName .centent-pre",
      ".questionName .preStyle",
      ".questionName",
      ".examPaper_subject .subject_describe div",
      ".examPaper_subject .subject_describe p",
      ".subject_describe div",
      ".subject_describe p",
      ".smallStem_describe p",
      ".smallStem_describe",
      ".question-title",
      ".quest-title",
      ".que-title",
      ".title-box",
      ".topic-title",
    ], root).map((node) => normalizeQuestionText(getNodeText(node))).filter(Boolean);

    if (candidates.length) {
      return candidates.sort((left, right) => right.length - left.length)[0];
    }
    return normalizeQuestionText(getNodeText(root));
  }

  function readExamOptions(root) {
    const optionNodes = queryFirstMatchingSet([
      ".radio-view li",
      ".checkbox-view li",
      ".checkbox-views label",
      ".checkbox-views li",
      ".subject_node .nodeLab",
      ".option-list li",
      ".answer-list li",
      ".question-option li",
      ".options li",
    ], root);

    return optionNodes.map((node, index) => {
      const labelNode = queryFirstBySelectors([
        ".letterSortNum",
        ".sort",
        ".prefix",
        ".option-prefix",
        ".nodeLab-sort",
        ".option-index",
      ], node);
      const label = normalizeText(getNodeText(labelNode) || getLetterByIndex(index)).toUpperCase().slice(0, 1) || getLetterByIndex(index);
      const rawText = getNodeText(node);
      const text = normalizeAnswerText(rawText) || rawText || label;
      const hint = [
        String(node.className || ""),
        String(node.getAttribute?.("class") || ""),
        String(node.getAttribute?.("data-state") || ""),
        String(node.getAttribute?.("data-result") || ""),
        String(node.getAttribute?.("aria-checked") || ""),
        String(node.getAttribute?.("aria-current") || ""),
      ].join(" ");

      return {
        element: node,
        label,
        text,
        normalizedText: normalizeAnswerText(text) || label,
        selected: /(^|[^a-z])(checked|selected|active|choose|cur|on)([^a-z]|$)/i.test(hint) || String(node.getAttribute?.("aria-checked") || "").toLowerCase() === "true",
        correct: /(^|[^a-z])(correct|right|success|standard|answer)([^a-z]|$)/i.test(hint) || String(node.getAttribute?.("data-result") || "") === "1",
      };
    });
  }

  function extractAnswerTokensFromText(text, options) {
    const normalized = normalizeText(text);
    if (!normalized) return [];

    const letterMatch = normalized.match(/正确答案[\s:：]*([A-H](?:[\s,，、/]+[A-H])*)/i);
    if (letterMatch) {
      const letters = [...new Set((letterMatch[1].match(/[A-H]/gi) || []).map((item) => item.toUpperCase()))];
      const answers = options
        .filter((option) => letters.includes(option.label))
        .map((option) => option.text);
      if (answers.length) return answers;
    }

    if (/正确答案|参考答案|答案解析/i.test(normalized)) {
      const answers = options
        .filter((option) => option.normalizedText && normalized.includes(option.normalizedText))
        .map((option) => option.text);
      if (answers.length) return [...new Set(answers)];
    }

    return [];
  }

  function extractExplicitAnswers(root, options) {
    const directMatches = options.filter((option) => option.correct).map((option) => option.text);
    if (directMatches.length) return [...new Set(directMatches)];

    const answerNodes = queryAllBySelectors([
      ".answer",
      ".correct-answer",
      ".right-answer",
      ".analysis",
      ".answer-analysis",
      ".exam_analysis",
      ".analysis-box",
      ".analysis-text",
      ".result-answer",
    ], root);

    for (const node of answerNodes) {
      const answers = extractAnswerTokensFromText(getNodeText(node), options);
      if (answers.length) return answers;
    }

    return extractAnswerTokensFromText(getNodeText(root), options);
  }

  function readCurrentExamQuestion() {
    const root = queryFirstBySelectors([
      ".ques-detail",
      ".examPaper_subject",
      ".question-detail",
      ".question-box",
      ".topic-box",
      ".subject_box",
      ".exam-topic",
    ], document, true);
    if (!root) return null;

    const options = readExamOptions(root);
    const textInputs = queryAllBySelectors([
      "textarea",
      "input[type='text']",
      "input:not([type])",
    ], root).filter((element) => isElementVisible(element) && !isActionableElementDisabled(element));

    const questionText = extractQuestionTextFromRoot(root);
    const signature = buildExamQuestionSignature(questionText, options.map((option) => option.text));
    const isMulti = options.length > 1 && (
      root.querySelector("input[type='checkbox']") ||
      options.some((option) => /checkbox|multi/i.test(String(option.element.className || "")))
    );
    const explicitAnswers = extractExplicitAnswers(root, options);

    return {
      root,
      text: questionText,
      signature,
      options,
      textInputs,
      isMulti,
      explicitAnswers,
    };
  }

  function resolveQuestionTargets(questionInfo) {
    const explicitAnswers = questionInfo.explicitAnswers || [];
    if (explicitAnswers.length) {
      storeExamAnswer(questionInfo, explicitAnswers, "page");
      return {
        answers: explicitAnswers,
        source: "page",
        fallback: false,
      };
    }

    const bankAnswers = lookupExamAnswer(questionInfo);
    if (bankAnswers.length) {
      return {
        answers: bankAnswers,
        source: "bank",
        fallback: false,
      };
    }

    return {
      answers: [],
      source: "unresolved",
      fallback: false,
      unresolved: true,
    };
  }

  function matchTargetOptions(questionInfo, answers) {
    const normalizedTargets = answers.map((item) => normalizeAnswerText(item) || String(item || "").trim().toUpperCase()).filter(Boolean);
    return questionInfo.options.filter((option) => (
      normalizedTargets.includes(option.normalizedText)
      || normalizedTargets.includes(option.label)
    ));
  }

  function fillExamTextInputs(questionInfo, answers = []) {
    if (!questionInfo.textInputs.length || !answers.length) return false;
    const normalizedAnswers = answers.map((item) => normalizeText(item)).filter(Boolean);
    if (!normalizedAnswers.length) return false;
    let changed = false;
    for (let index = 0; index < questionInfo.textInputs.length; index += 1) {
      const input = questionInfo.textInputs[index];
      const nextValue = normalizedAnswers[Math.min(index, normalizedAnswers.length - 1)] || normalizedAnswers[0];
      if (!nextValue) continue;
      if (String(input.value || "").trim() === nextValue) continue;
      changed = safeCall(() => setNativeInputValue(input, nextValue), changed) || changed;
    }
    return changed;
  }

  function noteExamQuestionUnresolved(questionInfo, reason = "missing-answer") {
    if (!questionInfo?.signature) return false;
    const shouldLog = (
      state.exam.unresolvedSignature !== questionInfo.signature
      || isDelayElapsed(state.exam.lastUnresolvedAt, now(), 15000)
    );
    state.exam.unresolvedSignature = questionInfo.signature;
    state.exam.lastUnresolvedAt = now();
    if (shouldLog) {
      logWarn("answer", "regular exam unresolved, waiting for explicit answer", {
        question: questionInfo.text,
        reason,
      });
    }
    return false;
  }

  function answerCurrentExamQuestion(questionInfo) {
    if (!questionInfo || !questionInfo.signature) return false;
    if (state.exam.lastSignature === questionInfo.signature && !isDelayElapsed(state.exam.lastAnsweredAt, now(), 1200)) {
      return false;
    }
    if (!isDelayElapsed(state.exam.lastAnsweredAt)) {
      return false;
    }

    const resolution = resolveQuestionTargets(questionInfo);
    if (!resolution.answers.length) {
      return noteExamQuestionUnresolved(questionInfo, resolution.source || "missing-answer");
    }

    const targetOptions = matchTargetOptions(questionInfo, resolution.answers);
    let changed = false;

    if (targetOptions.length) {
      for (const option of targetOptions) {
        if (option.selected) continue;
        changed = clickElement(option.element) || changed;
      }
    } else if (questionInfo.textInputs.length) {
      changed = fillExamTextInputs(questionInfo, resolution.answers) || changed;
    } else {
      return noteExamQuestionUnresolved(questionInfo, "target-mismatch");
    }

    if (!changed) return false;

    state.exam.lastSignature = questionInfo.signature;
    state.exam.lastAnsweredAt = now();
    state.exam.unresolvedSignature = "";
    state.exam.lastUnresolvedAt = 0;
    logSuccess("answer", "regular exam question answered", {
      question: questionInfo.text,
      source: resolution.source,
    });
    return true;
  }

  function findExamActionButton(patterns) {
    const nodes = queryAllBySelectors([
      "button",
      "a",
      "[role='button']",
      ".el-button",
      ".ant-btn",
      ".next-topic",
      ".submit",
      ".btn",
      "div[class*='btn']",
      "span[class*='btn']",
    ]);

    return nodes.find((node) => {
      if (!isElementVisible(node) || isActionableElementDisabled(node)) return false;
      const text = getNodeText(node);
      if (!text || text.length > 24) return false;
      return patterns.some((pattern) => pattern.test(text));
    }) || null;
  }

  function clickExamAction(patterns, message) {
    const button = findExamActionButton(patterns);
    if (!button) return false;
    if (!clickElement(button)) return false;
    state.exam.lastAdvancedAt = now();
    if (message) {
      logSuccess("answer", message, {
        text: getNodeText(button),
      });
    }
    return true;
  }

  function tryStartExamFlow() {
    if (now() - state.exam.lastAdvancedAt < 1500) return false;
    return clickExamAction([
      /开始答题/i,
      /继续答题/i,
      /进入考试/i,
      /进入作业/i,
      /开始测试/i,
      /去答题/i,
      /我要作答/i,
    ], "regular exam start clicked");
  }

  function tryAdvanceExamFlow(pageVm, questionInfo, options) {
    const normalizedOptions = options && typeof options === "object" ? options : {};
    const force = Boolean(normalizedOptions.force);
    const minAdvanceDelay = force ? 250 : 1200;
    if (now() - state.exam.lastAdvancedAt < minAdvanceDelay) return false;
    if (!force && !isDelayElapsed(state.exam.lastAnsweredAt)) return false;
    if (!force && questionInfo?.signature && state.exam.unresolvedSignature === questionInfo.signature) return false;

    if (pageVm && advanceHomeworkExam(pageVm, normalizedOptions)) {
      return true;
    }

    return clickExamAction([
      /保存并下一题/i,
      /^下一题$/i,
      /下一页/i,
      /下一步/i,
    ], force ? "regular exam unresolved question skipped" : "regular exam action clicked");
  }

  function hasManualSubmitButton() {
    return Boolean(findExamActionButton([
      /提交答案/i,
      /提交试卷/i,
      /确认交卷/i,
      /^交卷$/i,
      /完成答题/i,
      /保存并提交/i,
      /^提交$/i,
    ]));
  }

  function restoreExamAnsweringMode(questionInfo) {
    if (state.exam.recoveredThisPage) return false;
    if (!questionInfo || !questionInfo.signature) return false;

    state.exam.recoveredThisPage = true;
    armExamSession({
      ...(state.exam.session && typeof state.exam.session === "object" ? state.exam.session : {}),
      host: PAGE_HOST,
      routeName: state.exam.routeName || "doHomework",
      captureMode: state.exam.captureMode || "fallback-dom",
      recoverMode: "exam-page-runtime",
      recoveredAt: now(),
    });
    logSuccess("exam", "regular exam runtime recovered", {
      signature: questionInfo.signature,
      question: questionInfo.text,
    });
    return true;
  }

  function handleExamPageRuntime() {
    if (!state.config.autoQuiz) {
      updateUi("平时测试页待命");
      return false;
    }

    const pageVm = findHomeworkExamVm();

    if (tryStartExamFlow()) {
      updateUi("已进入平时测试答题页");
      return true;
    }

    const questionInfo = readCurrentExamQuestion();
    if (!questionInfo || (!questionInfo.options.length && !questionInfo.textInputs.length)) {
      updateUi(pageVm ? "平时测试页已接管，等待题目加载" : "等待平时测试题目加载");
      return false;
    }

    if (restoreExamAnsweringMode(questionInfo)) {
      updateUi("已恢复平时测试自动答题");
    }

    if (questionInfo.explicitAnswers.length) {
      storeExamAnswer(questionInfo, questionInfo.explicitAnswers, "page");
    }

    if (answerCurrentExamQuestion(questionInfo)) {
      updateUi("平时测试已自动作答");
      return true;
    }

    if (state.exam.unresolvedSignature === questionInfo.signature) {
      if (tryAdvanceExamFlow(pageVm, questionInfo, { force: true })) {
        updateUi("当前平时测试题未命中答案，已自动跳过");
        return true;
      }
      updateUi("当前平时测试题未命中答案，等待下一步条件满足");
      return false;
    }

    if (tryAdvanceExamFlow(pageVm, questionInfo)) {
      updateUi("平时测试已进入下一步");
      return true;
    }

    if (hasManualSubmitButton()) {
      updateUi("已到最后一题，等待手动交卷");
      return false;
    }

    updateUi("平时测试运行中");
    return false;
  }

  function maybeLaunchCurrentLessonExam(vm) {
    if (!isStudyPage() || !state.config.autoQuiz || !state.config.autoOpenRegularExam) return false;
    if (vm.testDialog || vm.imgDialog) return false;
    if (!isRecordedProgressComplete(vm)) return false;

    const currentLesson = findCurrentLesson(vm);
    const studentExamDto = currentLesson?.studentExamDto;
    if (!isStudentExamPending(studentExamDto)) return false;

    const launchKey = [
      normalizeVideoId(studentExamDto?.id) || "studentExam",
      normalizeVideoId(studentExamDto?.exam?.id) || normalizeVideoId(vm?.recruitId) || "recruit",
    ].join(":");
    if (state.exam.lastLaunchKey === launchKey && now() - state.exam.lastLaunchAt < 120000) {
      return true;
    }

    state.exam.lastLaunchKey = launchKey;
    state.exam.lastLaunchAt = now();
    armExamSession(buildExamSessionPayload(vm, currentLesson));
    logSuccess("exam", "launch regular exam", {
      lessonId: currentLesson?.id,
      studentExamId: studentExamDto?.id,
      examUrl: studentExamDto?.examUrl,
    });
    toast("当前节存在平时测试，已自动打开");

    if (typeof vm.chapterExamEntry === "function") {
      safeCall(() => vm.chapterExamEntry(currentLesson));
      return true;
    }
    if (typeof vm.judgeLookAnswer === "function") {
      safeCall(() => vm.judgeLookAnswer(currentLesson));
      return true;
    }
    return false;
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

  function observeCurrentVideo(vm, timestamp = now()) {
    const currentVideoId = resolveCurrentVideoId(vm);
    if (!currentVideoId) return null;

    if (state.currentVideoId !== currentVideoId) {
      const previousVideoId = state.currentVideoId;
      state.currentVideoId = currentVideoId;
      state.currentVideoChangedAt = timestamp;
      state.lastReplayVideoId = null;
      state.lastReplayAt = 0;
      state.progressSync.videoId = currentVideoId;
      state.progressSync.currentTime = 0;
      state.progressSync.totalStudyTime = Number(vm?.totalStudyTime || 0);
      state.progressSync.observedAt = 0;
      if (state.lastAdvanceTargetId === currentVideoId) {
        state.lastAdvanceTargetId = null;
      }
      logDebug("player", "observed current video change", {
        previousVideoId,
        currentVideoId,
      });
    }

    return currentVideoId;
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

  function findFirstPendingVideoEntry(vm, excludeVideoId = null) {
    const entries = collectVideoEntries(vm);
    if (!entries.length) return null;

    const excludedId = normalizeVideoId(excludeVideoId);
    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index];
      if (excludedId && entry.videoId === excludedId) continue;
      if (isLessonPendingForAdvance(entry.progressTarget)) {
        return entry;
      }
    }
    return null;
  }

  function isLessonPendingForAdvance(lesson) {
    if (!lesson) return false;
    const studied = Number(lesson.isStudiedLesson || 0);
    const percentage = Number(lesson.percentage || 0);
    return studied === 0 || (studied === 2 && percentage <= 50);
  }

  function findNextPendingVideoEntry(vm, currentVideoId = resolveCurrentVideoId(vm)) {
    return findFirstPendingVideoEntry(vm, currentVideoId);
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

  function shouldDelayReplay(currentVideoId, timestamp = now()) {
    const videoId = normalizeVideoId(currentVideoId);
    if (!videoId) return false;
    if (state.advanceCooldownUntil && timestamp < state.advanceCooldownUntil) {
      return true;
    }
    if (
      state.currentVideoId === videoId
      && state.currentVideoChangedAt
      && timestamp - state.currentVideoChangedAt < 3000
    ) {
      return true;
    }
    return false;
  }

  function markAdvanceAttempt(currentVideoId, targetVideoId, cooldownMs = 4000, timestamp = now()) {
    state.lastVideoId = normalizeVideoId(currentVideoId);
    state.lastAdvanceTargetId = normalizeVideoId(targetVideoId);
    state.lastAdvanceAt = timestamp;
    state.advanceCooldownUntil = timestamp + cooldownMs;
    state.lastReplayVideoId = null;
    state.lastReplayAt = 0;
  }

  function retryCurrentVideoIfNeeded(vm, currentVideoId = resolveCurrentVideoId(vm)) {
    const video = getPlayableVideo();
    if (!currentVideoId || shouldDelayReplay(currentVideoId)) return false;
    if (!isVideoNaturallyFinished(video)) return false;
    if (isRecordedProgressComplete(vm)) return false;
    if (state.lastReplayVideoId === currentVideoId && now() - state.lastReplayAt < 3000) return true;

    state.lastReplayVideoId = currentVideoId;
    state.lastReplayAt = now();
    logWarn("player", "video ended but recorded progress is incomplete, retry from start", {
      videoId: currentVideoId,
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
        playResult.catch(() => { });
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

  function jumpToNextPendingVideo(vm, reason, currentVideoId = resolveCurrentVideoId(vm)) {
    const nextPendingEntry = findNextPendingVideoEntry(vm, currentVideoId);
    if (!nextPendingEntry) return false;
    if (hasRecentAdvanceAttempt(currentVideoId, nextPendingEntry.videoId)) {
      return true;
    }
    if (!safeCall(() => jumpToVideoEntry(vm, nextPendingEntry), false)) {
      return false;
    }

    markAdvanceAttempt(currentVideoId, nextPendingEntry.videoId, 4500);
    logSuccess("player", "jump to first unfinished video", {
      fromVideoId: currentVideoId,
      toVideoId: nextPendingEntry.videoId,
      reason,
    });
    toast("当前视频已完成，已跳到列表中第一个未完成视频");
    updateUi("已跳到列表中第一个未完成视频");
    return true;
  }

  function advanceVideo(vm) {
    const currentVideoId = observeCurrentVideo(vm);
    if (vm.testDialog || vm.imgDialog) return;
    if (retryCurrentVideoIfNeeded(vm, currentVideoId)) return;
    if (isRecordedProgressComplete(vm) && jumpToNextPendingVideo(vm, "recorded progress completed", currentVideoId)) return;
    if (!shouldAdvance(vm)) return;

    if (state.lastVideoId === currentVideoId && !state.lastAdvanceTargetId && now() - state.lastAdvanceAt < 3000) {
      return;
    }

    markAdvanceAttempt(currentVideoId, null, 3000);
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
    if (scope === "player" && /jump to first unfinished video/i.test(message)) {
      return "当前视频已完成，已跳到列表中第一个未完成视频";
    }
    if (scope === "player" && /advance to next video/i.test(message)) {
      return "当前视频已完成，已切换到下一节";
    }
    if (scope === "detect" && /notTrustScript blocked/i.test(message)) {
      return null;
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
    if (scope === "exam" && /launch regular exam/i.test(message)) {
      return "当前节存在平时测试，已自动打开";
    }
    if (scope === "exam" && /homework exam runtime captured/i.test(message)) {
      return "平时测试页运行时已接管";
    }
    if (scope === "exam" && /regular exam runtime recovered/i.test(message)) {
      return "已恢复平时测试自动答题";
    }
    if (scope === "answer" && /regular exam question answered/i.test(message)) {
      return "已自动作答平时测试当前题目";
    }
    if (scope === "answer" && /regular exam unresolved, waiting for explicit answer/i.test(message)) {
      return null;
    }
    if (scope === "answer" && /regular exam unresolved question skipped/i.test(message)) {
      return "当前平时测试题未命中答案，已自动跳过";
    }
    if (scope === "answer" && /regular exam start clicked/i.test(message)) {
      return "已进入平时测试答题页";
    }
    if (scope === "answer" && /regular exam action clicked/i.test(message)) {
      return "平时测试已自动进入下一步";
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
      return null;
    }
    if (scope === "progress" && /page visible snapshot captured/i.test(message)) {
      return null;
    }
    if (level === "error") {
      return "脚本运行出现异常，请查看控制台日志";
    }
    if (level === "warn") {
      return null;
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
    state.config.autoOpenRegularExam = await gmGetValue(STORAGE_KEYS.autoOpenRegularExam, true);
    state.config.blockReportApis = await gmGetValue(STORAGE_KEYS.blockReportApis, true);
    state.config.blockDetectApis = await gmGetValue(STORAGE_KEYS.blockDetectApis, true);
    state.config.antiAntiDebug = await gmGetValue(STORAGE_KEYS.antiAntiDebug, true);
    const answerBank = await gmGetValue(STORAGE_KEYS.examAnswerBank, {});
    state.exam.answerBank = answerBank && typeof answerBank === "object" ? answerBank : {};
    state.exam.session = await gmGetValue(STORAGE_KEYS.examSession, null);
    logSuccess("config", "loaded config", { ...state.config });
  }

  function getConfigLabel(key) {
    if (key === "autoQuiz") return "自动答题";
    if (key === "autoOpenRegularExam") return "自动打开平时测试";
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
    gmRegisterMenuCommandCompat(`自动打开平时测试: ${state.config.autoOpenRegularExam ? "开" : "关"}`, () => {
      void toggleConfig("autoOpenRegularExam");
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
    installAntiDebugGuards();

    if (isExamPage()) {
      findHomeworkExamVm();
      handleExamPageRuntime();
      return;
    }

    const vm = findStudyVm();
    if (!vm) {
      updateUi("等待学习页初始化");
      logOnce("vm-wait", "debug", "vm", "waiting for study page initialization");
      return;
    }

    patchStudyVm(vm);
    closeTransientDialogs(vm);
    ensureVideoState(vm);
    syncProgressFromPlayback(vm, "runtimeTick");

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

    if (maybeLaunchCurrentLessonExam(vm)) {
      updateUi("当前节平时测试已打开");
      return;
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
    if (isStudyPage()) {
      startVmPatchProbe();
    } else if (isExamPage()) {
      startExamVmPatchProbe();
    }

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
