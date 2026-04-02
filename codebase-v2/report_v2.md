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

### 2.5 `secretStr` 生成逻辑（补充自 `4.js`）

关键定位：

- `dist/v2/app.js:54-63`
  - `getKey()` -> `l0a1b2c(0xb)`，用于普通 `gateway/t/v1`
  - `getStudentKey()` -> `l0a1b2c(0x3)`，用于 `studentexam-api.zhihuishu.com`
- `dist/v2/app.js:1456-1481`
  - 命中 `gateway/t/v1` 时，把原始 `data/params` 改写为 `{ secretStr, dateFormate }`
- `dist/4.js:609-652`
  - `l0a1b2c(module)`：向 `app-commserv-user/c/has` 拉取动态串 `sl`
  - `y9x8y7z(payload, sl)`：把原始参数加密成 `secretStr`
- `dist/4.js:1647-1648`
  - 这里的 `JSEncrypt.decrypt()` 实际走的是 `doPublic()`，即**公钥还原**，不是常规“私钥解密”

完整流程如下：

1. 先按目标域名选择模块号
   - 普通 `gateway/t/v1`：`module = 11`
   - `studentexam-api.zhihuishu.com`：`module = 3`

2. 拉取动态串 `sl`
   - 明文：`{"module": module}`
   - 用 4.js 内置固定 RSA 公钥做 PKCS#1 v1.5 公钥加密，得到 `uid`
   - 请求：
     - `GET https://appcomm-user.zhihuishu.com/app-commserv-user/c/has?uid=<uid>`
   - 取响应：`rt.sl`

3. 从 `sl` 还原 AES 会话参数
   - 代码：`keyInfo = rsaUtil.decrypt(sl, publicKey)`
   - 虽然函数名叫 `decrypt`，但底层实现是 `doPublic()`；所以这里本质上是：
     - 用固定 RSA 公钥对 `sl` 做一次“公钥还原 / 验签式解封装”
   - 还原结果是 JSON，对当前链路至少可确定会用到：
     - `keyInfo.cKey`

4. 生成 `secretStr`
   - 若入参是对象，先 `JSON.stringify`
   - AES 参数固定为：
     - 算法：`AES-CBC`
     - Padding：`PKCS7`
     - `iv = "1g3qqdh4jvbskb9x"`
     - `key = keyInfo.cKey`
   - 输出是 Base64 字符串，即最终的 `secretStr`

5. 最终发包外层结构
   - 拦截器不会直接发送明文参数，而是改写成：
     - `{ secretStr, dateFormate: Date.parse(new Date()) }`
   - 注意：真正进入 AES 的明文，是“改写前”的原始业务对象；如果该接口在业务包装层已经补过 `dateFormate` / `uuid`，这些字段也会一并被加进 `secretStr`

可以把整条链抽象成：

```text
原始业务参数
  -> (可选) 业务层补 dateFormate / uuid
  -> JSON.stringify
  -> 用 rt.sl 还原出 cKey
  -> AES-CBC-PKCS7(key=cKey, iv=1g3qqdh4jvbskb9x)
  -> Base64(secretStr)
  -> 外层改写为 { secretStr, dateFormate }
```

对应伪代码：

```javascript
async function buildSecretStr(payload, module) {
  const uid = RSA_PUBLIC_ENCRYPT({ module }, FIXED_PUBLIC_KEY);
  const sl = (await GET("/app-commserv-user/c/has", { uid })).rt.sl;
  const keyInfo = RSA_PUBLIC_DECRYPT(sl, FIXED_PUBLIC_KEY); // 4.js 的 decrypt 实际是 doPublic
  const plaintext = typeof payload === "object" ? JSON.stringify(payload) : String(payload);
  return AES_CBC_PKCS7_ENCRYPT(plaintext, keyInfo.cKey, "1g3qqdh4jvbskb9x");
}
```

### 2.6 Python 加密/解密 demo

- 已在项目根目录补了可复用脚本：`secretStr_demo.py`
- 依赖：`pycryptodome`
  - `pip install pycryptodome`
- 这个脚本现在包含 3 类能力：
  - `uid` 生成：给 `/app-commserv-user/c/has` 用
  - `secretStr` 加密 / 解密
  - CLI 演示：可直接跑完整示例、在线拉取 `rt.sl`、解释反解可行性

脚本内主要函数：

```python
from secretStr_demo import (
    rsa_encrypt_uid,            # module -> uid
    fetch_sl,                   # 在线请求 /c/has -> rt.sl
    decode_sl,                  # rt.sl -> {"cKey": ...}
    build_secret_str,           # payload + sl -> secretStr
    build_request_body,         # payload + sl -> {"secretStr", "dateFormate"}
    decrypt_secret_str_with_sl, # secretStr + sl -> 明文
    aes_encrypt,                # 明文 + cKey -> secretStr
    aes_decrypt,                # secretStr + cKey -> 明文
)
```

#### 2.6.1 纯本地 AES 加解密演示

这个演示不依赖网络，只验证 AES 参数是否对齐 4.js：

```python
from secretStr_demo import aes_encrypt, aes_decrypt

payload = {"recruitId": 123456, "lessonId": 654321, "smallLessonId": 0}
ckey = "0123456789abcdef"

secret_str = aes_encrypt(payload, ckey)
plain = aes_decrypt(secret_str, ckey)

print(secret_str)
print(plain)
```

#### 2.6.2 真实链路演示：`module -> rt.sl -> secretStr`

```python
from secretStr_demo import fetch_sl, build_request_body, decrypt_secret_str_with_sl

payload = {"recruitId": 123456, "lessonId": 654321}

# 普通 gateway/t/v1 用 11；studentexam-api 用 3
sl, raw = fetch_sl(11)

# 生成最终拦截器会发出的请求体
body, key_info = build_request_body(payload, sl)
print(body)

# 本地反解验证
plain, key_info = decrypt_secret_str_with_sl(body["secretStr"], sl)
print(key_info["cKey"])
print(plain)
```

最终 `body` 结构会是：

```python
{
    "secretStr": "<AES-CBC base64 密文>",
    "dateFormate": 1710000000000
}
```

#### 2.6.3 CLI 直接使用

```bash
# 运行完整 demo
python secretStr_demo.py demo

# 生成 uid
python secretStr_demo.py gen-uid --module 11

# 在线拉取 rt.sl
python secretStr_demo.py fetch-sl --module 11

# 还原 rt.sl
python secretStr_demo.py decode-sl --sl "<rt.sl>"

# 用 sl 生成 secretStr
python secretStr_demo.py encrypt --sl "<rt.sl>" --payload "{\"recruitId\":123456}"

# 顺带输出最终请求体
python secretStr_demo.py encrypt --sl "<rt.sl>" --payload "{\"recruitId\":123456}" --with-body

# 通过 sl 反解 secretStr
python secretStr_demo.py decrypt --secret-str "<secretStr>" --sl "<rt.sl>"

# 已知 cKey 时直接解
python secretStr_demo.py decrypt --secret-str "<secretStr>" --ckey "0123456789abcdef"

# 查看“能否从 secretStr 反解”的结论
python secretStr_demo.py explain
```

