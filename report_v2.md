# V2 API 溯源报告

## 1. 分析范围

- 解密产物主入口：`dist/v2/app.js`
- 学习页主要调用点：`dist/v2/stuStudy.js`
- 播放器与视频源解析：`dist/v2/videoPlayer.js`
- 为了把 `videojs` 生命周期回调名对齐到业务层，额外参考了同构源码 `source/v2/videoPlayer.js`；主链判断仍以 `dist/v2/*` 为准。
- “已使用”表示在当前 V2 学习页实际链路中已经定位到调用点，而不只是文件中定义了某个函数或历史分支。

## 2. 统一封装链路

### 2.1 API 导出层

- `dist/v2/app.js:1543-1739` 导出 `webpack_exports_be61`
- `webpack_exports_be61.a.<api>` 是你给出的主 API 集合
- `webpack_exports_be61.b` 是额外暴露的推送消息接口：`/api/pushAiStudentMessage/findPushAiStudentMessageList`

### 2.2 HTTP 传输层

`dist/v2/app.js:1388-1538` 中 `webpack_exports_b3e4` 提供 4 个底层方法：

- `a`: `axios.get(url, { params })`
- `b`: `axios.post(url, data)`，默认转成 `application/x-www-form-urlencoded`
- `c`: `axios.post(url, formData, { Content-Type: multipart/form-data, isformData: true })`
- `d`: `axios.post(url, data, { Content-Type: application/json;charset=UTF-8, rowBody: true })`

### 2.3 请求拦截器规则

- `axios.defaults.withCredentials = true`
- 若 URL 命中 `gateway/t/v1`，且不是 `ai-course-assistant-api.zhihuishu.com`，则在请求拦截器内把 `data/params` 重写为：
  - `{ secretStr: y9x8y7z(原始参数, 动态密钥), dateFormate: Date.parse(new Date()) }`
- 动态密钥来源：
  - `studentexam-api.zhihuishu.com` 走 `_0x5075fe.m()`
  - 其他 `gateway/t/v1` 走 `_0x5075fe.l()`
- 非 `rowBody` / 非 `isformData` 的 `POST` 会继续被 `qs.stringify`
- 统一错误处理：
  - `406(0x1a6)`：按 `checkPlan` 打开 `blacklist` / `nostudy`
  - `401(0x191)` / `403(0x193)`：清理登录态并跳登录页

### 2.4 包装层自动补参

- `_0xc84e22()`：补 `{ dateFormate }`
- `_0x51be72()`：补 `{ uuid, dateFormate }`
- 注意异常点：`queryStudentIsLimitFlow` 写成了 `Object.assign(payload, _0xc84e22)`，这里传入的是函数引用，不是 `_0xc84e22()`；因此“内层参数”不会自动带 `dateFormate`，但外层拦截器仍会补包 `{ secretStr, dateFormate }`

## 3. 主学习链总览

当前 V2 学习页的主链路基本是：

1. `created()` -> `getqueryCourse()` + `getVideoList()`
2. `getqueryCourse()` -> `queryCourse()` -> 初始化课程信息 / AI / 异常检测 / 章节展示模式 / 提示弹窗
3. `getVideoList()` -> `getVideoList()` -> `queryLearnedKgIds()` -> `queryStuyInfo()` -> `getLastVideoId()`
4. `getLastVideoId()` -> `limitStudy()` -> `prelearningNote()` -> `prelearningNoteApi()` -> `initVideo(learnTimeSec)`
5. `initVideo()` 只把 `videoId` 交给 `videoPlayer.js`；真实 `src/字幕/线路/uuid` 由播放器层再向视频服务补齐
6. 视频播放中定时走 `saveLearningCInTime()`，切换/退出/补存时走 `saveLearningDBInTime()`
7. 播放过程中再按时间点触发 `popupAnswer()` / `lessonPopupExam()` / `saveLessonPopupExamSaveAnswer()`

### 3.1 完整参数构造总线路（含 `videoPlayer.js`）

1. 选中课时后，最终会进入 `prelearningNote(chapter, lesson, smallLesson?)`
   - `lastViewVideoId = (smallLesson || lesson).videoId`
   - `chapeterDataFun()` 同步写入：
     - `videoDetail.chapterId = lesson.chapterId`
     - `lessonId = lesson.id`
     - `smallLessonId = smallLesson?.id || 0`
     - `videoTime = (smallLesson || lesson).videoSec`
     - `videoDetail.name/chapterName/chaNum/num/sonNum` 等展示字段

