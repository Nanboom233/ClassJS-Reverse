// ==UserScript==
// @name         2026 智慧树自动浇水施肥开花结果 - Enhanced
// @namespace    auto-wisdom-tree
// @version      0.3.5
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
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_closeTab
// @connect      *
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";

  const PAGE = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const PageResponse = PAGE.Response || Response;
  const PageEvent = PAGE.Event || Event;
  const PAGE_HOST = String(PAGE.location?.host || location.host || "").toLowerCase();
  const ANSWER_INTERVAL_MS = 2000;
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
      autoCloseCompletedExam: true,
      autoSubmitCompletedExam: false,
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
    halted: false,
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
      lastSnapshot: null,
    },
    serverProgress: {
      initialized: false,
      byLessonId: Object.create(null),
      pendingPayload: null,
      refreshTimerId: 0,
      pendingVideoId: null,
      pendingLessonId: null,
      pendingTargetStudyTime: 0,
      pendingAttempts: 0,
      pendingAt: 0,
      pendingReason: "",
      lastConfirmedVideoId: null,
      lastConfirmedAt: 0,
    },
    answerFlow: {
      lastPopupAnswerAt: 0,
    },
    exam: {
      answerBank: Object.create(null),
      completionCache: Object.create(null),
      completionCacheReadAt: Object.create(null),
      completionSyncPromises: Object.create(null),
      session: null,
      lastSessionSyncAt: 0,
      sessionSyncPromise: null,
      lastSessionHeartbeatAt: 0,
      lifecycleHooksInstalled: false,
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
      launchHandles: Object.create(null),
      launchedSessionExamKeys: Object.create(null),
      closeRequestedAt: 0,
      closeRequestedReason: "",
      closeRequestStudentExamId: "",
      closeAttemptCount: 0,
      lastCloseAttemptAt: 0,
      pendingSave: { kind: "", signature: "", startedAt: 0 },
      llm: {
        apiBaseUrl: "https://generativelanguage.googleapis.com/v1beta",
        apiKey: "",
        model: "",
        requestKey: "",
        requestState: "",
        requestError: "",
        requestPromise: null,
        requestedAt: 0,
        resolvedAt: 0,
      },
    },
  };

  const STORAGE_KEYS = {
    autoQuiz: "awt:autoQuiz",
    autoOpenRegularExam: "awt:autoOpenRegularExam",
    autoCloseCompletedExam: "awt:autoCloseCompletedExam",
    autoSubmitCompletedExam: "awt:autoSubmitCompletedExam",
    blockReportApis: "awt:blockReportApis",
    blockDetectApis: "awt:blockDetectApis",
    antiAntiDebug: "awt:antiAntiDebug",
    examCompletionPrefix: "awt:examCompletion:",
    examSession: "awt:examSession",
    examLlmApiBaseUrl: "awt:examLlmApiBaseUrl",
    examLlmApiKey: "awt:examLlmApiKey",
    examLlmModel: "awt:examLlmModel",
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

  const STUDY_PROGRESS_QUERY_RE = /\/learning\/queryStuyInfo/i; // (sic) platform typo: queryStuyInfo
  const STUDY_SAVE_CACHE_RE = /\/learning\/saveCacheIntervalTimeV2/i;
  const STUDY_SAVE_DB_RE = /\/learning\/saveDatabaseIntervalTimeV2/i;

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

  function getSession() {
    return state.exam.session && typeof state.exam.session === "object" ? state.exam.session : {};
  }

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

  function gmGetValueSync(key, defaultValue) {
    try {
      if (typeof GM_getValue === "function") {
        return GM_getValue(key, defaultValue);
      }
    } catch (error) {
      logWarn("gm", `GM getValue sync failed: ${key}`, error);
    }
    return defaultValue;
  }

  function gmSetValueSync(key, value) {
    try {
      if (typeof GM_setValue === "function") {
        GM_setValue(key, value);
        return true;
      }
    } catch (error) {
      logWarn("gm", `GM setValue sync failed: ${key}`, error);
    }
    return false;
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

  function gmXmlhttpRequestCompat(details) {
    return new Promise((resolve, reject) => {
      try {
        if (typeof GM_xmlhttpRequest === "function") {
          GM_xmlhttpRequest({
            ...details,
            onload: (response) => resolve(response),
            onerror: (error) => reject(error instanceof Error ? error : new Error("GM_xmlhttpRequest failed")),
            ontimeout: () => reject(new Error("GM_xmlhttpRequest timeout")),
            onabort: () => reject(new Error("GM_xmlhttpRequest aborted")),
          });
          return;
        }
        if (typeof GM !== "undefined" && GM && typeof GM.xmlHttpRequest === "function") {
          Promise.resolve(GM.xmlHttpRequest(details)).then(resolve, reject);
          return;
        }
      } catch (error) {
        reject(error);
        return;
      }
      reject(new Error("GM_xmlhttpRequest unavailable"));
    });
  }

  function gmOpenInTabCompat(url, options = {}) {
    const normalizedUrl = resolveExamLaunchUrl(url);
    if (!normalizedUrl) return null;

    const normalizedOptions = {
      active: false,
      insert: true,
      setParent: true,
      ...options,
    };

    try {
      if (typeof GM !== "undefined" && GM && typeof GM.openInTab === "function") {
        return GM.openInTab(normalizedUrl, normalizedOptions);
      }
      if (typeof GM_openInTab === "function") {
        return GM_openInTab(normalizedUrl, !normalizedOptions.active);
      }
    } catch (error) {
      logWarn("exam", "regular exam extension tab open failed", {
        url: normalizedUrl,
        error: normalizeText(error?.message || error),
      });
      return null;
    }
    return null;
  }

  function getPromptCompat() {
    if (PAGE && typeof PAGE.prompt === "function") return PAGE.prompt.bind(PAGE);
    if (typeof prompt === "function") return prompt;
    return null;
  }

  function promptConfigValue(message, defaultValue = "") {
    const promptFn = getPromptCompat();
    if (typeof promptFn !== "function") {
      logWarn("config", "prompt unavailable");
      return null;
    }
    return promptFn(message, defaultValue);
  }

  function maskSecret(value) {
    const text = normalizeText(value);
    if (!text) return "未配置";
    if (text.length <= 8) return `${text.slice(0, 1)}***${text.slice(-1)}`;
    return `${text.slice(0, 4)}***${text.slice(-4)}`;
  }

  function shortenHost(value) {
    const normalized = normalizeText(value);
    if (!normalized) return "";
    try {
      return new URL(normalized).host || normalized;
    } catch (_error) {
      return normalized.replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
    }
  }

  function normalizeExamLlmApiBaseUrl(value) {
    const normalized = normalizeText(value).replace(/\/+$/, "");
    if (!normalized) return "";
    return normalized.replace(/\/models\/[^/]*(:generateContent)?(\?.*)?$/i, "");
  }

  function buildExamLlmApiEndpoint(baseUrl, model, apiKey) {
    const normalized = normalizeExamLlmApiBaseUrl(baseUrl);
    if (!normalized || !model) return "";
    const url = `${normalized}/models/${encodeURIComponent(model)}:generateContent`;
    return apiKey ? `${url}?key=${encodeURIComponent(apiKey)}` : url;
  }

  function isExamLlmConfigured() {
    return Boolean(
      normalizeExamLlmApiBaseUrl(state.exam.llm.apiBaseUrl)
      && normalizeText(state.exam.llm.apiKey)
      && normalizeText(state.exam.llm.model)
    );
  }

  function resetExamLlmRequestState(clearAnswers = false) {
    state.exam.llm.requestKey = "";
    state.exam.llm.requestState = "";
    state.exam.llm.requestError = "";
    state.exam.llm.requestPromise = null;
    state.exam.llm.requestedAt = 0;
    state.exam.llm.resolvedAt = 0;
    state.exam.unresolvedSignature = "";
    state.exam.lastUnresolvedAt = 0;
    if (clearAnswers) {
      state.exam.answerBank = Object.create(null);
    }
  }

  async function saveExamLlmConfigField(storageKey, stateField, value) {
    state.exam.llm[stateField] = value;
    await gmSetValue(STORAGE_KEYS[storageKey], value);
    resetExamLlmRequestState(true);
    updateUi("考试外部答题配置已更新");
    toast("考试外部答题配置已更新");
    logSuccess("config", `updated ${storageKey}`, storageKey === "examLlmApiKey" ? maskSecret(value) : value);
  }

  async function configureExamLlmApiBaseUrl() {
    const defaultUrl = "https://generativelanguage.googleapis.com/v1beta";
    const currentValue = normalizeExamLlmApiBaseUrl(state.exam.llm.apiBaseUrl) || defaultUrl;
    const nextValue = promptConfigValue(
      "设置考试外部答题 Gemini API Base URL。\n例如 https://generativelanguage.googleapis.com/v1beta 。\n留空表示恢复默认 Gemini 地址。",
      currentValue,
    );
    if (nextValue === null) return;
    const normalized = normalizeExamLlmApiBaseUrl(nextValue) || defaultUrl;
    await saveExamLlmConfigField("examLlmApiBaseUrl", "apiBaseUrl", normalized);
  }

  async function configureExamLlmApiKey() {
    const nextValue = promptConfigValue(
      `设置考试外部答题 API Key。\n当前：${maskSecret(state.exam.llm.apiKey)}\n留空表示清空。`,
      "",
    );
    if (nextValue === null) return;
    await saveExamLlmConfigField("examLlmApiKey", "apiKey", normalizeText(nextValue));
  }

  async function configureExamLlmModel() {
    const nextValue = promptConfigValue(
      "设置考试外部答题 Model。\n例如 gemini-3.1-pro-preview、gemini-2.5-flash-preview-05-20。\n留空表示清空。",
      normalizeText(state.exam.llm.model),
    );
    if (nextValue === null) return;
    await saveExamLlmConfigField("examLlmModel", "model", normalizeText(nextValue));
  }

  function getConfigSummary() {
    return [
      `自动答题:${state.config.autoQuiz ? "开" : "关"}`,
      `自动开测:${state.config.autoOpenRegularExam ? "开" : "关"}`,
      `自动关测:${state.config.autoCloseCompletedExam ? "开" : "关"}`,
      `自动提交:${state.config.autoSubmitCompletedExam ? "开" : "关"}`,
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

  function isDoExaminationRoute() {
    const href = normalizeText(PAGE.location?.href || location.href || "");
    return /\/doexamination\//i.test(href) || normalizeText(state.exam.routeName) === "doExamination";
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

  function toPlainText(value) {
    const raw = String(value || "");
    if (!raw) return "";
    if (!/[<&]/.test(raw)) {
      return normalizeText(raw);
    }

    if (typeof document !== "undefined" && document && typeof document.createElement === "function") {
      const node = document.createElement("div");
      node.innerHTML = raw
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<\/div>/gi, "\n");
      return normalizeText(node.textContent || node.innerText || "");
    }

    return normalizeText(
      raw
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<\/div>/gi, "\n")
        .replace(/<[^>]+>/g, " "),
    );
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

  function buildExamQuestionSignatures(questionText, options = [], aliases = []) {
    const keys = [
      buildExamQuestionSignature(questionText, options),
      ...aliases.map((item) => buildExamQuestionSignature(item, options)),
    ];
    return [...new Set(keys.map((item) => normalizeText(item)).filter(Boolean))];
  }

  function collectQuestionInfoSignatureKeys(questionInfo) {
    if (!questionInfo || typeof questionInfo !== "object") return [];
    const optionTexts = Array.isArray(questionInfo.options)
      ? questionInfo.options.map((option) => option?.text).filter(Boolean)
      : [];
    const aliasTexts = Array.isArray(questionInfo.aliasTexts) ? questionInfo.aliasTexts : [];
    const signatures = [
      normalizeText(questionInfo.signature),
      ...(Array.isArray(questionInfo.aliases) ? questionInfo.aliases : []),
      ...buildExamQuestionSignatures(questionInfo.text || "", optionTexts, aliasTexts),
    ];
    return [...new Set(signatures.map((item) => normalizeText(item)).filter(Boolean))];
  }

  function isDelayElapsed(lastAt, timestamp = now(), interval = ANSWER_INTERVAL_MS) {
    return !lastAt || timestamp - lastAt >= interval;
  }

  function appendNormalizedAnswers(target, value) {
    if (Array.isArray(value)) {
      for (const item of value) appendNormalizedAnswers(target, item);
      return;
    }

    const normalized = normalizeText(value);
    if (!normalized) return;

    const compactLetters = normalized.toUpperCase();
    if (/^[A-H]+$/.test(compactLetters) && compactLetters.length > 1) {
      for (const letter of compactLetters.split("")) {
        if (!target.includes(letter)) target.push(letter);
      }
      return;
    }

    const letterList = compactLetters.match(/^[A-H](?:[\s,，、/]+[A-H])+$/i);
    if (letterList) {
      const letters = compactLetters.match(/[A-H]/g) || [];
      for (const letter of letters) {
        if (!target.includes(letter)) target.push(letter);
      }
      return;
    }

    const normalizedAnswer = normalizeAnswerText(normalized) || compactLetters;
    if (!target.includes(normalizedAnswer)) {
      target.push(normalizedAnswer);
    }
  }

  function normalizeResolvedAnswers(values) {
    const answers = [];
    appendNormalizedAnswers(answers, values);
    return answers;
  }

  function storeExamAnswer(questionInfo, answers) {
    const normalizedAnswers = normalizeResolvedAnswers(answers);
    if (!normalizedAnswers.length) return false;
    const keys = collectQuestionInfoSignatureKeys(questionInfo);
    if (!keys.length) return false;

    for (const key of keys) {
      state.exam.answerBank[key] = [...normalizedAnswers];
    }
    return true;
  }

  function lookupExamAnswer(questionInfo) {
    const keys = collectQuestionInfoSignatureKeys(questionInfo);
    for (const key of keys) {
      const answers = state.exam.answerBank[key];
      if (Array.isArray(answers) && answers.length) {
        return [...answers];
      }
    }
    return [];
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

  function parseJsonSafe(text) {
    if (typeof text !== "string" || !text) return null;
    try {
      return JSON.parse(text);
    } catch (_error) {
      return null;
    }
  }

  function observeStudyApiResponse(url, bodyText) {
    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) return;

    const payload = parseJsonSafe(bodyText);
    if (!payload || typeof payload !== "object") return;
    if (state.halted) return;

    if (STUDY_PROGRESS_QUERY_RE.test(normalizedUrl)) {
      const vm = findStudyVm();
      if (!vm) {
        state.serverProgress.pendingPayload = payload;
        return;
      }
      applyServerProgressSnapshot(vm, payload, "queryStuyInfo");
      return;
    }

    if (payload.code === -12 && STUDY_SAVE_DB_RE.test(normalizedUrl)) {
      haltScriptForSliderVerification(payload.message || "需要弹出滑块验证");
      return;
    }

    if (payload.code !== 0) return;
    if (!STUDY_SAVE_CACHE_RE.test(normalizedUrl) && !STUDY_SAVE_DB_RE.test(normalizedUrl)) {
      return;
    }

    const vm = findStudyVm();
    if (!vm) return;

    scheduleServerProgressRefresh(
      vm,
      STUDY_SAVE_DB_RE.test(normalizedUrl) ? "saveDatabaseIntervalTimeV2" : "saveCacheIntervalTimeV2",
      {
        delayMs: STUDY_SAVE_DB_RE.test(normalizedUrl) ? 900 : 600,
        targetStudyTime: Number(vm.totalStudyTime || 0),
      },
    );
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
        return originalFetch(...args).then((response) => {
          try {
            const clone = response && typeof response.clone === "function" ? response.clone() : null;
            if (clone && typeof clone.text === "function") {
              void clone.text().then((text) => {
                observeStudyApiResponse(response.url || url, text);
              }).catch(() => { });
            }
          } catch (_error) { }
          return response;
        });
      }
      const body = buildMockBody(url, kind);
      logDebug("network", `fetch blocked [${kind}]`, url);
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
        if (!this.__awt_progress_observer__) {
          this.__awt_progress_observer__ = true;
          const inspectResponse = () => {
            const responseText = typeof this.responseText === "string"
              ? this.responseText
              : typeof this.response === "string"
                ? this.response
                : "";
            observeStudyApiResponse(this.__awt_url || "", responseText);
          };
          if (typeof this.addEventListener === "function") {
            this.addEventListener("loadend", inspectResponse, { once: true });
          } else {
            const originalOnLoadEnd = this.onloadend;
            this.onloadend = function (...args) {
              inspectResponse();
              if (typeof originalOnLoadEnd === "function") {
                return originalOnLoadEnd.apply(this, args);
              }
              return undefined;
            };
          }
        }
        return originalSend.call(this, body);
      }

      const payload = buildMockBody(url, kind);
      const responseText = JSON.stringify(payload);
      logDebug("network", `xhr blocked [${kind}]`, url);

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
      logDebug("network", `$.ajax blocked [${kind}]`, url);
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
      logDebug("network", `sendBeacon blocked [${kind}]`, normalizedUrl);
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
    // Noop all known logging methods on MonitorUtil at the source.
    const logMethodKeys = ["errorLog", "warnLog", "infoLog", "log", "sendLog", "report"];
    logMethodKeys.forEach((key) => {
      if (typeof monitor[key] === "function") {
        const original = monitor[key].bind(monitor);
        monitor[key] = function (...args) {
          if (state.config.blockReportApis) return undefined;
          return original(...args);
        };
      }
    });
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
          logDebug("detect", "notTrustScript blocked");
          return false;
        }
        return original(...args);
      });
    }

    if (typeof vm.collectLog === "function" && !vm.collectLog[WRAP_MARK]) {
      vm.collectLog = wrapVmMethod(vm, vm.collectLog, (original) => function (...args) {
        if (state.config.blockReportApis) {
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
          logDebug("network", "secondKafkaCollect blocked");
          return undefined;
        }
        return original(...args);
      });
    }

    if (typeof vm.fetchLogData === "function" && !vm.fetchLogData[WRAP_MARK]) {
      vm.fetchLogData = wrapVmMethod(vm, vm.fetchLogData, (original) => function (url, ...args) {
        const normalizedUrl = normalizeUrl(url);
        if (state.config.blockReportApis && shouldBlockUrl(normalizedUrl) === "report") {
          logDebug("network", "fetchLogData blocked [report]", normalizedUrl);
          return Promise.resolve(buildMockBody(normalizedUrl, "report"));
        }
        if (state.config.blockDetectApis && shouldBlockUrl(normalizedUrl) === "detect") {
          logDebug("network", "fetchLogData blocked [detect]", normalizedUrl);
          return Promise.resolve(buildMockBody(normalizedUrl, "detect"));
        }
        return original(url, ...args);
      });
    }

    if (state.config.blockDetectApis) {
      const timerKeys = [
        "checkTimer", "detectTimer", "logTimer", "reportTimer",
        "monitorTimer", "kafkaTimer", "aberrantTimer", "scriptCheckTimer",
      ];
      timerKeys.forEach((key) => {
        if (vm[key]) {
          safeCall(() => clearInterval(vm[key]));
          safeCall(() => clearTimeout(vm[key]));
          vm[key] = 0;
        }
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
        changed = true;
      }
      if (actualPercent >= 50) {
        const previousPlayTimes = Number(vm.playTimes || 0);
        vm.playTimes = Math.max(previousPlayTimes, 6);
        if (vm.playTimes !== previousPlayTimes) {
          changed = true;
        }
        if (typeof vm.saveDdsjkTimeInWhileFn === "function" && !vm.isSaving) {
          safeCall(() => vm.saveDdsjkTimeInWhileFn(null, null, null, 8));
        }
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

  function haltScriptForSliderVerification(message) {
    if (state.halted) return;
    state.halted = true;
    if (state.runtimeTimerId) { clearInterval(state.runtimeTimerId); state.runtimeTimerId = 0; }
    if (state.vmProbeTimerId) { clearInterval(state.vmProbeTimerId); state.vmProbeTimerId = 0; }
    if (state.examVmProbeTimerId) { clearInterval(state.examVmProbeTimerId); state.examVmProbeTimerId = 0; }
    clearPendingServerProgressRefresh();
    state.serverProgress.pendingPayload = null;
    logWarn("bootstrap", "script halted: slider verification required", { message });
    toast(`脚本已中止：${message}，请手动完成滑块验证后刷新页面`);
    updateUi(`已中止：${message}`);
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
    const studentExamDto = extractStudentExamDto(lessonLike) || lessonLike || {};
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

  function resetExamSaveState() {
    state.exam.pendingSave = { kind: "", signature: "", startedAt: 0 };
  }

  function resetHomeworkExamCloseRequestState() {
    state.exam.closeRequestedAt = 0;
    state.exam.closeRequestedReason = "";
    state.exam.closeRequestStudentExamId = "";
    state.exam.closeAttemptCount = 0;
    state.exam.lastCloseAttemptAt = 0;
  }

  function isTemporarySaveConfirmMessage(message) {
    const normalizedMessage = normalizeText(toPlainText(message));
    return /暂存作业/.test(normalizedMessage);
  }

  function isDirectSubmitConfirmMessage(message) {
    const normalizedMessage = normalizeText(toPlainText(message));
    return /提交/.test(normalizedMessage) && /确[定认]/.test(normalizedMessage);
  }

  function resolveExamLaunchUrl(rawUrl) {
    const normalized = normalizeText(rawUrl);
    if (!normalized || /^javascript:/i.test(normalized)) return "";

    const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(normalized) || normalized.startsWith("//")
      ? normalized
      : /^[a-z0-9.-]+\.[a-z]{2,}(?:\/|$)/i.test(normalized)
        ? `https://${normalized}`
        : normalized;

    try {
      return new URL(candidate, String(PAGE.location?.origin || location.origin || "")).href;
    } catch (_error) {
      return candidate;
    }
  }

  function buildRegularExamPopupFeatures() {
    const screenObject = PAGE.screen || window.screen || {};
    const availWidth = Number(screenObject.availWidth || screenObject.width || 1280) || 1280;
    const availHeight = Number(screenObject.availHeight || screenObject.height || 900) || 900;
    const screenLeft = Number(screenObject.availLeft || PAGE.screenX || window.screenX || 0) || 0;
    const screenTop = Number(screenObject.availTop || PAGE.screenY || window.screenY || 0) || 0;
    const width = Math.max(820, Math.min(1280, availWidth - 120));
    const height = Math.max(640, Math.min(920, availHeight - 120));
    const left = Math.max(screenLeft, screenLeft + Math.floor((availWidth - width) / 2));
    const top = Math.max(screenTop, screenTop + Math.floor((availHeight - height) / 2));

    return [
      "popup=yes",
      "toolbar=no",
      "location=yes",
      "status=no",
      "menubar=no",
      "scrollbars=yes",
      "resizable=yes",
      `width=${width}`,
      `height=${height}`,
      `left=${left}`,
      `top=${top}`,
    ].join(",");
  }

  function rememberExamLaunchHandle(launchKey, handle, driver = "unknown") {
    const normalizedLaunchKey = normalizeText(launchKey);
    if (!normalizedLaunchKey || !handle) return null;

    state.exam.launchHandles[normalizedLaunchKey] = {
      handle,
      driver: normalizeText(driver) || "unknown",
      createdAt: now(),
      lastCloseAttemptAt: 0,
      closeAttempts: 0,
    };
    return state.exam.launchHandles[normalizedLaunchKey];
  }

  function cleanupExamLaunchHandle(launchKey) {
    const normalizedLaunchKey = normalizeText(launchKey);
    if (!normalizedLaunchKey) return false;
    if (!state.exam.launchHandles[normalizedLaunchKey]) return false;
    delete state.exam.launchHandles[normalizedLaunchKey];
    return true;
  }

  function getExamSessionLaunchKey(session = state.exam.session) {
    const launchKey = normalizeText(session?.launchKey || state.exam.lastLaunchKey || "");
    return launchKey || "";
  }

  function attemptExamLaunchHandleClose(launchKey, reason = "sessionClosing", force = false) {
    const normalizedLaunchKey = normalizeText(launchKey);
    if (!normalizedLaunchKey) return false;
    const launchHandleEntry = state.exam.launchHandles[normalizedLaunchKey];
    if (!launchHandleEntry || !launchHandleEntry.handle) return false;

    const timestamp = now();
    const lastCloseAttemptAt = Number(launchHandleEntry.lastCloseAttemptAt || 0);
    if (!force && lastCloseAttemptAt && timestamp - lastCloseAttemptAt < 1200) {
      return true;
    }

    launchHandleEntry.lastCloseAttemptAt = timestamp;
    launchHandleEntry.closeAttempts = Number(launchHandleEntry.closeAttempts || 0) + 1;

    const handle = launchHandleEntry.handle;
    const driver = normalizeText(launchHandleEntry.driver || "unknown") || "unknown";
    const closedBefore = safeCall(() => Boolean(handle.closed), false);
    if (closedBefore) {
      cleanupExamLaunchHandle(normalizedLaunchKey);
      return true;
    }

    const closeResult = safeCall(() => {
      if (typeof handle.close === "function") {
        return handle.close();
      }
      return false;
    }, false);
    const closedAfter = safeCall(() => Boolean(handle.closed), false);

    logDebug("exam", "owner attempted launched regular exam close", {
      launchKey: normalizedLaunchKey,
      reason,
      driver,
      closeAttempts: launchHandleEntry.closeAttempts,
      closeResult: typeof closeResult === "undefined" ? "undefined" : closeResult,
      closedAfter,
    });

    if (closedAfter) {
      cleanupExamLaunchHandle(normalizedLaunchKey);
    }
    return closeResult !== false || closedAfter;
  }

  function openRegularExamPopup(rawUrl, launchKey) {
    const popupUrl = resolveExamLaunchUrl(rawUrl);
    if (!popupUrl) return false;

    const popupName = `awt_exam_${String(launchKey || "regular_exam").replace(/[^a-z0-9_-]+/gi, "_")}`;
    const popupWindow = safeCall(() => PAGE.open(popupUrl, popupName, buildRegularExamPopupFeatures()), null);
    if (!popupWindow) {
      logWarn("exam", "regular exam popup blocked", {
        popupUrl,
      });
      return false;
    }

    rememberExamLaunchHandle(launchKey, popupWindow, "window-open");
    safeCall(() => popupWindow.focus?.());
    logSuccess("exam", "launch regular exam popup", {
      popupUrl,
      popupName,
    });
    return true;
  }

  function openRegularExamExtensionTab(rawUrl, launchKey) {
    const popupUrl = resolveExamLaunchUrl(rawUrl);
    if (!popupUrl) return false;

    const tab = gmOpenInTabCompat(popupUrl, {
      active: false,
      insert: true,
      setParent: true,
    });
    if (!tab) {
      logWarn("exam", "regular exam extension tab unavailable", {
        popupUrl,
        launchKey,
      });
      return false;
    }

    rememberExamLaunchHandle(launchKey, tab, "gm-open-in-tab");
    logSuccess("exam", "launch regular exam extension tab", {
      popupUrl,
      launchKey,
    });
    return true;
  }

  function armExamSession(sessionPayload) {
    if (!sessionPayload || typeof sessionPayload !== "object") return;
    const ts = now();
    state.exam.session = {
      ...(getSession()),
      launchState: "armed",
      launchStateAt: ts,
      ...sessionPayload,
      armedAt: ts,
    };
    void gmSetValue(STORAGE_KEYS.examSession, state.exam.session);
  }

  async function syncExamSessionFromStorage(force = false) {
    if (!isStudyPage()) return state.exam.session;
    if (!force && state.exam.sessionSyncPromise) return state.exam.sessionSyncPromise;
    const timestamp = now();
    if (!force && state.exam.lastSessionSyncAt && timestamp - state.exam.lastSessionSyncAt < 1200) {
      return state.exam.session;
    }
    state.exam.lastSessionSyncAt = timestamp;
    state.exam.sessionSyncPromise = gmGetValue(STORAGE_KEYS.examSession, null).then((storedSession) => {
      state.exam.session = storedSession && typeof storedSession === "object" ? storedSession : null;
      maybeCloseClosingExamLaunchFromSession(state.exam.session, "syncExamSessionFromStorage");
      return state.exam.session;
    }).catch((error) => {
      logWarn("exam", "sync exam session from storage failed", error);
      return state.exam.session;
    }).finally(() => {
      state.exam.sessionSyncPromise = null;
    });
    return state.exam.sessionSyncPromise;
  }

  function getExamSessionLaunchState(session = state.exam.session) {
    return normalizeText(session?.launchState || "");
  }

  function markExamSessionLaunchState(launchState, extra = {}) {
    armExamSession({
      ...(getSession()),
      ...extra,
      launchState,
      launchStateAt: now(),
    });
  }

  function maybeCloseClosingExamLaunchFromSession(session = state.exam.session, reason = "sessionClosing") {
    if (!isStudyPage()) return false;
    if (!state.config.autoCloseCompletedExam) return false;
    const launchKey = getExamSessionLaunchKey(session);
    const launchState = getExamSessionLaunchState(session);
    if (!launchKey) return false;
    if (launchState === "closed") {
      cleanupExamLaunchHandle(launchKey);
      return false;
    }
    if (launchState !== "closing") return false;
    return attemptExamLaunchHandleClose(launchKey, reason);
  }

  function installExamPageLifecycleHooks() {
    if (state.exam.lifecycleHooksInstalled || !isExamPage()) return;
    state.exam.lifecycleHooksInstalled = true;
    const markClosed = () => {
      resetHomeworkExamCloseRequestState();
      markExamSessionLaunchState("closed", {
        host: PAGE_HOST,
        closedAt: now(),
        lastHeartbeatAt: 0,
      });
    };
    window.addEventListener("pagehide", markClosed, true);
    window.addEventListener("beforeunload", markClosed, true);
  }

  function normalizeExamCount(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value >= 0 ? Math.floor(value) : null;
    }
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    if (!trimmed || !/^\d+(?:\.\d+)?$/.test(trimmed)) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : null;
  }

  function parseStudentExamCompletionRatio(value) {
    const normalized = normalizeText(value);
    if (!normalized) return null;
    const match = normalized.match(/^(\d+)\s*[\/／]\s*(\d+)$/);
    if (!match) return null;
    const answered = normalizeExamCount(match[1]);
    const total = normalizeExamCount(match[2]);
    if (answered === null || total === null || total <= 0) return null;
    return {
      answered,
      total,
      raw: normalized,
    };
  }

  function getStudentExamCompletionContainers(studentExamLike) {
    if (!studentExamLike || typeof studentExamLike !== "object") return [];
    const containers = [];
    const visited = new Set();
    const studentExamDto = extractStudentExamDto(studentExamLike);
    const candidates = [
      studentExamLike,
      studentExamDto,
      studentExamDto?.examinationArr,
    ];
    candidates.forEach((candidate) => {
      if (!candidate || typeof candidate !== "object" || Array.isArray(candidate) || visited.has(candidate)) return;
      visited.add(candidate);
      containers.push(candidate);
    });
    return containers;
  }

  function getStudentExamCompletionRatioFromContainer(container) {
    if (!container || typeof container !== "object") return null;
    const parsed = parseStudentExamCompletionRatio(container.ratioText);
    if (parsed) return { ...parsed, source: "ratioText" };
    return null;
  }

  function getStudentExamAchieveCount(container) {
    if (!container || typeof container !== "object") return null;
    const keys = [
      "achieveCount",
      "testNum",
    ];
    for (const key of keys) {
      const count = normalizeExamCount(container[key]);
      if (count !== null) return count;
    }
    return null;
  }

  function getStudentExamProblemCount(container) {
    if (!container || typeof container !== "object") return null;
    const direct = normalizeExamCount(container.problemNum) ?? normalizeExamCount(container.questionCount);
    if (direct !== null) return direct;
    const workExamParts = Array.isArray(container.workExamParts) ? container.workExamParts : [];
    if (!workExamParts.length) return null;
    let total = 0;
    let found = false;
    workExamParts.forEach((part) => {
      const count = normalizeExamCount(part?.questionCount);
      if (count !== null) { total += count; found = true; }
    });
    return found ? total : null;
  }

  function getStudentExamCompletionScore(completion) {
    if (!completion || typeof completion !== "object") return 0;
    let score = 0;
    if (completion.answered !== null) score += Number(completion.answered || 0) * 100;
    if (completion.total !== null) score += Number(completion.total || 0) * 10;
    if (completion.percentage !== null) score += Number(completion.percentage || 0);
    if (completion.ratioText) score += 1;
    return score;
  }

  function isStudentExamCompletionComplete(completion) {
    if (!completion) return false;
    if (completion.answered !== null && completion.total !== null && completion.total > 0) {
      return completion.answered >= completion.total;
    }
    return completion.percentage !== null && completion.percentage >= 100;
  }

  function isExamComplete(studentExamLike, entry = null) {
    const dto = extractStudentExamDto(studentExamLike)
      || extractStudentExamDto(entry?.progressTarget)
      || extractStudentExamDto(entry?.lesson);
    if (!dto) return false;
    // Source 1: server state (most reliable, 3 = submitted)
    if (Number(dto.state || 0) >= 3) return true;
    // Source 2: browser storage answered count vs total
    const studentExamId = normalizeVideoId(dto.id);
    if (studentExamId) {
      const achieveCount = normalizeExamCount(getBrowserStorageItem(`achieveCount${studentExamId}`));
      const problemNum = normalizeExamCount(dto.problemNum) ?? normalizeExamCount(dto.questionCount);
      if (achieveCount !== null && problemNum !== null && achieveCount >= problemNum && problemNum > 0) {
        return true;
      }
    }
    // Source 3: GM shared completion
    const shared = getStudentExamSharedCompletion({ studentExamId: studentExamId || "" });
    return isStudentExamCompletionComplete(shared);
  }

  function pickPreferredStudentExamCompletion(currentCompletion, nextCompletion) {
    if (!currentCompletion) return nextCompletion || null;
    if (!nextCompletion) return currentCompletion;

    const currentComplete = isStudentExamCompletionComplete(currentCompletion);
    const nextComplete = isStudentExamCompletionComplete(nextCompletion);
    if (currentComplete !== nextComplete) {
      return nextComplete ? nextCompletion : currentCompletion;
    }

    const currentScore = getStudentExamCompletionScore(currentCompletion);
    const nextScore = getStudentExamCompletionScore(nextCompletion);
    if (currentScore !== nextScore) {
      return nextScore > currentScore ? nextCompletion : currentCompletion;
    }

    const currentShared = Boolean(currentCompletion.shared || /^gm-shared/.test(normalizeText(currentCompletion.source)));
    const nextShared = Boolean(nextCompletion.shared || /^gm-shared/.test(normalizeText(nextCompletion.source)));
    if (currentShared !== nextShared) {
      return nextShared ? nextCompletion : currentCompletion;
    }

    const currentUpdatedAt = Number(currentCompletion.updatedAt || 0);
    const nextUpdatedAt = Number(nextCompletion.updatedAt || 0);
    if (currentUpdatedAt !== nextUpdatedAt) {
      return nextUpdatedAt > currentUpdatedAt ? nextCompletion : currentCompletion;
    }
    return currentCompletion;
  }

  function getBrowserStorageItem(key) {
    const normalizedKey = normalizeText(key);
    if (!normalizedKey) return "";

    const storages = [
      safeCall(() => PAGE.sessionStorage, null),
      safeCall(() => sessionStorage, null),
      safeCall(() => PAGE.localStorage, null),
      safeCall(() => localStorage, null),
    ];
    for (const storage of storages) {
      const value = safeCall(() => (
        storage && typeof storage.getItem === "function"
          ? storage.getItem(normalizedKey)
          : null
      ), null);
      if (value !== null && typeof value !== "undefined" && `${value}` !== "") {
        return String(value);
      }
    }
    return "";
  }

  function getStudentExamSharedCompletionKey(studentExamId) {
    const normalizedStudentExamId = normalizeVideoId(studentExamId);
    return normalizedStudentExamId ? `${STORAGE_KEYS.examCompletionPrefix}${normalizedStudentExamId}` : "";
  }

  function normalizeStudentExamSharedCompletion(rawCompletion, fallbackStudentExamId = "") {
    if (!rawCompletion || typeof rawCompletion !== "object") return null;
    const studentExamId = normalizeVideoId(
      rawCompletion.studentExamId
      || rawCompletion.stuExamId
      || fallbackStudentExamId,
    );
    const examId = normalizeVideoId(rawCompletion.examId);
    const answered = normalizeExamCount(
      rawCompletion.answered
      ?? rawCompletion.achieveCount
      ?? rawCompletion.testNum,
    );
    const total = normalizeExamCount(
      rawCompletion.total
      ?? rawCompletion.problemNum
      ?? rawCompletion.questionCount,
    );
    let percentage = normalizeExamCount(rawCompletion.percentage);
    if (percentage === null && answered !== null && total !== null && total > 0) {
      percentage = clampPercent(Math.floor((answered / total) * 100));
    }
    if (answered === null && total === null && percentage === null) return null;
    return {
      studentExamId,
      examId,
      answered,
      total,
      percentage,
      ratioText: normalizeText(
        rawCompletion.ratioText
        || ((answered !== null && total !== null && total > 0) ? `${answered}/${total}` : ""),
      ),
      updatedAt: Number(rawCompletion.updatedAt || 0) || now(),
      source: normalizeText(rawCompletion.source || "gm-shared") || "gm-shared",
      reason: normalizeText(rawCompletion.reason || ""),
      saveMode: Number.isFinite(Number(rawCompletion.saveMode))
        ? Number(rawCompletion.saveMode)
        : 0,
      shared: true,
    };
  }


  async function syncStudentExamSharedCompletionFromStorage(studentExamId, force = false) {
    const normalizedStudentExamId = normalizeVideoId(studentExamId);
    if (!normalizedStudentExamId) return null;

    const storageKey = getStudentExamSharedCompletionKey(normalizedStudentExamId);
    if (!storageKey) return null;
    if (!force && state.exam.completionSyncPromises[normalizedStudentExamId]) {
      return state.exam.completionSyncPromises[normalizedStudentExamId];
    }

    const syncPromise = gmGetValue(storageKey, null).then((storedCompletion) => {
      const normalizedCompletion = normalizeStudentExamSharedCompletion(storedCompletion, normalizedStudentExamId);
      state.exam.completionCacheReadAt[normalizedStudentExamId] = now();
      if (normalizedCompletion) {
        state.exam.completionCache[normalizedStudentExamId] = normalizedCompletion;
      }
      return normalizedCompletion;
    }).catch((error) => {
      logWarn("exam", "sync shared regular exam completion failed", {
        studentExamId: normalizedStudentExamId,
        error: normalizeText(error?.message || error),
      });
      return null;
    }).finally(() => {
      delete state.exam.completionSyncPromises[normalizedStudentExamId];
    });

    state.exam.completionSyncPromises[normalizedStudentExamId] = syncPromise;
    return syncPromise;
  }

  function getStudentExamSharedCompletion(studentExamLike, entry = null, options) {
    const studentExamDto = extractStudentExamDto(studentExamLike)
      || extractStudentExamDto(entry?.progressTarget)
      || extractStudentExamDto(entry?.lesson)
      || extractStudentExamDto(entry?.chapter)
      || (isLikelyStudentExamDto(studentExamLike) ? studentExamLike : null);
    const studentExamId = normalizeVideoId(studentExamDto?.id);
    if (!studentExamId) return null;

    const normalizedOptions = options && typeof options === "object" ? options : {};
    const forceRead = normalizedOptions.forceRead === true;
    const cachedCompletion = state.exam.completionCache[studentExamId] || null;
    if (!forceRead && cachedCompletion && isStudentExamCompletionComplete(cachedCompletion)) {
      return cachedCompletion;
    }

    const timestamp = now();
    const lastReadAt = Number(state.exam.completionCacheReadAt[studentExamId] || 0);
    if (!forceRead && lastReadAt && timestamp - lastReadAt < 1200 && cachedCompletion !== null) {
      return cachedCompletion;
    }

    state.exam.completionCacheReadAt[studentExamId] = timestamp;
    const storageKey = getStudentExamSharedCompletionKey(studentExamId);
    const storedCompletion = storageKey
      ? normalizeStudentExamSharedCompletion(gmGetValueSync(storageKey, null), studentExamId)
      : null;

    if (storedCompletion) {
      state.exam.completionCache[studentExamId] = storedCompletion;
      return storedCompletion;
    }

    void syncStudentExamSharedCompletionFromStorage(studentExamId);
    return cachedCompletion;
  }

  function buildStudentExamSharedCompletionRecord(pageVm, options) {
    if (!isHomeworkExamVm(pageVm)) return null;
    const normalizedOptions = options && typeof options === "object" ? options : {};
    const routeParams = buildExamRouteParams(pageVm.$route || pageVm.$root?.$route || null);
    const studentExamId = normalizeVideoId(routeParams.stuExamId);
    if (!studentExamId) return null;

    let answered = normalizeExamCount(pageVm.testNum);
    if (answered === null) {
      answered = getStudentExamAchieveCount(pageVm);
    }
    if (answered === null) {
      answered = normalizeExamCount(getBrowserStorageItem(`achieveCount${studentExamId}`));
    }

    let total = getStudentExamProblemCount(pageVm);

    // fallback: use DOM-based question total when DTO metadata is missing
    if (total === null) {
      const domTotal = getHomeworkQuestionTotal(pageVm);
      if (domTotal > 0) {
        total = domTotal;
      }
    }

    // fallback: derive answered from currentQuestionIndex when DTO fields are missing
    if (answered === null && total !== null && total > 0) {
      const currentQuestionIndex = Number(pageVm.currentQuestionIndex);
      if (Number.isFinite(currentQuestionIndex) && currentQuestionIndex >= 0) {
        const isLast = isHomeworkExamLastQuestion(pageVm);
        // currentQuestionIndex is 0-based; if on last question, answered = total
        // otherwise answered = currentQuestionIndex (questions before current are done)
        if (isLast) {
          answered = total;
        } else {
          answered = currentQuestionIndex;
        }
      }
    }

    let percentage = normalizeExamCount(pageVm.percentage);

    if (percentage === null && answered !== null && total !== null && total > 0) {
      percentage = clampPercent(Math.floor((answered / total) * 100));
    }

    return normalizeStudentExamSharedCompletion({
      studentExamId,
      examId: normalizeVideoId(routeParams.examId),
      answered,
      total,
      percentage,
      updatedAt: now(),
      source: normalizeText(normalizedOptions.source || "gm-shared"),
      reason: normalizeText(normalizedOptions.reason || ""),
      saveMode: Number.isFinite(Number(normalizedOptions.saveMode))
        ? Number(normalizedOptions.saveMode)
        : 0,
    }, studentExamId);
  }

  function persistStudentExamSharedCompletion(pageVm, options) {
    const nextCompletion = buildStudentExamSharedCompletionRecord(pageVm, options);
    if (!nextCompletion?.studentExamId) {
      return null;
    }

    const currentCompletion = getStudentExamSharedCompletion({
      id: nextCompletion.studentExamId,
      exam: {
        id: nextCompletion.examId,
      },
      state: 1,
    }) || null;
    const preferredCompletion = pickPreferredStudentExamCompletion(currentCompletion, nextCompletion);
    const secondaryCompletion = preferredCompletion === currentCompletion
      ? nextCompletion
      : currentCompletion;
    const mergedCompletion = normalizeStudentExamSharedCompletion({
      ...(secondaryCompletion || {}),
      ...(preferredCompletion || {}),
      studentExamId: nextCompletion.studentExamId,
      examId: nextCompletion.examId || currentCompletion?.examId || "",
      updatedAt: Math.max(
        Number(currentCompletion?.updatedAt || 0),
        Number(nextCompletion.updatedAt || 0),
        now(),
      ),
      shared: true,
    }, nextCompletion.studentExamId);
    if (!mergedCompletion) return null;

    state.exam.completionCache[nextCompletion.studentExamId] = mergedCompletion;
    state.exam.completionCacheReadAt[nextCompletion.studentExamId] = now();

    const storageKey = getStudentExamSharedCompletionKey(nextCompletion.studentExamId);
    if (!storageKey) return mergedCompletion;

    const wroteSync = gmSetValueSync(storageKey, mergedCompletion);
    if (!wroteSync) {
      void gmSetValue(storageKey, mergedCompletion);
    }

    logDebug("exam", "persist shared regular exam completion", {
      studentExamId: mergedCompletion.studentExamId,
      examId: mergedCompletion.examId,
      primaryKey: storageKey,
      answered: mergedCompletion.answered,
      total: mergedCompletion.total,
      percentage: mergedCompletion.percentage,
      reason: mergedCompletion.reason,
      saveMode: mergedCompletion.saveMode,
    });
    return mergedCompletion;
  }

  function getHomeworkExamCloseRequestStudentExamId(pageVm) {
    if (!isHomeworkExamVm(pageVm)) return "";
    const routeParams = buildExamRouteParams(pageVm.$route || pageVm.$root?.$route || null);
    return normalizeVideoId(routeParams.stuExamId) || "";
  }

  function isClosingHomeworkExamSession(studentExamId = "") {
    const normalizedStudentExamId = normalizeVideoId(studentExamId);
    if (!normalizedStudentExamId) return false;

    const session = state.exam.session || null;
    if (!session) return false;

    const sessionStudentExamId = normalizeVideoId(session.studentExamId || session.stuExamId);
    if (!sessionStudentExamId || sessionStudentExamId !== normalizedStudentExamId) return false;
    return getExamSessionLaunchState(session) === "closing";
  }

  function hasPendingHomeworkExamCloseRequest(pageVm, timestamp = now()) {
    const studentExamId = getHomeworkExamCloseRequestStudentExamId(pageVm);
    if (!studentExamId) return false;
    if (state.exam.closeRequestStudentExamId !== studentExamId) return false;
    const closeRequestedAt = Number(state.exam.closeRequestedAt || 0);
    if (closeRequestedAt && timestamp - closeRequestedAt < 15000) {
      return true;
    }
    return isClosingHomeworkExamSession(studentExamId);
  }

  function resolveHomeworkExamListLocation(pageVm) {
    if (!isHomeworkExamVm(pageVm)) return "";
    const router = pageVm.$router || pageVm.$root?.$router || null;
    if (!router || typeof router.resolve !== "function") return "";

    const resolved = safeCall(() => router.resolve({
      path: "/webExamList",
      name: "webExanList", // (sic) platform typo: webExanList
    }), null);
    return normalizeText(resolved?.href || "");
  }

  function attemptHomeworkExamRouteFallback(pageVm, reason, closeAttemptCount) {
    if (!isHomeworkExamVm(pageVm) || closeAttemptCount < 3) return false;

    const router = pageVm.$router || pageVm.$root?.$router || null;
    const fallbackHref = resolveHomeworkExamListLocation(pageVm);
    const redirected = safeCall(() => {
      if (router && typeof router.replace === "function") {
        router.replace({
          path: "/webExamList",
          name: "webExanList",
        });
        return true;
      }
      if (fallbackHref && PAGE.location?.href !== fallbackHref && typeof PAGE.location?.replace === "function") {
        PAGE.location.replace(fallbackHref);
        return true;
      }
      if (PAGE.history && typeof PAGE.history.back === "function" && Number(PAGE.history.length || 0) > 1) {
        PAGE.history.back();
        return true;
      }
      return false;
    }, false);

    if (redirected) {
      logWarn("exam", "regular exam page close fallback redirected", {
        studentExamId: getHomeworkExamCloseRequestStudentExamId(pageVm),
        reason,
        closeAttemptCount,
        fallbackHref,
      });
    }
    return redirected;
  }

  function requestHomeworkExamPageClose(pageVm, reason = "runtimeCompletedPage", options) {
    if (!isHomeworkExamVm(pageVm)) return false;

    const config = options && typeof options === "object" ? options : {};
    const timestamp = now();
    const studentExamId = getHomeworkExamCloseRequestStudentExamId(pageVm);
    const hasPendingRequest = Boolean(studentExamId) && hasPendingHomeworkExamCloseRequest(pageVm, timestamp);
    if (!hasPendingRequest) {
      state.exam.closeRequestedAt = timestamp;
      state.exam.closeRequestedReason = normalizeText(reason || "");
      state.exam.closeRequestStudentExamId = studentExamId;
      state.exam.closeAttemptCount = 0;
      state.exam.lastCloseAttemptAt = 0;
    }

    const lastCloseAttemptAt = Number(state.exam.lastCloseAttemptAt || 0);
    if (lastCloseAttemptAt && timestamp - lastCloseAttemptAt < 1500) {
      return true;
    }

    state.exam.lastCloseAttemptAt = timestamp;
    state.exam.closeAttemptCount = Number(state.exam.closeAttemptCount || 0) + 1;

    const closeAttemptCount = state.exam.closeAttemptCount;
    const preferVmSaveSuccess = config.preferVmSaveSuccess === true;
    const fallbackHref = resolveHomeworkExamListLocation(pageVm);
    if (!hasPendingRequest) {
      logDebug("exam", "request regular exam page close", {
        studentExamId,
        reason,
        closeAttemptCount,
        fallbackHref,
      });
    }

    if (preferVmSaveSuccess && typeof pageVm.saveSuccess === "function") {
      safeCall(() => pageVm.saveSuccess(), false);
    }
    safeCall(() => { if (typeof pageVm?.closeWindow === "function") pageVm.closeWindow(); });
    safeCall(() => { PAGE.close(); });
    safeCall(() => { if (typeof GM_closeTab === "function") GM_closeTab(); });
    attemptHomeworkExamRouteFallback(pageVm, reason, closeAttemptCount);
    return true;
  }

  function maybeBypassCompletedHomeworkExam(pageVm, reason = "runtimeCompletedPage") {
    if (!isHomeworkExamVm(pageVm)) return false;
    if (hasPendingHomeworkExamCloseRequest(pageVm)) {
      if (state.config.autoCloseCompletedExam) {
        requestHomeworkExamPageClose(pageVm, reason);
      }
      return true;
    }

    const completion = buildStudentExamSharedCompletionRecord(pageVm, {
      source: "gm-shared:exam-page-progress",
      reason,
      saveMode: 0,
    });
    if (!isStudentExamCompletionComplete(completion)) return false;

    // The save chain (switchQuestion(0,3) → saveSuccessChild → temporarySave
    // → saveSuccess) must finish before we close.  Wait if it is in progress.
    if (state.exam.pendingSave.kind) {
      return false;
    }

    const persistedCompletion = persistStudentExamSharedCompletion(pageVm, {
      source: "gm-shared:exam-page-progress",
      reason,
      saveMode: 0,
    }) || completion;

    state.exam.lastSessionHeartbeatAt = now();
    markExamSessionLaunchState("closing", {
      host: PAGE_HOST,
      closingAt: state.exam.lastSessionHeartbeatAt,
      lastHeartbeatAt: state.exam.lastSessionHeartbeatAt,
      closeReason: reason,
    });
    logSuccess("exam", "skip AI for completed regular exam page", {
      studentExamId: normalizeVideoId(persistedCompletion?.studentExamId),
      examId: normalizeVideoId(persistedCompletion?.examId),
      answered: persistedCompletion?.answered ?? null,
      total: persistedCompletion?.total ?? null,
      percentage: persistedCompletion?.percentage ?? null,
      reason,
      autoClose: state.config.autoCloseCompletedExam,
    });
    if (state.config.autoSubmitCompletedExam && typeof pageVm.beforeDirectSubmit === "function") {
      logSuccess("exam", "auto-submitting completed exam", {
        studentExamId: normalizeVideoId(persistedCompletion?.studentExamId),
      });
      // beforeDirectSubmit may be async (XHR to server).  Fire it and give it
      // a short window before closing the page.
      safeCall(() => pageVm.beforeDirectSubmit(), false);
    }
    // Delay close slightly when submitting so the submit XHR has time to land.
    const closeDelay = state.config.autoSubmitCompletedExam ? 1500 : 0;
    if (state.config.autoCloseCompletedExam) {
      if (closeDelay > 0) {
        setTimeout(() => requestHomeworkExamPageClose(pageVm, reason), closeDelay);
      } else {
        requestHomeworkExamPageClose(pageVm, reason);
      }
    } else {
      // Even when auto-close is disabled, release the session mutex so the
      // study page can launch the next exam.
      markExamSessionLaunchState("closed", {
        ...(getSession()),
        launchState: "closed",
        launchStateAt: now(),
        lastHeartbeatAt: 0,
        closeReason: reason,
        closedBy: "exam-page-completed-no-auto-close",
      });
    }
    return true;
  }

  function getLatestExamSessionForStudyPage() {
    const session = state.exam.session || null;
    if (!isStudyPage()) return session;

    const storedSession = gmGetValueSync(STORAGE_KEYS.examSession, null);
    if (storedSession && typeof storedSession === "object") {
      const storedArmedAt = Number(storedSession.armedAt || 0);
      const memoryArmedAt = Number(session?.armedAt || 0);
      if (!session || storedArmedAt >= memoryArmedAt) {
        state.exam.session = storedSession;
      }
      return state.exam.session;
    }

    return session;
  }

  function markRegularExamSessionClosedOnStudyPage(session = state.exam.session, reason = "studyPageResolved", extra) {
    if (!isStudyPage()) return false;
    if (!session || typeof session !== "object") return false;

    const normalizedReason = normalizeText(reason || "");
    const launchKey = getExamSessionLaunchKey(session);
    if (launchKey) {
      cleanupExamLaunchHandle(launchKey);
      delete state.exam.launchedSessionExamKeys[launchKey];
    }

    const timestamp = now();
    const nextSession = {
      ...(getSession()),
      ...session,
      launchState: "closed",
      launchStateAt: timestamp,
      lastHeartbeatAt: 0,
      closedAt: timestamp,
      closeReason: normalizedReason || normalizeText(session.closeReason || ""),
      ...extra,
    };
    state.exam.session = nextSession;
    const wroteSync = gmSetValueSync(STORAGE_KEYS.examSession, nextSession);
    if (!wroteSync) {
      void gmSetValue(STORAGE_KEYS.examSession, nextSession);
    }
    logDebug("exam", "resolved stale regular exam session on study page", {
      reason: normalizedReason,
      launchKey,
      studentExamId: normalizeVideoId(nextSession.studentExamId || nextSession.stuExamId),
      examId: normalizeVideoId(nextSession.examId),
      closedBy: normalizeText(nextSession.closedBy || ""),
    });
    return true;
  }

  function buildStaleSessionCloseExtra(session, sharedCompletion, closedBy) {
    return {
      studentExamId: normalizeVideoId(session.studentExamId || session.stuExamId || session.lessonId),
      examId: normalizeVideoId(session.examId || sharedCompletion?.examId),
      closeReason: normalizeText(sharedCompletion?.reason || session.closeReason || ""),
      closedBy,
      completedAt: Number(sharedCompletion?.updatedAt || 0) || now(),
    };
  }

  function tryResolveStaleRegularExamSessionOnStudyPage(session = state.exam.session, reason = "studyPageSessionCheck") {
    if (!isStudyPage()) return false;
    if (!session || typeof session !== "object") return false;

    const normalizedReason = normalizeText(reason || "");
    const launchState = getExamSessionLaunchState(session);
    if (!launchState || launchState === "closed") return false;

    // Prevent "closing" dead loop: if already closing for >30s, force close.
    if (launchState === "closing") {
      const closingAge = now() - Number(session.launchStateAt || 0);
      if (closingAge > 30000) {
        return markRegularExamSessionClosedOnStudyPage(session, `${reason}:closing-timeout`, {
          ...buildStaleSessionCloseExtra(session, null, "study-page-closing-timeout"),
          closingAgeMs: closingAge,
        });
      }
      return false;
    }

    const launchKey = getExamSessionLaunchKey(session);
    const launchHandleEntry = launchKey ? state.exam.launchHandles[launchKey] : null;
    const handle = launchHandleEntry?.handle || null;
    const handleClosed = handle
      ? safeCall(() => Boolean(handle.closed), false)
      : false;
    if (handleClosed) {
      return markRegularExamSessionClosedOnStudyPage(session, `${reason}:launch-handle-closed`,
        buildStaleSessionCloseExtra(session, null, "study-page-launch-handle"),
      );
    }

    const studentExamId = normalizeVideoId(session.studentExamId || session.stuExamId || session.lessonId);
    if (!studentExamId) {
      return markRegularExamSessionClosedOnStudyPage(session, `${reason}:missing-ids`,
        buildStaleSessionCloseExtra(session, null, "study-page-missing-exam-id"),
      );
    }

    const sharedCompletion = getStudentExamSharedCompletion({
      id: studentExamId,
      exam: {
        id: normalizeVideoId(session.examId),
      },
      state: 1,
    }, null, {
      forceRead: true,
    }) || null;
    if (!isStudentExamCompletionComplete(sharedCompletion)) return false;

    if (launchHandleEntry?.handle) {
      if (state.config.autoCloseCompletedExam) {
        attemptExamLaunchHandleClose(launchKey, `${reason}:shared-completion`, true);
      }
      const pendingLaunchHandleEntry = launchKey ? state.exam.launchHandles[launchKey] : null;
      const pendingHandle = pendingLaunchHandleEntry?.handle || null;
      const pendingHandleClosed = pendingHandle
        ? safeCall(() => Boolean(pendingHandle.closed), false)
        : true;
      if (!pendingHandleClosed) {
        const closePendingAt = now();
        markExamSessionLaunchState("closing", {
          ...(getSession()),
          ...buildStaleSessionCloseExtra(session, sharedCompletion, "study-page-shared-completion-pending"),
          lastHeartbeatAt: closePendingAt,
        });
        logWarn("exam", "shared-complete regular exam still awaiting owner close", {
          reason: normalizedReason,
          launchKey,
          studentExamId,
          examId: normalizeVideoId(session.examId || sharedCompletion?.examId),
        });
        return false;
      }

      return markRegularExamSessionClosedOnStudyPage(session, `${reason}:shared-completion`,
        buildStaleSessionCloseExtra(session, sharedCompletion, "study-page-shared-completion"),
      );
    }

    // No tracked handle + shared completion complete → mark closed directly
    // (previously marked "closing" which created an infinite loop since there
    // is no handle to close and the state never transitions to "closed").
    return markRegularExamSessionClosedOnStudyPage(session, `${reason}:shared-completion-no-handle`,
      buildStaleSessionCloseExtra(session, sharedCompletion, "study-page-shared-completion-missing-handle"),
    );
    return false;
  }

  function isExamLaunchHandleAlive(launchKey) {
    const handle = state.exam.launchHandles[launchKey];
    return handle && typeof handle === "object" && !handle.closed;
  }

  function hasLaunchedAnyRegularExamThisSession() {
    let session = getLatestExamSessionForStudyPage();
    if (!session) return false;
    tryResolveStaleRegularExamSessionOnStudyPage(session, "hasLaunchedAnyRegularExamThisSession");
    session = state.exam.session || session;
    if (!session) return false;
    const sessionLaunchKey = getExamSessionLaunchKey(session);
    const hadTrackedLaunchHandle = Boolean(sessionLaunchKey && isExamLaunchHandleAlive(sessionLaunchKey));
    maybeCloseClosingExamLaunchFromSession(session, "hasLaunchedAnyRegularExamThisSession");
    session = state.exam.session || session;
    if (!session) return false;
    const launchState = getExamSessionLaunchState(session);
    const launchKey = getExamSessionLaunchKey(session);
    if (!isExamLaunchHandleAlive(launchKey)) {
      const launchHandleEntry = launchKey ? state.exam.launchHandles[launchKey] : null;
      const launchHandle = launchHandleEntry?.handle || null;
      const launchHandleClosed = launchHandle
        ? safeCall(() => Boolean(launchHandle.closed), false)
        : false;
      if (launchHandleClosed) {
        markRegularExamSessionClosedOnStudyPage(session, "hasLaunchedAnyRegularExamThisSession:launch-handle-closed", {
          closedBy: "study-page-launch-handle",
        });
        return false;
      }
      if (launchState === "closing" && hadTrackedLaunchHandle && launchKey && !state.exam.launchHandles[launchKey]) {
        markRegularExamSessionClosedOnStudyPage(session, "hasLaunchedAnyRegularExamThisSession:closing-handle-confirmed", {
          closedBy: "study-page-owner-close",
        });
        return false;
      }
    } else {
      return true;
    }
    const timestamp = now();
    if (launchState === "launching") {
      const launchAt = Number(session.launchAt || session.launchStateAt || 0);
      return !launchAt || timestamp - launchAt <= 20000;
    }
    if (launchState === "active" || launchState === "closing") {
      const heartbeatAt = Number(session.lastHeartbeatAt || session.launchStateAt || 0);
      return Boolean(heartbeatAt) && timestamp - heartbeatAt <= 45000;
    }
    return false;
  }

  function isStudentExamPending(studentExamLike, entry = null) {
    const studentExamDto = extractStudentExamDto(studentExamLike)
      || (isLikelyStudentExamDto(studentExamLike) ? studentExamLike : null);
    if (!studentExamDto || typeof studentExamDto !== "object") return false;
    const examState = Number(studentExamDto.state);
    if (examState === 3 || examState === 4) return false;
    if (state.config.autoSubmitCompletedExam) return true;
    return !isExamComplete(studentExamLike, entry);
  }

  function isLikelyStudentExamDto(candidate) {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return false;
    const hasExamId = typeof candidate.id !== "undefined" && candidate.id !== null;
    const hasExamState = typeof candidate.state !== "undefined";
    return hasExamId && hasExamState;
  }

  function extractStudentExamDto(source) {
    if (!source || typeof source !== "object") return null;
    if (isLikelyStudentExamDto(source.studentExamDto)) return source.studentExamDto;
    if (isLikelyStudentExamDto(source)) return source;
    return null;
  }

  function buildExamRouteParams(routeLike) {
    const params = routeLike?.params || {};
    const session = getSession();
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

  function getCurrentHomeworkAnswerVm(pageVm) {
    const answerRefs = getHomeworkAnswerRefs(pageVm);
    if (!answerRefs.length) return null;
    const currentQuestionIndex = Number(pageVm?.currentQuestionIndex);
    if (
      Number.isFinite(currentQuestionIndex)
      && currentQuestionIndex >= 0
      && currentQuestionIndex < answerRefs.length
    ) {
      return answerRefs[currentQuestionIndex] || null;
    }
    return answerRefs[0] || null;
  }

  function getHomeworkAnswerQuestionEid(questionVm, questionInfo = null) {
    return normalizeVideoId(questionVm?.dataArr?.eid ?? questionInfo?.questionId);
  }

  function getRawQuestionOptions(questionVm) {
    return Array.isArray(questionVm?.dataArr?.questionOptions)
      ? questionVm.dataArr.questionOptions
      : [];
  }

  function mapRawOptionToLabeled(option, index) {
    const rawLabel = normalizeText(option?.sort || "").toUpperCase();
    const label = /^[A-H]$/.test(rawLabel) ? rawLabel : getLetterByIndex(index);
    const text = normalizeAnswerText(toPlainText(option?.content || label)) || label;
    return { label, text };
  }

  function getHomeworkAnswerVmOptions(questionVm) {
    const rawOptions = getRawQuestionOptions(questionVm);

    return rawOptions.map((option, index) => {
      const { label, text } = mapRawOptionToLabeled(option, index);
      return {
        raw: option,
        id: option?.id ?? label,
        label,
        text,
        normalizedText: normalizeAnswerText(text) || label,
      };
    }).filter((option) => option.text || option.label);
  }

  function findHomeworkAnswerVmTargets(questionVm, questionInfo, answers = []) {
    const vmOptions = getHomeworkAnswerVmOptions(questionVm);
    if (!vmOptions.length) return [];

    const domTargets = questionInfo ? matchTargetOptions(questionInfo, answers) : [];
    const normalizedTargets = new Set([
      ...answers.map((item) => normalizeAnswerText(item) || String(item || "").trim().toUpperCase()),
      ...domTargets.map((option) => option.label),
      ...domTargets.map((option) => option.normalizedText),
    ].filter(Boolean));

    return vmOptions.filter((option) => (
      normalizedTargets.has(option.label)
      || normalizedTargets.has(option.normalizedText)
    ));
  }

  function syncHomeworkAnswerVmFlags(questionVm, selectedTargets = []) {
    const questionOptions = getRawQuestionOptions(questionVm);
    if (!questionOptions.length) return false;

    const selectedIdKeys = new Set(selectedTargets.map((target) => normalizeVideoId(target?.id) || String(target?.id ?? "")));
    let changed = false;
    for (const option of questionOptions) {
      const shouldChecked = selectedIdKeys.has(normalizeVideoId(option?.id) || String(option?.id ?? ""));
      if (Boolean(option?.flagChecked) !== shouldChecked) {
        option.flagChecked = shouldChecked;
        changed = true;
      }
    }
    return changed;
  }

  function uniqHomeworkAnswerIds(values = []) {
    return [...new Set(values.map((value) => normalizeVideoId(value) || String(value ?? "")).filter(Boolean))].sort();
  }

  function areHomeworkAnswerIdListsEqual(left = [], right = []) {
    if (left.length !== right.length) return false;
    for (let index = 0; index < left.length; index += 1) {
      if (left[index] !== right[index]) return false;
    }
    return true;
  }

  function getHomeworkAnswerVmSelectedIds(questionVm) {
    const questionOptions = getRawQuestionOptions(questionVm);
    return uniqHomeworkAnswerIds(
      questionOptions
        .filter((option) => Boolean(option?.flagChecked))
        .map((option) => option?.id),
    );
  }


  function hasPreparedHomeworkTextAnswerData(questionVm, childEid = "") {
    const answerDataTemp = questionVm?.answerDataTemp;
    if (!answerDataTemp) return false;
    if (childEid && typeof answerDataTemp === "object") {
      return Boolean(answerDataTemp[childEid]);
    }
    if (typeof answerDataTemp !== "object") return Boolean(answerDataTemp);
    return Object.keys(answerDataTemp).length > 0;
  }

  function resolveHomeworkChoiceContext(questionVm, questionInfo, answers) {
    const rawOptions = getRawQuestionOptions(questionVm);
    const targetOptions = findHomeworkAnswerVmTargets(questionVm, questionInfo, answers);
    const targetIds = uniqHomeworkAnswerIds(targetOptions.map((option) => option.id));
    const currentSelectedIds = uniqHomeworkAnswerIds(
      Array.isArray(questionVm?.checkboxVal) && questionVm.checkboxVal.length
        ? questionVm.checkboxVal
        : getHomeworkAnswerVmSelectedIds(questionVm),
    );
    const sameSelection = areHomeworkAnswerIdListsEqual(currentSelectedIds, targetIds);
    return { rawOptions, targetOptions, targetIds, currentSelectedIds, sameSelection };
  }

  function isHomeworkChoiceAnswerVmSatisfied(pageVm, questionInfo, answers = []) {
    const questionVm = getCurrentHomeworkAnswerVm(pageVm);
    if (!questionVm || !questionInfo?.options?.length) return false;
    const { targetOptions, currentSelectedIds, sameSelection } = resolveHomeworkChoiceContext(questionVm, questionInfo, answers);
    if (!targetOptions.length) return false;
    return (
      sameSelection
      && Boolean(questionVm?.answerDataTemp)
    );
  }

  function isHomeworkTextAnswerVmSatisfied(pageVm, questionInfo, answers = []) {
    const questionVm = getCurrentHomeworkAnswerVm(pageVm);
    if (!questionVm || !questionInfo?.textInputs?.length) return false;
    const normalizedAnswers = answers.map((item) => normalizeText(item)).filter(Boolean);
    if (!normalizedAnswers.length) return false;

    if (Array.isArray(questionVm?.data?.questionChildrens) && questionVm.data.questionChildrens.length) { // (sic) platform typo: questionChildrens
      for (let index = 0; index < questionVm.data.questionChildrens.length; index += 1) {
        const child = questionVm.data.questionChildrens[index];
        const nextValue = normalizedAnswers[Math.min(index, normalizedAnswers.length - 1)] || normalizedAnswers[0];
        const childEid = normalizeVideoId(child?.eid) || getHomeworkAnswerQuestionEid(questionVm, questionInfo);
        if (!nextValue) return false;
        if (String(child?.introduct || "").trim() !== nextValue) return false;
        if (!hasPreparedHomeworkTextAnswerData(questionVm, childEid)) return false;
      }
      return true;
    }

    const nextValue = normalizedAnswers[0];
    if (!nextValue) return false;
    return (
      String(questionVm?.textAreaMsg || "").trim() === nextValue
      && hasPreparedHomeworkTextAnswerData(questionVm)
    );
  }

  function isHomeworkQuestionAnswerSatisfied(pageVm, questionInfo, answers = []) {
    if (!pageVm || !questionInfo) return false;
    if (questionInfo.options.length) {
      return isHomeworkChoiceAnswerVmSatisfied(pageVm, questionInfo, answers);
    }
    if (questionInfo.textInputs.length) {
      return isHomeworkTextAnswerVmSatisfied(pageVm, questionInfo, answers);
    }
    return false;
  }

  function applyHomeworkChoiceAnswerVm(pageVm, questionInfo, answers = []) {
    const questionVm = getCurrentHomeworkAnswerVm(pageVm);
    if (!questionVm || questionVm.disabledFlag) return false;

    const { targetOptions, targetIds, currentSelectedIds, sameSelection } = resolveHomeworkChoiceContext(questionVm, questionInfo, answers);
    if (!targetOptions.length) return false;

    const eid = getHomeworkAnswerQuestionEid(questionVm, questionInfo);
    const selectedIds = [...new Set(targetOptions.map((option) => option.id).filter((id) => id !== undefined && id !== null && String(id) !== ""))];
    if (!selectedIds.length) return false;

    const hadPreparedAnswerData = Boolean(questionVm?.answerDataTemp);
    const changedFlags = syncHomeworkAnswerVmFlags(questionVm, targetOptions);
    let applied = false;

    if (typeof questionVm.UpdataValue === "function" && Array.isArray(questionVm.checkboxVal) && (!sameSelection || !hadPreparedAnswerData || changedFlags)) { // (sic) platform typo: UpdataValue
      questionVm.checkboxVal = selectedIds.slice();
      applied = safeCall(() => {
        questionVm.UpdataValue(selectedIds, eid);
        return true;
      }, false) || applied;
    } else {
      const primaryTarget = targetOptions[0];
      if (typeof questionVm.UpdateTaskName === "function" && (!sameSelection || !hadPreparedAnswerData || changedFlags)) {
        applied = safeCall(() => {
          questionVm.UpdateTaskName(primaryTarget.raw, eid);
          return true;
        }, false) || applied;
      } else if (typeof questionVm.UpdateName === "function" && (!sameSelection || !hadPreparedAnswerData || changedFlags)) {
        applied = safeCall(() => {
          questionVm.UpdateName(primaryTarget.raw, eid);
          return true;
        }, false) || applied;
      }
    }

    const hasPreparedAnswerData = Boolean(questionVm?.answerDataTemp);
    if (changedFlags || applied) {
      safeCall(() => questionVm.$forceUpdate?.());
    }
    return changedFlags || applied || (!hadPreparedAnswerData && hasPreparedAnswerData);
  }

  function applyHomeworkTextAnswerVm(pageVm, questionInfo, answers = []) {
    const questionVm = getCurrentHomeworkAnswerVm(pageVm);
    if (!questionVm || questionVm.disabledFlag || typeof questionVm.UpdataFillblanksAll !== "function") {
      return false;
    }

    const normalizedAnswers = answers.map((item) => normalizeText(item)).filter(Boolean);
    if (!normalizedAnswers.length) return false;

    const eid = getHomeworkAnswerQuestionEid(questionVm, questionInfo);
    const hadPreparedTextAnswerData = hasPreparedHomeworkTextAnswerData(questionVm);
    let changed = false;
    let applied = false;

    if (Array.isArray(questionVm?.data?.questionChildrens) && questionVm.data.questionChildrens.length) {
      if (!questionVm.answerDataTemp || typeof questionVm.answerDataTemp !== "object") {
        questionVm.answerDataTemp = {};
      }
      for (let index = 0; index < questionVm.data.questionChildrens.length; index += 1) {
        const child = questionVm.data.questionChildrens[index];
        const childEid = normalizeVideoId(child?.eid) || eid;
        const nextValue = normalizedAnswers[Math.min(index, normalizedAnswers.length - 1)] || normalizedAnswers[0];
        if (!nextValue) continue;
        const childTextChanged = child && typeof child === "object" && String(child.introduct || "").trim() !== nextValue;
        const hadPreparedAnswerData = hasPreparedHomeworkTextAnswerData(questionVm, childEid);
        if (childTextChanged) {
          child.introduct = nextValue;
          changed = true;
        }
        if (Object.prototype.hasOwnProperty.call(questionVm, "focusMsg") && normalizeText(questionVm.focusMsg) === nextValue) {
          questionVm.focusMsg = "";
        }
        if (childTextChanged || !hadPreparedAnswerData) {
          applied = safeCall(() => {
            questionVm.UpdataFillblanksAll(nextValue, childEid, index);
            return true;
          }, false) || applied;
        }
      }
    } else {
      const nextValue = normalizedAnswers[0];
      if (!nextValue) return false;
      const textChanged = Object.prototype.hasOwnProperty.call(questionVm, "textAreaMsg") && String(questionVm.textAreaMsg || "").trim() !== nextValue;
      const hadPreparedAnswerData = hasPreparedHomeworkTextAnswerData(questionVm);
      if (textChanged) {
        questionVm.textAreaMsg = nextValue;
        changed = true;
      }
      if (Object.prototype.hasOwnProperty.call(questionVm, "focusMsg") && normalizeText(questionVm.focusMsg) === nextValue) {
        questionVm.focusMsg = "";
      }
      if (textChanged || !hadPreparedAnswerData) {
        applied = safeCall(() => {
          questionVm.UpdataFillblanksAll(nextValue, eid);
          return true;
        }, false) || applied;
      }
    }

    const hasPreparedAnswerData = hasPreparedHomeworkTextAnswerData(questionVm);
    if (changed || applied) {
      safeCall(() => questionVm.$forceUpdate?.());
    }
    return changed || applied || (!hadPreparedTextAnswerData && hasPreparedAnswerData);
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

    if (Array.isArray(pageVm?.alllQuestionTest) && pageVm.alllQuestionTest.length) { // (sic) platform typo: alllQuestionTest
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

    for (const methodName of ["hijackAllEls", "checkoutNotTrustScript", "checkout"]) {
      if (typeof vm[methodName] === "function" && !vm[methodName][WRAP_MARK]) {
        vm[methodName] = wrapVmMethod(vm, vm[methodName], (original) => function (...args) {
          if (state.config.blockDetectApis) {
            if (methodName !== "hijackAllEls") clearInterval(this.checkTimer);
            logDebug("detect", `homework ${methodName} blocked`);
            return true;
          }
          return original(...args);
        });
      }
    }

    if (typeof vm.collectLog === "function" && !vm.collectLog[WRAP_MARK]) {
      vm.collectLog = wrapVmMethod(vm, vm.collectLog, (original) => function (...args) {
        if (state.config.blockDetectApis || state.config.blockReportApis) {
          return false;
        }
        return original(...args);
      });
    }

    if (typeof vm.$alert === "function" && !vm.$alert[WRAP_MARK]) {
      vm.$alert = wrapVmMethod(vm, vm.$alert, (original) => function (message, ...rest) {
        if (state.config.blockDetectApis && /检测到异常脚本/.test(normalizeText(message))) {
          markExamDetectTriggered("homework detect alert blocked");
          // Return a never-resolving Promise so the .then() chain
          // (which typically closes the window) never executes.
          return new Promise(() => { });
        }
        return original(message, ...rest);
      });
    }

    if (typeof vm.$confirm === "function" && !vm.$confirm[WRAP_MARK]) {
      vm.$confirm = wrapVmMethod(vm, vm.$confirm, (original) => function (message, title, options, ...rest) {
        if (state.exam.pendingSave.kind === "temporary" && isTemporarySaveConfirmMessage(message)) {
          logSuccess("exam", "regular exam temporary save confirm auto accepted", {
            questionSignature: state.exam.pendingSave.signature || "",
          });
          return Promise.resolve({
            action: "confirm",
          });
        }
        if (state.config.autoSubmitCompletedExam && isDirectSubmitConfirmMessage(message)) {
          logSuccess("exam", "regular exam direct submit confirm auto accepted");
          return Promise.resolve({
            action: "confirm",
          });
        }
        return original(message, title, options, ...rest);
      });
    }

    if (typeof vm.saveSuccessChild === "function" && !vm.saveSuccessChild[WRAP_MARK]) {
      vm.saveSuccessChild = wrapVmMethod(vm, vm.saveSuccessChild, (original) => function (...args) {
        const saveMode = Number(args[1] || 0);
        const shouldChainTemporarySave = state.exam.pendingSave.kind === "lastQuestion" && saveMode === 3;
        const questionSignature = state.exam.pendingSave.signature || state.exam.lastSignature || "";
        const result = original(...args);

        if (saveMode === 1) {
          const persistedCompletion = persistStudentExamSharedCompletion(this, {
            source: "gm-shared:temporary-save-progress",
            reason: "temporarySavePrepared",
            saveMode,
          });
          if (persistedCompletion) {
            logDebug("exam", "temporary save progress captured", {
              questionSignature,
              studentExamId: persistedCompletion.studentExamId,
              answered: persistedCompletion.answered,
              total: persistedCompletion.total,
              percentage: persistedCompletion.percentage,
            });
          }
        }

        if (shouldChainTemporarySave) {
          logSuccess("exam", "regular exam last question save completed", {
            questionSignature,
          });
          resetExamSaveState();
          if (state.exam.pendingSave.kind !== "temporary") {
            const triggered = triggerExamSave(this, {
              signature: questionSignature,
              text: "",
            }, "temporary");
            if (!triggered) {
              logWarn("exam", "regular exam last question close chain failed after save", {
                questionSignature,
              });
            }
          }
        }

        return result;
      });
    }

    if (typeof vm.saveLog === "function" && !vm.saveLog[WRAP_MARK]) {
      vm.saveLog = wrapVmMethod(vm, vm.saveLog, (original) => function (...args) {
        if (state.config.blockReportApis) {
          return Promise.resolve({
            code: 0,
            status: 200,
            rt: {},
          });
        }
        return original(...args);
      });
    }

    if (typeof vm.saveSuccess === "function" && !vm.saveSuccess[WRAP_MARK]) {
      vm.saveSuccess = wrapVmMethod(vm, vm.saveSuccess, (original) => function (...args) {
        const shouldRequestCloseFallback = (
          state.exam.pendingSave.kind === "temporary"
          || hasPendingHomeworkExamCloseRequest(this)
        );
        if (state.exam.pendingSave.kind === "temporary") {
          const persistedCompletion = persistStudentExamSharedCompletion(this, {
            source: "gm-shared:temporary-save",
            reason: "temporarySaveSuccess",
            saveMode: 1,
          });
          state.exam.lastSessionHeartbeatAt = now();
          markExamSessionLaunchState("closing", {
            host: PAGE_HOST,
            closingAt: state.exam.lastSessionHeartbeatAt,
            lastHeartbeatAt: state.exam.lastSessionHeartbeatAt,
          });
          logSuccess("exam", "regular exam temporary save completed", {
            questionSignature: state.exam.pendingSave.signature || "",
            persistedCompletion,
          });
          resetExamSaveState();
        }
        if (state.exam.pendingSave.kind === "lastQuestion") {
          resetExamSaveState();
        }
        // When auto-close is disabled, temporarily block window.close so the
        // platform's original saveSuccess cannot close the popup window.
        let closeGuardInstalled = false;
        let savedClose = null;
        if (!state.config.autoCloseCompletedExam && shouldRequestCloseFallback) {
          try {
            savedClose = PAGE.close;
            PAGE.close = markWrapped(function blockedClose() {
              logDebug("exam", "window.close blocked by autoCloseCompletedExam=false");
              return false;
            });
            closeGuardInstalled = true;
          } catch (_) {
            logDebug("exam", "PAGE.close guard install failed (non-configurable)");
          }
        }
        const result = original(...args);
        if (closeGuardInstalled && savedClose) {
          try { PAGE.close = savedClose; } catch (_) { }
        }
        if (shouldRequestCloseFallback) {
          if (state.config.autoSubmitCompletedExam && typeof this.beforeDirectSubmit === "function") {
            logSuccess("exam", "auto-submitting completed exam before close");
            safeCall(() => this.beforeDirectSubmit(), false);
          }
          if (state.config.autoCloseCompletedExam) {
            const closeDelay = state.config.autoSubmitCompletedExam ? 1500 : 0;
            const vm = this;
            if (closeDelay > 0) {
              setTimeout(() => requestHomeworkExamPageClose(vm, "saveSuccessFallback"), closeDelay);
            } else {
              requestHomeworkExamPageClose(this, "saveSuccessFallback");
            }
          }
        }
        return result;
      });
    }

    if (state.config.blockDetectApis) {
      // Kill all known detection timers at the source so they stop producing
      // log data entirely, rather than relying on per-call hooks + network
      // layer interception as a fallback.
      const timerKeys = [
        "checkTimer", "detectTimer", "logTimer", "reportTimer",
        "monitorTimer", "kafkaTimer", "aberrantTimer", "scriptCheckTimer",
      ];
      timerKeys.forEach((key) => {
        if (vm[key]) {
          safeCall(() => clearInterval(vm[key]));
          safeCall(() => clearTimeout(vm[key]));
          vm[key] = 0;
        }
      });
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
    const currentSession = getSession();
    const currentStudentExamId = normalizeVideoId(
      routeParams.stuExamId
      || currentSession.studentExamId
      || currentSession.stuExamId,
    );
    const currentLaunchState = getExamSessionLaunchState(currentSession);
    const preserveClosingSession = Boolean(
      currentStudentExamId
      && currentLaunchState === "closing"
      && (
        !normalizeVideoId(currentSession.studentExamId || currentSession.stuExamId)
        || normalizeVideoId(currentSession.studentExamId || currentSession.stuExamId) === currentStudentExamId
      )
    );
    // Do not overwrite a "closed" session back to "active" — the mutex has
    // been released and the study page may already be launching the next exam.
    const preserveClosedSession = Boolean(
      currentStudentExamId
      && currentLaunchState === "closed"
      && (
        !normalizeVideoId(currentSession.studentExamId || currentSession.stuExamId)
        || normalizeVideoId(currentSession.studentExamId || currentSession.stuExamId) === currentStudentExamId
      )
    );
    if (preserveClosedSession) {
      return currentSession; // @type-safety: returns ExamSession, not boolean
    }
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
    installExamPageLifecycleHooks();

    patchHomeworkExamVm(pageVm);

    const heartbeatNow = now();
    if (captureChanged || heartbeatNow - Number(state.exam.lastSessionHeartbeatAt || 0) >= 2000) {
      state.exam.lastSessionHeartbeatAt = heartbeatNow;
      const nextLaunchState = preserveClosingSession ? "closing" : "active";
      armExamSession({
        ...currentSession,
        host: PAGE_HOST,
        recruitId: routeParams.recruitId,
        studentExamId: routeParams.stuExamId,
        examId: routeParams.examId,
        courseId: routeParams.courseId,
        schoolId: routeParams.schoolId,
        meetCourseType: routeParams.meetCourseType,
        routeName: routeName || "doHomework",
        captureMode,
        capturedAt: captureChanged ? heartbeatNow : currentSession.capturedAt || heartbeatNow,
        launchState: nextLaunchState,
        launchStateAt: preserveClosingSession
          ? Number(currentSession.launchStateAt || currentSession.closingAt || heartbeatNow)
          : heartbeatNow,
        lastHeartbeatAt: heartbeatNow,
        ...(preserveClosingSession ? {
          closingAt: Number(currentSession.closingAt || heartbeatNow),
          closeReason: normalizeText(currentSession.closeReason || state.exam.closeRequestedReason || ""),
        } : {}),
      });
    }

    if (captureChanged) {
      resetExamSaveState();
      if (!preserveClosingSession) {
        resetHomeworkExamCloseRequestState();
      }
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

  function extractExamQuestionTextFromDto(questionDto) {
    return normalizeQuestionText(toPlainText(
      questionDto?.name
      || questionDto?.content
      || "",
    ));
  }

  function extractExamOptionsFromDto(questionDto) {
    const rawOptions = Array.isArray(questionDto?.questionOptions)
      ? questionDto.questionOptions
      : [];

    return rawOptions.map((option, index) => {
      const { label, text } = mapRawOptionToLabeled(option, index);
      return {
        label,
        text,
        normalizedText: normalizeAnswerText(text) || label,
      };
    }).filter((option) => option.text);
  }

  function appendExamQuestionEntries(entries, questionDto, context = {}) {
    if (!questionDto || typeof questionDto !== "object") return;

    const ownText = extractExamQuestionTextFromDto(questionDto);
    const parentText = normalizeQuestionText(context.parentText || "");
    const options = extractExamOptionsFromDto(questionDto);
    const childQuestions = Array.isArray(questionDto.questionChildrens)
      ? questionDto.questionChildrens.filter(Boolean)
      : [];

    if (childQuestions.length && !options.length) {
      const nextParentText = normalizeQuestionText([parentText, ownText].filter(Boolean).join(" / "));
      for (const childQuestion of childQuestions) {
        appendExamQuestionEntries(entries, childQuestion, {
          parentText: nextParentText,
        });
      }
      return;
    }

    const text = normalizeQuestionText([parentText, ownText].filter(Boolean).join(" / ")) || ownText || parentText;
    const aliasTexts = [];
    if (ownText && text && ownText !== text) {
      aliasTexts.push(ownText);
    }

    const signatures = buildExamQuestionSignatures(text, options.map((option) => option.text), aliasTexts);
    if (!signatures.length) return;

    entries.push({
      questionId: normalizeVideoId(
        questionDto?.eid
        || questionDto?.id
        || questionDto?.questionId
        || questionDto?.testQuestion?.questionId,
      ),
      index: Number(questionDto?.index),
      text,
      aliasTexts,
      signature: signatures[0],
      aliases: signatures.slice(1),
      options,
      textInputs: [],
      textInputCount: options.length ? 0 : 1,
      isMulti: /checkbox|multi/i.test(normalizeText(
        questionDto?.questionType?.inputType
        || questionDto?.questionTypeName
        || questionDto?.questionType
        || "",
      )),
      explicitAnswers: [],
    });
  }

  function getExamQuestionInventory(pageVm) {
    const sourceQuestions = [];

    if (Array.isArray(pageVm?.alllQuestionTest) && pageVm.alllQuestionTest.length) {
      sourceQuestions.push(...pageVm.alllQuestionTest);
    } else if (Array.isArray(pageVm?.allQuestionIdArray) && pageVm.allQuestionIdArray.length) {
      for (const part of pageVm.allQuestionIdArray) {
        if (Array.isArray(part?.questionDtos) && part.questionDtos.length) {
          sourceQuestions.push(...part.questionDtos);
        }
      }
    }

    const entries = [];
    for (const questionDto of sourceQuestions) {
      appendExamQuestionEntries(entries, questionDto);
    }

    const deduped = [];
    const seen = new Set();
    for (const entry of entries) {
      if (!entry?.signature || seen.has(entry.signature)) continue;
      seen.add(entry.signature);
      deduped.push(entry);
    }
    return deduped;
  }

  function computeStableHash(value) {
    const text = String(value || "");
    let hash = 0;
    for (let index = 0; index < text.length; index += 1) {
      hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0;
    }
    return String(hash >>> 0);
  }

  function buildExamAnswerRequestKey(questionEntries) {
    const session = getSession();
    return computeStableHash(JSON.stringify({
      host: PAGE_HOST,
      recruitId: session.recruitId || "",
      examId: session.examId || "",
      studentExamId: session.studentExamId || "",
      model: state.exam.llm.model || "",
      questions: questionEntries.map((entry) => ({
        questionId: entry.questionId || "",
        signature: entry.signature,
      })),
    }));
  }

  function extractJsonPayloadFromText(text) {
    if (typeof text !== "string") return null;

    const direct = parseJsonSafe(text.trim());
    if (direct) return direct;

    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) {
      const parsedFence = parseJsonSafe(fenced[1].trim());
      if (parsedFence) return parsedFence;
    }

    const start = text.indexOf("{");
    if (start === -1) return null;

    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let index = start; index < text.length; index += 1) {
      const char = text[index];
      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (char === "\\") {
          escaped = true;
        } else if (char === "\"") {
          inString = false;
        }
        continue;
      }

      if (char === "\"") {
        inString = true;
        continue;
      }
      if (char === "{") {
        depth += 1;
        continue;
      }
      if (char === "}") {
        depth -= 1;
        if (depth === 0) {
          return parseJsonSafe(text.slice(start, index + 1));
        }
      }
    }

    return null;
  }

  function extractGeminiContent(payload) {
    const candidate = Array.isArray(payload?.candidates) ? payload.candidates[0] : null;
    const parts = candidate?.content?.parts;
    if (!Array.isArray(parts)) return "";
    // Try each part individually first — if one is valid JSON, return it directly
    // (avoids corruption from joining text + grounding metadata parts)
    for (const part of parts) {
      const text = typeof part === "string" ? part : typeof part?.text === "string" ? part.text : "";
      const trimmed = text.trim();
      if (!trimmed.startsWith("{")) continue;
      if (parseJsonSafe(trimmed) || extractJsonPayloadFromText(trimmed)) {
        return text;
      }
    }
    return parts.map((part) => {
      if (typeof part === "string") return part;
      if (typeof part?.text === "string") return part.text;
      return "";
    }).filter(Boolean).join("\n");
  }

  function extractAnswerValuesFromLlmItem(item) {
    if (typeof item === "string") {
      return normalizeResolvedAnswers(item);
    }
    if (!item || typeof item !== "object") return [];
    return normalizeResolvedAnswers([
      item.answer,
      item.answers,
      item.answerLabels,
      item.answerTexts,
      item.optionLabels,
      item.optionTexts,
      item.textAnswers,
      item.text,
    ]);
  }

  function buildLlmAnswerItems(payload) {
    if (!payload || typeof payload !== "object") return [];
    if (Array.isArray(payload.answers)) return payload.answers;
    if (Array.isArray(payload.data)) return payload.data;
    if (payload.answers && typeof payload.answers === "object") {
      return Object.entries(payload.answers).map(([signature, answer]) => ({
        signature,
        answer,
      }));
    }
    if (payload.answerMap && typeof payload.answerMap === "object") {
      return Object.entries(payload.answerMap).map(([signature, answer]) => ({
        signature,
        answer,
      }));
    }
    return [];
  }

  function cacheExamLlmAnswers(payload, questionEntries) {
    const signatureMap = Object.create(null);
    const questionIdMap = Object.create(null);
    for (const entry of questionEntries) {
      signatureMap[entry.signature] = entry;
      for (const alias of entry.aliases || []) {
        signatureMap[alias] = entry;
      }
      if (entry.questionId) {
        questionIdMap[entry.questionId] = entry;
      }
    }

    let storedCount = 0;
    for (const item of buildLlmAnswerItems(payload)) {
      const signature = normalizeText(item?.signature || item?.questionSignature || item?.key);
      const questionId = normalizeVideoId(item?.questionId || item?.id || item?.eid);
      const entry = (
        (signature && signatureMap[signature])
        || (questionId && questionIdMap[questionId])
        || null
      );
      if (!entry) continue;

      const answers = extractAnswerValuesFromLlmItem(item);
      if (!answers.length) continue;
      if (storeExamAnswer(entry, answers)) {
        storedCount += 1;
      }
    }

    return storedCount;
  }

  function buildGeminiRequestBody(questionEntries) {
    const session = getSession();
    const userContent = JSON.stringify({
      task: "请一次性解答整张平时测试试卷，利用搜索查找准确答案，并严格按指定 JSON 返回。",
      session: {
        recruitId: session.recruitId || "",
        examId: session.examId || "",
        studentExamId: session.studentExamId || "",
      },
      questions: questionEntries.map((entry) => ({
        questionId: entry.questionId || "",
        signature: entry.signature,
        question: entry.text,
        type: entry.textInputCount > 0 ? "text" : entry.isMulti ? "multiple-choice" : "single-choice",
        textInputCount: entry.textInputCount || 0,
        options: entry.options.map((option) => ({
          label: option.label,
          text: option.text,
        })),
      })),
    }, null, 2);

    return {
      systemInstruction: {
        parts: [
          {
            text: [
              "你是课程考试答题助手。请利用联网搜索能力查找题目答案。",
              "你必须只返回 JSON，不要 Markdown，不要代码块，不要解释。",
              "返回格式固定为 {\"answers\":[{\"questionId\":\"...\",\"signature\":\"...\",\"answerLabels\":[\"A\"],\"answerTexts\":[\"选项文本\"],\"textAnswers\":[\"填空答案\"]}] }。",
              "单选或多选优先填写 answerLabels；如果题目是填空、问答、简答，请填写 textAnswers。",
              "questionId 和 signature 必须逐字照抄输入。",
            ].join("\n"),
          },
        ],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userContent }],
        },
      ],
      tools: [{ google_search: {} }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            answers: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  questionId: { type: "STRING" },
                  signature: { type: "STRING" },
                  answerLabels: { type: "ARRAY", items: { type: "STRING" } },
                  answerTexts: { type: "ARRAY", items: { type: "STRING" } },
                  textAnswers: { type: "ARRAY", items: { type: "STRING" } },
                },
                required: ["questionId", "signature"],
              },
            },
          },
          required: ["answers"],
        },
      },
    };
  }

  async function requestExamAnswersFromLlm(questionEntries) {
    const endpoint = buildExamLlmApiEndpoint(state.exam.llm.apiBaseUrl, state.exam.llm.model, state.exam.llm.apiKey);
    if (!endpoint) {
      throw new Error("missing exam llm endpoint");
    }

    const maxRetries = 3;
    let lastError = null;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await _requestExamAnswersFromLlmOnce(endpoint, questionEntries, attempt);
      } catch (error) {
        lastError = error;
        logWarn("exam", `llm request attempt ${attempt}/${maxRetries} failed`, {
          attempt,
          error: normalizeText(error?.message || error) || "unknown",
          endpoint: shortenHost(state.exam.llm.apiBaseUrl),
          model: state.exam.llm.model,
        });
        if (attempt < maxRetries) {
          const delayMs = Math.min(2000 * attempt, 6000);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }
    throw lastError || new Error("llm request failed after retries");
  }

  async function _requestExamAnswersFromLlmOnce(endpoint, questionEntries, attempt) {

    const response = await gmXmlhttpRequestCompat({
      method: "POST",
      url: endpoint,
      timeout: 90000,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(buildGeminiRequestBody(questionEntries)),
    });

    const status = Number(response?.status || 0);
    const bodyText = typeof response?.responseText === "string"
      ? response.responseText
      : typeof response?.response === "string"
        ? response.response
        : "";
    if (!(status >= 200 && status < 300)) {
      const truncatedBody = bodyText.length > 500 ? bodyText.slice(0, 500) + "…" : bodyText;
      logWarn("exam", "llm request HTTP error", {
        status,
        endpoint,
        model: state.exam.llm.model,
        responseBody: truncatedBody,
        statusText: response?.statusText || "",
        finalUrl: response?.finalUrl || "",
      });
      throw new Error(`llm request failed with status ${status || "unknown"}: ${truncatedBody.slice(0, 120)}`);
    }

    const outerPayload = parseJsonSafe(bodyText);
    if (!outerPayload || typeof outerPayload !== "object") {
      logWarn("exam", "llm response body parse failed", {
        status,
        bodyLength: bodyText.length,
        bodyPreview: bodyText.slice(0, 300),
      });
      throw new Error("llm response body is not valid json");
    }

    const content = extractGeminiContent(outerPayload);
    let parsedPayload = extractJsonPayloadFromText(content);
    // Fallback: Gemini with responseMimeType may embed parsed JSON directly
    if (!parsedPayload && content && typeof content === "string") {
      try { parsedPayload = JSON.parse(content.replace(/^\uFEFF/, "")); } catch (_) { /* ignore */ }
    }
    if (!parsedPayload || typeof parsedPayload !== "object") {
      logWarn("exam", "llm response content parse failed", {
        contentLength: (content || "").length,
        contentPreview: (content || "").slice(0, 300),
      });
      throw new Error("llm response content is not valid json");
    }

    const storedCount = cacheExamLlmAnswers(parsedPayload, questionEntries);
    if (!storedCount) {
      logWarn("exam", "llm returned zero mappable answers", {
        parsedKeys: Object.keys(parsedPayload).slice(0, 10),
        questionCount: questionEntries.length,
      });
      throw new Error("llm returned zero mappable answers");
    }
    return {
      storedCount,
      questionCount: questionEntries.length,
    };
  }

  function startExamAnswerBatchRequest(requestKey, questionEntries) {
    // Double guard: never fire an LLM request if the exam is already done.
    const examVm = findHomeworkExamVm();
    if (examVm && isStudentExamCompletionComplete(
      buildStudentExamSharedCompletionRecord(examVm, {
        source: "gm-shared:batch-request-gate",
        reason: "batchRequestGate",
        saveMode: 0,
      })
    )) {
      logDebug("exam", "startExamAnswerBatchRequest short-circuited: exam complete");
      return;
    }

    state.exam.answerBank = Object.create(null);
    state.exam.unresolvedSignature = "";
    state.exam.lastUnresolvedAt = 0;
    state.exam.llm.requestKey = requestKey;
    state.exam.llm.requestState = "pending";
    state.exam.llm.requestError = "";
    state.exam.llm.requestedAt = now();
    state.exam.llm.resolvedAt = 0;
    state.exam.llm.retryCount = 0;

    logDebug("exam", "regular exam llm request started", {
      questionCount: questionEntries.length,
      endpoint: shortenHost(state.exam.llm.apiBaseUrl),
      model: state.exam.llm.model,
    });

    state.exam.llm.requestPromise = requestExamAnswersFromLlm(questionEntries).then((result) => {
      if (state.exam.llm.requestKey !== requestKey) return result;
      state.exam.llm.requestState = "ready";
      state.exam.llm.requestError = "";
      state.exam.llm.resolvedAt = now();
      logSuccess("exam", "regular exam llm answers ready", result);
      updateUi("外部模型答案已返回，开始自动作答");
      return result;
    }).catch((error) => {
      if (state.exam.llm.requestKey !== requestKey) return null;
      state.exam.llm.requestState = "error";
      state.exam.llm.requestError = normalizeText(error?.message || error) || "unknown error";
      state.exam.llm.retryCount = (state.exam.llm.retryCount || 0) + 1;
      logWarn("exam", "regular exam llm request failed (all retries exhausted)", {
        error: state.exam.llm.requestError,
        retryCount: state.exam.llm.retryCount,
        endpoint: shortenHost(state.exam.llm.apiBaseUrl),
        model: state.exam.llm.model,
        stack: error?.stack ? String(error.stack).slice(0, 300) : "",
      });
      updateUi("外部模型答题请求失败，请检查菜单配置");
      return null;
    }).finally(() => {
      if (state.exam.llm.requestKey === requestKey) {
        state.exam.llm.requestPromise = null;
      }
    });
  }

  function ensureExamAnswerBankReady(pageVm, questionInfo) {
    // Hard short-circuit: never request AI answers for a completed exam.
    const gateCompletion = buildStudentExamSharedCompletionRecord(pageVm, {
      source: "gm-shared:exam-answer-bank-gate",
      reason: "answerBankGate",
      saveMode: 0,
    });
    const gateComplete = isStudentExamCompletionComplete(gateCompletion)
      || (pageVm && isHomeworkExamLastQuestion(pageVm) && questionInfo?.explicitAnswers?.length > 0);
    if (gateComplete) {
      return {
        ready: true,
        reason: "exam-complete",
      };
    }

    if (lookupExamAnswer(questionInfo).length) {
      return {
        ready: true,
        reason: "cached",
      };
    }

    if (!isExamLlmConfigured()) {
      logOnce("exam-llm-config-missing", "warn", "exam", "regular exam llm config missing", {
        endpoint: shortenHost(state.exam.llm.apiBaseUrl),
        model: state.exam.llm.model || "",
        apiKeyConfigured: Boolean(normalizeText(state.exam.llm.apiKey)),
      });
      return {
        ready: false,
        reason: "missing-config",
      };
    }

    const questionEntries = getExamQuestionInventory(pageVm);
    if (!questionEntries.length) {
      logOnce("exam-llm-inventory-empty", "warn", "exam", "regular exam question inventory unavailable");
      return {
        ready: false,
        reason: "inventory-empty",
      };
    }

    const requestKey = buildExamAnswerRequestKey(questionEntries);
    if (state.exam.llm.requestKey === requestKey && state.exam.llm.requestState === "ready") {
      return {
        ready: true,
        reason: "ready",
        questionCount: questionEntries.length,
      };
    }
    if (state.exam.llm.requestKey === requestKey && state.exam.llm.requestState === "pending") {
      return {
        ready: false,
        reason: "pending",
        questionCount: questionEntries.length,
      };
    }
    if (
      state.exam.llm.requestKey === requestKey
      && state.exam.llm.requestState === "error"
      && !isDelayElapsed(state.exam.llm.requestedAt, now(), 15000)
    ) {
      return {
        ready: false,
        reason: "error",
        questionCount: questionEntries.length,
        error: state.exam.llm.requestError,
      };
    }

    startExamAnswerBatchRequest(requestKey, questionEntries);
    return {
      ready: false,
      reason: "pending",
      questionCount: questionEntries.length,
    };
  }

  function getCurrentExamEntryFromVm(pageVm) {
    if (!pageVm) return null;
    const inventory = getExamQuestionInventory(pageVm);
    if (!inventory.length) return null;
    const currentIndex = Number(pageVm?.currentQuestionIndex);
    if (Number.isFinite(currentIndex) && currentIndex >= 0) {
      return inventory.find((entry, index) => entry.index === currentIndex || index === currentIndex) || null;
    }
    return inventory[0] || null;
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

  function isExamOptionNodeSelected(node) {
    if (!node) return false;
    if (queryFirstBySelectors([
      "input[type='radio']:checked",
      "input[type='checkbox']:checked",
      ".onChecked",
    ], node)) {
      return true;
    }

    const checkedMarks = queryAllBySelectors(["img.flagChecked"], node);
    const selectedIconRe = /(94d3a3df37ca452e872099a548602d4d|134c9fe76fac4b76ace068fdc8b95f07)/i;
    return checkedMarks.some((mark) => (
      isElementVisible(mark)
      && selectedIconRe.test(String(mark.getAttribute?.("src") || ""))
    ));
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
        selected: (
          /(^|[^a-z])(checked|selected|active|choose|cur|on)([^a-z]|$)/i.test(hint)
          || String(node.getAttribute?.("aria-checked") || "").toLowerCase() === "true"
          || isExamOptionNodeSelected(node)
        ),
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

  function readCurrentExamQuestion(pageVm = state.exam.pageVm || null) {
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
    const currentEntry = getCurrentExamEntryFromVm(pageVm);

    return {
      root,
      questionId: currentEntry?.questionId || "",
      text: questionText,
      signature,
      aliases: currentEntry ? [currentEntry.signature, ...(currentEntry.aliases || [])] : [],
      aliasTexts: currentEntry?.aliasTexts || [],
      options,
      textInputs,
      isMulti,
      explicitAnswers,
    };
  }

  function buildExamAnswerTodoTemplate(questionInfo) {
    if (!questionInfo) return null;
    return {
      signature: questionInfo.signature || "",
      question: questionInfo.text || "",
      optionLabels: questionInfo.options.map((option) => option.label).filter(Boolean),
      optionTexts: questionInfo.options.map((option) => option.text).filter(Boolean),
      textInputCount: questionInfo.textInputs.length,
      endpoint: shortenHost(state.exam.llm.apiBaseUrl),
      model: state.exam.llm.model || "",
      apiKeyConfigured: Boolean(normalizeText(state.exam.llm.apiKey)),
    };
  }

  function resolveQuestionTargets(questionInfo) {
    const explicitAnswers = questionInfo.explicitAnswers || [];
    if (explicitAnswers.length) {
      storeExamAnswer(questionInfo, explicitAnswers);
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

    if (!isExamLlmConfigured()) {
      return {
        answers: [],
        source: "external-llm-not-ready",
        fallback: false,
        unresolved: true,
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
      changed = safeCall(() => {
        input.blur?.();
        input.dispatchEvent(new PageEvent("blur", {
          bubbles: true,
        }));
        return true;
      }, changed) || changed;
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

  function answerCurrentExamQuestion(questionInfo, pageVm = state.exam.pageVm || null) {
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

    if (questionInfo.options.length) {
      changed = applyHomeworkChoiceAnswerVm(pageVm, questionInfo, resolution.answers) || changed;
    } else if (questionInfo.textInputs.length) {
      changed = applyHomeworkTextAnswerVm(pageVm, questionInfo, resolution.answers) || changed;
    }

    if (!changed && isHomeworkQuestionAnswerSatisfied(pageVm, questionInfo, resolution.answers)) {
      return false;
    }

    if (!changed && targetOptions.length) {
      for (const option of targetOptions) {
        if (option.selected) continue;
        changed = clickElement(option.element) || changed;
      }
    } else if (!changed && questionInfo.textInputs.length) {
      changed = fillExamTextInputs(questionInfo, resolution.answers) || changed;
    } else if (!changed) {
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

  function triggerExamSave(pageVm, questionInfo, kind) {
    if (!isHomeworkExamVm(pageVm)) return false;
    if (kind === "temporary" && typeof pageVm.beforeTemporarySave !== "function") return false;
    if (kind === "lastQuestion" && typeof pageVm.switchQuestion !== "function") return false;

    if (state.exam.pendingSave.kind === kind) {
      if (!isDelayElapsed(state.exam.pendingSave.startedAt, now(), 15000)) return false;
      logWarn("exam", `regular exam ${kind} save timed out, retrying`, {
        question: questionInfo?.text || "",
      });
      resetExamSaveState();
    }

    state.exam.pendingSave = {
      kind,
      signature: questionInfo?.signature || "",
      startedAt: now(),
    };

    const currentQuestionIndex = Number(pageVm.currentQuestionIndex || 0);
    const triggered = safeCall(() => {
      if (kind === "temporary") {
        pageVm.beforeTemporarySave();
      } else {
        pageVm.switchQuestion(0, 3);
      }
      return true;
    }, false);
    if (!triggered) {
      resetExamSaveState();
      return false;
    }

    state.exam.lastAdvancedAt = state.exam.pendingSave.startedAt;
    logSuccess("exam", `regular exam ${kind} save triggered`, {
      currentQuestionIndex,
      question: questionInfo?.text || "",
    });
    return true;
  }

  function trySaveAndCloseLastExamQuestion(pageVm, questionInfo) {
    if (!isHomeworkExamVm(pageVm) || !questionInfo?.signature) return false;
    if (!isHomeworkExamLastQuestion(pageVm)) return false;
    if (state.exam.unresolvedSignature === questionInfo.signature) return false;
    if (state.exam.lastSignature === questionInfo.signature && !isDelayElapsed(state.exam.lastAnsweredAt)) return false;

    const resolvedAnswers = (Array.isArray(questionInfo.explicitAnswers) && questionInfo.explicitAnswers.length)
      ? [...questionInfo.explicitAnswers]
      : lookupExamAnswer(questionInfo);
    if (!resolvedAnswers.length) return false;

    const hasRecordedAnswer = state.exam.lastSignature === questionInfo.signature;
    const isAnswerSatisfied = (
      (questionInfo.options.length || questionInfo.textInputs.length)
        ? isHomeworkQuestionAnswerSatisfied(pageVm, questionInfo, resolvedAnswers)
        : true
    );
    if (!hasRecordedAnswer && !isAnswerSatisfied) {
      return false;
    }

    return triggerExamSave(pageVm, questionInfo, "lastQuestion");
  }

  function restoreExamAnsweringMode(questionInfo) {
    if (state.exam.recoveredThisPage) return false;
    if (!questionInfo || !questionInfo.signature) return false;

    const ts = now();
    state.exam.recoveredThisPage = true;
    state.exam.lastSessionHeartbeatAt = ts;
    markExamSessionLaunchState("active", {
      ...(getSession()),
      host: PAGE_HOST,
      routeName: state.exam.routeName || "doHomework",
      captureMode: state.exam.captureMode || "fallback-dom",
      recoverMode: "exam-page-runtime",
      recoveredAt: ts,
      lastHeartbeatAt: state.exam.lastSessionHeartbeatAt,
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

    if (isDoExaminationRoute()) {
      logOnce("exam-doexamination-todo", "warn", "exam", "formal exam runtime unsupported (TODO)");
      updateUi("正式考试页暂未接入（TODO）");
      return false;
    }

    const pageVm = findHomeworkExamVm();

    if (tryStartExamFlow()) {
      updateUi("已进入平时测试答题页");
      return true;
    }

    // Check pending close request first (from a previous save chain completion).
    if (pageVm && hasPendingHomeworkExamCloseRequest(pageVm)) {
      if (state.config.autoCloseCompletedExam) {
        requestHomeworkExamPageClose(pageVm, "pendingCloseRequest");
      }
      updateUi("平时测试已完成，跳过 AI");
      return true;
    }

    const questionInfo = readCurrentExamQuestion(pageVm);
    if (!questionInfo || (!questionInfo.options.length && !questionInfo.textInputs.length)) {
      // Even without question info, check completion to avoid sending AI
      // requests for an already-completed exam after page refresh.
      if (pageVm && maybeBypassCompletedHomeworkExam(pageVm, "runtimeProgressComplete")) {
        updateUi("平时测试已完成，跳过 AI 并关闭页面");
        return true;
      }
      updateUi(pageVm ? "平时测试页已接管，等待题目加载" : "等待平时测试题目加载");
      return false;
    }

    if (restoreExamAnsweringMode(questionInfo)) {
      updateUi("平时测试页已接管");
    }

    if (questionInfo.explicitAnswers.length) {
      storeExamAnswer(questionInfo, questionInfo.explicitAnswers);
    }

    // Hard gate: if the exam is already complete, do NOT request AI answers.
    // This must run before ensureExamAnswerBankReady which triggers the LLM.
    // Check both the DTO-based completion AND the DOM-based last-question state.
    const preAiCompletion = buildStudentExamSharedCompletionRecord(pageVm, {
      source: "gm-shared:exam-page-progress",
      reason: "preAiGate",
      saveMode: 0,
    });
    const examAlreadyComplete = isStudentExamCompletionComplete(preAiCompletion)
      || (isHomeworkExamLastQuestion(pageVm) && questionInfo.explicitAnswers.length > 0);
    if (pageVm && examAlreadyComplete) {
      if (maybeBypassCompletedHomeworkExam(pageVm, "runtimeProgressComplete")) {
        updateUi("平时测试已完成，跳过 AI 并关闭页面");
        return true;
      }
      // Bypass returned false — either completion not confirmed or save chain pending.
      // If no save chain is running, start one for the last question.
      if (!state.exam.pendingSave.kind && isHomeworkExamLastQuestion(pageVm)) {
        if (trySaveAndCloseLastExamQuestion(pageVm, questionInfo)) {
          updateUi("已完成最后一题，正在暂存并关闭页面");
          return true;
        }
      }
      updateUi("平时测试已完成，等待保存链完成");
      return false;
    }

    const cachedAnswers = lookupExamAnswer(questionInfo);
    const answerBankState = ensureExamAnswerBankReady(pageVm, questionInfo);
    if (!questionInfo.explicitAnswers.length && !cachedAnswers.length && !answerBankState.ready) {
      const answerContext = buildExamAnswerTodoTemplate(questionInfo);
      if (answerBankState.reason === "missing-config") {
        logOnce(
          `exam-answer-config-missing:${questionInfo.signature || "unknown"}`,
          "warn",
          "exam",
          "regular exam llm config missing for current question",
          answerContext,
        );
        updateUi("平时测试页已接管，等待配置外部答题接口");
        return false;
      }
      if (answerBankState.reason === "inventory-empty") {
        logOnce(
          `exam-answer-inventory-empty:${questionInfo.signature || "unknown"}`,
          "warn",
          "exam",
          "regular exam question inventory unavailable",
          answerContext,
        );
        updateUi("平时测试页已接管，暂未拿到整卷题目");
        return false;
      }
      if (answerBankState.reason === "error") {
        logOnce(
          `exam-answer-request-error:${questionInfo.signature || "unknown"}:${answerBankState.error || "unknown"}`,
          "warn",
          "exam",
          "regular exam llm request failed",
          answerBankState.error || answerContext,
        );
        updateUi("外部模型答题请求失败，请检查菜单配置");
        return false;
      }
      updateUi(`已收集${answerBankState.questionCount || 0}道题，等待外部模型返回答案`);
      return false;
    }

    if (answerCurrentExamQuestion(questionInfo, pageVm)) {
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

    if (trySaveAndCloseLastExamQuestion(pageVm, questionInfo)) {
      updateUi("已完成最后一题，正在暂存并关闭页面");
      return true;
    }

    if (state.exam.pendingSave.kind) {
      updateUi("已完成最后一题，正在暂存并关闭页面");
      return false;
    }

    // Completion gate: after the save chain has had a chance to run (or if the
    // exam was completed externally), block AI requests and trigger close.
    if (pageVm && maybeBypassCompletedHomeworkExam(pageVm, "runtimeProgressComplete")) {
      updateUi("平时测试已完成，跳过 AI 并关闭页面");
      return true;
    }

    if (isHomeworkExamLastQuestion(pageVm)) {
      updateUi("已到最后一题，等待保存并关闭条件满足");
      return false;
    }

    updateUi("平时测试运行中");
    return false;
  }

  function maybeLaunchCurrentLessonExam(vm) {
    if (!isStudyPage()) return false;
    if (!state.config.autoQuiz || !state.config.autoOpenRegularExam) {
      logDebug("exam", "skip regular exam launch: config disabled", {
        autoQuiz: state.config.autoQuiz,
        autoOpenRegularExam: state.config.autoOpenRegularExam,
      });
      return false;
    }
    if (!isExamLlmConfigured()) {
      if (!state.logKeys.has("exam-launch-llm-missing-toast")) {
        state.logKeys.add("exam-launch-llm-missing-toast");
        toast("考试答题 AI 未配置，请在 Tampermonkey 菜单中设置 API Key 和 Model");
      }
      logOnce("exam-launch-llm-missing", "warn", "exam", "skip regular exam launch: AI config incomplete", {
        endpoint: shortenHost(state.exam.llm.apiBaseUrl),
        model: state.exam.llm.model || "",
        apiKeyConfigured: Boolean(normalizeText(state.exam.llm.apiKey)),
      });
      return false;
    }
    if (vm.testDialog || vm.imgDialog) {
      logDebug("exam", "skip regular exam launch: dialog active", {
        testDialog: Boolean(vm.testDialog),
        imgDialog: Boolean(vm.imgDialog),
      });
      return false;
    }
    if (hasLaunchedAnyRegularExamThisSession()) {
      logDebug("exam", "skip regular exam launch: another exam page still active", {
        launchState: getExamSessionLaunchState(),
        sessionStudentExamId: state.exam.session?.studentExamId || "",
        sessionExamId: state.exam.session?.examId || "",
      });
      return false;
    }
    // In-memory mutex: prevent concurrent launches within the same tick cycle.
    // armExamSession writes to GM storage asynchronously, so the next tick
    // could pass hasLaunchedAnyRegularExamThisSession before the write lands.
    const launchMutexAge = now() - Number(state.exam.lastLaunchAt || 0);
    if (state.exam.lastLaunchAt && launchMutexAge < 10000) {
      logDebug("exam", "skip regular exam launch: in-memory launch mutex active", {
        lastLaunchAt: state.exam.lastLaunchAt,
        mutexAgeMs: launchMutexAge,
      });
      return false;
    }
    const candidates = collectPendingChapterExamCandidates(vm);
    if (!candidates.length) {
      logDebug("exam", "skip regular exam launch: no eligible candidates", {
        currentVideoId: resolveCurrentVideoId(vm),
        currentChapterName: getExamLaunchChapterName(findCurrentLessonEntry(vm)?.chapter),
      });
      return false;
    }

    const candidate = pickPendingChapterExamCandidate(candidates);
    if (!candidate) {
      logDebug("exam", "skip regular exam launch: all candidates already launched", {
        candidates: candidates.map(buildExamLaunchCandidatePayload).filter(Boolean),
      });
      return false;
    }

    const {
      launchKey,
      lessonLike,
      studentExamDto,
      source,
      entry,
    } = candidate;
    const fallbackLaunchEntry = resolveRegularExamFallbackLaunchTarget(candidate);
    const fallbackLaunchTarget = fallbackLaunchEntry.target || lessonLike;

    armExamSession(buildExamSessionPayload(vm, lessonLike));
    const launchPayload = {
      lessonId: lessonLike?.id,
      studentExamId: studentExamDto?.id,
      examUrl: studentExamDto?.examUrl,
      source,
      chapterName: normalizeText(entry?.chapter?.name || entry?.chapter?.chapterName || ""),
    };
    logDebug("exam", "selected regular exam launch candidate", {
      launchKey,
      ...launchPayload,
      currentVideoId: resolveCurrentVideoId(vm),
    });
    logDebug("exam", "launch regular exam attempt", launchPayload);
    const examUrl = studentExamDto?.examUrl || state.exam.session?.examUrl || "";
    // Acquire in-memory mutex BEFORE opening the window to prevent concurrent
    // launches from subsequent ticks that fire before GM storage is updated.
    state.exam.lastLaunchAt = now();
    state.exam.lastLaunchKey = launchKey;
    let launched = openRegularExamPopup(examUrl, launchKey);
    if (!launched) {
      launched = openRegularExamExtensionTab(examUrl, launchKey);
    }
    if (launched) {
      state.exam.launchedSessionExamKeys[launchKey] = now();
      state.exam.lastLaunchKey = launchKey;
      state.exam.lastLaunchAt = now();
      markExamSessionLaunchState("launching", {
        ...buildExamSessionPayload(vm, lessonLike),
        launchKey,
        launchAt: state.exam.lastLaunchAt,
        lastHeartbeatAt: state.exam.lastLaunchAt,
      });
      logDebug("exam", "regular exam launch marked as launched", {
        launchKey,
        driver: examUrl ? "popup-or-extension" : "unknown",
      });
      toast("已打开首个符合条件的平时测试");
      return true;
    }

    if (typeof vm.chapterExamEntry === "function") {
      logDebug("exam", "fallback regular exam launch via chapterExamEntry", {
        launchKey,
        ...launchPayload,
        fallbackLaunchSource: fallbackLaunchEntry.source || source,
      });
      launched = safeCall(() => {
        vm.chapterExamEntry(fallbackLaunchTarget);
        return true;
      }, false) || launched;
    }
    if (!launched && typeof vm.judgeLookAnswer === "function") {
      logDebug("exam", "fallback regular exam launch via judgeLookAnswer", {
        launchKey,
        ...launchPayload,
        fallbackLaunchSource: fallbackLaunchEntry.source || source,
      });
      launched = safeCall(() => {
        vm.judgeLookAnswer(fallbackLaunchTarget);
        return true;
      }, false) || launched;
    }
    if (!launched) {
      // Release in-memory mutex on failure so the next tick can retry.
      state.exam.lastLaunchAt = 0;
      state.exam.lastLaunchKey = "";
      logWarn("exam", "regular exam launch failed", {
        ...launchPayload,
        examUrl,
      });
      return false;
    }

    state.exam.launchedSessionExamKeys[launchKey] = now();
    state.exam.lastLaunchKey = launchKey;
    state.exam.lastLaunchAt = now();
    markExamSessionLaunchState("launching", {
      ...buildExamSessionPayload(vm, lessonLike),
      launchKey,
      launchAt: state.exam.lastLaunchAt,
      lastHeartbeatAt: state.exam.lastLaunchAt,
    });
    logDebug("exam", "regular exam launch marked as launched", {
      launchKey,
      driver: "fallback",
    });
    logSuccess("exam", "launch regular exam", launchPayload);
    toast("已自动打开首个符合条件的平时测试");
    return true;
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
      if (state.serverProgress.pendingVideoId && state.serverProgress.pendingVideoId !== currentVideoId) {
        clearPendingServerProgressRefresh();
      }
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

  function findCurrentLessonEntry(vm) {
    const currentVideoId = resolveCurrentVideoId(vm);
    if (!currentVideoId) return null;
    return collectVideoEntries(vm).find((entry) => entry.videoId === currentVideoId) || null;
  }

  function getChapterLaunchKey(chapter, chapterIndex = -1) {
    const chapterId = normalizeVideoId(chapter?.id)
      || `chapter-index-${Number.isFinite(chapterIndex) ? chapterIndex : -1}`;
    const chapterName = getExamLaunchChapterName(chapter) || chapterId;
    return `${chapterId}::${chapterName}`;
  }

  function collectVideoEntries(vm) {
    if (!Array.isArray(vm?.videoList)) return [];

    const entries = [];
    vm.videoList.forEach((chapter, chapterIndex) => {
      const chapterKey = getChapterLaunchKey(chapter, chapterIndex);
      const lessons = chapter?.videoLessons || [];
      lessons.forEach((lesson, lessonIndex) => {
        const smallLessons = lesson?.videoSmallLessons || [];
        if (smallLessons.length) {
          smallLessons.forEach((smallLesson, smallLessonIndex) => {
            if (!smallLesson?.videoId) return;
            entries.push({
              chapter,
              chapterKey,
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
          chapterKey,
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

  function getExamLaunchChapterName(chapter) {
    return normalizeText(chapter?.name || "");
  }

  function buildLessonLaunchProgressPayload(lesson) {
    const confirmed = getServerProgressEntry(lesson);
    return {
      lessonId: normalizeVideoId(lesson?.id),
      videoId: normalizeVideoId(lesson?.videoId),
      watchState: Number(confirmed?.watchState ?? lesson?.watchState ?? 0),
      studyTotalTime: Number(confirmed?.studyTotalTime ?? lesson?.studyTotalTime ?? 0),
      serverPercent: getServerRecordPercent(lesson),
      displayedPercent: getDisplayedRecordPercent(lesson),
      isStudiedLesson: Number(lesson?.isStudiedLesson || 0),
      complete: isLessonLaunchProgressComplete(lesson),
    };
  }

  function getExamCandidateSourcePriority(source) {
    switch (String(source || "")) {
      case "progressTarget":
        return 3;
      case "lesson":
        return 2;
      case "chapter":
        return 1;
      default:
        return 0;
    }
  }

  function extractDirectStudentExamCarrier(source) {
    if (!source || typeof source !== "object") return null;
    const directCarrier = (
      source.studentExamDto
      || source.studentExam
      || source.chapterStudentExamDto
      || source.chapterExamDto
      || source.chapterExam
      || source.examDto
      || source.examInfo
      || source.homeworkExam
      || null
    );
    return isLikelyStudentExamDto(directCarrier) ? directCarrier : null;
  }

  function resolveRegularExamFallbackLaunchTarget(candidate) {
    if (!candidate || typeof candidate !== "object") {
      return {
        target: null,
        source: "",
      };
    }

    const expectedStudentExamId = normalizeVideoId(candidate.studentExamDto?.id);
    const directTargets = [
      {
        source: "candidate",
        target: candidate.lessonLike,
      },
      {
        source: "chapter",
        target: candidate.entry?.chapter,
      },
      {
        source: "progressTarget",
        target: candidate.entry?.progressTarget,
      },
      {
        source: "lesson",
        target: candidate.entry?.lesson,
      },
    ];
    for (const item of directTargets) {
      const directCarrier = extractDirectStudentExamCarrier(item.target);
      if (!directCarrier) continue;
      const directStudentExamId = normalizeVideoId(directCarrier?.id);
      if (expectedStudentExamId && directStudentExamId && directStudentExamId !== expectedStudentExamId) {
        continue;
      }
      return item;
    }

    if (candidate.entry?.chapter && candidate.studentExamDto) {
      return {
        source: "chapter-wrap",
        target: {
          ...candidate.entry.chapter,
          studentExamDto: candidate.studentExamDto,
        },
      };
    }

    if (candidate.lessonLike && candidate.studentExamDto) {
      return {
        source: "candidate-wrap",
        target: {
          ...candidate.lessonLike,
          studentExamDto: candidate.studentExamDto,
        },
      };
    }

    return {
      target: null,
      source: "",
    };
  }

  function getExamCandidateSourceMeta(lessonLike, source, entry, vm, currentEntry) {
    const studentExamDto = extractStudentExamDto(lessonLike);
    if (!studentExamDto) return null;

    const recordedComplete = isExamComplete(lessonLike, entry);
    const examState = Number(studentExamDto?.state || 0);

    let pending;
    if (state.config.autoSubmitCompletedExam) {
      pending = examState !== 3 && examState !== 4;
    } else {
      const isTerminalExamState = examState === 3 || examState === 4
        || (examState === 2 && recordedComplete);
      pending = !isTerminalExamState && !recordedComplete;
    }


    return {
      launchKey: [
        normalizeVideoId(studentExamDto?.id) || "studentExam",
        normalizeVideoId(studentExamDto?.exam?.id) || normalizeVideoId(vm?.recruitId) || "recruit",
      ].join(":"),
      lessonLike,
      studentExamDto,
      source,
      sourcePriority: getExamCandidateSourcePriority(source),
      entry,
      currentEntry,
      recordedCompletion,
      recordedComplete,
      pending,
    };
  }

  function getExamCandidateSourceScore(candidateSource) {
    if (!candidateSource || typeof candidateSource !== "object") return 0;
    let score = Number(candidateSource.sourcePriority || 0) * 100;
    if (candidateSource.recordedComplete) score += 1000;
    if (candidateSource.recordedCompletion) {
      score += 100;
      if (candidateSource.recordedCompletion.answered !== null) score += 10;
      if (candidateSource.recordedCompletion.total !== null) score += 10;
      if (candidateSource.recordedCompletion.percentage !== null) score += 5;
      if (candidateSource.recordedCompletion.ratioText) score += 5;
    }
    if (candidateSource.pending) score += 1;
    return score;
  }

  function shouldPreferExamCandidateSource(currentSource, nextSource) {
    if (!currentSource) return true;
    const currentScore = getExamCandidateSourceScore(currentSource);
    const nextScore = getExamCandidateSourceScore(nextSource);
    if (nextScore !== currentScore) return nextScore > currentScore;
    return Number(nextSource?.sourcePriority || 0) > Number(currentSource?.sourcePriority || 0);
  }

  function buildExamLaunchSourcePayload(candidateSource) {
    if (!candidateSource || typeof candidateSource !== "object") return null;
    return {
      source: candidateSource.source || "",
      sourcePriority: Number(candidateSource.sourcePriority || 0),
      lessonId: normalizeVideoId(candidateSource.lessonLike?.id),
      studentExamId: normalizeVideoId(candidateSource.studentExamDto?.id),
      examId: normalizeVideoId(candidateSource.studentExamDto?.exam?.id),
      examState: Number(candidateSource.studentExamDto?.state || 0),
      examUrl: candidateSource.studentExamDto?.examUrl || "",
      recordedCompletion: candidateSource.recordedCompletion || null,
      recordedCompletionSource: normalizeText(candidateSource.recordedCompletion?.source || ""),
      recordedCompletionReason: normalizeText(candidateSource.recordedCompletion?.reason || ""),
      recordedCompletionUpdatedAt: Number(candidateSource.recordedCompletion?.updatedAt || 0),
      recordedComplete: Boolean(candidateSource.recordedComplete),
      pending: Boolean(candidateSource.pending),
    };
  }

  function buildExamLaunchCandidatePayload(candidate) {
    if (!candidate || typeof candidate !== "object") return null;
    const recordedComplete = Object.prototype.hasOwnProperty.call(candidate, "recordedComplete")
      ? candidate.recordedComplete
      : isExamComplete(candidate.lessonLike, candidate.entry);
    const sourceVariants = Array.isArray(candidate.sourceVariants)
      ? candidate.sourceVariants.map(buildExamLaunchSourcePayload).filter(Boolean)
      : [];
    return {
      launchKey: candidate.launchKey || "",
      source: candidate.source || "",
      lessonId: normalizeVideoId(candidate.lessonLike?.id),
      studentExamId: normalizeVideoId(candidate.studentExamDto?.id),
      examId: normalizeVideoId(candidate.studentExamDto?.exam?.id),
      examState: Number(candidate.studentExamDto?.state || 0),
      examUrl: candidate.studentExamDto?.examUrl || "",
      chapterName: getExamLaunchChapterName(candidate.entry?.chapter),
      currentChapter: Boolean(
        candidate.currentEntry
        && candidate.entry?.chapterKey
        && candidate.currentEntry.chapterKey === candidate.entry.chapterKey
      ),
      alreadyLaunchedThisSession: Boolean(
        candidate.launchKey && state.exam.launchedSessionExamKeys[candidate.launchKey]
      ),
      recordedComplete,
      sourceVariants,
      progress: buildLessonLaunchProgressPayload(candidate.entry?.progressTarget || candidate.lessonLike),
    };
  }

  function isLessonLaunchProgressComplete(lesson) {
    if (!lesson || typeof lesson !== "object") return false;
    const confirmed = getServerProgressEntry(lesson);
    if (confirmed) {
      return Number(confirmed.watchState || 0) === 1;
    }
    if (Number(lesson.isStudiedLesson || 0) === 1) {
      return true;
    }
    return getDisplayedRecordPercent(lesson) >= 100;
  }

  function collectPendingChapterExamCandidates(vm) {
    const entries = collectVideoEntries(vm);
    if (!entries.length) return [];

    const currentEntry = findCurrentLessonEntry(vm);
    const currentEntryIndex = currentEntry ? entries.indexOf(currentEntry) : -1;
    const eligibleEntries = currentEntryIndex > 0
      ? entries.slice(0, currentEntryIndex)
      : [];
    if (!eligibleEntries.length) return [];

    const candidateBuckets = new Map();
    const collectCandidateSource = (lessonLike, source, entry) => {
      const candidateSource = getExamCandidateSourceMeta(lessonLike, source, entry, vm, currentEntry);
      if (!candidateSource) return;

      const bucketKey = candidateSource.launchKey;
      if (!candidateBuckets.has(bucketKey)) {
        candidateBuckets.set(bucketKey, {
          launchKey: bucketKey,
          selectedSource: candidateSource,
          sourceVariants: [],
          hasPendingSource: false,
          hasCompleteSource: false,
        });
      }

      const bucket = candidateBuckets.get(bucketKey);
      bucket.sourceVariants.push(candidateSource);
      if (candidateSource.pending) {
        bucket.hasPendingSource = true;
      } else {
        bucket.hasCompleteSource = true;
      }
      if (shouldPreferExamCandidateSource(bucket.selectedSource, candidateSource)) {
        bucket.selectedSource = candidateSource;
      }
    };

    eligibleEntries.forEach((entry) => {
      collectCandidateSource(entry.chapter, "chapter", entry);
      collectCandidateSource(entry.progressTarget, "progressTarget", entry);
      if (entry.lesson && entry.lesson !== entry.progressTarget) {
        collectCandidateSource(entry.lesson, "lesson", entry);
      }
    });

    const candidates = Array.from(candidateBuckets.values()).filter((bucket) => (
      bucket.hasPendingSource && !bucket.hasCompleteSource
    )).map((bucket) => ({
      ...bucket.selectedSource,
      sourceVariants: bucket.sourceVariants,
    }));

    logDebug("exam", "collect regular exam launch candidates", {
      currentVideoId: resolveCurrentVideoId(vm),
      currentChapterName: getExamLaunchChapterName(currentEntry?.chapter),
      totalEntries: entries.length,
      eligibleEntries: eligibleEntries.length,
      candidates: candidates.map(buildExamLaunchCandidatePayload).filter(Boolean),
    });

    return candidates;
  }

  function pickPendingChapterExamCandidate(candidates = []) {
    if (!Array.isArray(candidates) || !candidates.length) return null;

    const unlaunchedCandidates = candidates.filter((candidate) => (
      candidate
      && candidate.launchKey
      && !state.exam.launchedSessionExamKeys[candidate.launchKey]
    ));
    if (!unlaunchedCandidates.length) return null;

    const currentChapterCandidate = unlaunchedCandidates.find((candidate) => (
      candidate.currentEntry
      && candidate.entry?.chapterKey
      && candidate.currentEntry.chapterKey === candidate.entry.chapterKey
    ));
    const selectedCandidate = currentChapterCandidate || unlaunchedCandidates[0];
    logDebug("exam", "pick regular exam launch candidate", {
      totalCandidates: candidates.length,
      unlaunchedCandidates: unlaunchedCandidates.map(buildExamLaunchCandidatePayload).filter(Boolean),
      selectedCandidate: buildExamLaunchCandidatePayload(selectedCandidate),
    });
    return selectedCandidate;
  }

  function getLessonProgressId(lesson) {
    if (!lesson || typeof lesson.id === "undefined" || lesson.id === null) return "";
    return String(lesson.id);
  }

  function setServerProgressEntry(lesson, watchState, studyTotalTime, timestamp = now()) {
    const lessonId = getLessonProgressId(lesson);
    if (!lessonId) return null;

    const normalizedWatchState = Number(watchState || 0);
    const normalizedStudyTotalTime = Math.max(0, Number(studyTotalTime || 0));
    const duration = Number(lesson?.videoSec || 0);
    const percentage = normalizedWatchState === 1
      ? 100
      : duration > 0
        ? clampPercent(Math.floor((normalizedStudyTotalTime / duration) * 100))
        : 0;

    const record = {
      lessonId,
      videoId: normalizeVideoId(lesson?.videoId),
      watchState: normalizedWatchState,
      studyTotalTime: normalizedStudyTotalTime,
      percentage,
      updatedAt: timestamp,
    };
    state.serverProgress.byLessonId[lessonId] = record;
    state.serverProgress.initialized = true;
    return record;
  }

  function getServerProgressEntry(lesson) {
    const lessonId = getLessonProgressId(lesson);
    if (!lessonId) return null;
    return state.serverProgress.byLessonId[lessonId] || null;
  }

  function getServerRecordPercent(lesson) {
    const confirmed = getServerProgressEntry(lesson);
    if (confirmed) return clampPercent(confirmed.percentage);

    const duration = Number(lesson?.videoSec || 0);
    const serverStudyTotalTime = Number(lesson?.studyTotalTime || 0);
    if (duration > 0 && serverStudyTotalTime > 0) {
      return clampPercent(Math.floor((serverStudyTotalTime / duration) * 100));
    }

    if (!state.serverProgress.initialized && Number(lesson?.isStudiedLesson || 0) === 1) {
      return 100;
    }

    return 0;
  }

  function applyQueryStudyInfoToLesson(lesson, watchState, studyTotalTime) {
    if (!lesson || typeof lesson !== "object") return false;

    let changed = false;
    const normalizedWatchState = Number(watchState || 0);
    const normalizedStudyTotalTime = Math.max(0, Number(studyTotalTime || 0));

    if (Number(lesson.isStudiedLesson || 0) !== normalizedWatchState) {
      lesson.isStudiedLesson = normalizedWatchState;
      changed = true;
    }

    if (Number(lesson.studyTotalTime || 0) !== normalizedStudyTotalTime) {
      lesson.studyTotalTime = normalizedStudyTotalTime;
      changed = true;
    }

    if (normalizedWatchState === 2) {
      const duration = Number(lesson.videoSec || 0);
      const percentage = duration > 0
        ? Math.min(100, Math.floor((normalizedStudyTotalTime / duration) * 100))
        : 0;
      const normalizedPercentage = percentage === 0 ? 0 : clampPercent(percentage);
      if (Number(lesson.percentage || 0) !== normalizedPercentage) {
        lesson.percentage = normalizedPercentage;
        changed = true;
      }
    } else if (normalizedWatchState === 0 && Number(lesson.percentage || 0) !== 0) {
      lesson.percentage = 0;
      changed = true;
    }

    return changed;
  }

  function getDisplayedRecordPercent(lesson) {
    if (!lesson) return 0;
    if (Number(lesson.isStudiedLesson || 0) === 1) {
      return 100;
    }
    return clampPercent(lesson.percentage || 0);
  }

  function isServerProgressConfirmedComplete(vm) {
    const currentLesson = findCurrentLesson(vm);
    if (!currentLesson) return hasFinishIcon();

    const confirmed = getServerProgressEntry(currentLesson);
    if (confirmed) {
      return Number(confirmed.watchState || 0) === 1;
    }

    return false;
  }

  function ensureCurrentLessonServerProgress(vm, reason = "saveSuccess", options) {
    const currentVideoId = resolveCurrentVideoId(vm);
    if (!vm || !currentVideoId) return false;
    if (isPendingServerProgressRefresh(currentVideoId)) return true;

    const currentLesson = findCurrentLesson(vm);
    if (!currentLesson) return false;

    const confirmed = getServerProgressEntry(currentLesson);
    const targetStudyTime = Math.max(
      0,
      Number(options?.targetStudyTime ?? vm.totalStudyTime ?? currentLesson.studyTotalTime ?? 0) || 0,
    );
    if (
      confirmed
      && Number(confirmed.watchState || 0) === 1
      && Number(confirmed.studyTotalTime || 0) >= targetStudyTime - 1
    ) {
      return false;
    }

    return scheduleServerProgressRefresh(vm, reason, {
      ...options,
      delayMs: Number(options?.delayMs ?? 0),
      targetStudyTime,
    });
  }

  function clearPendingServerProgressRefresh() {
    if (state.serverProgress.refreshTimerId) {
      clearTimeout(state.serverProgress.refreshTimerId);
    }
    state.serverProgress.refreshTimerId = 0;
    state.serverProgress.pendingVideoId = null;
    state.serverProgress.pendingLessonId = null;
    state.serverProgress.pendingTargetStudyTime = 0;
    state.serverProgress.pendingAttempts = 0;
    state.serverProgress.pendingAt = 0;
    state.serverProgress.pendingReason = "";
  }

  function isPendingServerProgressRefresh(currentVideoId = state.serverProgress.pendingVideoId, timestamp = now()) {
    const videoId = normalizeVideoId(currentVideoId);
    if (!videoId) return false;
    if (state.serverProgress.pendingVideoId !== videoId) return false;
    if (!state.serverProgress.pendingAt) return false;
    return timestamp - state.serverProgress.pendingAt < 15000;
  }

  function requestServerProgressRefresh(vm, reason = state.serverProgress.pendingReason || "saveSuccess") {
    if (state.halted) return false;
    if (!vm || typeof vm.queryStuyInfo !== "function") return false;

    const currentVideoId = resolveCurrentVideoId(vm);
    if (!currentVideoId || state.serverProgress.pendingVideoId !== currentVideoId) return false;
    if (state.serverProgress.pendingAttempts >= 3) return false;

    state.serverProgress.pendingAttempts += 1;
    const logFn = state.serverProgress.pendingAttempts >= 2 ? logWarn : logDebug;
    logFn("progress", "requesting server progress refresh", {
      reason,
      videoId: currentVideoId,
      attempt: state.serverProgress.pendingAttempts,
      targetStudyTime: Number(state.serverProgress.pendingTargetStudyTime || 0),
    });
    safeCall(() => vm.queryStuyInfo());
    return true;
  }

  function scheduleServerProgressRefresh(vm, reason = "saveSuccess", options) {
    if (state.halted) return false;
    if (!vm || typeof vm.queryStuyInfo !== "function") return false;
    const config = options || {};

    const currentVideoId = resolveCurrentVideoId(vm);
    const currentLesson = findCurrentLesson(vm);
    const lessonId = getLessonProgressId(currentLesson);
    if (!currentVideoId || !lessonId) return false;

    const timestamp = Number(config.timestamp || now());
    const currentPendingTarget = Number(state.serverProgress.pendingTargetStudyTime || 0);
    const targetStudyTime = Math.max(currentPendingTarget, Number(config.targetStudyTime ?? vm.totalStudyTime ?? 0) || 0);
    const currentPendingVideoId = normalizeVideoId(state.serverProgress.pendingVideoId);
    const resetAttempts = config.resetAttempts !== false && (
      currentPendingVideoId !== currentVideoId
      || targetStudyTime > currentPendingTarget + 1
    );

    state.serverProgress.pendingVideoId = currentVideoId;
    state.serverProgress.pendingLessonId = lessonId;
    state.serverProgress.pendingTargetStudyTime = targetStudyTime;
    state.serverProgress.pendingAt = timestamp;
    state.serverProgress.pendingReason = reason;
    if (resetAttempts) {
      state.serverProgress.pendingAttempts = 0;
    }

    if (state.serverProgress.refreshTimerId) {
      clearTimeout(state.serverProgress.refreshTimerId);
    }

    const delayMs = Math.max(0, Number(config.delayMs ?? 600));
    state.serverProgress.refreshTimerId = setTimeout(() => {
      state.serverProgress.refreshTimerId = 0;
      requestServerProgressRefresh(vm, reason);
    }, delayMs);
    return true;
  }

  function applyServerProgressSnapshot(vm, payload, reason = "queryStuyInfo", timestamp = now()) {
    const data = payload?.data;
    if (!vm || !data || typeof data !== "object") return false;

    const lessonPayload = data.lesson && typeof data.lesson === "object" ? data.lesson : {};
    const smallLessonPayload = data.lv && typeof data.lv === "object" ? data.lv : {};
    const entries = collectVideoEntries(vm);
    let updatedCount = 0;

    entries.forEach((entry) => {
      const lessonId = getLessonProgressId(entry.progressTarget);
      if (!lessonId) return;

      const source = entry.smallLesson ? smallLessonPayload[lessonId] : lessonPayload[lessonId];
      if (!source || typeof source !== "object") return;

      setServerProgressEntry(entry.progressTarget, source.watchState, source.studyTotalTime, timestamp);
      applyQueryStudyInfoToLesson(entry.progressTarget, source.watchState, source.studyTotalTime);
      updatedCount += 1;
    });

    if (!updatedCount) return false;

    const currentLessonId = state.serverProgress.pendingLessonId;
    if (currentLessonId) {
      const confirmed = state.serverProgress.byLessonId[currentLessonId] || null;
      const confirmedStudyTime = Number(confirmed?.studyTotalTime || 0);
      const targetStudyTime = Number(state.serverProgress.pendingTargetStudyTime || 0);
      if (confirmed && (confirmed.watchState === 1 || confirmedStudyTime >= targetStudyTime - 1)) {
        state.serverProgress.lastConfirmedVideoId = normalizeVideoId(state.serverProgress.pendingVideoId);
        state.serverProgress.lastConfirmedAt = timestamp;
        clearPendingServerProgressRefresh();
        logSuccess("progress", "server progress confirmed after refresh", {
          reason,
          videoId: state.serverProgress.lastConfirmedVideoId,
          confirmedStudyTime,
          watchState: confirmed.watchState,
        });
      } else if (state.serverProgress.pendingVideoId === resolveCurrentVideoId(vm)) {
        const pendingReason = String(state.serverProgress.pendingReason || reason || "");
        clearPendingServerProgressRefresh();
        if (/endedServerConfirm|advanceServerConfirm/i.test(pendingReason)) {
          logWarn("progress", "server progress incomplete after refresh", {
            reason: pendingReason,
            videoId: normalizeVideoId(confirmed?.videoId) || resolveCurrentVideoId(vm),
            targetStudyTime,
            confirmedStudyTime,
            watchState: confirmed?.watchState ?? null,
          });
        } else {
          logDebug("progress", "server progress refresh still incomplete", {
            reason: pendingReason,
            videoId: normalizeVideoId(confirmed?.videoId) || resolveCurrentVideoId(vm),
            targetStudyTime,
            confirmedStudyTime,
            watchState: confirmed?.watchState ?? null,
          });
        }
      }
    }

    logSuccess("progress", "server progress applied", {
      reason,
      updatedCount,
    });
    return true;
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
    return Number(lesson.isStudiedLesson || 0) !== 1;
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
    return Number(currentLesson.isStudiedLesson || 0) === 1 || hasFinishIcon();
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
    if (isRecordedProgressComplete(vm) && !isServerProgressConfirmedComplete(vm)) {
      if (ensureCurrentLessonServerProgress(vm, "endedServerConfirm", {
        delayMs: 0,
        targetStudyTime: Number(vm?.totalStudyTime || 0),
      })) {
        updateUi("等待服务端进度确认", vm);
        return true;
      }
    }
    if (isPendingServerProgressRefresh(currentVideoId)) {
      updateUi("等待服务端进度确认", vm);
      return true;
    }
    if (isServerProgressConfirmedComplete(vm)) return false;
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
    return isVideoNaturallyFinished(video) && isServerProgressConfirmedComplete(vm);
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
    if (isRecordedProgressComplete(vm) && !isServerProgressConfirmedComplete(vm)) {
      if (ensureCurrentLessonServerProgress(vm, "advanceServerConfirm", {
        delayMs: 0,
        targetStudyTime: Number(vm?.totalStudyTime || 0),
      })) {
        updateUi("等待服务端进度确认", vm);
        return;
      }
    }
    const readyToAdvance = shouldAdvance(vm);
    const serverConfirmedComplete = isServerProgressConfirmedComplete(vm);
    if (readyToAdvance) {
      logDebug("exam", "video reached regular exam launch gate", {
        currentVideoId,
        currentLessonId: normalizeVideoId(findCurrentLesson(vm)?.id),
        currentChapterName: getExamLaunchChapterName(findCurrentLessonEntry(vm)?.chapter),
        totalStudyTime: Number(vm?.totalStudyTime || 0),
        totalTimeFinish: Number(vm?.totalTimeFinish || 0),
      });
    }
    if (!readyToAdvance && serverConfirmedComplete) {
      logDebug("exam", "video not naturally finished, regular exam scan still allowed", {
        currentVideoId,
        currentLessonId: normalizeVideoId(findCurrentLesson(vm)?.id),
        currentChapterName: getExamLaunchChapterName(findCurrentLessonEntry(vm)?.chapter),
        totalStudyTime: Number(vm?.totalStudyTime || 0),
        totalTimeFinish: Number(vm?.totalTimeFinish || 0),
      });
    }
    if (serverConfirmedComplete && maybeLaunchCurrentLessonExam(vm)) {
      updateUi("首个符合条件的平时测试已打开");
    }
    if (serverConfirmedComplete && jumpToNextPendingVideo(vm, "recorded progress completed", currentVideoId)) return;
    if (!readyToAdvance) return;

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
    if (scope === "progress" && /server progress confirmed after refresh/i.test(message)) {
      return "服务端进度已确认";
    }
    if (scope === "progress" && /server progress incomplete after refresh/i.test(message)) {
      return null;
    }
    if (scope === "progress" && /forced final progress flush at natural end/i.test(message)) {
      return "视频已播完，已按页面进度补齐最终落库";
    }
    if (scope === "progress" && /requesting server progress refresh/i.test(message)) {
      return null;
    }
    if (scope === "progress" && /server progress applied/i.test(message)) {
      return null;
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
    if (scope === "exam" && /launch regular exam attempt/i.test(message)) {
      return null;
    }
    if (scope === "exam" && /launch regular exam popup/i.test(message)) {
      return "已用小窗口打开首个符合条件的平时测试";
    }
    if (scope === "exam" && /launch regular exam extension tab/i.test(message)) {
      return "小窗口被拦截，已改用扩展标签页打开平时测试";
    }
    if (scope === "exam" && /^launch regular exam$/i.test(message)) {
      return "已自动打开首个符合条件的平时测试";
    }
    if (scope === "exam" && /regular exam launch failed/i.test(message)) {
      return "平时测试打开失败，等待下次触发";
    }
    if (scope === "exam" && /regular exam popup blocked/i.test(message)) {
      return null;
    }
    if (scope === "exam" && /homework exam runtime captured/i.test(message)) {
      return "平时测试页运行时已接管";
    }
    if (scope === "exam" && /regular exam runtime recovered/i.test(message)) {
      return "平时测试页运行时已恢复";
    }
    if (scope === "exam" && /formal exam runtime unsupported \(TODO\)/i.test(message)) {
      return "正式考试页暂未接入（TODO）";
    }
    if (scope === "exam" && /regular exam llm config missing/i.test(message)) {
      return "平时测试外部答题接口尚未配置";
    }
    if (scope === "exam" && /regular exam llm request started/i.test(message)) {
      return "已汇总整卷题目，正在请求外部模型答案";
    }
    if (scope === "exam" && /regular exam llm answers ready/i.test(message)) {
      return "外部模型答案已返回，开始回填";
    }
    if (scope === "exam" && /regular exam llm request failed/i.test(message)) {
      return "外部模型答案请求失败";
    }
    if (scope === "exam" && /skip AI for completed regular exam page/i.test(message)) {
      return "平时测试已完成，跳过 AI 并关闭页面";
    }
    if (scope === "exam" && /regular exam question inventory unavailable/i.test(message)) {
      return "暂未拿到整卷题目数据";
    }
    if (scope === "exam" && /regular exam last question temporary save triggered/i.test(message)) {
      return "最后一题已暂存，等待页面关闭";
    }
    if (scope === "exam" && /regular exam temporary save completed/i.test(message)) {
      return "最后一题暂存完成，页面即将关闭";
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
    if (scope === "config" && /updated examLlm/i.test(message)) {
      return "考试外部答题配置已更新";
    }
    if (scope === "bootstrap" && /bootstrapped/i.test(message)) {
      return "脚本已完成初始化";
    }
    if (scope === "bootstrap" && /runtime loop started/i.test(message)) {
      return null;
    }
    if (scope === "vm" && /study vm patched/i.test(message)) {
      return "学习页已接管";
    }
    if (scope === "vm" && /early vm patch probe completed/i.test(message)) {
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
    const recordPercent = getDisplayedRecordPercent(currentLesson);

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
    let playedDuration = 0;
    let totalDuration = 0;
    for (const entry of entries) {
      const studied = Number(entry.progressTarget?.isStudiedLesson || 0);
      const duration = Math.max(0, Number(entry.progressTarget?.videoSec || 0));
      let recordedDuration = Math.max(0, Number(entry.progressTarget?.studyTotalTime || 0));
      const entryVideoId = normalizeVideoId(entry.progressTarget?.videoId);
      if (entryVideoId && entryVideoId === state.progressSync.videoId) {
        recordedDuration = Math.max(recordedDuration, Number(state.progressSync.totalStudyTime || 0));
      }
      if (!(recordedDuration > 0) && duration > 0) {
        const percentage = clampPercent(entry.progressTarget?.percentage || 0);
        if (percentage > 0) {
          recordedDuration = duration * (percentage / 100);
        } else if (studied === 1) {
          recordedDuration = duration;
        }
      }
      totalDuration += duration;
      playedDuration += Math.min(duration, recordedDuration);
      if (studied === 1) {
        completedCount += 1;
      }
    }

    return {
      completedCount,
      totalCount: entries.length,
      playedDuration,
      totalDuration,
      percent: totalDuration > 0 ? (playedDuration / totalDuration) * 100 : 0,
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
        `总课程进度：${formatDuration(courseProgress.playedDuration)} / ${formatDuration(courseProgress.totalDuration)}（${formatPercent(courseProgress.percent)}，已完成 ${courseProgress.completedCount}/${courseProgress.totalCount}）`,
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
    if (level === "debug") return;
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
    state.config.autoCloseCompletedExam = await gmGetValue(STORAGE_KEYS.autoCloseCompletedExam, true);
    state.config.autoSubmitCompletedExam = await gmGetValue(STORAGE_KEYS.autoSubmitCompletedExam, false);
    state.config.blockReportApis = await gmGetValue(STORAGE_KEYS.blockReportApis, true);
    state.config.blockDetectApis = await gmGetValue(STORAGE_KEYS.blockDetectApis, true);
    state.config.antiAntiDebug = await gmGetValue(STORAGE_KEYS.antiAntiDebug, true);
    state.exam.llm.apiBaseUrl = normalizeExamLlmApiBaseUrl(
      await gmGetValue(STORAGE_KEYS.examLlmApiBaseUrl, "https://generativelanguage.googleapis.com/v1beta"),
    ) || "https://generativelanguage.googleapis.com/v1beta";
    state.exam.llm.apiKey = normalizeText(await gmGetValue(STORAGE_KEYS.examLlmApiKey, ""));
    state.exam.llm.model = normalizeText(await gmGetValue(STORAGE_KEYS.examLlmModel, ""));
    state.exam.answerBank = Object.create(null);
    state.exam.completionCache = Object.create(null);
    state.exam.completionCacheReadAt = Object.create(null);
    state.exam.completionSyncPromises = Object.create(null);
    resetExamLlmRequestState(false);
    state.exam.session = await gmGetValue(STORAGE_KEYS.examSession, null);
    logSuccess("config", "loaded config", { ...state.config });
    logSuccess("config", "loaded examLlm config", {
      apiBaseUrl: shortenHost(state.exam.llm.apiBaseUrl),
      model: state.exam.llm.model || "",
      apiKey: maskSecret(state.exam.llm.apiKey),
    });
  }

  function getConfigLabel(key) {
    if (key === "autoQuiz") return "自动答题";
    if (key === "autoOpenRegularExam") return "自动打开平时测试";
    if (key === "autoCloseCompletedExam") return "自动关闭已完成测试";
    if (key === "autoSubmitCompletedExam") return "自动提交已完成测试";
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
    gmRegisterMenuCommandCompat(`自动关闭已完成测试: ${state.config.autoCloseCompletedExam ? "开" : "关"}`, () => {
      void toggleConfig("autoCloseCompletedExam");
    });
    gmRegisterMenuCommandCompat(`自动提交已完成测试: ${state.config.autoSubmitCompletedExam ? "开" : "关"}`, () => {
      void toggleConfig("autoSubmitCompletedExam");
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
    gmRegisterMenuCommandCompat(`考试答题 Base URL: ${shortenHost(state.exam.llm.apiBaseUrl) || "未配置"}`, () => {
      void configureExamLlmApiBaseUrl();
    });
    gmRegisterMenuCommandCompat(`考试答题 API Key: ${state.exam.llm.apiKey ? "已配置" : "未配置"}`, () => {
      void configureExamLlmApiKey();
    });
    gmRegisterMenuCommandCompat(`考试答题 Model: ${state.exam.llm.model || "未配置"}`, () => {
      void configureExamLlmModel();
    });
    logSuccess("gm", "menu commands registered", { ...state.config });
  }

  function runtimeTick() {
    if (state.halted) return;
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
    if (state.serverProgress.pendingPayload) {
      if (applyServerProgressSnapshot(vm, state.serverProgress.pendingPayload, "deferredQueryStuyInfo")) {
        state.serverProgress.pendingPayload = null;
      }
    }
    closeTransientDialogs(vm);
    ensureVideoState(vm);
    syncProgressFromPlayback(vm, "runtimeTick");

    if (answerDialog(vm)) {
      updateUi("已自动作答并提交");
    } else if (state.config.autoQuiz && vm.testDialog) {
      updateUi("等待题组数据");
    } else if (isPendingServerProgressRefresh(resolveCurrentVideoId(vm))) {
      updateUi("等待服务端进度确认");
    } else {
      updateUi("运行中");
    }

    maybeCloseClosingExamLaunchFromSession(state.exam.session, "runtimeTickCached");
    void syncExamSessionFromStorage();
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
