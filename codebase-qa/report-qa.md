# codebase-qa 全链路解析报告

## 1. 分析范围与总判断

- 当前快照是一个 **Vue + Vuex + Vue Router** 的课程问答 H5 前端。
- 主入口在 `codebase-qa/qa.js`，Webpack runtime 在 `codebase-qa/manifest.js`。
- 当前目录只提供了：
  - `manifest.js`
  - `qa.js`（主 bundle，chunk 13）
  - `0.js`（Web 首页，chunk 0）
  - `1.js`（Web 问答详情页，chunk 1）
  - `common-api.js`（chunk 14，占位空包）
- `manifest.js` 声明了 chunk `0-14`，但实际只落地了 `0/1/13/14`。因此：
  - **Web 首页 `/web/home/:courseId` 与 Web 详情 `/web/questionDetail/:courseId/:qid` 可以完整静态解析。**
  - 其余路由只能根据 router、共用模块、接口命名做边界说明，**无法对缺失 chunk 做源码级完全还原**。

核心结论：

1. 这套前端的真正关键不在页面 UI，而在 **请求封装 + 动态密钥 + 风控补偿链路**。
2. 非旧版 App 路径下，请求不是直接发明文，而是：
   - 加载远程 `//base2.zhihuishu.com/js/6.js?v=2022099999`
   - 通过 `labc2(10)` / `labc2(13)` 获取 `dynStr` / `dynOnlineStr`
   - 用外部函数 `yxyz(params, dynStr*)` 生成 `secretStr`
   - 再经 axios request interceptor 注入 `Authorization`
3. 风控链路分两层：
   - **HTTP 422**：直接走黑名单/异常弹窗
   - **业务码 1010**：触发 `AbleCaptcha` 滑块验证，再重放提交
4. 业务主体是一个“课程问答”系统，覆盖：
   - 首页问答列表
   - 详情页问答/回答/评论
   - 举报、置顶、精华、删除、禁言、解禁
   - 我的参与统计
   - 首次访问引导
   - 未读消息入口

---

## 2. 文件角色拆解

| 文件 | 角色 | 结论 |
| --- | --- | --- |
| `codebase-qa/manifest.js` | Webpack 运行时 | 负责 chunk 哈希映射与懒加载脚本注入 |
| `codebase-qa/qa.js` | 主 bundle | 含 store、router、接口层、启动逻辑、工具函数、bridge、埋点 |
| `codebase-qa/0.js` | Web 首页 chunk | 首页容器、顶部 banner、列表页、提问/回答弹窗、举报/禁言相关组件 |
| `codebase-qa/1.js` | Web 详情页 chunk | 问题详情、回答列表、评论流、点赞/围观/评论/删除/举报/禁言组件 |
| `codebase-qa/common-api.js` | 占位 chunk | 无实际逻辑，只有空模块 |

---

## 3. 路由与 chunk 映射

`qa.js:260-389` 定义了整套路由。解析结果如下：

| 路由名 | 路径 | chunk | 模块 | 当前快照是否有源码 |
| --- | --- | --- | --- | --- |
| `test` | `/test` | 2 | 710 | 否 |
| `webHome` | `/web/home/:courseId` | 0 | 712 | 是 |
| `webQuestionDetail` | `/web/questionDetail/:courseId/:qid` | 1 | 714 | 是 |
| `webMyJoin` | `/web/myJoin/:courseId` | 3 | 713 | 否 |
| `bannedPostList` | `/web/bannedPostList/:courseId` | 6 | 711 | 否 |
| `appClientHome` | `/appClient/home/:courseId` | 4 | 706 | 否 |
| `appInformAgainstNew` | `/appClient/InformAgainst/:courseId` | 11 | 703 | 否 |
| `appQuestionDetail` | `/appClient/questionDetail/:courseId/:qid` | 5 | 708 | 否 |
| `appMyJoin` | `/appClient/myJoin/:courseId` | 8 | 707 | 否 |
| `appWiki` | `/appClient/questionList/wiki` | 10 | 709 | 否 |
| `appBannedPost` | `/appClient/bannedPost/:courseId` | 7 | 704 | 否 |
| `appClientbannedPostList` | `/appClient/bannedPostList/:courseId` | 9 | 705 | 否 |

补充：

- `router.afterEach` 会在路由切换后调用 `pageCollection` 埋点（`qa.js:381-389`）。
- 可见埋点只覆盖：
  - 首页：`bizId=100005`
  - 问题详情：`bizId=100006`

---

## 4. 启动链路：页面从打开到可发请求的完整过程

### 4.1 Vue 启动

`qa.js:1988-2089`

- 注册全局组件 `remote-js`
- 注册 `vue-navigation`
- `new Vue({ router, store, template: '<App />' })`
- `beforeCreate` 把实例挂到 `Vue.prototype.bus`

### 4.2 App 级 created

`qa.js:2439-2460`

启动时做这些事：

1. 识别当前是不是智惠树 App（`isZhihuishu()`）
2. 识别是不是旧版 App 路径（URL 含 `/app/`）
3. 把 `isApp` / `oldApp` 写入状态
4. 暴露两个全局入口：
   - `window.setEncryKeysE = this.setEncryKeys`
   - `window.appToastE = this.appToast`
5. IE<=9 直接跳浏览器升级页
6. Web 场景下先拉当前登录信息
7. 强制把协议切到 `https:`

### 4.3 远程脚本加载

