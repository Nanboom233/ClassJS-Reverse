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
expect(/@match\s+\*:\/\/onlineexamh5new\.zhihuishu\.com\/\*/, "metadata match onlineexamh5new");
expect(/@match\s+\*:\/\/studentexambaseh5\.zhihuishu\.com\/\*/, "metadata match studentexambaseh5");
expect(/@match\s+\*:\/\/exam\.zhihuishu\.com\/\*/, "metadata match exam host");
expectText("const ANSWER_INTERVAL_MS = 5000;", "forced five-second answer interval");
expect(/function installDevtoolsHotkeyGuard\(/, "lightweight devtools hotkey guard helper");
expect(/function startVmPatchProbe\(/, "early vm patch probe helper");
expect(/if \(document\.readyState === "loading"\) return;/, "runtimeTick skips during loading");
expect(/installDevtoolsHotkeyGuard\(\);\s*installAntiDebugGuards\(\);\s*patchFetch\(\);\s*patchXhr\(\);\s*patchSendBeacon\(\);/s, "bootstrap restores anti-debug debugger bypass at startup");
expect(/if \(isStudyPage\(\)\) \{\s*startVmPatchProbe\(\);\s*\}/s, "study-page bootstrap still starts the vm patch probe");
expect(/Object\.defineProperty\(OriginalFunction\.prototype,\s*"constructor",\s*\{[\s\S]*value:\s*FunctionProxy/s, "Function.prototype.constructor should point to the debugger-stripping proxy");
assert.doesNotMatch(script, /Object\.defineProperty\(OriginalFunction\.prototype,\s*"constructor",\s*\{[\s\S]*get\s*\(/s, "Function.prototype.constructor override must stay data-property based");
assert.ok(hotkeyGuardSection, "missing hotkey guard section");
assert.doesNotMatch(hotkeyGuardSection[0], /preventDefault\(/, "devtools hotkey guard must not block browser default F12 behavior");
assert.doesNotMatch(hotkeyGuardSection[0], /stopImmediatePropagation\(/, "devtools hotkey bypass must not swallow the event itself");
assert.doesNotMatch(script, /captured devtools hotkey/, "legacy hotkey capture logging must stay removed");
assert.doesNotMatch(script, /已绕过异常脚本检测/, "user-side detect bypass spam copy must stay removed");
assert.doesNotMatch(script, /stripped debugger statement from dynamic code/i, "dynamic anti-debug strip spam log must stay removed");

[
  "function normalizeVideoId(",
  "function resolveCurrentVideoId(",
  "function observeCurrentVideo(",
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
  "function resetProgressSyncState(",
  "function appendWatchPointRange(",
  "function getActualPlaybackPercent(",
  "function syncProgressFromPlayback(",
  "function collectVideoEntries(",
  "function findFirstPendingVideoEntry(",
  "function findNextPendingVideoEntry(",
  "function jumpToNextPendingVideo(",
  "function jumpToVideoEntry(",
  "function isRecordedProgressComplete(",
  "function isVideoNaturallyFinished(",
  "function shouldDelayReplay(",
  "function markAdvanceAttempt(",
  "function retryCurrentVideoIfNeeded(",
  "function stripDebuggerStatements(",
  "function isDevtoolsKeyEvent(",
  "function isStudyPage(",
  "function isExamPage(",
  "function buildExamSessionPayload(",
  "function armExamSession(",
  "function restoreExamAnsweringMode(",
  "function readCurrentExamQuestion(",
  "function handleExamPageRuntime(",
  "function maybeLaunchCurrentLessonExam(",
  'autoOpenRegularExam: true',
  'autoOpenRegularExam: "awt:autoOpenRegularExam"',
  'antiAntiDebug: true',
  'antiAntiDebug: "awt:antiAntiDebug"',
  'examAnswerBank: "awt:examAnswerBank"',
  'examSession: "awt:examSession"',
  'recoveredThisPage: false',
  'recoverMode: "exam-page-runtime"',
  '自动开测:${state.config.autoOpenRegularExam ? "开" : "关"}',
  'if (!isDelayElapsed(state.answerFlow.lastPopupAnswerAt)) {',
  'if (!isDelayElapsed(state.exam.lastAnsweredAt)) {',
  '自动打开平时测试',
  '反反调试/F12:',
  'currentVideoId: null',
  'currentVideoChangedAt: 0',
  'advanceCooldownUntil: 0',
  'lastReplayVideoId: null',
  'Function proxy installed',
  'Function constructor proxy installed',
  'eval proxy installed',
  'page devtools hotkey bypass installed',
  'early vm patch probe completed',
  'aberrantCloseBtn blocked',
  'xhr fallback blocked [${kind}]',
  'progress debug hooks installed',
  'page hidden snapshot captured',
  'page visible snapshot captured',
  'progress trend snapshot',
  'compensated throttled progress lag',
  'forced final progress flush at natural end',
  'question auto-submitted:',
  'launch regular exam',
  'regular exam runtime recovered',
  'regular exam question answered',
  'regular exam fallback answer used',
  'regular exam action clicked',
  '已到最后一题，等待手动交卷',
  'jump to first unfinished video',
  'video ended but recorded progress is incomplete, retry from start',
  'return isVideoNaturallyFinished(video) && isRecordedProgressComplete(vm);',
  'reason: "recorded progress completed"',
].forEach((text) => expectText(text, text));

expect(
  /if \(isRecordedProgressComplete\(vm\) && jumpToNextPendingVideo\(vm, "recorded progress completed", currentVideoId\)\) return;/,
  "completed current video jumps to next unfinished before waiting for natural finish",
);
expect(
  /if \(!currentVideoId \|\| shouldDelayReplay\(currentVideoId\)\) return false;/,
  "replay must be suppressed while a fresh video switch or jump cooldown is still settling",
);
expect(
  /if \(state\.lastReplayVideoId === currentVideoId && now\(\) - state\.lastReplayAt < 3000\) return true;/,
  "replay cooldown must now be keyed by current video id",
);
expect(
  /markAdvanceAttempt\(currentVideoId, nextPendingEntry\.videoId, 4500\);/,
  "jumping to the first unfinished video must arm a short post-jump cooldown",
);
expect(
  /if \(!shouldAdvance\(vm\)\) return;/,
  "sequential videoNext fallback still requires natural finish",
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
  "平时测试",
  "自动打开平时测试",
  "每题固定延迟 5 秒",
  "中途打开脚本也会直接恢复自动答题",
  "等待手动交卷",
  "列表中第一个未完成视频",
  "已移除页面侧“已绕过异常脚本检测”提示",
  "进度未完成，重播当前视频",
  "后台标签页不同步调试",
].forEach((text) => expectText(text, `summary keeps ${text}`, summary));
assert.doesNotMatch(summary, /测试脚本已按最后指令清理/, "summary must reflect that the test script is still present and used");
assert.doesNotMatch(summary, /stripDebuggerStatements.*节流/, "summary must not keep the stale stripped-debugger log note");

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
const observeState = {
  currentVideoId: null,
  currentVideoChangedAt: 0,
  lastReplayVideoId: "old-video",
  lastReplayAt: 10,
  lastAdvanceTargetId: "next-video",
  advanceCooldownUntil: 0,
  lastVideoId: null,
  lastAdvanceAt: 0,
  progressSync: {
    videoId: null,
    currentTime: 0,
    totalStudyTime: 0,
    observedAt: 0,
  },
};
const observeCurrentVideo = instantiateFunction("observeCurrentVideo", {
  resolveCurrentVideoId,
  state: observeState,
  now: () => 1000,
  logDebug: () => {},
});
const collectVideoEntries = instantiateFunction("collectVideoEntries", { normalizeVideoId });
const isLessonPendingForAdvance = instantiateFunction("isLessonPendingForAdvance");
const findFirstPendingVideoEntry = instantiateFunction("findFirstPendingVideoEntry", {
  collectVideoEntries,
  normalizeVideoId,
  isLessonPendingForAdvance,
});
const clampPercent = instantiateFunction("clampPercent");
const summarizeBlockedKind = instantiateFunction("summarizeBlockedKind");
const shortenUiUrl = instantiateFunction("shortenUiUrl");
const buildUiLogMessage = instantiateFunction("buildUiLogMessage", {
  summarizeBlockedKind,
  shortenUiUrl,
});
const tryAdvanceExamFlowSource = extractFunction("tryAdvanceExamFlow");
const hasManualSubmitButtonSource = extractFunction("hasManualSubmitButton");
const getCourseProgress = instantiateFunction("getCourseProgress", {
  collectVideoEntries,
  clampPercent,
});
const findNextPendingVideoEntry = instantiateFunction("findNextPendingVideoEntry", {
  findFirstPendingVideoEntry,
  resolveCurrentVideoId,
});
const shouldDelayReplay = instantiateFunction("shouldDelayReplay", {
  normalizeVideoId,
  state: observeState,
  now: () => 3000,
});
const markAdvanceAttempt = instantiateFunction("markAdvanceAttempt", {
  normalizeVideoId,
  state: observeState,
  now: () => 2000,
});

assert.strictEqual(normalizeVideoId(123), "123", "normalizeVideoId should stringify numeric ids");
assert.strictEqual(normalizeVideoId("  abc  "), "abc", "normalizeVideoId should trim string ids");
assert.strictEqual(normalizeVideoId("   "), null, "normalizeVideoId should drop empty ids");
assert.strictEqual(
  observeCurrentVideo({ lastViewVideoId: "next-video" }),
  "next-video",
  "observeCurrentVideo should resolve the current video id",
);
assert.deepStrictEqual(
  {
    currentVideoId: observeState.currentVideoId,
    currentVideoChangedAt: observeState.currentVideoChangedAt,
    lastReplayVideoId: observeState.lastReplayVideoId,
    lastAdvanceTargetId: observeState.lastAdvanceTargetId,
  },
  {
    currentVideoId: "next-video",
    currentVideoChangedAt: 1000,
    lastReplayVideoId: null,
    lastAdvanceTargetId: null,
  },
  "observeCurrentVideo should reset replay state after a video switch lands on the jump target",
);
markAdvanceAttempt("next-video", "pending-video", 4500);
assert.deepStrictEqual(
  {
    lastVideoId: observeState.lastVideoId,
    lastAdvanceTargetId: observeState.lastAdvanceTargetId,
    lastAdvanceAt: observeState.lastAdvanceAt,
    advanceCooldownUntil: observeState.advanceCooldownUntil,
  },
  {
    lastVideoId: "next-video",
    lastAdvanceTargetId: "pending-video",
    lastAdvanceAt: 2000,
    advanceCooldownUntil: 6500,
  },
  "markAdvanceAttempt should track the source, target, and cooldown window for the latest jump",
);
assert.strictEqual(
  shouldDelayReplay("next-video"),
  true,
  "shouldDelayReplay should suppress replay while a recent advance cooldown is active",
);
observeState.advanceCooldownUntil = 0;
observeState.currentVideoId = "next-video";
observeState.currentVideoChangedAt = 500;
assert.strictEqual(
  shouldDelayReplay("next-video"),
  true,
  "shouldDelayReplay should suppress replay immediately after the current video id changes",
);
observeState.currentVideoChangedAt = 0;
assert.strictEqual(
  shouldDelayReplay("next-video"),
  false,
  "shouldDelayReplay should allow replay once no cooldown is active and the video has stabilized",
);

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
  "findNextPendingVideoEntry should return the first unfinished item in the full list",
);
assert.strictEqual(
  findNextPendingVideoEntry({ ...sampleVm, lastViewVideoId: "missing" })?.videoId,
  "v4",
  "findNextPendingVideoEntry should still recover the first unfinished item when current resolution is missing",
);
const topDownVm = {
  lastViewVideoId: "v4",
  videoList: [
    {
      videoLessons: [
        { videoId: "v1", isStudiedLesson: 1, percentage: 100 },
        { videoId: "v2", isStudiedLesson: 0, percentage: 0 },
        { videoId: "v3", isStudiedLesson: 1, percentage: 100 },
        { videoId: "v4", isStudiedLesson: 1, percentage: 100 },
      ],
    },
  ],
};
assert.strictEqual(
  findFirstPendingVideoEntry(topDownVm, "v4")?.videoId,
  "v2",
  "findFirstPendingVideoEntry should scan the full list from top to bottom",
);
assert.strictEqual(
  findNextPendingVideoEntry(topDownVm)?.videoId,
  "v2",
  "findNextPendingVideoEntry should now recover the earliest unfinished item even when it appears before the current video",
);
assert.strictEqual(
  buildUiLogMessage("debug", "progress", "progress trend snapshot", {}),
  null,
  "debug logs should be hidden from the page log panel",
);
assert.strictEqual(
  buildUiLogMessage("success", "player", "jump to first unfinished video", {}),
  "当前视频已完成，已跳到列表中第一个未完成视频",
  "page log messages should use Chinese user-friendly copy",
);
assert.strictEqual(
  buildUiLogMessage("warn", "network", "xhr fallback blocked [detect]", "https://example.com/path"),
  "已拦截检测请求：example.com/path",
  "network page logs should keep only the short Chinese request summary",
);
assert.strictEqual(
  buildUiLogMessage("success", "exam", "launch regular exam", {}),
  "当前节存在平时测试，已自动打开",
  "regular exam launch should get a Chinese summary in the page log panel",
);
assert.strictEqual(
  buildUiLogMessage("success", "exam", "regular exam runtime recovered", {}),
  "已恢复平时测试自动答题",
  "opening the script midway through the exam page should resume auto-answer mode",
);
assert.strictEqual(
  buildUiLogMessage("warn", "detect", "notTrustScript blocked", {}),
  null,
  "detect bypass logs should stay hidden from the page log panel",
);
assert.strictEqual(
  buildUiLogMessage("warn", "progress", "page visible snapshot captured", {}),
  null,
  "progress snapshot spam should stay hidden from the page log panel",
);
assert.doesNotMatch(
  tryAdvanceExamFlowSource,
  /提交答案|提交试卷|确认交卷|完成答题|保存并提交|\^交卷\$|\^提交\$/,
  "regular exam auto-advance must not auto-submit the paper",
);
[
  "/提交答案/i",
  "/提交试卷/i",
  "/确认交卷/i",
  "/^交卷$/i",
  "/完成答题/i",
  "/保存并提交/i",
  "/^提交$/i",
].forEach((text) => expectText(text, `manual submit detector keeps ${text}`, hasManualSubmitButtonSource));
assert.deepStrictEqual(
  getCourseProgress(sampleVm),
  {
    completedCount: 3,
    totalCount: 4,
    percent: 75,
  },
  "getCourseProgress should aggregate per-lesson percentage into total course progress",
);

const progressSyncState = {
  progressSync: {
    videoId: null,
    currentTime: 0,
    totalStudyTime: 0,
    observedAt: 0,
  },
};
const resetProgressSyncState = instantiateFunction("resetProgressSyncState", {
  state: progressSyncState,
  normalizeVideoId,
  now: () => 5000,
});
const appendWatchPointRange = instantiateFunction("appendWatchPointRange");
const getActualPlaybackPercent = instantiateFunction("getActualPlaybackPercent", {
  getPlayableVideo: () => ({ currentTime: 30, duration: 60 }),
  findCurrentLesson: () => ({ percentage: 12, videoSec: 60 }),
  clampPercent,
});
assert.strictEqual(
  getActualPlaybackPercent({}),
  50,
  "getActualPlaybackPercent should prefer actual video playback time when duration is available",
);
const syncLogs = [];
const syncVideo = { currentTime: 42, duration: 60, playbackRate: 1, ended: false };
const syncLesson = { percentage: 20, isStudiedLesson: 2, videoSec: 60 };
let syncComputeCalls = 0;
const syncVm = {
  lastViewVideoId: "v-sync",
  totalStudyTime: 18,
  totalTimeFinish: 18,
  playTimes: 4,
  watchPointPost: "",
  computeProgree() {
    syncComputeCalls += 1;
  },
};
progressSyncState.progressSync = {
  videoId: "v-sync",
  currentTime: 10,
  totalStudyTime: 10,
  observedAt: 1000,
};
const syncProgressFromPlayback = instantiateFunction("syncProgressFromPlayback", {
  getPlayableVideo: () => syncVideo,
  resolveCurrentVideoId,
  now: () => 31000,
  state: progressSyncState,
  isVideoNaturallyFinished: () => false,
  document: { hidden: false },
  resetProgressSyncState,
  appendWatchPointRange,
  safeCall: (fn) => fn(),
  logWarn: (scope, message, payload) => syncLogs.push({ scope, message, payload }),
  logDebug: (scope, message, payload) => syncLogs.push({ scope, message, payload }),
  findCurrentLesson: () => syncLesson,
  getActualPlaybackPercent: () => 70,
});
assert.strictEqual(
  syncProgressFromPlayback(syncVm, "runtimeTick", 31000),
  true,
  "syncProgressFromPlayback should compensate when playback advances faster than recorded study time",
);
assert.strictEqual(syncVm.totalStudyTime, 42, "progress sync should catch totalStudyTime up to the real playback delta");
assert.strictEqual(syncVm.totalTimeFinish, 42, "progress sync should keep totalTimeFinish aligned with the compensated delta");
assert.strictEqual(syncVm.playTimes, 28, "progress sync should preserve unsaved playTimes during compensation");
assert.strictEqual(syncVm.watchPointPost, "0,1,5,6,7,8,9,10", "progress sync should rebuild watch points across the compensated range");
assert.strictEqual(syncComputeCalls, 1, "progress sync should re-run computeProgree after compensating counters");
assert.ok(
  syncLogs.some((entry) => entry.message === "compensated throttled progress lag"),
  "progress sync should log when it compensates a hidden-tab lag spike",
);

const finalizeState = {
  progressSync: {
    videoId: "v-final",
    currentTime: 55,
    totalStudyTime: 40,
    observedAt: 1000,
  },
};
const finalizeResetProgressSyncState = instantiateFunction("resetProgressSyncState", {
  state: finalizeState,
  normalizeVideoId,
  now: () => 7000,
});
const finalizeVideo = { currentTime: 60, duration: 60, playbackRate: 1, ended: true };
const finalizeLesson = { percentage: 45, isStudiedLesson: 2, videoSec: 60 };
let finalizeSaved = 0;
const finalizeVm = {
  lastViewVideoId: "v-final",
  totalStudyTime: 40,
  totalTimeFinish: 40,
  playTimes: 2,
  watchPointPost: "",
  isSaving: false,
  computeProgree() {},
  saveDdsjkTimeInWhileFn() {
    finalizeSaved += 1;
  },
};
const finalizeSyncProgressFromPlayback = instantiateFunction("syncProgressFromPlayback", {
  getPlayableVideo: () => finalizeVideo,
  resolveCurrentVideoId,
  now: () => 7000,
  state: finalizeState,
  isVideoNaturallyFinished: () => true,
  document: { hidden: false },
  resetProgressSyncState: finalizeResetProgressSyncState,
  appendWatchPointRange,
  safeCall: (fn) => fn(),
  logWarn: (scope, message, payload) => syncLogs.push({ scope, message, payload }),
  logDebug: (scope, message, payload) => syncLogs.push({ scope, message, payload }),
  findCurrentLesson: () => finalizeLesson,
  getActualPlaybackPercent: () => 100,
});
assert.strictEqual(
  finalizeSyncProgressFromPlayback(finalizeVm, "runtimeTick", 7000),
  true,
  "syncProgressFromPlayback should force a final flush when the video has naturally ended",
);
assert.strictEqual(finalizeLesson.isStudiedLesson, 1, "natural finish sync should promote the current lesson to completed");
assert.strictEqual(finalizeLesson.percentage, 100, "natural finish sync should refresh the local recorded percentage from actual playback");
assert.ok(finalizeVm.playTimes >= 6, "natural finish sync should raise playTimes above the save threshold before final flush");
assert.strictEqual(finalizeSaved, 1, "natural finish sync should trigger one final save attempt");

console.log("[test-auto-wisdom-tree] smoke, obfuscated-source, anti-debug, progress-retry, progress-compensation, and passive progress-debug checks passed");