2. `prelearningNoteApi` 的业务入参在这里第一次成型
   - 明文对象：
     - `{ ccCourseId: courseId, chapterId: lesson.chapterId, isApply, lessonId: lesson.id, lessonVideoId?: smallLesson.id, recruitId, videoId: lastViewVideoId }`
   - 若 `lessonVideoId == 0`，会删除该字段
   - 同时生成风控串：
     - `evLog = D26666.Z([recruitId, lessonId, lessonVideoId||0, lastViewVideoId, chapterId])`

3. `prelearningNoteApi` 成功后，服务端返回 `studiedLessonDto.learnTimeSec`
   - `stuStudy.js` 并不直接持有真实播放地址，只把这个续播秒数交给 `initVideo(learnTimeSec)`
   - `initVideo()` 传给播放器的只有：
     - `{ id: lastViewVideoId, autostart: false, control: { nextBtn: true }, screenElemId: "outContainer" }`

4. `videoPlayer.js` 再次补齐播放器真实参数
   - 以 `id = lastViewVideoId` 去拉字幕与视频源
   - 补出：`track`、`subtitleStyle`、`sourceSrc`、`src`、`chooseLine`、`rate`、`isFullscreen`、`hasSchool`
   - `sourceSrc.uuid` 继续参与后续切线路接口

5. 播放器就绪后，把服务端续播秒数灌回真实播放器
   - `ablePlayerX("container").seek(learnTimeSec)`
   - 当前 V2 页面走的是 `vjsAPI`
   - `seek(sec)` -> `player.currentTime(sec)`
   - `getPosition()` -> `player.currentTime()`

6. 播放器事件开始驱动学习参数
   - `onPlay` -> `startTotalTimer()`
   - `startTotalTimer()` 启 4 个定时器：
     - `learningTimeRecord`: `0x7c6 = 1990ms`
     - `totalStudyTimeFun`: `0x137e = 4990ms`
     - `svcpEveryOnceInAWhile`: `0x2bf20 = 180000ms`
     - `saveDdsjkTimeInWhileFn`: `0x493e0 = 300000ms`
   - `totalStudyTimeFun()` 每轮累计：
     - `totalStudyTime += 5 * playRate`
     - `totalTimeFinish += 5 * playRate`
     - `playTimes += 5 * playRate`
   - `learningTimeRecord()` 生成 `watchPointPost`
     - 初始串是 `'0,1,'`
     - 之后每次追加 `parseInt(totalStudyTime / 5) + 2`
   - `playbackRate(rate)` 会把 `playRate` 封顶到 `1.8`
   - `onTime(currentSec)` 继续触发 `threeDFun(currentSec)` 与 `autoTestFun(currentSec)`
   - `onPause` 会立刻触发 `saveDdsjkTimeInWhileFn(null, null, null, 3)`
   - `playerNext` 会进入 `videoNext()`，继而切到下一课时并重新跑一遍 `prelearningNote()`

7. 最终学习进度参数是在播放器状态基础上二次拼出来的
   - `currentPosition = u(ablePlayerX("container").getPosition())`
   - `saveLearningCInTime` 的 `sdsew` 原数组：
     - `[recruitId, chapterId, courseId, lessonId, currentPosition, parseInt(totalStudyTime), lastViewVideoId, smallLessonId, parseInt(playTimes), mainCode]`
   - `saveLearningDBInTime` 的 `sdsew` 原数组：
     - `[recruitId, lessonId, smallLessonId, lastViewVideoId, chapterId, studyStatus, parseInt(playTimes), parseInt(totalStudyTime), currentPosition, mainCode]`
   - 两条链都把：
     - `ewssw = watchPointPost`
     - `zwsds = encode(studiedLessonDto.id)`
   - 只有 DB 落库链额外明文补 `courseId`

8. 当前 V2 页面未发现 `stuStudy.js` 调用 `ablePlayerX(...).addCourseInfo(...)`
   - 因此播放器内部 `courseInfo` 保持默认空对象
   - 当前学习进度接口参数与 `courseInfo` 无直接关系

## 4. 已定位到实际使用的 API

下面每条都按“业务调用链 -> 参数 -> 约束/备注”写。

### 4.1 全局、头部、退课、提示类

