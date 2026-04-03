const fs = require("fs");
const path = require("path");
const assert = require("assert");

const runtimeDir = __dirname;
const scriptPath = path.join(runtimeDir, "auto-wisdom-tree.js");
const summaryPath = path.join(runtimeDir, "auto-wisdom-tree-summary.md");
const script = fs.readFileSync(scriptPath, "utf8");
const summary = fs.readFileSync(summaryPath, "utf8");
const obfStuStudy = fs.readFileSync(path.join(runtimeDir, "..", "v2-source", "stuStudy.js"), "utf8");
const obfApp = fs.readFileSync(path.join(runtimeDir, "..", "v2-source", "app.js"), "utf8");
const obfVideoPlayer = fs.readFileSync(path.join(runtimeDir, "..", "v2-source", "videoPlayer.js"), "utf8");
const hotkeyGuardSection = script.match(/function installDevtoolsHotkeyGuard\(\) \{[\s\S]*?\n  }\n\n  function installAntiDebugGuards/);

function expect(pattern, description) {
  assert.match(script, pattern, `missing: ${description}`);
}

function expectText(text, description, source = script) {
  assert.ok(source.includes(text), `missing: ${description}`);
}

expect(/@run-at\s+document-start/, "metadata run-at=document-start");
expect(/@grant\s+unsafeWindow/, "metadata unsafeWindow grant");
expect(/function installDevtoolsHotkeyGuard\(/, "lightweight devtools hotkey guard helper");
expect(/function startVmPatchProbe\(/, "early vm patch probe helper");
expect(/if \(document\.readyState === "loading"\) return;/, "runtimeTick skips during loading");
expect(/document\.readyState !== "loading" && timestamp - state\.antiDebug\.lastStripLogAt > 5000/, "anti-debug strip logging is throttled");
expect(/installDevtoolsHotkeyGuard\(\);\s*installAntiDebugGuards\(\);\s*patchFetch\(\);\s*patchXhr\(\);\s*patchSendBeacon\(\);\s*startVmPatchProbe\(\);/s, "bootstrap restores anti-debug debugger bypass at startup and starts early vm probe");
assert.doesNotMatch(script, /Object\.defineProperty\(PAGE\.Function\.prototype,\s*"constructor"/, "Function.prototype.constructor override must stay removed");
assert.ok(hotkeyGuardSection, "missing hotkey guard section");
assert.doesNotMatch(hotkeyGuardSection[0], /preventDefault\(/, "devtools hotkey guard must not block browser default F12 behavior");

[
  "function normalizeVideoId(",
  "function resolveCurrentVideoId(",
  "function formatDuration(",
  "function clampPercent(",
  "function formatPercent(",
  "function buildUiLogMessage(",
  "function getUiLogEntry(",
  "function getCurrentVideoProgress(",
  "function getCourseProgress(",
  "function buildUiStatusText(",
  "function patchFetch(",
  "function patchXhr(",
  "function patchJqueryAjax(",
  "function patchSendBeacon(",
  "function installAntiDebugGuards(",
  "function startVmPatchProbe(",
  "function installProgressDebugHooks(",
  "function snapshotProgressState(",
  "function trackProgressTrend(",
  "function collectVideoEntries(",
  "function findNextPendingVideoEntry(",
  "function jumpToNextPendingVideo(",
  "function jumpToVideoEntry(",
  "function isRecordedProgressComplete(",
  "function isVideoNaturallyFinished(",
  "function retryCurrentVideoIfNeeded(",
  "function stripDebuggerStatements(",
  "function isDevtoolsKeyEvent(",
  'antiAntiDebug: true',
  'antiAntiDebug: "awt:antiAntiDebug"',
  '反反调试/F12:',
  'Function proxy installed',
  'eval proxy installed',
  'devtools hotkey guard installed',
  'captured devtools hotkey',
  'early vm patch probe completed',
  'aberrantCloseBtn blocked',
  'xhr fallback blocked [${kind}]',
  'progress debug hooks installed',
  'page hidden snapshot captured',
  'page visible snapshot captured',
  'progress trend snapshot',
  'question auto-submitted:',
  'jump to next unfinished video',
  'video ended but recorded progress is incomplete, retry from start',
  'return isVideoNaturallyFinished(video) && isRecordedProgressComplete(vm);',
  'reason: "recorded progress completed"',
].forEach((text) => expectText(text, text));

expect(
  /if \(isRecordedProgressComplete\(vm\) && jumpToNextPendingVideo\(vm, "recorded progress completed"\)\) return;/,
  "completed current video jumps to next unfinished before waiting for natural finish",
);
expect(
  /if \(!shouldAdvance\(vm\)\) return;/,
  "sequential videoNext fallback still requires natural finish",
);
expect(
  /if \(currentIndex < 0\) return null;/,
  "next unfinished search must not jump from an unknown current item",
);
expect(
  /if \(level === "debug"\) return null;/,
  "debug logs must stay out of the page log panel",
);
expect(
  /state\.uiStatusNode\.textContent = buildUiStatusText\(state\.uiStatusText \|\| "运行中", vm\);/,
  "status bar should be rebuilt from runtime progress helpers",
);

[
  "collector\\.zhihuishu\\.com\\/public\\/collect",
  "collector2c\\.zhihuishu\\.com\\/public\\/collect",
  "collector2c\\.zhihuishu\\.com\\/public\\/jsonp\\/collect",
  "collector2c\\.zhihuishu\\.com\\/public\\/kafkaCollect",
  "\\/cheat\\/exceptionActionDetail",
  "\\/cheat\\/agreeExceptionActionDetail",
  "queryIsLimitFlow",
].forEach((text) => expectText(text, text));

[
  "'popupAnswer': function",
  "'testDotClick': function",
  "'topicClickQot': function",
  "'closeTest': function",
  "'videoNext': function",
  "'notTrustScript': function",
  "'checkoutNotTrustScript': function",
  "'collectLog': function",
  "'aberrantFun': function",
  "'fetchLogData': function",
].forEach((text) => expectText(text, `obfuscated stuStudy keeps ${text}`, obfStuStudy));

[
  "'queryUserRecruitIdLastVideoId': function",
  "'popupAnswer': function",
  "'saveLessonPopupExamSaveAnswer': function",
  "'lessonPopupExam': function",
  "/cheat/agreeExceptionActionDetail",
  "/app/queryIsLimitFlow",
].forEach((text) => expectText(text, `obfuscated app keeps ${text}`, obfApp));

[
  "//collector.zhihuishu.com/public/collect",
  "https://collector2c.zhihuishu.com/public/collect",
  "MonitorUtil",
  "playbackRate",
].forEach((text) => expectText(text, `obfuscated videoPlayer keeps ${text}`, obfVideoPlayer));

[
  "## 目标",
  "## 实现摘要",
  "## 验证",
  "进度未完成，重播当前视频",
  "后台标签页不同步调试",
].forEach((text) => expectText(text, `summary keeps ${text}`, summary));

function extractFunction(name) {
  const marker = `function ${name}(`;
  const start = script.indexOf(marker);
  assert.ok(start >= 0, `missing function source: ${name}`);

  let depth = 0;
  let foundBody = false;
  for (let index = start; index < script.length; index += 1) {
    const char = script[index];
    if (char === "{") {
      depth += 1;
      foundBody = true;
    } else if (char === "}") {
      depth -= 1;
      if (foundBody && depth === 0) {
        return script.slice(start, index + 1);
      }
    }
  }

  throw new Error(`unterminated function source: ${name}`);
}

function instantiateFunction(name, deps = {}) {
  const depNames = Object.keys(deps);
  const depValues = depNames.map((depName) => deps[depName]);
  const factory = new Function(...depNames, `"use strict"; ${extractFunction(name)} return ${name};`);
  return factory(...depValues);
}

const normalizeVideoId = instantiateFunction("normalizeVideoId");
const resolveCurrentVideoId = instantiateFunction("resolveCurrentVideoId", { normalizeVideoId });
const collectVideoEntries = instantiateFunction("collectVideoEntries", { normalizeVideoId });
const isLessonPendingForAdvance = instantiateFunction("isLessonPendingForAdvance");
const clampPercent = instantiateFunction("clampPercent");
const summarizeBlockedKind = instantiateFunction("summarizeBlockedKind");
const shortenUiUrl = instantiateFunction("shortenUiUrl");
const buildUiLogMessage = instantiateFunction("buildUiLogMessage", {
  summarizeBlockedKind,
  shortenUiUrl,
});
const getCourseProgress = instantiateFunction("getCourseProgress", {
  collectVideoEntries,
  clampPercent,
});
const findNextPendingVideoEntry = instantiateFunction("findNextPendingVideoEntry", {
  collectVideoEntries,
  resolveCurrentVideoId,
  isLessonPendingForAdvance,
});

assert.strictEqual(normalizeVideoId(123), "123", "normalizeVideoId should stringify numeric ids");
assert.strictEqual(normalizeVideoId("  abc  "), "abc", "normalizeVideoId should trim string ids");
assert.strictEqual(normalizeVideoId("   "), null, "normalizeVideoId should drop empty ids");

const sampleVm = {
  lastViewVideoId: "v2",
  videoList: [
    {
      videoLessons: [
        { videoId: "v1", isStudiedLesson: 1, percentage: 100 },
        {
          videoSmallLessons: [
            { videoId: "v2", isStudiedLesson: 1, percentage: 100 },
            { videoId: "v3", isStudiedLesson: 1, percentage: 100 },
          ],
        },
        { videoId: "v4", isStudiedLesson: 0, percentage: 0 },
      ],
    },
  ],
};

assert.deepStrictEqual(
  collectVideoEntries(sampleVm).map((entry) => entry.videoId),
  ["v1", "v2", "v3", "v4"],
  "collectVideoEntries should flatten lessons and child lessons in visual order",
);
assert.strictEqual(
  findNextPendingVideoEntry(sampleVm)?.videoId,
  "v4",
  "findNextPendingVideoEntry should return the first unfinished item after the current one",
);
assert.strictEqual(
  findNextPendingVideoEntry({ ...sampleVm, lastViewVideoId: "missing" }),
  null,
  "findNextPendingVideoEntry should refuse to jump when current item cannot be resolved",
);
assert.strictEqual(
  buildUiLogMessage("debug", "progress", "progress trend snapshot", {}),
  null,
  "debug logs should be hidden from the page log panel",
);
assert.strictEqual(
  buildUiLogMessage("success", "player", "jump to next unfinished video", {}),
  "当前视频已完成，已跳到下一个未完成视频",
  "page log messages should use Chinese user-friendly copy",
);
assert.strictEqual(
  buildUiLogMessage("warn", "network", "xhr fallback blocked [detect]", "https://example.com/path"),
  "已拦截检测请求：example.com/path",
  "network page logs should keep only the short Chinese request summary",
);
assert.deepStrictEqual(
  getCourseProgress(sampleVm),
  {
    completedCount: 3,
    totalCount: 4,
    percent: 75,
  },
  "getCourseProgress should aggregate per-lesson percentage into total course progress",
);

console.log("[test-auto-wisdom-tree] smoke, obfuscated-source, anti-debug, progress-retry, and passive progress-debug checks passed");