#### 2.6.4 从 `secretStr` 解密的可能性

结论分 4 种情况：

1. **只有 `secretStr`**
   - 基本不能直接反解
   - 因为它只是 AES-CBC 密文，虽然 IV 固定，但不知道 `cKey`

2. **`secretStr` + 同一次会话的 `rt.sl`**
   - 可以反解
   - 路径是：`rt.sl -> cKey -> AES 解密 secretStr`

3. **`secretStr` + 已知 `cKey`**
   - 可以直接反解

4. **只有后续新抓到的另一个 `rt.sl`**
   - 不一定能反解旧 `secretStr`
   - 本质上要看这个旧密文和新 `sl` 是否对应同一个 `cKey`

结合当前前端实现，还可以补一个实操判断：

- `state.key` / `state.studentKey` 会缓存动态 key
- 所以**同一页面会话、同一类接口**往往复用同一个 `sl/cKey`
- 因此如果你抓到了该会话内任意一次 `/c/has` 响应，通常就足够反解该会话后续同类 `secretStr`

这个 demo 对齐了 4.js 当前已确认的 3 个关键点：

- `uid`：RSA 公钥加密 `{"module": n}`
- `sl`：RSA 公钥还原得到 `{"cKey": ...}`
- `secretStr`：AES-CBC-PKCS7 + 固定 IV + Base64 输出

## 3. 主学习链总览

本节不再按“模块归类”写，而是按**页面实际运行时间顺序**写：从 `stuStudy` 页面创建开始，依次说明每个 API 何时触发、谁触发、是否并发、以及它后面又会带出什么 API。  
具体参数字段、返回分支和细节约束，统一见第 4 节。

### 3.1 页面进入瞬间：`created()` 先并发拉起两条主链

`dist/v2/stuStudy.js:112824-112826`

页面主组件 `created()` 后，立刻并发执行：

1. `getqueryCourse()`
2. `getVideoList()`

同时还会做两件**本地动作**：

- `checkoutNotTrustScript()`：只启动定时检查，不立刻发请求
- `isSpecialAiCourse()`：只做本地灰度判断，不发请求

也就是说，**页面首屏不是串行加载，而是“课程信息链”和“视频目录链”同时跑”**。  
这点很重要，因为后面 `prelearningNote()` 里之所以还保留一次 `queryCourse()` 兜底，就是为了补偿这两条链的竞态。

### 3.2 与主页面并行的外围组件首屏请求

这些请求不属于“选视频 -> 播视频”主链，但它们也发生在页面刚创建/挂载之后：

1. **头部组件 created**
   - `getLoginUserInfo({ dateFormate })`
   - 成功后继续：
     - `getUserMessage()`

2. **AI 推送消息组件 mounted**
   - 若本地缓存键 `msg-${recruitAndCourseId}-${userId}-${YYYY/MM/DD}-v01` 不存在
   - 则调用：
     - `findPushAiStudentMessageList({ recruitId })`

这两个外围分支与 `stuStudy` 主链并行，不阻塞课程目录和播放器初始化。

### 3.3 第一条主链：`getqueryCourse()` 负责把课程级元信息先补齐

`dist/v2/stuStudy.js:113237-113267`

这条链按时间顺序如下：

1. **先检查本地是否遗留上次退出时缓存的 DB 落库数据**
   - 若 `saveDataKey` / `SCALLDD` 存在，且缓存 `userId` 与当前登录人一致
   - 会先补发：
     - `saveLearningDBInTime({ sdsew, zwsds, courseId })`
   - 这是“补存上次未及时提交的学习进度”，发生在真正拉课程信息之前。

2. **正式拉课程主信息**
   - 调用：
     - `queryCourse({ recruitAndCourseId })`

3. **`queryCourse` 成功后，在同一个 success 分支里继续发出一组课程级并行请求**
   - 这些调用在代码里是顺序书写，但本质上都是各自独立的异步请求，属于“`queryCourse` 成功后的并发补充链”：

   1. `bindPop({ recruitId })`
      - 用于判断是否展示缺勤/告警类弹窗

   2. `queryStudyReadBefore({ courseId, recruitId })`
      - 仅当本地没有 `readKey = read_${recruitId}` 时触发
      - 这是 `startShowRead()` 拉“学习前说明/成绩构成”的链

   3. `queryCourseDispMode({ recruitAndCourseId })`
      - 拉章节展示模式

   4. `findUnionAiId({ courseId, recruitId })`
      - 拉知识图谱映射信息 / `mapUid`

   5. `getCourseAccessAI({ recruitId, courseId })`
      - 拉课程级 AI 开关
      - 若返回 `isOpen == true`，还会继续补一跳：
        - `queryStudyReadBefore({ courseId, recruitId })`
      - 但这一次不是为了“学习前说明”，而是 `studyBefore("aiBot")` 只取 `courseStart/courseEnd` 给 AI 助教使用

   6. `eADetail({ schoolId, recruitId })`
      - 仅当 `studyStatus != 1` 且存在 `schoolId` 时触发
      - 用于异常行为 / 锁定弹窗检查

4. **`queryCourse` 成功后还会启动一个“延后触发”的计时 API**
   - `habitWarn()` 此时只启动本地秒表，不立刻发请求
   - 当累计到 `1500` 秒时，才会调用：
     - `currentSystemTime({})`

所以 `getqueryCourse()` 的主作用可以概括成：

```text
先补存旧进度
  -> queryCourse
     -> bindPop
     -> (可选) queryStudyReadBefore
     -> queryCourseDispMode
     -> findUnionAiId
     -> getCourseAccessAI
        -> (AI 开启时再补) queryStudyReadBefore(aiBot)
     -> (可选) eADetail
     -> (延时 1500 秒后) currentSystemTime
```

### 3.4 第二条主链：`getVideoList()` 负责把目录、学习状态、续播点串起来

`dist/v2/stuStudy.js:113193-113301`

这条链按时间顺序如下：

1. **先拉整门课的视频目录**
   - 调用：
     - `getVideoList({ recruitAndCourseId })`

2. **目录返回后，立刻补拉知识图谱已学习节点**
   - 调用：
     - `queryLearnedKgIds({ recruitId })`
   - 用于给章节 / 课时 / 知识节点打 `active`