- `findPushAiStudentMessageList`（经 `webpack_exports_be61.b` 暴露，`GET`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:112076 getList()` -> `webpack_exports_be61.b({ recruitId })` -> `dist/v2/app.js:1559 _0x4700a9` -> `webpack_exports_b3e4.a`
  - 参数：`{ recruitId: this.recruitId }`
  - 约束：先查本地缓存键 `msg-${recruitAndCourseId}-${userId}-${YYYY/MM/DD}-v01`；已存在则直接跳过请求。成功后过滤 `templateId !== 4006`，再决定是否展示 AI 消息弹窗。

- `getLoginUserInfo`（`GET`，无包装层自动补参，外层 `secretStr`）
  - 调用链 1：`dist/v2/app.js:246 getCurrentUserInfo()` -> `webpack_exports_be61.a.getLoginUserInfo({ dateFormate })`
  - 调用链 2：`dist/v2/stuStudy.js:98834 header.created()` -> `webpack_exports_be61.a.getLoginUserInfo({ dateFormate })`
  - 参数：两处都是手动传 `{ dateFormate: Date.parse(new Date()) }`
  - 约束：根组件以 `code == 200` 判成功；失败直接跳统一登录页。头部组件成功后继续请求 `getUserMessage`。

- `getUserMessage`（`GET`，无包装层自动补参，URL 命中 `gateway/t/v1`）
  - 调用链：`header.created()` 中 `getLoginUserInfo` 成功后 -> `webpack_exports_be61.a.getUserMessage()`
  - 参数：无显式参数
  - 约束：返回 `data.unReadCount` 写入 `messageNum`

- `queryCanBeTuiKe`（`GET`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:98884 backSource()` -> `webpack_exports_be61.a.queryCanBeTuiKe({ recruitId })`
  - 参数：`{ recruitId: this.recruitId }`
  - 约束：成功后分 3 类分支：
    - `canDropCourse = true`：打开退课确认弹窗
    - `freedomCourseChoose = true`：展示允许退课时间窗
    - 其他：提示需联系本校课程负责人

- `tuike`（`GET`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:98869 quitClass()` -> 本地验证码比对通过 -> `webpack_exports_be61.a.tuike({ recruitId })`
  - 参数：`{ recruitId: this.recruitId }`
  - 约束：只有 `this.value == this.identifyCode` 才发请求；成功后提示“退课申请提交成功”，约 2 秒后跳回学堂

- `bindPop`（`POST form`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`getqueryCourse()` 成功后 -> `bindPopFun()` -> `webpack_exports_be61.a.bindPop({ recruitId })`
  - 参数：`{ recruitId: this.recruitId }`
  - 约束：`code == 0 && data.status == 1` 时打开 `warnDialog`

- `absentPop`（`POST form`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`absentPopFun()` -> `webpack_exports_be61.a.absentPop({ recruitId })`
  - 参数：`{ recruitId: this.recruitId }`
  - 约束：`code == 0 && data.status == 0` 时关闭 `warnDialog`

### 4.2 手机号、短信、人机校验

- `getMobile`（`GET`，明文）
  - 调用链：`dist/v2/stuStudy.js:99291 getMobileApi()` -> `webpack_exports_be61.a.getMobile({})`
  - 参数：空对象
  - 约束：成功后优先取 `rt.phone` 写入 `bindMobile`；失败只弹“获取手机号失败”

- `sendSmsCodeWithoutCheck`（`POST form`，明文）
  - 调用链：`dist/v2/stuStudy.js:99313 sendMessageApi()` -> `webpack_exports_be61.a.sendSmsCodeWithoutCheck({})`
  - 参数：空对象
  - 约束：调用前由 `getCodeClick()` 启动 60 秒倒计时；接口层只校验 `status == 200`

- `validateSlideToken`（`POST form`，明文包装层，但 URL 命中 `gateway/t/v1`，走外层 `secretStr`）
  - 调用链 1：`dist/v2/stuStudy.js:113802 capinitAbleYidunFallback()` -> 易盾滑块成功回调 -> `validateSlideToken({ token, ev, checkType })`
  - 调用链 2：`dist/v2/stuStudy.js:113895 validateMessage()` -> 短信验证码弹窗提交 -> `validateSlideToken({ token, ev, checkType: 2 })`
  - 参数：
    - 滑块：`{ token: validate, ev: this.evLog, checkType: this.checkType }`
    - 短信：`{ token: 用户输入验证码, ev: this.evLog, checkType: 2 }`
  - 约束：
    - 滑块失败会累计 `errorTime`，每 5 次展示额外提示
    - 短信路径要求 `data.status == 200 && data.pass`

- `getQRCodeImg`（`POST form`，明文）
  - 调用链：`dist/v2/stuStudy.js:98554 getQrcode()` -> `webpack_exports_be61.a.getQRCodeImg({ checkType, callModule })`
  - 参数：`{ checkType: "FACE_CHECK", callModule: "app_video_study" }`
  - 约束：成功后取 `rt.qrToken`、`rt.img`；二维码 10 分钟失效

- `getFaceIDResult`（`POST form`，明文）
  - 调用链 1：`dist/v2/stuStudy.js:98569 getVerityRt()` -> `getFaceIDResult({ qrToken })`
  - 调用链 2：`dist/v2/stuStudy.js:98577 doneVerified()` -> 再次 `getFaceIDResult({ qrToken })`
  - 参数：`{ qrToken: this.qrToken }`
  - 约束：把 `rt.result == 1 || rt.result == 3` 视为通过

- `saveStudentFaceRecognitionVideoLearnResult`（`POST form`，外层 `secretStr`）
  - 调用链：`doneVerified()` -> `getFaceIDResult` 成功通过 -> 组装结果 -> `saveStudentFaceRecognitionVideoLearnResult(payload)`
  - 参数：`{ faceToken: qrToken, status: rt.result, ev: this.evLog, checkType: rt.result == 1 ? 3 : 2 }`
  - 约束：只在人脸结果为 `1/3` 时提交；要求返回 `data.status == 200` 才关闭弹窗

### 4.3 播放器初始化与 `videoPlayer.js` 衍生 API

- `//newbase.zhihuishu.com/video/subtitleV1/?d=a&jsoncallback=?`（JSONP，播放器侧）
  - 调用链：`dist/v2/stuStudy.js:initVideo(learnTimeSec)` -> `$("#container").Ableplayer({ id: lastViewVideoId, ... }, callbacks)` -> `$.fn.Ableplayer` -> `PlayerStarter.createPlayer()` -> `videojsPlayer()` -> `subtitleV1`
  - 参数：`{ id: lastViewVideoId, host: '' }`
  - 参数来源：`lastViewVideoId` 来自 `prelearningNote()` 中的 `(smallLesson || lesson).videoId`
  - 用途：返回 `subtitles` 后写入 `options.track`；若存在 `subtitleConfig`，继续写入 `options.subtitleStyle`
  - 约束：只在 `options.videotype` 为空时触发；与 `/video/initVideo` 采用“双接口都返回后再继续初始化”的门闩逻辑

