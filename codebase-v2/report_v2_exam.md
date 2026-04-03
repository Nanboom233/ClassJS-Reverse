# v2-source/exam 深度分析报告

## 目标

彻底研究 `codebase-v2/v2-source/exam` 下的新考试前端源码，明确：

1. 这套源码的真实应用结构。
2. 作业/考试答题链路、恢复链路、暂存链路、提交流程。
3. 验证码、异常检测、锁定、日志上报的实际接入点。
4. 后续自动化脚本应该接哪里，绝对不该再接哪里。

本轮分析对象：

- `codebase-v2/v2-source/exam/stuExamWeb.js`
- `codebase-v2/v2-source/exam/1.js`

## 结论摘要

### 1. 这不是“轻量测试页”，而是一套完整的 Vue 2 考试应用

- `stuExamWeb.js` 是应用壳，负责 `Vuex + Router + axios + service + captcha + monitor`。
- `1.js` 不是“整个考试系统”，而是 `/webExamList/dohomework/...` 这条作业答题页的懒加载 chunk。
- `/webExamList/doexamination/...` 走的是另一条 chunk，不在当前 `exam/` 目录内，不能把 `1.js` 直接当成全部考试页逻辑。

关键位置：

- `stuExamWeb.js:13` Vuex store
- `stuExamWeb.js:780-863` router
- `stuExamWeb.js:1291-1298` 根 Vue 实例挂载
- `stuExamWeb.js:817-829` `dohomework` 路由
- `stuExamWeb.js:830-839` `doexamination` 路由

### 2. 自动化正确接入点是“服务层 + 父子组件保存链”，不是 DOM 扫题

作业页真实控制流是：

1. 父页面通过 `this.$refs.answerData[currentIndex].saveData(...)` 驱动当前题保存。
2. 当前题型组件内部组装答案、触发 `saveStudentAnswer`、清理或保留本地缓冲。
3. 子组件通过 `saveSuccess` 事件回到父页面。
4. 父页面 `saveSuccessChild(...)` 再决定：
   - 切到上一题/下一题
   - 暂存
   - 提交
   - 仅提示“保存成功”

关键位置：

- `1.js:32987-32995` `switchQuestion(...)`
- `1.js:32996-33002` `beforeDirectSubmit()` / `beforeTemporarySave()`
- `1.js:33004-33019` `saveSuccessChild(...)`

### 3. 当前源码已经把“恢复已作答状态”做成了服务端优先

- `openHomework()` 拉试卷结构。
- `hasAnswerData()` 先查 `hasAnswer(...)`。
- 若已作答，再调 `getStuAnswerInfoNew(...)`。
- 之后逐个调用子组件 `getAnswerData(rt)` 做题目级回灌。

这意味着：

- 恢复链不是靠 DOM 勾选，而是靠题目数据对象回灌。
- 本地 `stuExamAnswer{stuExamId}` 更像“写缓冲/失败补偿队列”，不是首选恢复源。

关键位置：

- `1.js:32749-32817` `openHomework()`
- `1.js:32818-32847` `hasAnswerData()`
- `1.js:32858-32863` `recursionQuestionId()`
- `1.js:32849-32857` `mergeData()` 存在，但当前链路里没有看到主流程显式使用

### 4. 验证码 / 锁定 / 异常检测链比旧 runtime 假设更重

- 请求层 422 会触发 `window.zhsMonitor.open(...)`。
- 保存答案阶段就可能进入：
  - `-12`：易盾/YuDun 弹窗
  - `-10`：验证码
  - `-20`：禁答/锁定
- 页面存在：
  - `checkIsLock()`
  - `checkoutNotTrustScript()`
  - `collectLog(...)`
  - 复制/右键/选中限制
  - `hijackAllEls()` 改写所有元素的 `__vue__`

所以后续自动化若继续依赖：

- DOM `__vue__` 爬取
- 晚期重写 XHR/fetch/native API
- 只靠按钮点击 + DOM 状态机

都很脆弱。

## 一、应用壳：`stuExamWeb.js`

### 1. Store 结构

`stuExamWeb.js:13-101`

Store 至少持有以下关键状态：

- 用户身份：`userName`、`userHeader`、`uuid`
- 页面指针：`mainThat`、`doHomeWorkObj`、`doExaminationObj`
- 答题/页面状态：`answerArr`、`homeWorkFlag`、`courseName`
- 运行时键：`key`、`examKey`
- 跨页对象：`setGoErweimaObj`
- 全局能力：`globalProperty`

其中：