`qa.js:3729-3800`

模板里通过 `remote-js` 注入 11 个远程脚本，最关键的是：

- `//base2.zhihuishu.com/js/6.js?v=2022099999`
- `AbleUploader` 一整套上传脚本
- `jquery.nanoscroller`

其中最关键的不是上传，而是 `6.js`：

- `qa.js:2743-2756`
- 在 `jsLoaded()` 里调用 `labc2(10)`、`labc2(13)` 获取动态密钥
  - `labc2(10)` → `dynStr`
  - `labc2(13)` → `dynOnlineStr`

本地 bundle **只消费密钥**，不定义密钥算法：

- `yxyz` 在本地快照中只有调用，没有定义
- `labc2` 在本地快照中只有调用，没有定义
- 这说明 **加密能力来自远程脚本，不在当前源码包内**

### 4.4 watch 驱动的数据装配

`qa.js:2507-2585`

App 不是一次性初始化完，而是靠多个 watcher 分阶段推进：

- `$route`
  - 首次从 `/` 进入真实路由时，把 `courseId / role / recruitId` 写进 store
  - 旧版 App 路径下立即触发课程信息、禁言状态、用户权限、学校列表、参与统计拉取

- `dateRange`
  - 监听 `dynStr + courseId + roleId + recruitId`
  - 非旧版 App 场景，在 `dynStr` 就绪后统一触发：
    - `getCourseQaInfo`
    - `getUserPower`
    - `getForbidStatus`
    - `getSelectTeaSchool`
    - `getmyParticipateQaNum`

- `onlineRange`
  - 监听 `dynOnlineStr`
  - 当 `roleId == 2 && !isApp && dynOnlineStr` 时，调用 `checkIsLock()`

- `roleMatchs`
  - 会根据后端 `userRole` 自动纠正前端 `role`
  - 逻辑是：
    - `userRole == 3 && roleId == 1` → 强制改成 `role=2`
    - `userRole != 3 && userRole != -1 && roleId == 2` → 强制改成 `role=1`
  - **推断**：`role=2` 更偏学生问答视角，`role=1` 更偏教师/话题视角

---

## 5. 请求拦截 / 鉴权 / 加密 / 风控链路

### 5.1 axios 请求拦截

`qa.js:77-96`

请求层统一做了四件事：

1. `withCredentials = true`
2. 默认 `Content-Type` 从 JSON 改成表单
3. 只要请求命中 `creditqa-api.zhihuishu.com` 或任意 `-api.zhihuishu.com`，就尝试补 `Authorization`
4. `POST` 请求统一走 `qs.stringify`

`Authorization` 来源有两种：

- `config.jsA`：调用方显式传入
- `jt-cas` cookie：默认回退值

### 5.2 Authorization 来源

`qa.js:3385-3394`

`getAccaFnStr()` 的顺序是：

1. Android：`appBaseJSContextObj.getByNative()`
2. iOS：`window.iOSInfo.getByNative`
3. Web：`jt-cas` cookie

也就是说：

- **Web 走 cookie**
- **Native 走桥接返回的 token**

### 5.3 参数加密

`qa.js:435-692`

`fetch_gateway` 模块里的大部分接口都不是直接传业务字段，而是：

1. `yxyz(params, dynStr)` 或 `yxyz(params, dynOnlineStr)`
2. 生成 `secretStr`
3. 再把 `dateFormate / secretStr` 组装进请求

重要点：

- `dynStr` / `dynOnlineStr` 来自远程 `6.js`
- `yxyz` 也来自远程环境
- 本地只负责拼装，不负责实现算法

### 5.4 响应风控拦截

`qa.js:98-130`

一旦响应错误为 `422`，直接走异常处理：

- iOS：`iosNativeWkFun("goAbnormalPop", popParams)`
- Android：`appBaseJSContextObj.goAbnormalPop(JSON.stringify(popParams))`
- Web：
  - `checkType == 3` → `zhsMonitor.open('nostudy', ...)`
  - 其他 → `zhsMonitor.open('blacklist', ...)`

这说明 422 在这里不是普通失败码，而是 **平台风控/黑名单/异常行为拦截**。

### 5.5 业务码 1010：验证码补偿

可见于：

- 提问/回答弹窗：`0.js:40890-41029`
- 评论发布：`1.js:42424-42472`

逻辑：

1. 业务提交返回 `code == 1010`
2. 调 `initAbleYidun()`
3. `initAbleYidun()` 内部走 `initAbleYidunFallbackFunc()`（`qa.js:3416-3448`）
4. 成功后拿到 `validate`
5. 带上 `validate` 重放原请求

因此这套系统有两套风控：

- **前置拦截型**：HTTP 422
- **补偿验证型**：业务码 1010

### 5.6 课程锁定检查

`qa.js:2723-2735`

- 在 `dynOnlineStr` 就绪后，`roleId == 2 && !isApp` 会调用：
  - `checkIsLock()` → `/student/check/exceptionActionDetail`
- 如果返回 `res.result.lock == true`：
  - `courseIsLock = true`
  - 页面显示锁定遮罩层（`qa.js:3801-3805`）

---

## 6. store / 权限 / 环境分叉

### 6.1 baseData 状态模型

`qa.js:2122-2149`

关键状态：