3. **继续补拉每个课时/小节当前学习状态**
   - 调用：
     - `queryStuyInfo({ lessonIds, lessonVideoIds?, recruitId })`
   - 用于回填：
     - `isStudiedLesson`
     - `studyTotalTime`
     - `percentage`

4. **再拉本招生课的最近观看视频**
   - 调用：
     - `queryUserRecruitIdLastVideoId({ recruitId })`
   - 若服务端没给出合法 `lastViewVideoId`
   - 前端才本地回退到目录中的第一个可播放视频

5. **拿到 `lastViewVideoId` 后，进入学习时段检查**
   - 调用：
     - `limitStudy()`
   - 若 `videoData.type == 1`
     - 继续调用：
       - `queryStudiedTimeLimitInfo({ recruitId, schoolId })`
   - 若不是时段限制课，或者请求失败
     - 直接进入 `limitStudyFun()`

6. **`limitStudyFun()` 只做本地匹配，不发请求**
   - 它会在 `videoList` 中找到 `lastViewVideoId` 对应的章节 / 课时 / 小节
   - 找到后调用：
     - `prelearningNote(chapter, lesson, smallLesson?)`

这一条视频目录主链可以抽象成：

```text
getVideoList
  -> queryLearnedKgIds
  -> queryStuyInfo
  -> queryUserRecruitIdLastVideoId
  -> (可选) queryStudiedTimeLimitInfo
  -> prelearningNote
```

### 3.5 两条主链汇合点：`prelearningNote()` 才是真正进入播放器前的最后一跳

`dist/v2/stuStudy.js:113349-113378`

这里是主学习链的关键汇合点。

1. **先本地固化当前视频上下文**
   - 不发请求
   - 只把以下字段写入内存：
     - `lastViewVideoId`
     - `videoDetail.chapterId/chapterName/chaNum/num/sonNum/name`
     - `lessonId`
     - `smallLessonId`
     - `videoTime`

2. **若 `courseId/isApply` 还没准备好，会二次调用 `queryCourse` 兜底**
   - 调用：
     - `queryCourse({ recruitAndCourseId })`
   - 这不是重复逻辑，而是为了处理前面提到的并发竞态：
     - `getqueryCourse()` 与 `getVideoList()` 是并发启动
     - 因此当目录链先跑到 `prelearningNote()` 时，课程链未必已经把 `courseId/isApply` 填好

3. **随后正式调用进入视频前置接口**
   - 调用：
     - `prelearningNoteApi({ ccCourseId, chapterId, isApply, lessonId, lessonVideoId?, recruitId, videoId })`

4. **`prelearningNoteApi` 成功后，分出 3 个条件分支**

   1. **易盾/滑块分支**
      - 若返回 `isSlide == true`
      - 此时还不会立刻发新请求，只会弹出校验容器
      - 后续用户通过滑块或短信验证码时，才会继续：
        - `validateSlideToken(...)`
        - `getMobile({})`
        - `sendSmsCodeWithoutCheck({})`

   2. **人脸识别分支**
      - 若返回 `isFace == true`
      - 播放器会先暂停并打开人脸弹窗
      - 后续人脸组件才会继续调用：
        - `getQRCodeImg({ checkType: "FACE_CHECK", callModule: "app_video_study" })`
        - `getFaceIDResult({ qrToken })`
        - `saveStudentFaceRecognitionVideoLearnResult({ faceToken, status, ev, checkType })`

   3. **正常起播分支**
      - 若没有被异常弹窗 / 锁定弹窗拦住，且视频资源不是转码中
      - 则调用：
        - `initVideo(learnTimeSec)`

### 3.6 `initVideo()` 之后，真正的播放器链转交给 `videoPlayer.js`

`stuStudy.js` 自己并不持有真实 `src`，它只把：

- `id = lastViewVideoId`
- `autostart = false`
- `screenElemId = "outContainer"`

交给播放器层。  
真正补齐播放地址、字幕、线路、`uuid` 的请求，发生在 `videoPlayer.js`。

时间顺序如下：

1. **播放器并发拉两类初始化数据**
   - `//newbase.zhihuishu.com/video/subtitleV1/?d=a&jsoncallback=?`
   - `//newbase.zhihuishu.com/video/initVideo`

2. **两边都准备好后，播放器才真正完成可播放态**
   - `subtitleV1` 负责补：
     - `track`
     - `subtitleStyle`
   - `initVideo` 负责补：
     - `sourceSrc`
     - `src`
     - `chooseLine`
     - `rate`
     - `hasSchool`
     - `sourceSrc.uuid`

3. **如果线路切换或播放器报错，再进入播放器侧衍生 API**
   - 用户手动切线，或 `initVideo` 返回 `1003` 自动切线时：
     - `//newbase.zhihuishu.com/video/changeVideoLine`
   - 切线异常日志：
     - `https://collector2c.zhihuishu.com/public/collect`
   - 播放器错误日志：
     - `//collector.zhihuishu.com/public/collect`

4. **播放器 ready 后，控制权回到 `stuStudy.js`**
   - `onReady()` 里按顺序执行：
     1. `seek(learnTimeSec)`（本地，不发请求）
     2. `threeDimens({ videoId })`
     3. `popupAnswer({ lessonId, lessonVideoId?, recruitId, courseId })`
     4. `scrollLocation()`（本地，不发请求）

所以真正的“起播前 API 串”应该理解为：

```text
prelearningNoteApi
  -> initVideo(stuStudy)
     -> subtitleV1(videoPlayer)
     -> /video/initVideo(videoPlayer)
     -> onReady
        -> threeDimens
        -> popupAnswer
```

### 3.7 视频开始播放后：进入周期型学习进度请求阶段

播放器 `onPlay()` 后，会启动 4 个定时器，但其中真正会发 API 的是 2 条学习进度链和 1 条延时习惯分链：

1. **每 180 秒缓存一次学习进度**
   - 调用：
     - `saveLearningCInTime({ ewssw, sdsew, zwsds })`

2. **每 300 秒做一次数据库落库**
   - 调用：
     - `saveLearningDBInTime({ ewssw, sdsew, zwsds, courseId })`

3. **学习习惯计时满 1500 秒**
   - 调用：
     - `currentSystemTime({})`

4. **下列时刻也会额外触发 `saveLearningDBInTime`**
   - `onPause`
   - 切换视频 / 小节
   - 视频学完
   - 页面退出后下次重新进入的“补存”

因此“进度相关 API”不是只有定时 2 条，而是：

```text
播放中定时：saveLearningCInTime + saveLearningDBInTime
暂停/切换/退出补存：saveLearningDBInTime
学习习惯满时长：currentSystemTime
```