- `setGoErweimaObj` 会写入 `sessionStorage`：`stuExamWeb.js:52-54`
- `getKey()` / `getExamKey()` 依赖外部 `labc(3)` / `labc(5)`：`stuExamWeb.js:88-98`

### 2. Router 范围

`stuExamWeb.js:780-863`

已确认核心路由：

- `/webExamList`
- `/webExamList/dohomework/:recruitId/:stuExamId/:examId/:courseId/:schoolId/:meetCourseType`
- `/webExamList/doexamination/:recruitId/:stuExamId/:examId/:courseId/:schoolId`
- `/webExamList/computerExamination/:recruitId/:stuExamId/:examId/:courseId/:schoolId/:uuid`
- `/webExamList/checkHomework/:recruitId/:stuExamId/:examId/:courseId/:schoolId`

补充结论：

- `dohomework` 对应 `n.e(1)`，即当前研究到的 `1.js`
- `doexamination` 对应 `n.e(5)`，不在当前 `exam/` 目录中
- 不能把 `1.js` 的结论直接外推到真正考试页 chunk

### 3. 根应用启动

`stuExamWeb.js:1291-1346`

启动过程：

1. 创建根 Vue 实例，注入 router/store。
2. 根 `App` 组件在 `created` 阶段强制 HTTPS。
3. `mounted` 时先后探测：
   - `studentExam` 登录态
   - `taurusExam` 登录态
4. 登录成功后把用户信息写入 store。
5. 只有登录成功，才稳定进入业务路由。

这意味着：

- 业务页面不是独立裸页，存在应用壳前置登录检查。
- 自动化若跳过壳层假设“页面已就绪”，容易误判时机。

### 4. axios 与请求打包

`stuExamWeb.js:183-225`

请求层关键事实：

- 全局 `withCredentials = true`
- 默认超时 15 秒
- 大多数 POST 被改成 `application/x-www-form-urlencoded`
- `getExamToken` 会额外带 `ev` 头

特殊头逻辑：

- `CASLOGC.uuid + sessionStorage.recruitId` 参与 `ev` 计算：`stuExamWeb.js:190-200`

### 5. 请求签名并不在页面局部闭包内

`stuExamWeb.js:227-292`

签名链核心依赖外部：

- `labc(...)`
- `yxyz(...)`

并且存在针对 `/doexamination` 保存答案请求的特殊补字段：

- `source: "1"`：`stuExamWeb.js:247-255`
- 判定条件：`stuExamWeb.js:734-736`

这说明：

- 直接裸调接口不是不可行，而是必须复用页面原始 transport/sign 逻辑。
- 任何把页面当作“自包含 bundle”的假设都是错误的。

### 6. 风控 / monitor / captcha 壳层能力

#### 6.1 422 响应直接进 `zhsMonitor`

`stuExamWeb.js:211-225`

- `422 + checkType=3` -> `window.zhsMonitor.open("nostudy")`
- `422 + checkType in {1,2}` -> `window.zhsMonitor.open("blacklist", ...)`

#### 6.2 易盾初始化

`stuExamWeb.js:678-710`

依赖：

- `window.initAbleYidunFallback`

会创建：

- `captchaYidun` 容器
- `instance`
- `logFn`

#### 6.3 滑块校验与锁定接口已统一暴露

`stuExamWeb.js:2552-2598`

关键接口：

- `checkIsLock`
- `getStuExceptionAction`
- `exceptionBackExamApi`
- `saveExceptionMessage`
- `getSaveAnswerLockResult`
- `validateSlideToken`
- `validateSlideTokenN`

## 二、服务层：接口族群梳理

### 1. 主要后端域名

`stuExamWeb.js:2297-2301`

- `//studentexam-api.zhihuishu.com`
- `//taurusexam-api.zhihuishu.com`

对应命名空间：

- `studentExam`
- `taurusExam`

### 2. 作业/考试核心接口

`stuExamWeb.js:2384-2451`

最关键的一组：

- `openHomework -> /student/doHomework`
- `doExam / openExam -> /student/doExam`
- `getStuAnswerInfoNew`
- `saveStudentAnswer`
- `temporarySave`
- `submit`
- `hasAnswer`

### 3. 风控 / 申诉 / 锁定 / 异常

`stuExamWeb.js:2552-2598`

- `checkIsLock`
- `getStuExceptionAction`
- `checkIsPublicCourse`
- `exceptionBackExamApi`
- `saveExceptionMessage`
- `slideVerificationIsRight`
- `getSaveAnswerLockResult`
- `validateSlideToken`

### 4. 采集 / 埋点 / AI / 配置