- `//newbase.zhihuishu.com/video/initVideo`（JSONP，播放器侧）
  - 调用链：同上 -> `initVideo`
  - 参数：`{ videoID: lastViewVideoId }`
  - 用途：
    - 返回 `sourceSrc`
    - 遍历 `sourceSrc.lines[*]`
    - 取 `lineDefault == true` 的线路作为默认 `src`
    - 同时写入 `chooseLine`、`rate = 1`、`isFullscreen = 0`
    - 若任一线路 `lineName == '校内'`，写入 `hasSchool = true`
    - `sourceSrc.uuid` 会继续进入后续 `changeVideoLine`
  - 约束：
    - `errorCode == 1001/1002/1004`：直接展示播放器错误
    - `errorCode == 1003`：自动尝试切换“流畅 -> 标准 -> 校内”线路

- `//newbase.zhihuishu.com/video/changeVideoLine`（JSONP，播放器侧）
  - 调用链：播放器线路按钮点击 -> 暂存 `defini/volume/vjsPaused` -> 从 `sourceSrc.lines` 匹配目标 `lineName` 得到 `lineID` -> `_0x3ff88d()` -> `changeVideoLine`
  - 参数：`{ videoID: options.id, lineID: options.lineID, uuid: options.sourceSrc.uuid }`
  - 参数来源：
    - `videoID = lastViewVideoId`
    - `lineID` 来自 `sourceSrc.lines[*].lineID`
    - `uuid` 来自首次 `/video/initVideo` 返回的 `sourceSrc.uuid`
  - 用途：返回新线路 `result` 后重写 `options.src`，重算 `chooseLine`，随后重新进入 `videojsPlayer()`
  - 约束：切线路前会 `dispose()` 旧实例，并把 `options.videotype = 1`，避免再次走字幕/源地址初始化分支

- `https://collector2c.zhihuishu.com/public/collect`（POST，播放器线路异常日志）
  - 调用链：`/video/initVideo` 返回 `1003` 自动切线路，或切线路后仍异常 -> `_0x321eb3(message)` -> `collector2c`
  - 参数：`{ appType: 'PC', appPlatform: 'PC', appVersion: '', data: [{ module: 'videoLine', uuid: CASLOGC.uuid, type: 'switch', videoId: options.id, videoUrl: options.src, clientIp: '', createTime: new Date(), message }] }`
  - 约束：只用于线路切换异常上报，不参与学习进度主链