### 3.8 播放进行中：弹题链、图片链、知识卡链会按时间点或点击触发

1. **当前视频的全部弹点，是在 `onReady()` 就一次性拉好的**
   - 调用：
     - `popupAnswer({ lessonId, lessonVideoId?, recruitId, courseId })`
   - 返回 4 类数据：
     - `questionPoint`
     - `popupPictureDtos`
     - `videoThemeDtos`
     - `knowledgeCardDtos`

2. **`onTime(currentTime)` 时，只会自动处理 `testType 1/2`**
   - `testType == 1` 普通弹题：
     - `lessonPopupExam({ lessonId, lessonVideoId?, time, questionIds })`
     - 用户点选项后：
       - `saveLessonPopupExamSaveAnswer({ courseId, recruitId, testQuestionId, isCurrent, lessonId, lessonVideoId?, answer, testType: 0 })`
   - `testType == 2` 图片弹窗：
     - 只本地开图，不再发新接口
   - `testType == 3/4` 主题卡 / 知识卡：
     - 只本地切 `visible`，不再发新接口

3. **`threeDFun(currentTime)` 本身不发请求**
   - 真正的 3D 资源接口只在 `onReady()` 调过一次：
     - `threeDimens({ videoId })`

所以播放中的内容链可以概括为：

```text
onReady -> popupAnswer
onTime
  -> (普通弹题) lessonPopupExam -> saveLessonPopupExamSaveAnswer
  -> (图片/主题卡/知识卡) 仅本地展示
```

### 3.9 页面已经可操作后，用户可随时触发的页面内补充 API

这些请求不一定发生，但它们都只能在页面首屏完成后才有机会被用户触发：

1. **学习说明 / 成绩构成**
   - 首次自动弹，或用户手动点“学习说明”
   - 调用：
     - `queryStudyReadBefore({ courseId, recruitId })`

2. **班级信息**
   - 用户点班级信息
   - 调用：
     - `queryUserClassInfo({ classId, recruitId })`

3. **课程提纲**
   - 用户点课程提纲
   - 调用：
     - `outline({ courseId, recruitId })`

4. **知识图谱节点点击**
   - 用户打开知识图谱并点击节点
   - 调用：
     - `knowledgeClick({ kId, recruitId, source: 1 })`

5. **退课 / 返回源页面判断**
   - 用户点返回或退课入口
   - 调用：
     - `queryCanBeTuiKe({ recruitId })`
   - 若前端验证码校验通过并确认退课
     - 还会继续调用：
       - `tuike({ recruitId })`

6. **缺勤/提醒弹窗确认**
   - 首次展示来自 `bindPop`
   - 用户处理该弹窗时：
     - `absentPop({ recruitId })`

7. **异常弹窗确认**
   - 首次展示来自 `eADetail`
   - 用户点关闭时：
     - `agreeEADetail({ exceptionId, schoolId })`

8. **特殊课程复习入口**
   - 用户点 `goReview`
   - 会先打一条日志：
     - `https://collector2c.zhihuishu.com/public/kafkaCollect`
   - 随后再跳转复习页

### 3.10 作业/考试入口分支：不影响视频主链，但共用同一页面上下文

这部分通常发生在页面右侧作业区或章节测验入口。

1. **章节作业入口**
   - `chapterExamEntry(studentExam)`
   - 先调：
     - `queryStudentIsLimitFlow({})`
   - 若不限流，再调：
     - `findExamCorrectType({ examId, recruitId })`
   - 若作业状态是“已批阅可查看答案”，还会继续：
     - `isCheckAnswer({ studentExamId })`

2. **作业列表入口**
   - `goToExamJudge()`
   - 调用：
     - `queryStudentIsLimitFlow({})`

3. **查看答案确认**
   - `lookAnsSureBtn()`
   - 调用：
     - `updateCheckAnswer({ studentExamId })`

### 3.11 AI 分支：课程开关在首屏拉，真正问答在用户打开后才发生

AI 相关 API 也分成“首屏开关链”和“用户交互链”两层。

1. **首屏开关链**
   - 在 `queryCourse` 成功后已经拉过：
     - `findUnionAiId({ courseId, recruitId })`
     - `getCourseAccessAI({ recruitId, courseId })`
   - 若 AI 开启，还会补：
     - `queryStudyReadBefore({ courseId, recruitId })`（仅取 AI 头部要展示的学习时间窗）

2. **用户真正打开 AI 助教后**
   - 可能先打一个进入日志：
     - `https://collector2c.zhihuishu.com/public/kafkaCollect`
   - 然后按组件分支进入 3 套问答链之一：
     - `sendAiQuestion(payload)`
     - `sendAiQuestionV1(payload)`
     - `createThreads(...) -> sendAiQuestionV3(formData)`

3. **AI 弹题不是独立题库**
   - 普通弹题题目链仍然是：
     - `popupAnswer -> lessonPopupExam -> saveLessonPopupExamSaveAnswer`
   - AI 只是额外挂在弹题标题栏的入口，不改题目接口本身

### 3.12 风控 / 校验 / 反脚本分支：只在命中条件时额外发生

这部分不是每次都发生，但一旦命中，会插入到主学习链中。

1. **易盾滑块 / 短信验证码**
   - 触发时机：
     - `prelearningNoteApi` 返回 `isSlide`
     - 或学习进度接口返回 `-12`
   - 后续链路：
     - 滑块成功：
       - `validateSlideToken({ token, ev, checkType })`
     - 若转短信验证：
       - `getMobile({})`
       - `sendSmsCodeWithoutCheck({})`
       - `validateSlideToken({ token, ev, checkType: 2 })`

2. **人脸识别**
   - 触发时机：
     - `prelearningNoteApi` 返回 `isFace`
   - 后续链路：
     - `getQRCodeImg({ checkType: "FACE_CHECK", callModule: "app_video_study" })`
     - `getFaceIDResult({ qrToken })`
     - `saveStudentFaceRecognitionVideoLearnResult({ faceToken, status, ev, checkType })`

3. **脚本篡改 / 非可信事件**
   - 默认只做本地检测，不一定发请求
   - 一旦命中 `notTrustScript()`，才会上报：
     - `https://collector2c.zhihuishu.com/public/jsonp/collect`

---

把整页真正的**时间线主干**压缩成一行，就是：