- `getCollector` -> `//collector.zhihuishu.com/public/jsonp/collect`：`stuExamWeb.js:2543-2545`
- `aiTrainingWeekPoint`：`stuExamWeb.js:2600-2601`
- `getBaseConfig`：`stuExamWeb.js:2603-2605`

## 三、作业答题运行时：`1.js`

## 1. 先澄清作用域

`1.js` 是 `/webExamList/dohomework/...` 对应 chunk，不是整个考试系统的总代码。

关键位置：

- `stuExamWeb.js:817-829`
- `1.js:32074-32091`

因此本文件更准确的定位是：

- 作业/平时测试答题页运行时

## 2. 页面级组件映射

`1.js:105-205`、`1.js:31917-31932`

顶层题型组件映射关系：

- `1` -> `SingleSelection`
- `2` -> `Checkbox`
- `14` -> `judge`
- `3/5/7/8` -> `Fillblanks`
- `4/6/13` -> `essayquestion`
- `9` -> `clozetest`
- `10` -> `auditorytraining`
- `11` -> `customtypes`

这些组件统一通过：

- `ref: "answerData"`
- 事件：`questionStatus`、`saveSuccess`

接回父页面。

## 3. 页面初始化链

### 3.1 created

`1.js:31997-32072`

created 阶段做的事：

- 把 `doHomeWorkPointerObj` 注入 Vuex：`1.js:32001-32005`
- 安装滚动吸顶
- 屏蔽右键、粘贴、复制、剪切、文本选中
- 启动 `checkoutNotTrustScript()`
- 启动 `freezeCopyMethod()`
- 查询是否 AI 训练课程

### 3.2 mounted

`1.js:32074-32091`

mounted 阶段：

- 从 `CASLOGC` 提取 `uuid`
- 把 `recruitId` 写入 `sessionStorage`
- 初始化 YuDun
- 调用：
  - `openHomework()`
  - `getIsPublic()`
  - `getAiAvatar()`

## 4. 打开试卷与恢复链

### 4.1 `openHomework()`

`1.js:32749-32817`

步骤：

1. 打开 loading。
2. 调 `/student/doHomework`。
3. 成功后写入：
   - `examinationArr = t.rt.examBase`
   - `endTime = t.rt.examEndTime`
4. 根据 `state` 判断是否已完成：
   - `3/4` => 已完成
5. 初始化题目状态：
   - `initialStatus(workExamParts)`
   - 计算 `newArray`（各部分题目索引边界）
6. 调：
   - `hasAnswerData(...)`
   - `getAllQuestion(...)`
7. 最后调用 `hijackAllEls()`

### 4.2 `hasAnswerData()`

`1.js:32818-32847`

步骤：

1. 先调 `hasAnswer(...)`
2. 若后端返回已作答：
   - 递归收集叶子题 `eid`
   - 调 `getStuAnswerInfoNew(...)`
   - 将服务端答案逐个灌入 `this.$refs.answerData[a].getAnswerData(e.rt)`

结论：

- 已作答恢复是“服务端答案 -> 组件回灌”。
- 不是本地 DOM 恢复。

## 5. 题目状态、切题与进度统计

### 5.1 状态初始化

`1.js:32864-32875`

- `questionStatus(e, eid)` 会更新所有题的 `flag`
- `testNum` 用于统计已答题数
- `allQuestionIdArray` 保存全量题目状态快照

### 5.2 切题

`1.js:32987-32995`

- `switchQuestion(delta, mode)` 不直接改 index
- 它先拿当前题组件：
  - `this.$refs.answerData[currentIndex].saveData(delta, mode)`

### 5.3 父页面统一收口

`1.js:33004-33019`

`saveSuccessChild(delta, mode)` 才真正决定：

- `mode = 0`：切题
- `mode = 1`：暂存
- `mode = 2`：提交
- `mode = 3`：只提示保存成功

并同步：

- `achieveCount{stuExamId}`
- `percentage`

## 四、题型保存链

## 1. 统一模式

题型组件的通用模式是：

1. 先根据交互状态拼出一条题目答案记录。
2. 合并到本地 `stuExamAnswer{stuExamId}`。
3. `saveData()` 时打 `/answer/saveStudentAnswer`。
4. 根据返回码决定：
   - 清本地缓存
   - 保留缓存
   - 发出 `captchaForAnswer`
   - 发出 `disableForAnswer`
   - 发出 `exceptionBackExam`

## 2. 多选题样本

`1.js:27248-27383`

多选题确认字段：

- `examId`
- `recruitId`
- `stuExamId`
- `eid`
- `answer`
- `schoolId`
- `deviceId`
- `examType`
- `fromType: 3`
- `dataIds: ""`
- `questionType: 2`