- 基础身份：`realName`, `headPicUrl`, `userId`
- 路由上下文：`courseId`, `roleId`, `recruitId`, `appUUID`
- 环境标识：`isApp`, `clientType`, `darkMode`, `isHistory`
- 课程维度：`studyMode`, `courseInfo`, `isWisdomCourse`
- 业务统计：`qNumShow`, `aNUmShow`, `cNumShow`, `ParticipateQaNum`
- 权限维度：`userRole`, `hasAssistantRole`, `teaSchoolList`
- 安全上下文：`dynStr`, `dynOnlineStr`, `accA`, `forbidStatus`

### 6.2 旧版 App 与非旧版路径的分流

`qa.js:2180-2290`

存在两套接口适配：

- `fetch_url`（模块 197）：旧版 `/app/` 场景，GET 风格、参数里带 `uuid`
- `fetch_gateway`（模块 196）：新版/普通 H5 场景，POST/GET + `secretStr` + `Authorization`

也就是说：

- **旧 App** 更像老接口兼容层
- **新 H5 / 新 App WebView** 走加密网关接口

### 6.3 权限自动修正

`qa.js:2568-2585`

后端 `userRole` 会反向约束 query 里的 `role`：

- `userRole == 3` 被强制改到 `role=2`
- 其他有效角色被强制改到 `role=1`

这不是 UI 提示，而是直接 `router.replace({ query })` + `setRoleId()`。

---

## 7. 首页 `/web/home/:courseId` 的业务全解

### 7.1 页面骨架

`0.js:15-56`, `0.js:42927-43004`

首页由三部分组成：

1. `top-section`：顶部课程 banner
2. `qa-list`：中间主列表
3. `Right-Components` + `rightFix`：右侧信息面板与悬浮工具条

### 7.2 顶部 banner（课程信息层）

模板见 `0.js:83-145`，逻辑见 `0.js:42869-42900`。

展示内容：

- 课程图
- 课程名
- 课程类型文案
- 问题/回答/评论总数

课程类型文案逻辑：

- 智慧课程：不显示额外标签
- 否则根据 `studyMode` 与 `isAiCourse` 推导：
  - `1` → `公开课`
  - `2` → `实验课`
  - `0 && !isAiCourse` → `共享课`

计数说明：

- `qNumShow / aNUmShow / cNumShow` 是格式化后的展示值
- tooltip 明确说明：
  - 数量包含“已审核删除”的内容
  - 所以和页面当前可见数量不一定一致

### 7.3 右侧面板 `Right-Components`

逻辑见 `0.js:40596-40639`，模板线索见 `0.js:41440-41477`。

核心作用：

- 展示“我的参与”四块统计：
  - 我的回答
  - 我的评论
  - 我的话题 / 我的提问（取决于 `roleId`）
  - 我的围观
- 点击跳转到 `/web/myJoin/:courseId?type=*`
- 统计数据来自 `ParticipateQaNum`
- 还包含二维码区域（模板可见，具体用途偏引流/扫码）

### 7.4 悬浮条 `rightFix`

逻辑见 `1.js:41480-41540`，样式/结构见 `1.js:41548-41622`。

它负责：

- 未读消息数展示
- 跳转消息中心
- 返回课程首页
- 一键回到顶部

消息接口：

- 教师态：`getMessageCount(type=NOTICE)` + `getMessageCount(type=MESSAGE)`
- 学生态：`getStudentUnReadMessageCount()`

### 7.5 列表主体 `qa-list`

核心逻辑在 `0.js:41780-42185`。

#### 7.5.1 Tab 体系

默认 tab：

- `热门`
- `最新`
- `精华`
- `话题讨论`

条件追加：

- `hasAssistantRole == 4 && !isVirtualCourse` → 再追加 `我的班级`

#### 7.5.2 各 tab 对应接口

- `热门` → `getHotQuestionList`
- `最新` → `getRecommendList`
- `精华` → `getEssenceList`
- `话题讨论` → `getTopicList`
- `我的班级` → `getClassQuestionList`

分页：

- `pageSize = 50`
- 滚动到底继续拉

一个特殊分支：

- 如果首次进来热门为空，会自动回退到“最新”

#### 7.5.3 章节筛选

只在：

- 当前 tab = `话题讨论`
- 不是实验课
- 存在章节数据

时显示。

流程：

1. `initChapter()` 调 `getChapterTalkList`
2. 插入一个虚拟项 `全部`
3. `clickMenu()` 按章节重拉 `getTopicList`

#### 7.5.4 列表项操作

首页列表项支持：

- 打开详情页（`moveQaDetail()`，直接 `window.open` 新窗口）
- 围观 / 取消围观（`clickOnlook()`）
- 删除/举报/置顶/精华/禁言（通过 `hover-down` 组件派发）

围观逻辑特点：

- 有 500ms 节流防重复点
- 成功后同时刷新“我的参与”统计

#### 7.5.5 首页特殊卡片：课程问答小助手

`0.js:42324-42350`

在首页列表顶部会插入一个“课程问答小助手”卡片，点击跳转：

- `https://wiki-wenda.zhihuishu.com/`

这张卡片不是普通问答数据，是前端硬编码的辅助入口。

### 7.6 提问 / 回答弹窗

主逻辑：

- `0.js:40806-41029`

能力包括：

- 文本输入
- 最多 9 张图
- 教师侧提“话题”时支持章节选择（`getAllChapterList`）
- 字数门槛：实际输入 >= 4 才允许提交

#### 7.6.1 上传

通过外部 `Ableuploader` 完成：