- `//collector.zhihuishu.com/public/collect`（POST，播放器错误日志）
  - 调用链：播放器 `showError('03'|'04')` -> `MonitorUtil.errorLog()` -> `collector`
  - 参数：`{ data: [{ videoId: options.id, module: 'VIDEO_ERROR_LOG', uuid: player.uuid, lineName, videoStorage: options.src, userId? }] }`
  - 约束：只在播放器报错时触发；当前学习页不依赖其返回值

- 播放器回调桥接（非独立 HTTP API）
  - 依据 `dist/v2/stuStudy.js:initVideo()` 传入的 callback 对象，并结合 `source/v2/videoPlayer.js` 的 `videojs(..., function(){...})` 事件挂载，可还原为：
    - `loadeddata -> onReady()`
    - `play -> onPlay()`
    - `pause -> onPause()`
    - `ended -> onComplete()`
    - `timeupdate -> onTime(player.currentTime())`
    - 速率按钮 -> `playbackRate(player.playbackRate())`
    - 下一节按钮 -> `playerNext()`
    - 全屏进入/退出 -> `onEnterFullScreen()` / `onExitFullScreen()`

- 备注：`dist/v2/videoPlayer.js` 中还保留了一套 `letv` 历史链路及其旧接口，但当前 `dist/v2/stuStudy.js` 通过 `PlayerStarter.createPlayer()` 实际固定走的是 `videojsPlayer()` 分支

### 4.4 课程初始化与学习主链

- `queryCourse`（`POST form`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链 1：`dist/v2/stuStudy.js:113237 getqueryCourse()` -> `queryCourse({ recruitAndCourseId })`
  - 调用链 2：`dist/v2/stuStudy.js:113352 prelearningNote()` 在 `isApply/courseId` 缺失时补查 -> `queryCourse({ recruitAndCourseId })`
  - 参数：`{ recruitAndCourseId: this.$route.query.recruitAndCourseId }`
  - 约束：`getqueryCourse()` 成功后会继续触发 `bindPopFun`、`blackChangeWhite`、`startShowRead`、`queryCourseDispMode`、`getMapUid`、`getCourseAiQot`、`initDbndAi`、异常行为检查；如果 `studyStatus == 1` 直接提示“学习时间已经结束”

- `getVideoList`（`POST form`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:113193 getVideoList()` -> `webpack_exports_be61.a.getVideoList({ recruitAndCourseId })`
  - 参数：`{ recruitAndCourseId: this.$route.query.recruitAndCourseId }`
  - 约束：成功后重置所有课时节点的 `percentage/isStudiedLesson`，再继续触发 `queryLearnedKgIds()`、`queryStuyInfo()`、`getLastVideoId()`

- `queryLearnedKgIds`（`POST form`，内层补 `dateFormate`，URL 命中 kgshare `gateway/t/v1`，外层 `secretStr`）
  - 调用链 1：`getVideoList()` 成功后 -> `queryLearnedKgIds({ recruitId })`
  - 调用链 2：`dist/v2/stuStudy.js:113996 queryLearnedKgIds()` -> 返回知识图谱已学节点
  - 参数：`{ recruitId: this.recruitId }`
  - 约束：用于把 `knowledgeInfoDtos[*].active = true`，同时在首轮初始化中顺带收集 `lessonIds`、`lessonVideoIds`、`videoIds`

- `queryStuyInfo`（`POST form`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:113269 queryStuyInfo()` -> `webpack_exports_be61.a.queryStuyInfo(payload)`
  - 参数：`{ lessonIds, lessonVideoIds, recruitId }`；若 `lessonVideoIds.length <= 0` 会删除 `lessonVideoIds`
  - 约束：成功后把返回的 `watchState/studyTotalTime` 合并回 `videoList`，并按 `studyTotalTime / videoSec` 计算百分比

- `queryUserRecruitIdLastVideoId`（`POST form`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:113293 getLastVideoId()` -> `queryUserRecruitIdLastVideoId({ recruitId })`
  - 参数：`{ recruitId: this.recruitId }`
  - 约束：如果服务端返回的视频不在当前 `videoIds` 中，则回落到本地列表的第一个有效视频；随后一定进入 `limitStudy()`

- `queryCourseDispMode`（`GET`，无包装层自动补参，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:113331 queryCourseDispMode()` -> `webpack_exports_be61.a.queryCourseDispMode({ recruitAndCourseId })`
  - 参数：`{ recruitAndCourseId: this.$route.query.recruitAndCourseId }`
  - 约束：成功后写入 `chapterDisplayMode`