保存返回码语义：

- `code == -12`：YuDun 弹窗
- `status == 200 && rt.statu == 1`：保存成功，清本地缓存
- `rt.statu == -10`：`captchaForAnswer`
- `rt.statu == -20`：`disableForAnswer`

## 3. 问答/材料题样本

`1.js:27961-28092`

问答题会额外携带：

- 文本 `answer`
- 上传附件 `dataIds`
- `questionType: 3`

保存失败时同样会：

- 保留 `stuExamAnswer{stuExamId}`
- 发出 `exceptionBackExam`

## 4. 组合题/复合题不是单点直存

`1.js:27542-27553`、`1.js:27671-27682`

复合题容器逻辑：

- 遍历 `childAnswerData[*].saveData(...)`
- 用 `stack` 计数
- 所有子题保存完成后，才向上 `$emit("saveSuccess", ...)`

结论：

- 后续自动化不能只盯“当前页面一个题型组件”。
- 复合题必须走容器的聚合保存流程。

## 五、暂存与提交

## 1. 暂存

### 1.1 入口

`1.js:32410-32442`

`temporaryStorage()` 做两件事：

1. 先检查本地 `stuExamAnswer{stuExamId}`，有就先 `saveData(t)`。
2. 再调用 `temporarySave(...)`，参数只带：
   - `recruitId`
   - `examId`
   - `stuExamId`
   - `achieveCount`

### 1.2 真正暂存请求

`1.js:32447-32498`

调用 `/answer/temporarySave`。

## 2. 提交

### 2.1 入口

`1.js:32500-32618`

`submitJob()` 会先：

- 计算 `alreadyNum`
- 检查还有多少题未作答
- 若本地还有 `stuExamAnswer{stuExamId}`，再次先 flush 一次 `saveStudentAnswer`
- 然后才走 `autoSub()`

### 2.2 最终提交

`1.js:32669-32748`

`submit(e, loading)` 调 `/answer/submit`，返回语义：

- `rt.statu == 1`：提交成功但仍需后续流程
- `rt.statu == 0`：提交成功并可拿到得分
- `rt.statu == -1`：重复提交

结论：

- 直接裸调 `/answer/submit` 会绕过当前题 flush 和本地队列 flush。
- 正确提交链必须走：
  - 当前题 `saveData(...)`
  - `saveSuccessChild(..., 2)`
  - `submitJob()`
  - `autoSub()`
  - `submit(...)`

## 六、本地缓存与关键键

## 1. 本地/会话键

已确认与自动化强相关的键：

- `CASLOGC`：用户身份、uuid 等
- `DEVICE_CODE`：`deviceId`
- `setGoErweimaObj`
- `recruitId`（sessionStorage）
- `stuExamAnswer{stuExamId}`
- `achieveCount{stuExamId}`

关键位置：

- `stuExamWeb.js:52-54`
- `1.js:32082-32084`
- `1.js:27254-27255`
- `1.js:27272`
- `1.js:32424`
- `1.js:33018`

## 2. `setGoErweimaObj` 结论

这里存在不一致：

- 写入发生在 `sessionStorage`
- 但部分答题保存逻辑读取路径并不稳定

所以：

- 不建议把 `examType` 等价视作稳定本地上下文字段

## 七、异常检测 / 反脚本 / 日志上报

## 1. `hijackAllEls()`

`1.js:32179-32187`

会对所有带 `__vue__` 的元素重新定义 getter/setter。

结论：

- 依赖 DOM `__vue__` 向下抓页面实例会失效或不稳定。

## 2. `checkoutNotTrustScript()`

`1.js:32189-32203`

定时检查：

- 若 `n.i(v.n)()` 失败
- 直接弹“检测到异常脚本”
- `collectLog(window.XMLHttpRequest)`
- 最后 `window.close()`

## 3. `collectLog(...)`

`1.js:32205-32246`

会打：

- `https://collector2c.zhihuishu.com/public/jsonp/collect`

这是异常脚本检测后的采集链。

## 4. `saveLog(...)`

`1.js:33065-33078`

页面业务日志也走：

- `//collector.zhihuishu.com/public/jsonp/collect`

也就是说：

- 当前页面不只有“异常采集”
- 正常答题行为也会持续打 collector

## 5. 复制/右键/选中限制

`1.js:32018-32067`、`1.js:32170-32177`

页面主动限制：

- 右键
- 粘贴
- 复制
- 剪切
- 文本选中

并且 `selectionchange` 里会主动清空选区。

## 6. 关闭窗口是正常分支，不只是异常分支