- `#uploadAcrossImg`
- `allowSuffix = jpg|png|jpeg|bmp|gif`
- `fileSizeLimit = 52e5`
- `fileItemLimit = 9`

#### 7.6.2 提交提问

`saveQuestion()` 发送字段：

- `annexs`
- `content`
- `courseId`
- `recruitId`

- `chapterId`
- `sourceType`
- `validate`
- `saveSource: 1`

提交成功后：

- Toast 成功
- 刷新“我的参与”
- 关闭弹窗
- 触发 `reloadQuestionList`
- 埋点 `bizId=200004, questionType=1`

#### 7.6.3 提交回答

`saveAnswer()` 发送字段：

- `annexs`
- `qid`
- `source`
- `aContent`
- `courseId`
- `recruitId`
- `validate`
- `saveSource: 1`

提交成功后：

- 详情页刷新答案流
- 刷新问题详情
- 刷新“我的参与”
- 埋点 `questionType=2`

#### 7.6.4 风控补偿

提问/回答共用：

- 返回 `1010` → 拉起滑块验证码
- 返回 `422` → `abnormalStatus = true`
- `passVerify()` 后重新提交

### 7.7 首页举报 / 首次访问引导 / 禁言提示

#### 举报

`0.js:39021-39068`

举报原因是预置枚举：

- 广告或垃圾信息
- 色情/暴力/血腥等违法内容
- 辱骂/歧视/挑衅
- 政治敏感
- 恶意灌水
- 其它

提交接口：`qaWebReportService`

#### 首次访问引导

`0.js:41744-41747`, `0.js:42161-42185`

流程：

1. 首页 mounted 调 `isFirstVisit()`
2. 若首次访问，则 `guideVisible = true`
3. 引导弹窗点击后调 `updateFirstVisit()`
4. 然后打开 `https://wiki-wenda.zhihuishu.com/`

模板上只有 `guideVisible && userRole == 3` 才显示，说明该引导主要针对学生侧。

#### 禁言前置检查

首页点击提问前会先调 `getUserForbidStatus`：

- 已禁言 → 打开禁言说明弹窗
- 未禁言 → 才打开提问弹窗

---

## 8. 详情页 `/web/questionDetail/:courseId/:qid` 的业务全解

### 8.1 进入详情页时做什么

核心逻辑：`1.js:42164-42229`

mounted 时：

1. 从 `CASLOGC` 取 `userId`
2. 从路由取 `qid`
3. 如果 query 里有 `aid`：
   - 进入“我的回答”视图
4. 否则：
   - 进入“全部回答”视图
5. 同时拉：
   - `getQuestionInfo()`
   - `getAnswerInInfoOrderByTime()` 或 `getMyAnswerInInfo()`
6. 绑定窗口滚动，做悬浮按钮与无限滚动

### 8.2 问题主体

`1.js:42211-42228`

详情页先拉 `getQuestionInfo()`，然后做：

- 写入 `questionDetial` / `questionInfo`
- 格式化 `answerNum` / `onlookerNum`
- 如果 `contentShowStatus != 1 && isHistory != 1`
  - 直接把内容替换成 `*由于涉嫌违规，该内容已经被屏蔽*`

这意味着：

- 前端明确支持“内容被审核屏蔽但对象仍存在”的状态

### 8.3 回答列表

#### 全部回答

`1.js:42230-42287`

- 接口：`getAnswerInInfoOrderByTime`
- 分页：`pageSize = 20`
- 每条回答会补 UI 状态：
  - 展开/收起
  - 评论区开关
  - 评论分页索引
  - 本地输入框内容

#### 我的回答

`1.js:42540-42596`

- 接口：`getMyAnswerInInfo`
- 同样分页 `20`
- 用于“只看我的回答”视图

#### 视图切换

`changeType()`

- `1` → 全部回答
- `2` → 我的回答

### 8.4 评论流

#### 拉评论

`1.js:42378-42400`

- 接口：`getCommentInfoList`
- 分页 `20`
- 每条评论补本地输入框状态，支持二级回复

#### 发评论 / 回复评论

`1.js:42401-42478`

流程：

1. 本地校验输入非空
2. 先调 `getUserForbidStatus`
3. 如果被禁言：
   - 打开禁言提示弹窗
4. 如果目标回答已被屏蔽且当前不是历史态：
   - 直接拦截
5. 否则调 `saveComment`
   - 回复上级评论时带 `commentParentId`
   - 带 `saveSource: 1`
   - 如有验证码结果带 `validate`

成功后：

- 清空输入框
- 重置评论分页
- 重拉评论列表
- 评论数 +1
- 刷新“我的参与”
- 埋点 `questionType=3`

失败分支：

- `1010` → 拉起验证码
- `422` → 把上下文塞进 `continueData`
- 之后由 `continueSaveCommen()` 重放

### 8.5 点赞 / 围观 / 展开

- 点赞：`changeLike()` → `updateOperationToLike`
- 围观：`clickOnlook()` → `onLookerQuestion`
- 展开问题正文：`textSeeMore()`
- 展开回答正文：`answerTextSeeMore()`
- 展开/收起评论区：`showAnswer()`

### 8.6 删除回调的本地同步

`1.js:42481-42518`

删除成功后不一定全量重拉：

- 删除回答：本地删 `replyList`，同步 `answerNum`
- 删除评论：本地删对应 `commentList`，同步 `commentNum`
- 删除问题：直接跳回首页