- `queryStudyReadBefore`（`POST form`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:113034 studyBefore(flag)` -> `queryStudyReadBefore({ courseId, recruitId })`
  - 参数：`{ courseId: this.courseId, recruitId: this.recruitId }`
  - 约束：
    - 普通路径：写入 `readInfo` 并绘制成绩构成图
    - `studyBefore("aiBot")` 路径：只回填 `studyTimes.courseStart/courseEnd`

- `queryUserClassInfo`（`GET`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:113403 queryUserClassInfo()` -> `queryUserClassInfo({ classId, recruitId })`
  - 参数：`{ classId: this.data.classId, recruitId: this.recruitId }`
  - 约束：成功后写入 `classInfo`

- `queryStudiedTimeLimitInfo`（`GET`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:113413 limitStudy()`，仅当 `videoData.type == 1` 时调用
  - 参数：`{ recruitId: this.recruitId, schoolId: this.schoolId }`
  - 约束：若当前不在可学习时段且存在 `studyTimeDetials`，会隐藏视频区并格式化时段文案；请求失败时直接放行 `limitStudyFun()`

- `prelearningNoteApi`（`POST form`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:113352 prelearningNote(chapter, lesson, smallLesson?)` -> `webpack_exports_be61.a.prelearningNoteApi(payload)`
  - 参数：
    - `{ ccCourseId, chapterId, isApply, lessonId, lessonVideoId?, recruitId, videoId }`
    - `lessonVideoId == 0` 时会删除该字段
    - 同时会生成 `this.evLog = D26666.Z([recruitId, lessonId, lessonVideoId||0, lastViewVideoId, chapterId])`
  - 约束：成功后可能触发两类校验：
    - `data.isSlide`：拉起易盾
    - `data.isFace`：暂停播放器并展示人脸验证
    - 若视频 `videoSec == 0`，只弹“视频转码中”提示，不进 `initVideo`

- `saveLearningCInTime`（`POST form`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:113722 svcpEveryOnceInAWhile()` -> `saveLearningCInTime(payload)`
  - 参数：
    - `ewssw`: `watchPointPost`
    - `sdsew`: `D26666.Z([recruitId, chapterId, courseId, lessonId, currentPosition, totalStudyTime, lastViewVideoId, smallLessonId, playTimes, mainCode])`
    - `zwsds`: `encode(studiedLessonDto.id)`
  - 约束：必须满足 `!isSaving && playTimes > 5`
  - 返回码分支：
    - `-10`：多开视频，弹提示
    - `-12`：拉起易盾
    - 其他非 `0`：打开 `backDialog`

- `saveLearningDBInTime`（`POST form`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链 1：`dist/v2/stuStudy.js:113237 getqueryCourse()` 启动时补存本地残留进度
  - 调用链 2：`dist/v2/stuStudy.js:113736 saveDdsjkTimeInWhileFn()` 切视频/结束/落库保存
  - 参数：
    - 补存路径：`{ sdsew: evEcy, zwsds: learningTokenId, courseId }`
    - 常规路径：`{ ewssw, sdsew: D26666.Z([recruitId, lessonId, smallLessonId, lastViewVideoId, chapterId, studyStatus, playTimes, totalStudyTime, currentPosition, mainCode]), zwsds: encode(studiedLessonDto.id), courseId }`
  - 约束：同样要求 `!isSaving`
  - 返回码分支：
    - `-10`：多开视频
    - `-12`：易盾
    - `-9`：学习时间结束
    - `403`：登录失效跳转

- `currentSystemTime`（`GET`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:112954 habitWarn()` 中每秒计时，达到 `0x5dc(1500)` 秒后调用
  - 参数：`{}`
  - 约束：只在 `data.hasHabbitScore` 且本地未标记 `isHabitTime` 时触发；成功后把服务端时间写进本地 `isHabitTime`

- `outline`（`GET`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:113439 outline()` -> `outline({ courseId, recruitId })`
  - 参数：`{ courseId: this.courseId, recruitId: this.recruitId }`
  - 约束：成功后写入 `teachInfo`，并把 `chapterList[*].rank` 做 `encodeS`

- `threeDimens`（`GET`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:113451 getThreeD()` -> `threeDimens({ videoId })`
  - 参数：`{ videoId: this.lastViewVideoId }`
  - 约束：成功后只维护三维资源展示状态，不改学习主状态