关键位置：

- `1.js:32201-32203`
- `1.js:33053-33059`

这意味着后续 runtime 若需要维持页面控制，应考虑：

- 页面可能主动 `window.close()`

## 八、验证码 / 锁定 / 公共课限制

## 1. 保存答案阶段就可能进入验证码

题型保存返回码：

- `-12`：YuDun
- `-10`：captcha
- `-20`：disable / lock

关键位置：

- `1.js:27310-27316`
- `1.js:28032-28039`
- `1.js:28549-28558`
- `1.js:28978-28984`
- `1.js:29555-29561`

## 2. 父页面的验证码驱动

`1.js:32248-32349`

父页面有完整 YuDun 生命周期：

- `failCallBack(...)`
- `successCallBack(...)`
- `validateMessage(...)`
- `toastDialogClick(...)`

并通过：

- `validateSlideToken(...)`

继续向后端校验。

## 3. 锁定态

`1.js:32354-32362`

`checkIsLock()` 会写：

- `courseIsLock`
- `courseLockText`

而 `getCurrentTime()` 在非开放学校场景还会主动触发 `checkIsLock()`：

- `1.js:32877-32894`

## 九、自动化接入建议

## 1. 最稳定的接入面

优先级从高到低：

### A. `stuExamWeb.js` service 层

优先 hook：

- `openHomework`
- `hasAnswer`
- `getStuAnswerInfoNew`
- `saveStudentAnswer`
- `temporarySave`
- `submit`
- `checkIsLock`
- `validateSlideToken`

原因：

- 名字稳定
- 语义清晰
- 不依赖 DOM

### B. 父页面实例指针

`1.js:32001-32005`

作业页会把 `doHomeWorkPointerObj` 写入 Vuex。

这比后期 DOM 抓实例更稳，因为：

- `hijackAllEls()` 会废掉 `__vue__`

### C. 父页面保存链

最值得复用的行为链：

- 当前题 `saveData(...)`
- `saveSuccessChild(...)`
- `temporaryStorage()` / `submitJob()`

这是页面原生闭环。

## 2. 明确不建议依赖的面

### A. DOM `__vue__`

原因：

- `1.js:32179-32187` 明确改写

### B. 只按按钮点击推进

原因：

- 当前题保存不是“点一下下一题按钮”这么简单
- 它依赖子组件自身 `saveData(...)` 语义

### C. 只靠本地缓存恢复

原因：

- 页面恢复是服务端优先
- `mergeData()` 当前主链没看到实际使用

### D. `endtimeFlag`

原因：

- `1.js:32006` 读取它
- 但 router 并没有在 `dohomework` 路径里声明它
- 真正 gating 又会被服务器时间重新计算

### E. `window.location.href` 分支判断

原因：

- 某些 captcha/校验分支直接基于 pathname 判断
- 可作为观察面，不宜作为主要控制面

## 3. 后续自动化实现的正确方向

### 方向一：拿到父页面指针，复用现有父子保存链

目标：

- 不重写答题协议
- 不自己拼一个假状态机

### 方向二：以 service 层为准做观测和兜底

目标：

- 明确每一步发了哪个接口
- 对返回码做显式分支

### 方向三：把 `stuExamAnswer{stuExamId}` 视为写缓冲队列，不是最终真相

目标：

- 自动化失败时仍可补发
- 但恢复时仍以服务端答案为准

### 方向四：把 `-12/-10/-20/422/state=3/4/clickFlag=0` 都建模成显式状态

目标：

- 不再用“统一重试”掩盖不同失败原因

## 十、当前边界与未覆盖项

1. 当前目录里只有 `dohomework` 对应的 `1.js`，`doexamination` 真实 chunk 未包含在 `exam/` 目录内。
2. 当前报告已经把 `exam/` 目录本身研究透，但不能声称“整个网站所有考试页都已完全覆盖”。
3. 本轮只做源码研究，没有修改 runtime 脚本，也没有新增测试、编译或运行步骤。

## 最终判断

后续若继续做自动化，必须放弃旧思路：

- 不再把这套页面当成“轻量 DOM 测试页”
- 不再只靠“扫当前题 + 点下一题”
- 不再只靠 `A/B/C/D` 位次匹配答案

正确路线应该是：

1. 先按 `stuExamWeb.js` 的 service 层和请求打包规则理解通信。
2. 再按 `1.js` 的父子组件保存链复用页面原生流程。
3. 对验证码、锁定、collector、异常脚本检测做显式状态建模。
4. 把 `dohomework` 与 `doexamination` 明确拆开分析，不混为一谈。