### 8.7 详情页固定按钮

详情页底部存在固定“我来回答”按钮：

- 先检查禁言状态
- 未禁言才调出回答弹窗

---

## 9. 举报 / 删除 / 置顶 / 精华 / 禁言 / 解禁的统一操作层

这部分主要由 `hover-down` 组件完成，核心逻辑见 `1.js:39820-39960`。

### 9.1 数据类型约定

从模板和 API 映射看：

- `dataType = 1`：问题
- `dataType = 2`：回答
- `dataType = 3`：评论
- `dataType = 4`：二级评论 / 回复

### 9.2 删除

`submitDialog()` 根据 `dataType` 分发：

- 1 → `deleteTopicInterface`
- 2 → `deleteAnswerInterface`
- 3/4 → `deleteCommentInterface`

成功后向父组件抛 `delete` 事件，由父组件决定本地更新还是跳转。

### 9.3 举报

`commandReport()` 打开举报对话框；
举报对话框内部调用：

- `qaWebReportService`

成功后抛 `report` 事件，父组件一般只做刷新或关闭。

### 9.4 置顶 / 精华

- `commandTop()`：
  - 问题 → `updateTopInterFace`
  - 回答 → 当前实现里映射到了 `updateEliteInterFace`
- `commandBest()`：
  - 也调用 `updateEliteInterFace`

这说明：

- 问题支持“置顶”
- 回答支持“精华”
- 代码命名里有一处语义混淆：`commandTop()` 在回答分支其实走的是精华接口

### 9.5 禁言 / 解禁

统一流程：

1. 先 `getUserForbidStatus`
2. 如果已有禁言状态 → 打开解禁弹窗
3. 否则 → 打开禁言弹窗

实际接口：

- 禁言：`forbidUser`
- 解禁：`removeForbidUser`

详情页与首页都共用这套操作组件。

---

## 10. 接口总表（按业务域归类）

### 10.1 登录 / 身份 / 基础课程

- `getLoginUserInfo2`
- `logout`
- `qaAnswerIndexPage`
- `getRoleByUserId`
- `myParticipateQaNum`
- `getSelectTeaSchool`
- `isWisdomCourse`
- `isAiCourse`

### 10.2 列表 / 详情 / 查询

- `getHotQuestionList`
- `getRecommendList`
- `getEssenceList`
- `getTopicList`
- `getClassQuestionList`
- `getQuestionInfo`
- `getAnswerInInfoOrderByTime`
- `getMyAnswerInInfo`
- `getCommentInfoList`
- `getChapterTalkList`
- `getAllChapterList`
- `getMyOnlookerList`
- `myAnswerList`
- `myQuestionList`
- `myCommentList`

### 10.3 互动操作

- `saveQuestion`
- `saveAnswer`
- `saveComment`
- `saveComment2`
- `updateOperationToLike`
- `onLookerQuestion`

### 10.4 举报 / 审核 / 禁言

- `qaWebReportService`
- `updateToppingForBasicCache`
- `updateEliteForBasicCache`
- `deleteQuestionByQuestionId`
- `deleteAnswerByAnswerId`
- `deleteCommentByCommentId`
- `forbidUser`
- `getRecruitForbidList`
- `getUserForbidStatus`
- `removeForbidUser`
- `isFirstVisit`
- `updateFirstVisit`

### 10.5 消息 / 风控 / 黑名单

- `getAllNoReadCount`
- `getStudentUnReadMessageCount`
- `exceptionActionDetail`
- `getMobile`
- `sendCode`
- `sendCodeNew`
- `codeValidate`

### 10.6 当前快照中“接口已定义但未见调用”的项

只在 `qa.js` 网关层定义、但当前可见 chunk 未发现调用点：

- `saveQaPushControlV3Api`
- `getQaPushControlIsNo`
- `saveComment2`

说明这些能力很可能在缺失的懒加载 chunk 中，或已成为遗留接口。

---

## 11. 缺失源码边界

当前快照不能源码级完全解析的部分：

1. `webMyJoin`
2. `bannedPostList`
3. 全部 `appClient/*` 路由
4. `test` 路由
5. 远程脚本提供的：
   - `labc2`
   - `yxyz`
   - `AbleCaptcha`
   - `Ableuploader`

因此：

- **对当前目录已提供的文件，解析是完整的**
- **对未提供的 chunk，只能根据 router、共用组件和接口命名做高置信推断**
- **对加密算法本体，只能确认调用链，无法在本地包内还原实现**

---

## 12. 代码层面的异常点 / 风险点

### 12.1 axios 成功态判断写法有问题

`qa.js:98-101`

```js
if (!res.data.status === 2000) {
  return Promise.reject(res);
}
```

这里的 `!res.data.status === 2000` 按 JS 优先级会先取反再比较，几乎不可能按预期工作。

实际效果：

- 这个拦截器**没有真正拦住非成功响应**
- 页面层最终还是靠各业务函数自己判断 `status == 200` / `code == 200`

### 12.2 `getCurrentUserInfo` 的 catch 里打印了未定义变量

`qa.js:2171-2173`

- `catch(function (error) { console.log(err); ... })`
- 这里 `err` 未定义，应该是 `error`

这是明显的日志级 bug。

### 12.3 `setAccToken` 被映射但没有实现

只找到一处：

- `qa.js:2635`