### 4.5 视频弹题、作业、异常行为、防刷控制

- `popupAnswer`（`POST form`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:113471 popupAnswer()` -> `popupAnswer(payload)`
  - 参数：`{ lessonId, lessonVideoId?, recruitId, courseId }`；`lessonVideoId` 为空时删除
  - 约束：成功后把 `questionPoint/videoThemeDtos/popupPictureDtos/knowledgeCardDtos` 合并成统一 `listTotal`，并按 `timeSec / videoTime * 100` 计算时间点位置

- `lessonPopupExam`（`POST form`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:113498 testDotClick(testPoint)` 在 `testType == 1` 时 -> `lessonPopupExam(payload)`
  - 参数：`{ lessonId, lessonVideoId?, time: timers, questionIds }`
  - 约束：调用前会暂停播放器；成功后标准化题目结构、选项状态、正确答案数组，并打开 `testDialog`

- `saveLessonPopupExamSaveAnswer`（`POST form`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:113535 topicClickQot(option)` -> 本地先算对错 -> `saveLessonPopupExamSaveAnswer(payload)`
  - 参数：`{ courseId, recruitId, testQuestionId, isCurrent: option.result, lessonId, lessonVideoId?, answer: answerStu.join(','), testType: 0 }`
  - 约束：`lessonVideoId == 0` 时删除；请求成功没有业务分支，本地 UI 状态已先更新，接口主要用于落库

- `queryStudentIsLimitFlow`（`GET`，包装层写法异常，外层 `secretStr` 仍在）
  - 调用链 1：`dist/v2/stuStudy.js:113755 chapterExamEntry()` -> `queryStudentIsLimitFlow({})`
  - 调用链 2：`dist/v2/stuStudy.js:113794 goToExamJudge()` -> `queryStudentIsLimitFlow({})`
  - 参数：空对象
  - 约束：若返回 `status == 200 && rt.isOpen`，展示“高峰期等待 xx 分钟”弹窗；否则继续进入作业详情或作业列表
  - 备注：`Object.assign(payload, _0xc84e22)` 极像源码缺失 `()` 的问题

- `findExamCorrectType`（`POST form`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:113760 judgeLookAnswer(studentExam)` -> `findExamCorrectType({ examId, recruitId })`
  - 参数：`{ examId: studentExamDto.exam.id, recruitId: this.recruitId }`
  - 约束：结果只用于决定 `isHuPing`，进而决定打开 `examUrl` 还是 `https://exam.zhihuishu.com/onlineExam/studentExam/stuExam?recruitId=...`

- `isCheckAnswer`（`POST form`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`judgeLookAnswer()` 中当 `studentExamDto.state == 4` 时 -> `isCheckAnswer({ studentExamId })`
  - 参数：`{ studentExamId: studentExamDto.id }`
  - 约束：只有接口返回 `code == 0` 才允许打开作业查看页

- `updateCheckAnswer`（`POST form`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:113778 lookAnsSureBtn()` -> `updateCheckAnswer({ studentExamId })`
  - 参数：`{ studentExamId: this.lookAnswerInfo.id }`
  - 约束：成功后关闭确认弹窗并打开作业页

- `eADetail`（`GET`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:113007 aberrantFun()`，在 `getqueryCourse()` 成功且有 `schoolId` 时触发
  - 参数：`{ schoolId: this.schoolId, recruitId: this.recruitId }`
  - 约束：成功后若 `data.popWindow` 打开异常弹窗并暂停；若 `data.lock` 打开限时锁定弹窗并暂停

- `agreeEADetail`（`POST form`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:112997 aberrantCloseBtn()` -> `agreeEADetail({ exceptionId, schoolId })`
  - 参数：`{ exceptionId: this.aberrantInfo.exceptionId, schoolId: this.schoolId }`
  - 约束：成功后关闭异常弹窗

### 4.6 AI、知识图谱、课程辅助

- `getCourseAccessAI`（`POST form`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:113955 getCourseAiQot()` -> `getCourseAccessAI({ recruitId, courseId })`
  - 参数：`{ recruitId: this.recruitId, courseId: this.courseId }`
  - 约束：成功后决定 `isAiQotCourse`、`isResourceAIHelper`、AI 图标、`isAiBoxShow`，并额外调用 `studyBefore("aiBot")` 拉学习时间窗