```text
created
  -> 并发：getqueryCourse + getVideoList
  -> queryCourse 成功后补课程级请求(bindPop / queryCourseDispMode / findUnionAiId / getCourseAccessAI / eADetail / queryStudyReadBefore...)
  -> getVideoList 成功后补目录级请求(queryLearnedKgIds / queryStuyInfo / queryUserRecruitIdLastVideoId / queryStudiedTimeLimitInfo)
  -> prelearningNote
  -> prelearningNoteApi
  -> videoPlayer.js 补 subtitle/initVideo
  -> onReady -> threeDimens + popupAnswer
  -> 播放中：saveLearningCInTime / saveLearningDBInTime / currentSystemTime
  -> 到点弹题：lessonPopupExam -> saveLessonPopupExamSaveAnswer
  -> 用户再按需触发：outline / queryUserClassInfo / queryCanBeTuiKe / queryStudentIsLimitFlow / AI 问答等分支
```

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
  - 约束：接口回包后立即暂停播放器；成功后标准化题目结构、选项状态、正确答案数组，并打开 `testDialog`

- `saveLessonPopupExamSaveAnswer`（`POST form`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:113535 topicClickQot(option)` -> 本地先算对错 -> `saveLessonPopupExamSaveAnswer(payload)`
  - 参数：`{ courseId, recruitId, testQuestionId, isCurrent: option.result, lessonId, lessonVideoId?, answer: answerStu.join(','), testType: 0 }`
  - 约束：`lessonVideoId == 0` 时删除；请求成功没有业务分支，本地 UI 状态已先更新，接口主要用于落库

#### 补充：普通弹题测验（非 AI）完整调取链与字段细节

这条链和 AI 助教是两层逻辑：

- **普通弹题测验本身**：`popupAnswer -> lessonPopupExam -> saveLessonPopupExamSaveAnswer`
- **AI 助教入口**：只是在弹题框标题区额外挂了“点我”入口，不改题目接口

完整链路可还原为：

```text
created()
  -> getVideoList()
  -> getqueryCourse()
  -> getLastVideoId()/limitStudyFun()
  -> prelearningNote(章节, 课时, 小节?)
  -> initVideo(learnTimeSec)
     -> onReady()
        -> getThreeD()
        -> popupAnswer()                     // 拉取本视频全部弹点
        -> scrollLocation()
     -> onTime(currentTime)
        -> threeDFun(currentTime)
        -> autoTestFun(currentTime)         // 到点自动触发普通弹题/图片弹窗
            -> testDotClick(testPoint)
               -> testType == 1
                  -> lessonPopupExam(...)
                  -> 打开 testDialog
               -> 用户点击选项
                  -> topicClick()
                  -> topicClickQot()
                  -> saveLessonPopupExamSaveAnswer(...)
               -> closeTest()
