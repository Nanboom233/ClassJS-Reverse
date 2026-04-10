// ==UserScript==
// @name         C宝 - 全自动吵醒机器人
// @namespace    ob-jsjiami/chaoxing
// @version      0.3.6
// @description  吵醒学不通章节测验自动一键搞砸
// @author       Minami
// @match        *://*.chaoxing.com/mycourse/*
// @match        *://*.chaoxing.com/mooc-ans/mycourse/*
// @match        *://*.chaoxing.com/work/doHomeWorkNew*
// @match        *://*.chaoxing.com/mooc-ans/work/doHomeWorkNew*
// @match        *://*.edu.cn/work/doHomeWorkNew*
// @match        *://*.edu.cn/mooc-ans/work/doHomeWorkNew*
// @require      https://greasyfork.org/scripts/445293/code/TyprMd5.js
// @resource     Table https://www.forestpolice.org/ttf/2.0/table.json
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      generativelanguage.googleapis.com
// @connect      *
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";

  const PAGE = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const SCRIPT_TAG = "[auto-chaoxing-quiz]";

  // ═══════════════════════════════════════════════════════════════════
  // §1  State
  // ═══════════════════════════════════════════════════════════════════

  const state = {
    halted: false,
    running: false,
    fontDecrypted: false,
    questionsAnswered: 0,
    answerRecords: [], // { section, question, type, answer, source }
    answerRecordIndex: new Map(),
    answerRecordSectionOrder: new Map(),
    answerRecordWriteCount: 0,
    submitMode: "save", // "save" = 暂时保存, "submit" = 直接提交
    autoAdvance: true,  // 自动点击下一节
    llm: {
      apiBaseUrl: "",
      apiKey: "",
      model: "",
    },
    antiDebug: {
      installed: false,
      strippedCount: 0,
    },
  };

  // ═══════════════════════════════════════════════════════════════════
  // §2  Utilities
  // ═══════════════════════════════════════════════════════════════════

  function now() { return Date.now(); }

  function log(level, scope, message, payload) {
    const prefix = `${SCRIPT_TAG}[${scope}]`;
    const args = [prefix, message];
    if (payload !== undefined) args.push(payload);
    if (level === "error") console.error(...args);
    else if (level === "warn") console.warn(...args);
    else if (level === "success") console.log(...args);
    else console.debug(...args);
  }

  function normalizeText(value) {
    if (typeof value === "number") return String(value);
    if (typeof value !== "string") return "";
    return value.trim();
  }

  function parseJsonSafe(text) {
    if (typeof text !== "string" || !text.trim()) return null;
    try { return JSON.parse(text); } catch (_) { return null; }
  }

  function toPlainText(html) {
    if (typeof html !== "string") return "";
    const el = document.createElement("div");
    el.innerHTML = html;
    return (el.textContent || el.innerText || "").trim();
  }

  function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

  // ═══════════════════════════════════════════════════════════════════
  // §3  Anti-Debug (移植简化版)
  // ═══════════════════════════════════════════════════════════════════

  function stripDebuggerStatements(source) {
    if (typeof source !== "string" || !source) return source;
    const replaced = source.replace(/\bdebugger\b\s*;?/gi, "");
    if (replaced !== source) state.antiDebug.strippedCount += 1;
    return replaced;
  }

  function installAntiDebugGuards() {
    if (state.antiDebug.installed) return;
    state.antiDebug.installed = true;

    try {
      const OriginalFunction = PAGE.Function;
      PAGE.Function = new Proxy(OriginalFunction, {
        construct(target, args) {
          if (args.length > 0) args[args.length - 1] = stripDebuggerStatements(args[args.length - 1]);
          return Reflect.construct(target, args);
        },
        apply(target, thisArg, args) {
          if (args.length > 0) args[args.length - 1] = stripDebuggerStatements(args[args.length - 1]);
          return Reflect.apply(target, thisArg, args);
        },
      });
      Object.defineProperty(OriginalFunction.prototype, "constructor", {
        configurable: true, writable: true, value: PAGE.Function,
      });
      log("success", "anti-debug", "Function proxy installed");
    } catch (e) { log("error", "anti-debug", "Function proxy failed", e); }

    try {
      const originalEval = PAGE.eval;
      PAGE.eval = new Proxy(originalEval, {
        apply(target, thisArg, args) {
          if (args.length > 0) args[0] = stripDebuggerStatements(args[0]);
          return Reflect.apply(target, thisArg, args);
        },
      });
      log("success", "anti-debug", "eval proxy installed");
    } catch (e) { log("error", "anti-debug", "eval proxy failed", e); }

    const proxyTimer = (name) => {
      try {
        if (typeof PAGE[name] !== "function") return;
        PAGE[name] = new Proxy(PAGE[name], {
          apply(target, thisArg, args) {
            if (args.length > 0 && typeof args[0] === "string") {
              args[0] = stripDebuggerStatements(args[0]);
            }
            return Reflect.apply(target, thisArg, args);
          },
        });
      } catch (_) { /* ignore */ }
    };
    proxyTimer("setTimeout");
    proxyTimer("setInterval");
  }

  // ═══════════════════════════════════════════════════════════════════
  // §4  GM Wrappers & LLM Config
  // ═══════════════════════════════════════════════════════════════════

  function gmXmlhttpRequestCompat(details) {
    return new Promise((resolve, reject) => {
      try {
        if (typeof GM_xmlhttpRequest === "function") {
          GM_xmlhttpRequest({
            ...details,
            onload: (r) => resolve(r),
            onerror: (e) => {
              const msg = e?.error || e?.statusText || (typeof e === "string" ? e : "network error");
              reject(new Error(`GM_xmlhttpRequest error: ${msg}`));
            },
            ontimeout: () => reject(new Error(`GM_xmlhttpRequest timeout (${details.timeout || "?"}ms)`)),
            onabort: () => reject(new Error("GM_xmlhttpRequest aborted")),
          });
          return;
        }
      } catch (e) { reject(e); return; }
      reject(new Error("GM_xmlhttpRequest unavailable"));
    });
  }

  function normalizeLlmBaseUrl(value) {
    const normalized = normalizeText(value).replace(/\/+$/, "");
    if (!normalized) return "";
    return normalized.replace(/\/models\/[^/]*(:generateContent)?(\?.*)?$/i, "").replace(/\/+$/, "");
  }

  function buildLlmEndpoint(baseUrl, model, apiKey) {
    const normalized = normalizeLlmBaseUrl(baseUrl);
    if (!normalized || !model || !apiKey) return "";
    return `${normalized}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  }

  function isLlmConfigured() {
    return Boolean(normalizeLlmBaseUrl(state.llm.apiBaseUrl) && normalizeText(state.llm.apiKey) && normalizeText(state.llm.model));
  }

  async function loadConfig() {
    state.llm.apiBaseUrl = normalizeLlmBaseUrl(
      await GM_getValue("cxLlmApiBaseUrl", "https://generativelanguage.googleapis.com/v1beta"),
    ) || "https://generativelanguage.googleapis.com/v1beta";
    state.llm.apiKey = normalizeText(await GM_getValue("cxLlmApiKey", ""));
    state.llm.model = normalizeText(await GM_getValue("cxLlmModel", ""));
    state.submitMode = (await GM_getValue("cxSubmitMode", "save")) === "submit" ? "submit" : "save";
    state.autoAdvance = (await GM_getValue("cxAutoAdvance", "true")) !== "false";
  }

  function registerMenus() {
    GM_registerMenuCommand("设置 Gemini API Base URL", async () => {
      const v = prompt("Gemini API Base URL:", state.llm.apiBaseUrl);
      if (v === null) return;
      state.llm.apiBaseUrl = normalizeLlmBaseUrl(v) || "https://generativelanguage.googleapis.com/v1beta";
      await GM_setValue("cxLlmApiBaseUrl", state.llm.apiBaseUrl);
    });
    GM_registerMenuCommand("设置 Gemini API Key", async () => {
      const v = prompt("Gemini API Key:", state.llm.apiKey);
      if (v === null) return;
      state.llm.apiKey = normalizeText(v);
      await GM_setValue("cxLlmApiKey", state.llm.apiKey);
    });
    GM_registerMenuCommand("设置 Gemini Model", async () => {
      const v = prompt("Model (如 gemini-2.5-flash-preview-05-20):", state.llm.model);
      if (v === null) return;
      state.llm.model = normalizeText(v);
      await GM_setValue("cxLlmModel", state.llm.model);
    });
    GM_registerMenuCommand(`提交模式：${state.submitMode === "submit" ? "直接提交 ✓" : "暂时保存 ✓"} (点击切换)`, async () => {
      state.submitMode = state.submitMode === "submit" ? "save" : "submit";
      await GM_setValue("cxSubmitMode", state.submitMode);
      alert(`已切换为：${state.submitMode === "submit" ? "直接提交" : "暂时保存"}（刷新页面生效）`);
    });
    GM_registerMenuCommand(`自动下一节：${state.autoAdvance ? "开启 ✓" : "关闭"} (点击切换)`, async () => {
      state.autoAdvance = !state.autoAdvance;
      await GM_setValue("cxAutoAdvance", state.autoAdvance ? "true" : "false");
      alert(`自动下一节已${state.autoAdvance ? "开启" : "关闭"}（刷新页面生效）`);
    });
    GM_registerMenuCommand("导出答案记录", () => {
      downloadAnswerFile();
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // §5  Font Decryption
  // ═══════════════════════════════════════════════════════════════════

  function base64ToUint8Array(base64) {
    const data = window.atob(base64);
    const buffer = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) buffer[i] = data.charCodeAt(i);
    return buffer;
  }

  function decryptFontSecret(doc) {
    if (state.fontDecrypted) return;
    const $ = PAGE.jQuery || doc?.defaultView?.jQuery;
    if (!$) return;
    // @require 注入的 Typr/md5 在脚本作用域中，不在 unsafeWindow 上
    // 通过 typeof 检查避免 ReferenceError
    let TyprRef, md5Ref;
    try { TyprRef = typeof Typr !== "undefined" ? Typr : PAGE.Typr; } catch (_) { TyprRef = PAGE.Typr; }
    try { md5Ref = typeof md5 !== "undefined" ? md5 : PAGE.md5; } catch (_) { md5Ref = PAGE.md5; }
    if (!TyprRef || !md5Ref) { log("warn", "font", "Typr or md5 not loaded"); return; }

    const $tip = $("style:contains(font-cxsecret)", doc);
    if (!$tip.length) return;

    let font;
    try {
      const fontBase64 = $tip.text().match(/base64,([\w\W]+?)'/)[1];
      font = TyprRef.parse(base64ToUint8Array(fontBase64))[0];
    } catch (e) { log("error", "font", "font parse failed", e); return; }

    let table;
    try { table = JSON.parse(GM_getResourceText("Table")); }
    catch (e) { log("error", "font", "table load failed", e); return; }

    const match = {};
    for (let i = 19968; i < 40870; i++) {
      let glyph = TyprRef.U.codeToGlyph(font, i);
      if (!glyph) continue;
      glyph = TyprRef.U.glyphToPath(font, glyph);
      const hash = md5Ref(JSON.stringify(glyph)).slice(24);
      if (table[hash]) match[i] = table[hash];
    }

    $(".font-cxsecret", doc).html(function (_index, html) {
      for (const [key, value] of Object.entries(match)) {
        html = html.replace(new RegExp(String.fromCharCode(Number(key)), "g"), String.fromCharCode(value));
      }
      return html;
    }).removeClass("font-cxsecret");

    state.fontDecrypted = true;
    log("success", "font", `decrypted ${Object.keys(match).length} chars`);
  }

  // ═══════════════════════════════════════════════════════════════════
  // §6  Question Extraction
  // ═══════════════════════════════════════════════════════════════════

  function getQuizDoc() {
    // 三层 iframe: #iframe → work/index.html → /mooc-ans/api/work?...
    try {
      const L1 = document.getElementById("iframe");
      if (!L1) return null;
      const L1Doc = L1.contentDocument || L1.contentWindow?.document;
      if (!L1Doc) return null;
      const L2 = L1Doc.querySelector("iframe");
      if (!L2) return null;
      const L2Doc = L2.contentDocument || L2.contentWindow?.document;
      if (!L2Doc) return null;
      const L3 = L2Doc.querySelector("iframe");
      if (!L3) return L2Doc; // fallback: 题目可能在第二层
      const L3Doc = L3.contentDocument || L3.contentWindow?.document;
      return L3Doc || L2Doc;
    } catch (_) { return null; }
  }

  function switchToQuizTab() {
    const tabs = document.querySelectorAll("#prev_tab .prev_ul li");
    for (const tab of tabs) {
      if (tab.getAttribute("title") === "章节测验" || tab.textContent.includes("章节测验")) {
        if (!tab.classList.contains("active")) tab.click();
        return true;
      }
    }
    return false;
  }

  function isOptionSelected(opt) {
    const li = opt.liEl;
    const a = opt.aEl;
    if (!li) return false;
    // 超星标记选中状态的方式多样：
    // - li 或 a 上添加 check_answer / on / checked / active class
    // - li 上带 aria-checked / aria-pressed="true"
    // - li 内部 span 带 check_answer / check_answer_dx class
    // - li 内部有 input:checked
    // - a.after 变为 a.check_answer
    const selectedClasses = /\bcheck_answer\b|\bcheck_answer_dx\b|\bon\b|\bchecked\b|\bactive\b|\bselected\b/;
    if (selectedClasses.test(li.className)) return true;
    if (a && selectedClasses.test(a.className)) return true;
    if ((li.getAttribute("aria-checked") || "").toLowerCase() === "true") return true;
    if ((li.getAttribute("aria-pressed") || "").toLowerCase() === "true") return true;
    if (li.querySelector(".check_answer, .check_answer_dx")) return true;
    if (li.querySelector("input:checked")) return true;
    // 有些版本用 style background 标记
    const bg = li.style.backgroundColor || "";
    if (bg && bg !== "transparent" && bg !== "rgb(255, 255, 255)" && bg !== "") {
      // 有背景色可能是选中状态，但空字符串和白色不算
      if (bg !== "" && !bg.includes("255, 255, 255")) return true;
    }
    return false;
  }

  function getStoredQuestionAnswer(question) {
    const value = normalizeText(question.answerField?.value || "");
    if (!value) return "";
    if (value === "[]" || value === "{}" || value === '""' || /^null$/i.test(value) || /^undefined$/i.test(value)) {
      return "";
    }
    return value;
  }

  function parseStoredOptionLabels(question, storedAnswer) {
    const value = normalizeText(storedAnswer).toUpperCase();
    if (!value) return [];
    if (question.isMulti && /^[A-Z]+$/.test(value)) return Array.from(value);
    return value.split(/[\s,;|/]+/).map((item) => item.trim()).filter(Boolean);
  }

  function formatRecordedOption(opt) {
    const label = normalizeText(opt.label);
    return label ? `${label}. ${opt.text}` : opt.text;
  }

  function isQuestionAlreadyAnswered(question) {
    const storedAnswer = getStoredQuestionAnswer(question);
    // 选择题：至少有一个选项被选中
    if (question.options.length) {
      return question.options.some((opt) => isOptionSelected(opt)) || Boolean(storedAnswer);
    }
    // 填空/简答：至少有一个输入框有内容
    if (question.textInputs.length) {
      return question.textInputs.some((input) => (input.value || "").trim().length > 0) || Boolean(storedAnswer);
    }
    return Boolean(storedAnswer);
  }

  function extractQuestionsFromDoc(doc) {
    if (!doc) return [];
    decryptFontSecret(doc);

    const questions = [];
    const containers = doc.querySelectorAll(".TiMu");
    if (!containers.length) return [];

    containers.forEach((container, index) => {
      const titleEl = container.querySelector(".Zy_TItle");
      const typeMatch = (titleEl?.textContent || "").match(/【(.+?)题】/);
      const questionType = typeMatch ? typeMatch[1] : "";
      // Get text after the type tag, from the .font-cxsecret or .fontLabel div
      const fontLabel = titleEl?.querySelector(".fontLabel, .font-cxsecret");
      let questionText = toPlainText(fontLabel?.innerHTML || titleEl?.innerHTML || "")
        .replace(/^\d+\s*/, "").replace(/【.+?题】/, "").trim();
      if (!questionText) return;

      const options = [];
      const ulTop = container.querySelector(".Zy_ulTop");
      if (ulTop) {
        const lis = ulTop.querySelectorAll("li");
        lis.forEach((li) => {
          const labelSpan = li.querySelector("span[data]");
          const label = labelSpan?.getAttribute("data") || labelSpan?.textContent?.trim() || "";
          const aEl = li.querySelector("a.after, a");
          const text = toPlainText(aEl?.innerHTML || "").trim();
          options.push({ label, text, liEl: li, aEl });
        });
      }

      const textInputs = Array.from(container.querySelectorAll("textarea, input.inp[type='text']"));
      const answerField = container.querySelector("input[type='hidden'][name^='answer']:not([name^='answertype'])");
      const isMulti = questionType === "多选";
      const isJudge = questionType === "判断";

      questions.push({
        index, text: questionText, options, textInputs, isMulti, isJudge, answerField,
        type: textInputs.length > 0 ? "text" : isJudge ? "true-false" : isMulti ? "multiple-choice" : "single-choice",
        container,
      });
    });

    return questions;
  }

  // ═══════════════════════════════════════════════════════════════════
  // §7  AI Engine (Gemini)
  // ═══════════════════════════════════════════════════════════════════

  function extractJsonPayloadFromText(text) {
    if (typeof text !== "string") return null;
    const direct = parseJsonSafe(text.trim());
    if (direct) return direct;
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) { const p = parseJsonSafe(fenced[1].trim()); if (p) return p; }
    const start = text.indexOf("{");
    if (start === -1) return null;
    let depth = 0, inStr = false, esc = false;
    for (let i = start; i < text.length; i++) {
      const c = text[i];
      if (inStr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === '"') inStr = false; continue; }
      if (c === '"') { inStr = true; continue; }
      if (c === "{") depth++; else if (c === "}") { depth--; if (depth === 0) return parseJsonSafe(text.slice(start, i + 1)); }
    }
    return null;
  }

  function extractGeminiContent(payload) {
    const candidate = Array.isArray(payload?.candidates) ? payload.candidates[0] : null;
    const parts = candidate?.content?.parts;
    if (!Array.isArray(parts)) return "";
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

  function buildGeminiRequestBody(questions) {
    const systemText = [
      "你是超星学习通章节测验答题助手。请利用联网搜索能力查找题目答案。",
      "你必须只返回 JSON，不要 Markdown，不要代码块，不要解释。",
      "单选或多选优先填写 answerLabels；填空/简答填写 textAnswers。",
    ].join("\n");

    return {
      systemInstruction: { parts: [{ text: systemText }] },
      contents: [{
        role: "user", parts: [{
          text: JSON.stringify({
            task: "请一次性解答所有章节测验题目，利用搜索查找准确答案，严格按 JSON 返回。",
            questions: questions.map((q) => ({
              index: q.index, question: q.text, type: q.type,
              options: q.options.map((o) => ({ label: o.label, text: o.text })),
            })),
          }, null, 2)
        }]
      }],
      tools: [{ google_search: {} }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            answers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  index: { type: "integer" },
                  answerLabels: { type: "array", items: { type: "string" } },
                  textAnswers: { type: "array", items: { type: "string" } },
                },
                required: ["index"],
              },
            },
          },
          required: ["answers"],
        },
      },
    };
  }

  async function requestAnswersFromLlm(questions) {
    const endpoint = buildLlmEndpoint(state.llm.apiBaseUrl, state.llm.model, state.llm.apiKey);
    if (!endpoint) throw new Error("LLM endpoint not configured");
    // 隐藏 key 的日志
    const safeEndpoint = endpoint.replace(/key=[^&]+/, "key=***");
    log("debug", "ai", `requesting ${questions.length} questions → ${safeEndpoint}`);

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await gmXmlhttpRequestCompat({
          method: "POST", url: endpoint, timeout: 120000,
          headers: { "Content-Type": "application/json" },
          data: JSON.stringify(buildGeminiRequestBody(questions)),
        });
        const status = Number(response?.status || 0);
        const bodyText = response?.responseText || response?.response || "";
        if (!(status >= 200 && status < 300)) throw new Error(`HTTP ${status}: ${bodyText.slice(0, 200)}`);

        const outerPayload = parseJsonSafe(bodyText);
        if (!outerPayload) throw new Error("response is not valid JSON");

        const content = extractGeminiContent(outerPayload);
        let parsed = extractJsonPayloadFromText(content);
        if (!parsed && content) try { parsed = JSON.parse(content.replace(/^\uFEFF/, "")); } catch (_) { /* */ }
        if (!parsed?.answers) throw new Error("no answers in response");

        log("success", "ai", `got ${parsed.answers.length} answers`);
        return parsed.answers;
      } catch (e) {
        log("warn", "ai", `attempt ${attempt}/3 failed: ${e.message}`);
        if (attempt < 3) await sleep(attempt * 2000); else throw e;
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // §8  Answer Application
  // ═══════════════════════════════════════════════════════════════════

  function applyAnswer(question, answer) {
    if (!answer) return false;
    if (Array.isArray(answer.answerLabels) && answer.answerLabels.length && question.options.length) {
      const targets = new Set(answer.answerLabels.map((l) => l.toUpperCase().trim()));
      let applied = false;
      for (const opt of question.options) {
        const isTarget = targets.has(opt.label.toUpperCase());
        const alreadySelected = isOptionSelected(opt);
        // 只点击需要改变状态的选项：
        // - 目标选项未选中 → 点击选中
        // - 非目标选项已选中 → 多选题需要取消（单选题点击新选项会自动取消旧的）
        if (isTarget && !alreadySelected) {
          if (opt.aEl) { opt.aEl.click(); applied = true; }
          else if (opt.liEl) { opt.liEl.click(); applied = true; }
        } else if (!isTarget && alreadySelected && question.isMulti) {
          // 多选题：取消不在目标中的已选选项
          if (opt.aEl) { opt.aEl.click(); applied = true; }
          else if (opt.liEl) { opt.liEl.click(); applied = true; }
        }
      }
      return applied;
    }
    if (Array.isArray(answer.textAnswers) && answer.textAnswers.length && question.textInputs.length) {
      let applied = false;
      question.textInputs.forEach((input, i) => {
        const text = answer.textAnswers[i] || answer.textAnswers[0] || "";
        if (!text) return;
        const setter = Object.getOwnPropertyDescriptor(
          input.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, "value",
        )?.set;
        if (setter) setter.call(input, text); else input.value = text;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        applied = true;
      });
      return applied;
    }
    return false;
  }

  // ═══════════════════════════════════════════════════════════════════
  // §9  UI Panel
  // ═══════════════════════════════════════════════════════════════════

  let panelEl = null;
  let panelTitleEl = null;
  let panelStatusEl = null;
  let panelCountEl = null;
  let panelStatusText = "初始化中...";

  function renderPanel() {
    if (!panelEl) return;
    panelTitleEl.textContent = "超星 AI 答题";
    panelStatusEl.textContent = `状态：${panelStatusText}`;
    panelCountEl.textContent = `已经记录（${state.answerRecords.length}）题目`;
  }

  function ensurePanel() {
    if (panelEl) return;
    panelEl = document.createElement("div");
    panelEl.style.cssText = "position:fixed;bottom:20px;right:20px;z-index:99999;background:#1a1a2e;color:#e0e0e0;padding:12px 16px;border-radius:8px;font-size:13px;font-family:monospace;box-shadow:0 4px 12px rgba(0,0,0,0.3);max-width:300px;line-height:1.5;";
    panelTitleEl = document.createElement("div");
    panelTitleEl.style.cssText = "font-weight:700;margin-bottom:6px;";
    panelStatusEl = document.createElement("div");
    panelCountEl = document.createElement("div");
    panelCountEl.style.cssText = "margin-top:6px;color:#9fe870;";
    panelEl.appendChild(panelTitleEl);
    panelEl.appendChild(panelStatusEl);
    panelEl.appendChild(panelCountEl);
    document.body.appendChild(panelEl);
    renderPanel();
  }
  function updatePanel(text) {
    panelStatusText = text;
    ensurePanel();
    renderPanel();
  }

  // ═══════════════════════════════════════════════════════════════════
  // §10 Submit / Save & Auto-Advance
  // ═══════════════════════════════════════════════════════════════════

  function findButtonInDoc(doc, ...textPatterns) {
    if (!doc) return null;
    const allBtns = doc.querySelectorAll("a, button, input[type='button'], input[type='submit']");
    for (const btn of allBtns) {
      const btnText = (btn.textContent || btn.value || "").trim();
      for (const pattern of textPatterns) {
        if (typeof pattern === "string" ? btnText.includes(pattern) : pattern.test(btnText)) return btn;
      }
    }
    return null;
  }

  async function submitOrSaveQuiz(quizDoc) {
    if (state.submitMode === "submit") {
      // 直接提交
      const submitBtn = findButtonInDoc(quizDoc, "提交", /交卷/);
      if (submitBtn) {
        log("success", "submit", "clicking submit button");
        updatePanel("正在提交...");
        submitBtn.click();
        await sleep(1500);
        // 处理确认弹窗 — 在外层页面和 quiz doc 中都找
        for (const searchDoc of [quizDoc, document]) {
          const confirmBtn = findButtonInDoc(searchDoc, "确定", "确认", "提交");
          if (confirmBtn && confirmBtn !== submitBtn) {
            confirmBtn.click();
            await sleep(1000);
            break;
          }
        }
        log("success", "submit", "quiz submitted");
        updatePanel("已提交");
        return true;
      }
      log("warn", "submit", "submit button not found, falling back to save");
    }

    // 暂时保存
    const saveBtn = findButtonInDoc(quizDoc, "暂时保存", "保存", /暂存/);
    if (saveBtn) {
      log("success", "save", "clicking save button");
      updatePanel("正在保存...");
      saveBtn.click();
      await sleep(1500);
      log("success", "save", "quiz saved");
      updatePanel("已保存");
      return true;
    }

    log("warn", "save", "no save/submit button found");
    return false;
  }

  function isCurrentSectionLast() {
    const nextBtn = document.querySelector("#prevNextFocusNext, .prev_next.next");
    if (nextBtn) {
      const style = typeof getComputedStyle === "function" ? getComputedStyle(nextBtn) : null;
      const isVisible = nextBtn.offsetParent !== null
        && style?.display !== "none"
        && style?.visibility !== "hidden";
      const onclickAttr = nextBtn.getAttribute("onclick") || "";
      const hasNextAction = onclickAttr.includes("PCount.next");
      if (isVisible && hasNextAction) return false;
      if (!isVisible && !hasNextAction) return true;
    }

    const catalogNames = Array.from(document.querySelectorAll(".posCatalog_name"))
      .filter((el) => normalizeText(el.textContent));
    const activeCatalogName = document.querySelector(".posCatalog_active .posCatalog_name, .posCatalog_name.posCatalog_active");
    if (activeCatalogName && catalogNames.length) {
      return activeCatalogName === catalogNames[catalogNames.length - 1];
    }

    return !nextBtn;
  }

  async function clickNextSection() {
    const nextBtn = document.querySelector("#prevNextFocusNext, .prev_next.next");
    if (!nextBtn || nextBtn.offsetParent === null) {
      const onclickAttr = nextBtn?.getAttribute("onclick") || "";
      if (onclickAttr.includes("PCount.next")) {
        try { new Function(onclickAttr)(); } catch (_) { /* */ }
      } else {
        log("warn", "advance", "next section button not found");
        return false;
      }
    } else {
      nextBtn.click();
    }
    log("success", "advance", "clicked next section, waiting for confirm dialog...");
    updatePanel("正在跳转下一节...");

    // 等待"当前章节还有任务点未完成"确认弹窗出现并自动点击"下一节"
    for (let i = 0; i < 10; i++) {
      await sleep(500);
      // 弹窗 .jobFinishTip 中的"下一节"按钮
      const popNextBtn = document.querySelector(".jobFinishTip .nextChapter");
      if (popNextBtn && popNextBtn.offsetParent !== null) {
        log("success", "advance", "clicking confirm dialog next button");
        popNextBtn.click();
        return true;
      }
      // workPop 弹窗中的确定按钮
      const popOk = document.querySelector("#workpop #popok");
      if (popOk && popOk.offsetParent !== null) {
        log("success", "advance", "clicking workPop confirm button");
        popOk.click();
        return true;
      }
    }

    // 没有弹窗说明直接跳转了
    log("debug", "advance", "no confirm dialog appeared, navigation may have succeeded");
    return true;
  }

  // ═══════════════════════════════════════════════════════════════════
  // §10 Answer Recording & Export
  // ═══════════════════════════════════════════════════════════════════

  function getSectionTitle() {
    const titleEl = document.querySelector(".prev_title, .posCatalog_active .posCatalog_name");
    return (titleEl?.textContent || titleEl?.getAttribute("title") || "").trim() || "未知章节";
  }

  function normalizeRecordText(value) {
    return normalizeText(value).replace(/\s+/g, " ");
  }

  function readExistingAnswerFromDom(question) {
    if (question.options.length) {
      const selected = [];
      for (const opt of question.options) {
        if (isOptionSelected(opt)) {
          selected.push(formatRecordedOption(opt));
        }
      }
      if (selected.length) return selected.join("; ");

      const storedAnswer = getStoredQuestionAnswer(question);
      if (!storedAnswer) return null;
      const labels = new Set(parseStoredOptionLabels(question, storedAnswer));
      const matched = question.options
        .filter((opt) => labels.has(normalizeText(opt.label).toUpperCase()))
        .map((opt) => formatRecordedOption(opt));
      return matched.length ? matched.join("; ") : storedAnswer;
    }
    // 填空/简答
    if (question.textInputs.length) {
      const texts = question.textInputs.map((i) => (i.value || "").trim()).filter(Boolean);
      return texts.length ? texts.join("; ") : getStoredQuestionAnswer(question) || null;
    }
    return getStoredQuestionAnswer(question) || null;
  }

  function getAnswerRecordKey(record) {
    return [record.section, record.type, record.question].join("\u0001");
  }

  function getAnswerRecordScore(record) {
    return (record.answer ? 2 : 0) + (record.options ? 1 : 0) + (record.source === "ai" ? 1 : 0);
  }

  function releaseQuestionDomRefs(question) {
    if (!question || typeof question !== "object") return;
    if (Array.isArray(question.options)) {
      question.options.forEach((opt) => {
        if (!opt || typeof opt !== "object") return;
        opt.liEl = null;
        opt.aEl = null;
      });
    }
    if (Array.isArray(question.textInputs)) question.textInputs = [];
    question.answerField = null;
    question.container = null;
  }

  function recordAnswer(question, answer, source, sectionTitle) {
    state.answerRecordWriteCount += 1;

    const record = {
      section: normalizeRecordText(sectionTitle) || "未知章节",
      question: normalizeRecordText(question.text),
      questionIndex: Number.isFinite(Number(question.index)) ? Number(question.index) + 1 : null,
      type: normalizeRecordText(question.type),
      options: normalizeRecordText(question.options.map((o) => o.label + ". " + o.text).join(" | ")),
      answer: normalizeRecordText(answer),
      source, // "page" = 页面已有答案, "ai" = AI 回答
    };
    if (!record.question) return;

    if (!state.answerRecordSectionOrder.has(record.section)) {
      state.answerRecordSectionOrder.set(record.section, state.answerRecordSectionOrder.size);
    }

    const key = getAnswerRecordKey(record);
    const existingIndex = state.answerRecordIndex.get(key);
    if (typeof existingIndex === "number") {
      const existing = state.answerRecords[existingIndex];
      const nextScore = getAnswerRecordScore(record);
      const existingScore = getAnswerRecordScore(existing);
      if (nextScore > existingScore || (nextScore === existingScore && record.source === "ai" && existing.source !== "ai")) {
        state.answerRecords[existingIndex] = { ...existing, ...record };
      }
    } else {
      state.answerRecordIndex.set(key, state.answerRecords.length);
      state.answerRecords.push(record);
    }

    renderPanel();
  }

  function getExportAnswerRecords() {
    return state.answerRecords.map((record, order) => ({
      ...record,
      section: normalizeRecordText(record.section) || "未知章节",
      question: normalizeRecordText(record.question),
      type: normalizeRecordText(record.type),
      options: normalizeRecordText(record.options),
      answer: normalizeRecordText(record.answer),
      questionIndex: Number.isFinite(Number(record.questionIndex)) ? Number(record.questionIndex) : Number.MAX_SAFE_INTEGER,
      order,
    })).sort((a, b) => {
      const sectionDelta = (state.answerRecordSectionOrder.get(a.section) ?? Number.MAX_SAFE_INTEGER)
        - (state.answerRecordSectionOrder.get(b.section) ?? Number.MAX_SAFE_INTEGER);
      if (sectionDelta !== 0) return sectionDelta;
      const questionDelta = a.questionIndex - b.questionIndex;
      if (questionDelta !== 0) return questionDelta;
      return a.order - b.order;
    });
  }

  function getQuestionTypeLabel(type) {
    const normalized = normalizeText(type);
    if (normalized === "single-choice") return "单选题";
    if (normalized === "multiple-choice") return "多选题";
    if (normalized === "true-false") return "判断题";
    if (normalized === "text") return "填空/简答";
    return normalized || "未知题型";
  }

  function getAnswerSourceLabel(source) {
    return source === "page" ? "页面已有" : "AI";
  }

  function splitRecordOptions(optionsText) {
    return normalizeText(optionsText).split(/\s*\|\s*/).map((item) => item.trim()).filter(Boolean);
  }

  function formatExportAnswerText(answerText) {
    const normalized = normalizeText(answerText);
    return normalized || "（空）";
  }

  function buildAnswerFileContent() {
    const exportRecords = getExportAnswerRecords();
    const groupedRecords = new Map();
    exportRecords.forEach((record) => {
      if (!groupedRecords.has(record.section)) groupedRecords.set(record.section, []);
      groupedRecords.get(record.section).push(record);
    });

    const lines = [];
    lines.push("# 超星章节测验答案记录");
    lines.push(`# 导出时间: ${new Date().toLocaleString("zh-CN")}`);
    lines.push(`- 原始记录数: ${state.answerRecordWriteCount}`);
    lines.push(`- 去重后题目数: ${exportRecords.length}`);
    lines.push(`- 章节数: ${groupedRecords.size}`);
    lines.push("");

    for (const [section, records] of groupedRecords.entries()) {
      lines.push(`## ${section}（${records.length} 题）`);
      lines.push("");
      records.forEach((r, i) => {
        const displayIndex = Number.isFinite(r.questionIndex) && r.questionIndex !== Number.MAX_SAFE_INTEGER
          ? r.questionIndex
          : i + 1;
        lines.push(`### ${displayIndex}. [${getQuestionTypeLabel(r.type)}] ${r.question}`);
        const optionLines = splitRecordOptions(r.options);
        if (optionLines.length) {
          lines.push("- 选项：");
          optionLines.forEach((optionText) => lines.push(`  - ${optionText}`));
        }
        lines.push(`- 答案：${formatExportAnswerText(r.answer)}`);
        lines.push(`- 来源：${getAnswerSourceLabel(r.source)}`);
        lines.push("");
      });
      lines.push("");
    }

    return lines.join("\n");
  }

  function downloadAnswerFile() {
    if (!state.answerRecords.length) {
      log("warn", "export", "no answers to export");
      return;
    }
    const exportRecords = getExportAnswerRecords();
    const content = buildAnswerFileContent();
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `超星答案_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
    log("success", "export", `exported ${exportRecords.length} answers (from ${state.answerRecordWriteCount} records)`);
  }

  // ═══════════════════════════════════════════════════════════════════
  // §11 Bootstrap
  // ═══════════════════════════════════════════════════════════════════

  // Install anti-debug IMMEDIATELY at document-start, before any platform code runs
  installAntiDebugGuards();

  async function processCurrentSection() {
    // 切换到章节测验 tab
    switchToQuizTab();

    // 等待题目 iframe 加载
    let quizDoc = null;
    for (let i = 0; i < 20; i++) {
      await sleep(1000);
      switchToQuizTab();
      quizDoc = getQuizDoc();
      if (quizDoc?.body && quizDoc.querySelectorAll(".TiMu").length > 0) break;
      quizDoc = null;
    }
    if (!quizDoc) {
      log("debug", "main", "no quiz found in this section, skipping");
      return "no-quiz";
    }

    await sleep(1000);
    quizDoc = getQuizDoc();
    try { decryptFontSecret(quizDoc); } catch (_) { /* */ }

    updatePanel("提取题目...");
    const questions = extractQuestionsFromDoc(quizDoc);
    if (!questions.length) return "no-quiz";

    const sectionTitle = getSectionTitle();

    // 记录已答题目的答案（从页面 DOM 读取）
    const unanswered = [];
    for (const q of questions) {
      if (isQuestionAlreadyAnswered(q)) {
        const existingAnswer = readExistingAnswerFromDom(q);
        if (existingAnswer) recordAnswer(q, existingAnswer, "page", sectionTitle);
        releaseQuestionDomRefs(q);
      } else {
        unanswered.push(q);
      }
    }
    if (!unanswered.length) {
      log("success", "main", `all ${questions.length} questions already answered`);
      updatePanel(`${questions.length} 题已全部作答，跳过`);
      return "already-done";
    }

    updatePanel(`${unanswered.length}/${questions.length} 题待答，请求 AI...`);
    log("success", "main", `${unanswered.length} unanswered out of ${questions.length}`);

    let answers;
    try { answers = await requestAnswersFromLlm(unanswered); }
    catch (e) { updatePanel(`AI 请求失败：${e.message}`); return "ai-error"; }

    updatePanel(`收到 ${answers.length} 个答案，填写中...`);
    let applied = 0;
    for (const ans of answers) {
      const q = unanswered.find((q) => q.index === Number(ans.index));
      if (!q) continue;
      // 构建答案文本用于记录
      const answerText = Array.isArray(ans.answerLabels) && ans.answerLabels.length
        ? ans.answerLabels.join(", ")
        : Array.isArray(ans.textAnswers) && ans.textAnswers.length
          ? ans.textAnswers.join("; ")
          : "";
      if (applyAnswer(q, ans)) {
        applied++;
        recordAnswer(q, answerText, "ai", sectionTitle);
        releaseQuestionDomRefs(q);
        await sleep(300 + Math.random() * 200);
      } else {
        recordAnswer(q, answerText + " (填写失败)", "ai", sectionTitle);
        releaseQuestionDomRefs(q);
      }
    }
    updatePanel(`完成：${applied}/${unanswered.length} 题已填写`);

    // 保存或提交
    if (applied > 0) {
      await sleep(1000);
      const quizDocFresh = getQuizDoc();
      await submitOrSaveQuiz(quizDocFresh || quizDoc);
    }

    return "done";
  }

  async function main() {
    if (window !== window.top) return;

    await loadConfig();
    registerMenus();

    if (document.readyState === "loading") {
      await new Promise((r) => document.addEventListener("DOMContentLoaded", r));
    }
    ensurePanel();

    if (!isLlmConfigured()) {
      updatePanel("请先在 Tampermonkey 菜单中配置 API Key 和 Model");
      return;
    }

    // 循环处理多个章节
    const maxSections = 100;
    for (let section = 0; section < maxSections; section++) {
      if (state.halted) break;

      updatePanel(section === 0 ? "等待页面加载..." : "等待新章节加载...");
      if (section > 0) await sleep(3000); // 等待页面 AJAX 加载完成

      if (isCurrentSectionLast()) {
        log("success", "main", "already at last section, auto stopping");
        updatePanel("已到最后一节，自动停止");
        break;
      }

      const result = await processCurrentSection();

      if (!state.autoAdvance) {
        if (result === "done" || result === "already-done") {
          updatePanel("当前章节完成（自动下一节已关闭）");
        }
        break;
      }

      // 自动跳转下一节
      if (result === "done" || result === "already-done" || result === "no-quiz") {
        await sleep(2000);
        updatePanel("跳转下一节...");
        const advanced = await clickNextSection();
        if (!advanced) {
          updatePanel("没有更多章节了");
          break;
        }
        // 等待页面内容更新（超星是 AJAX 加载，不是真正的页面跳转）
        await sleep(3000);
        // 重置字体解密状态，因为新章节可能有新的加密字体
        state.fontDecrypted = false;
        continue;
      }

      // AI 错误等情况，停止
      break;
    }

    // 所有章节处理完毕，自动导出答案文件
    if (state.answerRecords.length > 0) {
      updatePanel(`全部完成，共记录 ${state.answerRecords.length} 题，正在导出...`);
      await sleep(1000);
      downloadAnswerFile();
    }
  }

  main().catch((e) => { log("error", "main", "fatal", e); updatePanel?.(`错误：${e.message}`); });
})();