但 `baseData.mutations` 里没有对应 `setAccToken`，也没有其他调用点。

说明这是遗留接口或半删状态。

### 12.4 回答分支里“置顶/精华”命名混乱

`1.js:39891-39904`

- `commandTop()` 的 `dataType=2` 分支实际走 `updateEliteInterFace`
- 代码命名与真实语义不完全一致

### 12.5 当前快照强依赖外部脚本

如果远程 `6.js` 或上传/验证码脚本失败：

- 无法拿到加密密钥
- 无法生成 `secretStr`
- 无法正常提交提问/回答/评论

这也是 `jsLoadError()` 要直接提示“重新进入”的原因。

---

## 13. 防复制 / 防粘贴逻辑深挖

### 13.1 真正的防复制入口只有两处

当前可见源码里，业务代码层面的防复制/防粘贴不是散落在各组件里，而是集中在两个页面根组件的 `created` 钩子：

- 首页根组件：`0.js:42948-42960`
- 详情页根组件：`1.js:42155-42162`

两处逻辑本质一致，都是在 `roleId == 2` 时执行：

```js
document.onselectstart = new Function("event.returnValue=false")
document.oncontextmenu = new Function("event.returnValue=false")
document.oncopy = new Function("event.returnValue=false")
document.oncut = new Function("event.returnValue=false")
document.onpaste = new Function("event.returnValue=false")
```

### 13.2 触发条件：跟 `roleId == 2` 强绑定

首页：

- `0.js:42952-42960`
- 从 `this.$route.query.role` 取值；没有就默认 `1`
- 只有 `role == 2` 才安装这 5 个全局 handler

详情页：

- `1.js:42155-42162`
- 直接读取 store 里的 `roleId`
- 只有 `roleId == 2` 才安装

再结合 `qa.js:2568-2585` 的 `roleMatchs` 自动修正逻辑，可以推断：

- **学生侧最终更容易落到 `role=2`**
- **教师/非学生侧更容易落到 `role=1`**

所以当前可见快照里的防复制逻辑，本质上是：

- **只对 `role=2` 这一侧启用的全页文档级限制**

### 13.3 拦截范围不是“正文”，而是“整个 document”

因为代码直接改的是：

- `document.onselectstart`
- `document.oncontextmenu`
- `document.oncopy`
- `document.oncut`
- `document.onpaste`

所以生效范围不是某个问答 DOM 区块，而是 **当前页面整个 document**。

实际影响包括：

1. 不能选中文本
2. 不能右键
3. 不能复制
4. 不能剪切
5. 不能粘贴

这意味着它不仅限制“复制页面内容”，还会连带影响：

- 评论输入框
- 回答输入框
- 提问输入框
- 任意页面内文本框

也就是说，这是一个 **粗粒度文档级拦截**，不是精细化的内容保护。

### 13.4 生命周期特征：只安装，不清理

当前可见业务组件里，没有看到与之配套的恢复逻辑：

- 没有 `beforeDestroy` / `destroyed` 中把 `document.oncopy` 等恢复
- 也没有在 `role` 从 `2 -> 1` 时主动解除

因此在当前窗口上下文里，一旦相关页面以 `role=2` 执行过该逻辑：

- 这些 handler 会一直挂在 `document` 上
- 直到整页刷新，或被其他脚本覆盖

这是这套防复制逻辑最重要的实现特征之一：**它是“全局污染式”安装，不是“进入即开、离开即关”的精细控制**。

### 13.5 为什么详情页会继续生效

首页跳详情不是简单 router push，而是直接拼 URL 打开新窗口：

- `0.js:42124-42127`

而它会把 `role` 一并带过去：

- `#/web/questionDetail/<courseId>/<questionId>?recruitId=...&role=...`

所以如果首页已经处于 `role=2`：

- 详情页新窗口也会带着 `role=2`
- 详情页根组件又会再次安装同样的 document 级拦截

这就保证了：

- 首页禁复制
- 打开详情后仍然禁复制

### 13.6 当前快照里“没有看到”的更强保护

全局检索当前快照后，**没有发现**下面这些更重的前端内容保护：

- `user-select: none`
- 剪贴板内容改写（`clipboardData.setData`）
- 文本水印
- Canvas/图片化正文
- 透明遮罩层拦截复制
- 选中文本后自动清空 selection
- 键盘级 `Ctrl+C / Ctrl+V` 专门拦截

因此当前快照里的防复制，本质上就是：

- **依赖浏览器默认事件模型的前端 UX 阻断**
- 不是强 DRM，也不是数据层加密保护

### 13.7 业务意图推断

结合现有逻辑，较高概率的业务意图是：

1. 学生侧（`role=2`）限制复制题干、回答、评论
2. 顺便限制学生把外部内容直接粘进提问/回答/评论框
3. 与平台的风控体系（422 / 1010 / 禁言）一起构成“学习场景约束”

这是**推断**，不是源码里直接写明的产品注释；但从 `roleMatchs`、页面入口标题（`提问` / `话题`）、以及 `role=2` 才装防复制来看，这个推断是高置信的。

### 13.8 这套防复制逻辑的边界

从实现方式看，它只能拦住普通用户的直接交互，拦不住更低层的数据获取：

- 页面正文仍然是普通 DOM 文本
- 问题/回答/评论数据仍然通过接口明文回到前端后再渲染
- 当前快照里没有做“文本只在图片/Canvas 中呈现”

所以它更像：

- **前端交互限制**