```

关键代码定位：

- 视频初始化：`dist/v2/stuStudy.js:113667-113709`
- 弹点拉取：`dist/v2/stuStudy.js:113471-113496`
- 自动到点触发：`dist/v2/stuStudy.js:113522-113525`
- 弹题详情加载：`dist/v2/stuStudy.js:113498-113517`
- 作答与落库：`dist/v2/stuStudy.js:113532-113563`
- 关闭弹题限制：`dist/v2/stuStudy.js:113626-113634`
- 弹题 UI 模板：`dist/v2/stuStudy.js:114139-114272`
- 播放条上的 4 类弹点渲染：`dist/v2/stuStudy.js:114384-114456`
- API 包装层：
  - `dist/v2/app.js:1622-1623` -> `/popupAnswer/loadVideoPointerInfo`
  - `dist/v2/app.js:1628-1629` -> `/popupAnswer/lessonPopupExam`
  - `dist/v2/app.js:1625-1626` -> `/popupAnswer/saveLessonPopupExamSaveAnswer`

1. **先由 `prelearningNote()` 固定当前视频上下文**
   - `dist/v2/stuStudy.js:113349-113378`
   - `chapeterDataFun()` 会先把以下字段写好：
     - `videoDetail.chapterId/chapterName/chaNum/num/sonNum/name`
     - `lessonId`
     - `smallLessonId`
     - `videoTime = (小节或课时).videoSec`
   - 这里的 `videoTime` 很关键，后面所有弹点的横向位置都按 `timeSec / videoTime * 100` 算百分比。

2. **播放器 ready 后只拉一次当前视频的全部弹点**
   - `dist/v2/stuStudy.js:113676-113678`
   - `initVideo(learnTimeSec)` 的 `onReady()` 会执行：
     - `seek(learnTimeSec)`
     - `getThreeD()`
     - `popupAnswer()`
     - `scrollLocation()`
   - 也就是说：**每次切换视频/小节后，先重新拉一遍该视频的全部弹点元数据**，不是播放到某秒再去临时拉弹点列表。

3. **`popupAnswer()` 实际拉的是“视频弹点总表”**
   - 请求：`/popupAnswer/loadVideoPointerInfo`
   - 参数：
     - `{ lessonId, lessonVideoId?, recruitId, courseId }`
     - 没有小节时删除 `lessonVideoId`
   - 返回后前端不会直接只保留“题目”，而是把 4 类弹点一起收进来：
     - `questionPoint`：普通弹题测验，记为 `testType = 1`
     - `popupPictureDtos`：图片弹窗，记为 `testType = 2`
     - `videoThemeDtos`：主题提示/说明弹层，记为 `testType = 3`
     - `knowledgeCardDtos`：知识卡片弹层，记为 `testType = 4`
   - 标准化时会补这些前端字段：
     - `showDot = false`
     - `positionLeft = timeSec / videoTime * 100`
     - `positionTop = 0`
     - `visible = false`（仅 `testType 3/4` 会补）
   - 然后把 4 类数据合并成 `testInfo.listTotal`
   - 若多个弹点落在同一百分比位置，会把后面的 `positionLeft` 再右移 `0.5`，避免完全重叠。

4. **播放条上其实渲染了 4 套点击入口**
   - `dist/v2/stuStudy.js:114384-114456`
   - DOM 层不是只渲染 `listTotal`，而是分别渲染：
     - `testInfo.popupPictureDtos`
     - `testInfo.questionPoint`
     - `testInfo.videoThemeDtos`
     - `testInfo.knowledgeCardDtos`
   - 4 类节点统一都绑定到 `testDotClick(item)`。

5. **自动弹出只覆盖 `testType 1/2`，不会自动弹知识卡/主题卡**
   - `dist/v2/stuStudy.js:113686-113694` 的 `onTime(currentTime)`
   - 每次时间推进都会调用 `autoTestFun(currentTime)`
   - `autoTestFun()` 逻辑：
     - 仅当 `testType == 1` 或 `testType == 2`
     - 且 `parseInt(currentTime) == item.timeSec`
     - 才自动执行 `testDotClick(item)`
   - 触发前还会做一次 `item.timeSec = item.timeSec - 1`
     - 目的就是避免在同一秒内反复命中、重复弹出。
   - `testType 3/4` 没有自动触发逻辑，只能靠用户手点弹点。

6. **`testDotClick()` 有 4 个分支，其中只有 `testType 1` 是“普通弹题测验详情链”**
   - `dist/v2/stuStudy.js:113498-113517`
   - `testType == 1`
     - 调 `/popupAnswer/lessonPopupExam`
     - 参数：`{ lessonId, lessonVideoId?, time: testPoint.timers, questionIds: testPoint.questionIds }`
     - 返回回调一进来就 `ablePlayerX("container").pause()`
     - 成功后把题组写入 `topicInfo.lessonTestQuestionUseInterfaceDtos`
     - 默认取第一题写入 `pageList`
     - 打开 `testDialog = true`
     - 顺手把当前 `habitTime` 存到 `habitTimeKey`，并 `clearInterval(habitTimer)`
   - `testType == 2`
     - 不再发题目接口
     - 直接暂停播放器，写入 `imgUrlDialog = item.url`，打开 `imgDialog`
     - 同样暂停学习习惯计时器
   - `testType == 3`
     - 只切换 `item.visible`
     - 模板里对应 `el-popover(content=item.content)`
   - `testType == 4`
     - 只切换 `item.visible`
     - 模板里对应 `el-popover(title=item.title, content=item.content)`

7. **`lessonPopupExam()` 返回的是“题组”，不是单题**
   - 题组字段：`lessonTestQuestionUseInterfaceDtos`
   - 每个题对象会被前端二次加工：
     - `imagList = datas.filter(dataType == 2)`：题干图片
     - `answerUs = []`：正确答案的字母展示，如 `A,B`
     - `answerRight = []`：正确选项 id 列表
     - `isError = null`
     - `showAnswer / isCheck / answerStu`
   - 若接口已返回历史作答 `zAnswer`：
     - `showAnswer = true`
     - `isCheck = true`
     - `answerStu = zAnswer.answer.split(',')`
     - 同时把命中的选项回填成 `isClick = true`
   - 选项标准化：
     - `sortUs = _0x10faf0.v(sort)`：把原始序号转成前端展示字母
     - `isClick = false`
     - `result == 1` 的选项会进入：
       - `answerRight.push(option.id)`
       - `answerUs.push(option.sortUs)`
   - 最后把首题写入：
     - `this.pageList = this.topicInfo.lessonTestQuestionUseInterfaceDtos[0]`
   - 所以弹题弹窗底层是“题组 + 分页”模式，不是一次只返回一道题。

8. **弹题弹窗 UI 细节**
   - `dist/v2/stuStudy.js:114139-114272`
   - 关闭策略：
     - `close-on-click-modal = false`
     - `before-close = closeTest`
   - 标题区：
     - 普通课：`弹题测验`
     - AI 课：`AI助教小智给你出题啦！...点我`
   - 题组翻页：
     - `el-pagination`
     - `page-size = 1`
     - `current-change / prev-click / next-click -> pageeClick`
   - 题型展示：
     - `【questionType.name】 + question.name`
   - 选项展示：
     - `radio` 用单选图标
     - `checkbox` 用复选图标
   - 正确答案区：
     - 只有 `pageList.showAnswer == true` 时才显示
     - 文案直接展示 `pageList.answerUs.join(',')`

9. **作答不是等“提交按钮”，而是点选项即本地判分 + 立即落库**
   - `dist/v2/stuStudy.js:113532-113563`
   - `topicClick()` 只是事件门禁：
     - 若事件对象带 `isTrusted`
     - 则必须 `isTrusted == true` 且存在 `clientX/clientY`
     - 才会真正进入 `topicClickQot()`
   - `topicClickQot()` 本地逻辑：
     - 只处理当前页 `pageList.testQuestion.questionId`
     - 单选：
       - 先把所有选项 `isClick = false`
       - 只保留当前点击项
     - 多选：
       - 切换当前项 `isClick`
       - 再从所有 `isClick == true` 的选项重算 `answerStu`
     - 只要有选择，`isCheck = true`
   - 本地判分规则：
     - 若选中的每个 id 都在 `answerRight` 内，但整体还没选全
       - `isError = null`
       - `showAnswer = false`
     - 若选中的集合与 `answerRight` 完全一致
       - `isError = false`
       - `showAnswer = true`
     - 若包含错误项
       - `isError = true`
       - `showAnswer = true`
   - 也就是说：
     - **多选题支持“部分正确但未完成”的中间态**
     - 只有完全答对或已经选错，前端才立即亮出答案。

10. **落库接口的真实入参有一个容易忽略的细节**
    - 请求：`/popupAnswer/saveLessonPopupExamSaveAnswer`
    - 参数：
      - `courseId`
      - `recruitId`
      - `testQuestionId = pageList.testQuestion.questionId`
      - `isCurrent = 当前被点击选项的 result`
      - `lessonId`
      - `lessonVideoId?`
      - `answer = this.answerStu.join(',')`
      - `testType = 0`
    - 注意：
      - 这里的 `isCurrent` **不是整题是否答对**
      - 它直接取“当前点击选项”的 `result`
      - 所以前端真正能表达整题选择结果的字段，其实是 `answer`
    - 请求发出前若 `lessonVideoId == 0` 会删除该字段
    - 请求成功后前端没有再根据回包修正 UI，说明：
      - **判分展示以前端本地计算为主**
      - **接口更像是作答记录落库**

11. **关闭弹题有“必须全部作答 + isTrusted”双重限制**
    - `dist/v2/stuStudy.js:113626-113634`
    - `closeTest(event)` 分两层：
      - 若 `event.isTrusted !== false`
        - 继续检查 `topicInfo.lessonTestQuestionUseInterfaceDtos.filter(item => item.isCheck).length`
        - 只有“题组内每题都已做答”才允许关闭
        - 否则弹窗提示：`未做答的弹题不能关闭`
      - 若 `event.isTrusted === false`
        - 直接走 `notTrustScript()`
    - 关闭成功后：
      - `testDialog = false`
      - `habitWarn()` 重新恢复学习习惯计时器

12. **学习习惯计时会在弹题/图片弹窗期间暂停**
    - 普通弹题打开时：
      - `localStorage.habitTimeKey = 当前 habitTime`
      - `clearInterval(habitTimer)`
    - 图片弹窗打开时：
      - 同样暂停
    - 关闭弹题 `closeTest()` / 关闭图片 `closeImg()`
      - 都会回调 `habitWarn()` 重新续上
    - 这说明弹题链不仅影响播放器暂停，还影响“学习习惯分”的前端计时。

13. **因此，普通弹题测验的“调取链”本质上分成 3 层**

```text
第 1 层：视频 ready 后预拉全部弹点
  popupAnswer/loadVideoPointerInfo
    -> questionPoint / popupPictureDtos / videoThemeDtos / knowledgeCardDtos