- `findUnionAiId`（`POST form`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:112918 getMapUid()` -> `findUnionAiId({ courseId, recruitId })`
  - 参数：`{ courseId: this.courseId, recruitId: this.recruitId }`
  - 约束：只有 `code == 0 && data.result != -1` 才回填 `mapUid/mapType/mapHush/mapStr`

- `knowledgeClick`（`POST form`，内层补 `uuid + dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:113987 knowledgeClick(node)` -> `knowledgeClick({ kId, recruitId, source: 1 })`
  - 参数：`{ kId: node.id, recruitId: this.recruitId, source: 1 }`
  - 约束：包装层会额外补 `uuid`；成功后仅把节点标记为 `active`

- `sendAiQuestion`（`POST JSON`，明文，包装层会先补内层 `dateFormate`）
  - 调用链：`dist/v2/stuStudy.js:99962 sendWebsocket(text, file)` -> `sendAiQuestion(payload)`
  - 参数：
    - `{ userId, serviceId: recruitId, courseId, role: 1, model: "baidu-completions_pro", templateCode: "share-assistant", templateVariables: { course: courseName, text }, text }`
    - 若第二参数存在，则 `templateVariables.text = ''`，正文走 `text`
  - 约束：成功后把 `response.data` 直接追加到当前 QA 项回答

- `sendAiQuestionV1`（`POST JSON`，明文，包装层会先补内层 `dateFormate`）
  - 调用链：`dist/v2/stuStudy.js:100826 sendWebsocket(text, file)` -> `sendAiQuestionV1(payload)`
  - 参数：与 `sendAiQuestion` 同结构
  - 约束：调用前先 `closeAudio()`，属于另一套 AI/音频组件

- `createThreads`（`POST form`，明文，内层补 `dateFormate`）
  - 调用链：`dist/v2/stuStudy.js:101548 buildNewConversation()` -> `createThreads({})`
  - 参数：空对象
  - 约束：成功只把返回值保存到 `this.threadId`；失败统一提示“建立会话失败，请重试”

- `sendAiQuestionV3`（`POST multipart/form-data`，明文）
  - 调用链：`dist/v2/stuStudy.js:101839 sendWebsocket(text = '', file)` -> `sendAiQuestionV3(formData)`
  - 参数：`FormData{text, file, userId, model, templateCode, courseName}`
  - 约束：适配文本 + 文件/语音；调用前会 `closeAudio()` 并置 `loading = true`

## 5. 当前解密产物中“已定义但未发现调用”的 API

以下接口已在 `dist/v2/app.js:1568-1735` 定义，但当前 `dist/v2/app.js` / `dist/v2/stuStudy.js` 中未找到实际调用点：

- `logout`
- `queryStudyInfo`
- `generateExperimentId`
- `queryStuExperimentList`
- `queryLeaderboard`
- `queryRankingDtoList`
- `sendCode`
- `codeValidate`
- `sendCodeNew`
- `sendAiQuestionV2`
- `queryFaceRecognitionSwitchFromWeb`
- `queryFaceRecognitionResult`

## 6. 关键结论

- V2 学习页的核心链路已经完整闭环：`queryCourse -> getVideoList -> queryStuyInfo -> getLastVideoId -> prelearningNoteApi -> initVideo -> saveLearningCInTime/saveLearningDBInTime`
- `stuStudy.js` 传给播放器的不是 `src`，而只是 `videoId + 控制参数`；真实 `src/字幕/线路/uuid` 是 `videoPlayer.js` 再向视频服务补齐出来的
- 课程学习进度不是明文字段直接上传，核心进度字段会先经 `D26666.Z(...)` / `encode(...)` 再进接口
- 风控/防挂机点主要有 3 类：
  - `queryStudentIsLimitFlow`：作业入口限流
  - `validateSlideToken`：易盾/短信校验
  - `saveLearningCInTime/saveLearningDBInTime`：返回 `-10/-12/-9`
- 播放器侧当前实际走 `videojs` 分支；`letv` 相关旧代码和旧接口仍在文件里，但不是当前 V2 学习页的主链
- AI 能力存在 3 套并行调用方式：
  - `sendAiQuestion`：老版文本
  - `sendAiQuestionV1`：另一套 JSON 文本/音频组件
  - `createThreads + sendAiQuestionV3`：新版会话/文件上传能力
- `queryStudentIsLimitFlow` 的包装层存在明显异常写法，后续如果你们要继续复原源码，建议优先确认这里是否是原始代码 bug，还是解密/还原阶段漏掉了 `()`