而不是：

- **内容不可恢复**

这也是为什么这套逻辑对普通鼠标右键/复制比较有效，但从工程角度看并不构成真正的数据隔离。

---

## 14. qah5 新 hooker 设计草案

目标页面：

- `https://qah5.zhihuishu.com/*`

设计前提：

- 该页已经确认存在 `role=2` 下的全页级防复制/防粘贴逻辑
- 用户额外说明该页还启用了既有“拦截上报”和“反反调试”能力
- 因此新 hooker 不能只做 DOM 解锁，还要把 **防复制、埋点/上报、反调试对抗** 放进同一启动时序里考虑

### 14.1 目标

新 hooker 的目标应收敛为 4 件事：

1. **解锁复制/右键/粘贴**
   - 覆盖 `document.onselectstart / oncontextmenu / oncopy / oncut / onpaste`
   - 同时预留对 `addEventListener` 型拦截的兼容

2. **不误伤业务 API**
   - 允许 `getQuestionInfo / saveQuestion / saveAnswer / saveComment / qaWebReportService` 继续正常工作
   - 只阻断“平台埋点/脚本检测/非业务上报”

3. **在 document-start 就安装**
   - 因为当前页面的防复制逻辑是在根组件 `created` 里安装
   - 晚于页面脚本再补救，会失去时序优势

4. **对已有反调试做最小必要对冲**
   - 至少要处理 `debugger` 注入、`eval/Function/setTimeout/setInterval` 动态拼接代码
   - 以及可能存在的开发者快捷键拦截

### 14.2 非目标

第一版设计里，不建议把目标扩成下面这些：

- 不做自动答题/自动业务操作
- 不改问答业务数据
- 不接管提问/回答/评论流程
- 不主动伪造用户业务请求
- 不做过度宽泛的 `*.zhihuishu.com/*` 全站拦截

也就是说，这个 hooker 第一阶段应是 **“页面解锁 + 反对抗护栏”**，不是通用平台脚本。

### 14.3 三种方案

#### 方案 A：后置 DOM 解锁器

思路：

- `document-end` 或页面 mounted 后，再把 `document.oncopy` 等清空
- 必要时轮询重置

优点：

- 实现最短
- 侵入性最低

缺点：

- 时序最差
- 页面如果在更早阶段已安装检测/埋点/拦截，就会先吃一轮副作用
- 对后续重新赋值、懒加载 chunk、路由切换都不稳

结论：

- **不推荐作为主方案**

#### 方案 B：独立的 qah5 专用 hooker（推荐）

思路：

- 新建一个只匹配 `qah5.zhihuishu.com` 的独立 runtime
- 复用 `auto-wisdom-tree.js` 的成熟模式：
  - `document-start`
  - `WRAP_MARK`
  - `fetch/xhr/jquery/sendBeacon` 分层 patch
  - `Function/eval/timer` 反调试代理
- 但业务目标只保留 qah5 所需的最小集合

优点：

- 与现有 study/exam 脚本隔离，回归风险最低
- 可以按 qah5 的页面特征做更精确的规则
- 未来如果要继续加 qah5 专属策略，不会污染学习/考试逻辑

缺点：

- 与 `auto-wisdom-tree.js` 会有一部分重复抽象
- 后续若要统一 UI/配置，需要再做抽取

结论：

- **我推荐这个方案作为第一落地版本**

#### 方案 C：把 qah5 host 模式并入 `auto-wisdom-tree.js`

思路：

- 在现有脚本里新增 `QAH5_HOST_RE`
- 把 qah5 hook 点作为一个新的 host-mode 分支并入现有 runtime

优点：

- 复用现成 UI、配置、日志、网络 patch、反调试能力
- 只有一个脚本入口，运维简单

缺点：

- `auto-wisdom-tree.js` 已经很大，再加 qah5 会进一步耦合
- 任何 qah5 回归都可能波及 study/exam 逻辑
- 设计边界会从“课程树脚本”逐渐变成“智慧树全站脚本”

结论：

- **适合第二阶段统一化，不适合第一阶段直接并入**

### 14.4 推荐方案：B（独立 qah5 专用 hooker）

推荐原因只有一句话：

- **qah5 的目标是“页面解锁与反对抗”，不是“学习/考试自动化”，直接并入 `auto-wisdom-tree.js` 会把两个不同问题域绑死。**

因此第一阶段应：

1. 先做一个 **独立 host、独立配置、独立规则集** 的 qah5 hooker
2. 内部实现尽量复用 `auto-wisdom-tree.js` 的结构思路
3. 等稳定后，再决定要不要抽公共 patch 基础层

### 14.5 推荐方案的内部结构

#### 第一层：preboot layer（document-start 即装）

职责：

- 安装反调试代理
- 安装 copy/paste 解锁代理
- 安装网络/埋点拦截代理

这一层必须最早运行，因为：

- qah5 的防复制逻辑是在页面根组件 `created` 里装的
- 如果我们不抢在它前面，就只能事后补锅

#### 第二层：copy-unlock layer

建议做 3 级 hook：

1. **属性级**
   - hook `Document.prototype` / 当前 `document`
   - 保护这些属性：
     - `onselectstart`
     - `oncontextmenu`
     - `oncopy`
     - `oncut`
     - `onpaste`