第 2 层：命中普通题点后再拉题组详情
  popupAnswer/lessonPopupExam
    -> lessonTestQuestionUseInterfaceDtos

第 3 层：每次点选项立即落库
  popupAnswer/saveLessonPopupExamSaveAnswer
    -> answer / testQuestionId / isCurrent / lessonId / lessonVideoId?
```

如果只看“普通弹题测验”本身，真正参与题目链的只有：

- 弹点总表里的 `questionPoint`
- 题组详情接口 `lessonPopupExam`
- 作答落库接口 `saveLessonPopupExamSaveAnswer`

而同一接口里一起回来的：

- `popupPictureDtos`
- `videoThemeDtos`
- `knowledgeCardDtos`

本质上只是共用“视频弹点位”机制，不属于普通题目的答题链。

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

- `https://collector2c.zhihuishu.com/public/jsonp/collect`（GET JSONP，异常脚本/篡改日志）
  - 调用链：`dist/v2/stuStudy.js:113565 notTrustScript(trigger)` -> `collectLog(trigger)` -> `collector2c`
  - 触发源：
    - `dist/v2/stuStudy.js:113157 videoClick(..., event)`：最后一个参数若是 `PointerEvent` 且 `isTrusted === false`
    - `dist/v2/stuStudy.js:113626 closeTest(event)`：关闭弹题时若 `event.isTrusted === false`
    - `dist/v2/stuStudy.js:113575 checkoutNotTrustScript()`：页面创建后 1 秒执行一次，之后每 60 秒执行 `checkout()`；若 `_0x10faf0.o()` 判定 `XMLHttpRequest` 被篡改，则 `notTrustScript(window.XMLHttpRequest)`
  - 参数：`{ appType: 'ZHS_WEB', appPlatform, appVersion, data: [{ module: 'SHARECOURSE_SCRIPTS', uuid, userId, type: 'VIDEO_STUDY', courseId, recruitId, code: 101, userAgent, otherParams: { videoId, lessionId, errorMsg }, createTime }] }`
  - 约束：命中后会弹“检测到异常脚本”提示、暂停播放器，并在 3 秒后跳转 `https://www.zhihuishu.com`

#### 补充：`#container` 点击事件的本地异常脚本检测

- 关键位置：`dist/v2/stuStudy.js:112799-112808`
- 初始化时机：`mounted()` 内对 `document.getElementById("container")` 注册 `click` 监听，第三个参数是 `true`，即**捕获阶段**触发
- 判定逻辑：
  - 监听器先执行 `event.preventDefault()`
  - 随后判断 `event instanceof Event && event.isTrusted === false`
  - 命中后立即弹出“检测到异常脚本”提示，执行 `ablePlayerX("container").pause()`，并在 `3000ms` 后 `window.location.replace("https://www.zhihuishu.com")`
- 含义：
  - 这不是接口级风控，而是**前端本地反脚本检测**
  - 目标是拦截播放器容器内的**脚本合成点击事件**，例如通过 DOM 注入/自动化脚本触发的点击，而不是用户真实鼠标点击
  - 因为它挂在 `#container` 的捕获阶段，所以理论上会比后续业务点击处理更早拿到事件，属于一层“前置门禁”
- 与其他检测点的关系：
  - `videoClick(..., event)` 里还有一层 `PointerEvent.isTrusted` 检查
  - `closeTest(event)` 对关闭弹题动作也校验 `isTrusted`
  - `checkoutNotTrustScript()` 负责定时检查 `XMLHttpRequest` 是否被替换/代理
  - `initVideo().onTime()` 还会检测 `playbackRate > 1.8`
  - 因此当前学习页的反脚本策略是**DOM 事件可信度 + XHR 篡改检查 + 播放倍速阈值**三层并行
- 备注：
  - 这段 `#container click` 分支是**内联处理**，没有走 `notTrustScript() -> collectLog()`，所以默认只弹窗/暂停/跳转，不单独上报日志
  - 按当前解密产物文本，它使用的是普通 `function` 回调并直接访问 `this.$alert`；如果运行时没有额外绑定上下文，这里理论上存在 `this` 指向 `#container` DOM 节点的风险。但从分支内容看，其设计意图非常明确：检测到非可信点击就中断学习流程

### 4.6 AI、知识图谱、课程辅助

- `getCourseAccessAI`（`POST form`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:113955 getCourseAiQot()` -> `getCourseAccessAI({ recruitId, courseId })`
  - 参数：`{ recruitId: this.recruitId, courseId: this.courseId }`
  - 约束：
    - `data.isOpen == true`：把课程标记为 `isAiQotCourse`
    - `data.aiV2 == true`：走资源型 AI 助教 `isResourceAIHelper`
    - `data.image1/image2`：回填 `aiIcons`
    - `data.isTime`：写入 `isAiBoxShow`，控制当前时间窗内 AI 助教是否可打开
    - 仅当 `isOpen == true` 时，额外调用 `studyBefore("aiBot")`，只取 `courseStart/courseEnd` 给 AI 助教头部展示“仅限学习期间使用”

- `findUnionAiId`（`POST form`，内层补 `dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:112918 getMapUid()` -> `findUnionAiId({ courseId, recruitId })`
  - 参数：`{ courseId: this.courseId, recruitId: this.recruitId }`
  - 约束：只有 `code == 0 && data.result != -1` 才回填 `mapUid/mapType/mapHush/mapStr`

- `knowledgeClick`（`POST form`，内层补 `uuid + dateFormate`，外层 `secretStr`）
  - 调用链：`dist/v2/stuStudy.js:113987 knowledgeClick(node)` -> `knowledgeClick({ kId, recruitId, source: 1 })`
  - 参数：`{ kId: node.id, recruitId: this.recruitId, source: 1 }`
  - 约束：包装层会额外补 `uuid`；成功后仅把节点标记为 `active`

- `https://collector2c.zhihuishu.com/public/kafkaCollect`（POST，AI 助教打开日志）
  - 调用链：
    - `dist/v2/stuStudy.js:99874 showAIBox()` / `99891 showQotBox()` -> `sendLog()`
    - `dist/v2/stuStudy.js:100636 showAIBox()` / `100651 showQotBox()` -> `sendLog()`
    - `dist/v2/stuStudy.js:101639 showAIBox()` / `101654 showQotBox()` -> `sendLog()`
  - 参数：`{ appType: 'PC', appPlatform: 'PC', table: 'tbl_soc_yiyan_enter', data: [{ uuid, sourceType: 'PC', ctimes, courseId, recruitId }] }`
  - 约束：只记录“进入 AI 助教”的埋点，不参与题目链路

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

#### 补充：AI 弹题逻辑不是独立题库链，而是“普通弹题 + AI 助教入口”

1. **课程级开关先由 `getCourseAccessAI()` 决定**
   - 调用起点：`queryCourse()` 成功后 -> `getCourseAiQot()`
   - 这里不会拉题，只负责给页面打几个开关：
     - `isAiQotCourse`：这门课是否显示“AI 助教小智给你出题啦”
     - `isAiBoxShow`：当前时间窗内 AI 助教是否允许打开
     - `isResourceAIHelper`：是否切到资源型/新版 AI 助教
     - `aiIcons`：机器人图标素材

2. **真正的题目链仍然是普通弹题链**
   - 时间点拉取：`popupAnswer()`
   - 点击弹题点：`testDotClick()` -> `lessonPopupExam()`
   - 选择答案：`topicClickQot()` -> `saveLessonPopupExamSaveAnswer()`
   - 反查 `dist/v2/stuStudy.js` 后，`isAiQotCourse` **没有参与题目请求参数构造，也没有改变作答落库接口**
   - 也就是说：**AI 弹题本质上不是另一套题库/判分接口，而是在同一套弹题 UI 上加了 AI 助教入口**

3. **AI 课程只改弹题弹窗头部文案和入口**
   - 关键位置：`dist/v2/stuStudy.js:114159-114164`
   - 当 `isAiQotCourse == true` 时，普通标题“弹题测验”会替换成：
     - `AI助教小智给你出题啦！学习过程中有问题，随时点我`
   - 其中“点我”按钮绑定 `showAIChatBox()`

4. **“点我”按钮不会重新拉题，而是直接打开 AI 助教**
   - 关键位置：`dist/v2/stuStudy.js:113967-113974`
   - 分支逻辑：
     - `isAiBoxShow == false`：直接提示“课程学习已结束，学习助手不可用，请知悉”
     - `AIHelperProRef` 存在：调用 `showAIHelperDrawer()`，打开抽屉式 AI 助教
     - `aiChatBoxRef` 存在：若当前还没展示过协议弹窗，则先触发 `changePop()`；随后调用 `showQotBox()`
   - 因此“点我”只是**从弹题弹窗跳到 AI 助教容器**，并不影响当前题目的标准答题链

5. **首次打开 AI 助教会走协议确认**
   - 页面级逻辑：`dist/v2/stuStudy.js:114013-114015 changePop()`
   - 协议弹窗组件：`dist/v2/stuStudy.js:102156-102157`
   - 持久化键：`localStorage.hideAiChatPopFlag`
   - 行为是：
     - 本地没记过“已同意” -> 展示 `myPop`
     - 用户在 `myPop` 点“同意” -> 写入 `hideAiChatPopFlag = 1`
     - 后续同浏览器环境再次打开 AI 助教时，默认跳过协议弹窗

6. **AI 助教容器按课程/学校/灰度条件分流，不是统一组件**
   - 关键模板分流：`dist/v2/stuStudy.js:114275-114354`
   - 当前至少有 4 条分支：
     - `aiVideoChat`：`isAiQotCourse && isTestCourse`，题目入口旁打开，底层走 `sendAiQuestionV1`
     - `aiChatBox`：常规 AI 弹题课程，底层走 `sendAiQuestion`
     - `aiChatRadioInput`：特殊灰度课 / 特殊用户路径，先 `createThreads()`，再走 `sendAiQuestionV3`
     - `AIHelperPro` / `AIHelperResoure`：浮动/抽屉式 AI 助教，`aiV2` 打到资源型分支
   - 其中 `isSpecialAiPop` 不是通用配置，而是 `dist/v2/stuStudy.js:112914-112916` 里的**硬编码灰度条件**

7. **可把整条 AI 弹题链概括成：**

```text
queryCourse
  -> getCourseAccessAI
     -> 决定 isAiQotCourse / isAiBoxShow / aiV2 / aiIcons
  -> popupAnswer / lessonPopupExam / saveLessonPopupExamSaveAnswer
     -> 仍是普通弹题接口链
  -> 若 isAiQotCourse
     -> 弹题头部出现“AI助教小智给你出题啦 + 点我”
     -> 点我 -> showAIChatBox
        -> (必要时) 协议弹窗 myPop
        -> 打开 aiChatBox / aiVideoChat / aiChatRadioInput / AIHelperPro
        -> sendAiQuestion / V1 / V3
```

8. **实质结论**
   - “AI 弹题”更接近一种**教学交互增强层**
   - 它复用原有视频弹题的题目链和答题落库链
   - AI 部分新增的是：
     - 课程级开关
     - 助教入口按钮
     - 协议弹窗
     - 不同 AI 对话组件及其问答接口
   - 所以如果后续要复现/模拟“AI 弹题”，需要拆成两部分看：
     - **题目本身**：按原 `popupAnswer -> lessonPopupExam -> saveLessonPopupExamSaveAnswer`
     - **AI 助教**：按 `getCourseAccessAI + sendAiQuestion(/V1/V3)` 单独处理

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
- `secretStr` 的完整链路已经补齐：
  - `module(11/3)` -> `/app-commserv-user/c/has` -> `rt.sl`
  - `rt.sl` 经 4.js 自定义 RSA `decrypt(doPublic)` 还原出 `cKey`
  - 再用 `AES-CBC-PKCS7(key=cKey, iv=1g3qqdh4jvbskb9x)` 加密原始请求对象
- 风控/防挂机点主要有 3 类：
  - `queryStudentIsLimitFlow`：作业入口限流
  - `validateSlideToken`：易盾/短信校验
  - `saveLearningCInTime/saveLearningDBInTime`：返回 `-10/-12/-9`
- 除了接口级风控，前端本地还存在明确的反脚本检测：
  - `#container` 捕获阶段点击监听、`videoClick()`、`closeTest()` 都会用 `event.isTrusted`/`PointerEvent.isTrusted` 判断是否为脚本事件
  - `checkoutNotTrustScript()` 会周期性检查 `XMLHttpRequest` 是否被篡改
  - 播放中若检测到 `playbackRate > 1.8`，会直接暂停并跳转首页
- 播放器侧当前实际走 `videojs` 分支；`letv` 相关旧代码和旧接口仍在文件里，但不是当前 V2 学习页的主链
- AI 能力存在 3 套并行调用方式：
  - `sendAiQuestion`：老版文本
  - `sendAiQuestionV1`：另一套 JSON 文本/音频组件
  - `createThreads + sendAiQuestionV3`：新版会话/文件上传能力
- `queryStudentIsLimitFlow` 的包装层存在明显异常写法，后续如果你们要继续复原源码，建议优先确认这里是否是原始代码 bug，还是解密/还原阶段漏掉了 `()`