2. **监听器级**
   - hook `EventTarget.prototype.addEventListener/removeEventListener`
   - 重点观察：
     - `copy`
     - `cut`
     - `paste`
     - `contextmenu`
     - `selectstart`
     - `keydown/keypress/keyup`

3. **再保险级**
   - 在路由切换、懒加载 chunk 注入后，主动再做一次：
     - handler 清零
     - 可疑监听器屏蔽

可疑监听器的判定建议使用源码特征：

- `returnValue=false`
- `preventDefault`
- `clipboard`
- `contextmenu`
- `selectstart`
- `copy`
- `paste`

这样可以尽量只杀“阻断型监听器”，不误伤普通输入逻辑。

#### 第三层：anti-anti-debug layer

建议从 `auto-wisdom-tree.js` 里复用最小必要集：

- `Function` proxy：剥离动态构造代码中的 `debugger`
- `eval` proxy：剥离 `debugger`
- `setTimeout/setInterval` proxy：剥离 `debugger`
- 开发者快捷键保护：
  - `F12`
  - `Ctrl+Shift+I/J/C`
  - `Ctrl+U`

这里不建议一上来做更重的 console / getter / stack trap 对抗，先保留最小集，避免误伤。

#### 第四层：network-report layer

这一层的原则不是“全拦”，而是“只拦非业务上报”。

建议默认 block 目标：

- `buried-point.zhihuishu.com/gateway/t/buriedPoint/common`
- `collector*.zhihuishu.com/*`
- `sendBeacon` 型埋点
- `MonitorUtil.*report/log/sendLog`（若实际页面存在）

明确 allow 的业务 API：

- `creditqa-api.zhihuishu.com/.../qa/*`
- `.../forbid/*`
- `.../getQuestionInfo`
- `.../saveQuestion`
- `.../saveAnswer`
- `.../saveComment`
- `.../qaWebReportService`

这里要特别注意：

- **`qaWebReportService` 是用户举报业务，不是平台埋点，不能误拦**

#### 第五层：app-aware observation layer

建议加一个轻量观察层，而不是直接改业务：

- 观察 `#app` 挂载
- 观察 Vue 路由切换
- 记录当前 `role`
- 记录 anti-copy 是否被页面再次试图重装
- 记录哪些 URL 命中了 telemetry block

第一版只做观测与日志，不做业务篡改。

### 14.6 URL / 规则设计

建议把规则分成 4 类，而不是写死一堆 if/else：

1. `QAH5_HOST_RE`
   - 只匹配 `qah5.zhihuishu.com`

2. `COPY_GUARD_EVENTS`
   - `copy/cut/paste/contextmenu/selectstart`

3. `TELEMETRY_RULES`
   - `buried-point`
   - `collector`
   - `sendBeacon`
   - `MonitorUtil`

4. `SAFE_BUSINESS_RULES`
   - `creditqa-api.../qa/`
   - `.../forbid/`
   - `.../message/`

这样实现时就能做到：

- host 判断独立
- 事件过滤独立
- 上报拦截独立
- 业务白名单独立

### 14.7 推荐的配置项

建议只保留 4 个开关：

- `unlockCopyGuard`：默认开
- `blockTelemetry`：默认开
- `antiAntiDebug`：默认开
- `debugLogs`：默认关

第一版不建议上太多开关，否则验证成本会上升。

### 14.8 后续实现时的验证清单

如果进入实现，验证应至少覆盖：

1. `role=2` 首页：
   - 能选中文本
   - 能右键
   - 能复制
   - 能往输入框粘贴

2. 从首页跳详情：
   - 详情页同样解锁

3. 评论 / 回答 / 提问：
   - 输入框不被 paste 拦截
   - 提交仍正常走业务 API

4. 网络：
   - 埋点 URL 被拦
   - 业务 URL 不被误拦

5. 反调试：
   - 页面存在 `debugger` 注入时不应卡死
   - DevTools 热键不应被页面脚本吃掉

6. 稳定性：
   - 懒加载 chunk、路由切换后 copy guard 不应反复死灰复燃

### 14.9 当前设计结论

如果下一步进入实现，我建议：

- **做一个独立的 `qah5` 专用 hooker**
- **document-start 安装**
- **先做“copy-unlock + telemetry block + minimal anti-anti-debug”三件套**
- **不碰问答业务逻辑本身**

---

## 15. 最终结论

`codebase-qa` 不是单纯的问答页面，而是一套完整的课程问答前端壳，核心由 **启动装配、动态密钥加密、请求鉴权、风控补偿、审核运营能力** 五部分组成。

对当前已提供的源码，最重要的全链路可以归纳为：

1. **App 启动**：识别环境 → 拉用户 → 远程加载 6.js → 拿 `dynStr/dynOnlineStr`
2. **请求出站**：`yxyz` 生成 `secretStr` → axios 注入 Authorization → 发往 `creditqa-api` / `onlineservice-api`
3. **风控拦截**：
   - 422 直接异常弹窗
   - 1010 走滑块验证再重放
4. **首页业务**：课程 banner + 问答列表 + 提问/话题 + 围观 + 首次引导 + 我的参与 + 未读消息
5. **详情业务**：问题详情 + 全部/我的回答 + 评论流 + 点赞 + 围观 + 举报/删除/精华/禁言

如果后续要继续深挖：

- 第一优先级应补齐缺失 chunk `3/4/5/6/7/8/9/10/11`
- 第二优先级应单独还原远程 `6.js`，把 `labc2 / yxyz` 的真实算法链补出来
