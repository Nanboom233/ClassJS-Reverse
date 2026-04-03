# v2-source/exam 自动化接入设计

## 目标

基于已完成的 `v2-source/exam` 源码研究，为 `codebase-v2/runtime/auto-wisdom-tree.js` 设计一套新的“平时测试/作业答题”接入方案。

这份文档只解决 **接入设计**，不直接改代码。

## 一、现状与错位

## 1. 当前 runtime 已有的平时测试实现

`runtime/auto-wisdom-tree.js` 当前已具备：

- 学习页自动打开平时测试：`auto-wisdom-tree.js:1859-1894`
- 平时测试页 DOM 扫描识题：`auto-wisdom-tree.js:1595-1630`
- 从 DOM 显式答案 / GM 题库取答案：`auto-wisdom-tree.js:1633-1666`
- 直接点击选项 / 填输入框：`auto-wisdom-tree.js:1668-1723`
- 通过按钮文案推进“开始/下一题”：`auto-wisdom-tree.js:1725-1855`
- 学习页里对 `chapterExamEntry`、`goToExamJudge` 做包裹：`auto-wisdom-tree.js:1045-1070`

这套实现已经不是空白，但仍是 **DOM/按钮驱动优先**。

## 2. 新源码证明出的真实页面结构

从 `v2-source/exam` 已确认：

- `stuExamWeb.js` 是 Vue 2 应用壳：store/router/axios/service/captcha/risk
- `1.js` 是 `/webExamList/dohomework/...` 的作业答题 runtime
- 父页面真实保存链是：
  - 当前题组件 `saveData(...)`
  - 父页面 `saveSuccessChild(...)`
  - 再进入切题 / 暂存 / 提交
- 页面恢复链是：
  - `openHomework()`
  - `hasAnswerData()`
  - `getStuAnswerInfoNew()`
  - 子组件 `getAnswerData(rt)`

关键位置：

- `stuExamWeb.js:817-829`
- `stuExamWeb.js:830-839`
- `1.js:32749-32847`
- `1.js:32987-33019`

## 3. 当前 runtime 与新源码的核心错位

### 3.1 把 `1.js` 当成整个考试系统

这是错的。

- `1.js` 只覆盖 `dohomework`
- `doexamination` 还有另一条 chunk

### 3.2 以 DOM 为主，以组件链为辅

这也是错位的。

新源码里更稳的控制面是：

- 父页面实例
- Vuex 指针
- service 层

### 3.3 “无答案时默认点第一项”

当前 runtime 在无显式答案、无题库命中时会回退到第一项：

- `auto-wisdom-tree.js:1653-1658`

这在新源码里风险很高，因为：

- 页面有真实保存链
- 页面有锁定/验证码/异常检测
- 乱点第一项会把错误答案真实落库

### 3.4 停在“手动交卷”

当前 runtime 到最后一题后停在：

- `已到最后一题，等待手动交卷`

但新源码已明确存在完整父页面提交链，所以后续若要支持自动交卷，必须接父页面已有闭环，而不是继续点击 DOM 提交按钮。

## 二、设计原则

## 1. 先抓页面实例，再谈自动化

新的设计要把优先级改成：

1. **页面实例 / store 指针**
2. **父页面保存链**
3. **service 层 / 网络观测**
4. **DOM 只做兜底**

## 2. 拆分 `dohomework` 与 `doexamination`

设计层面必须拆成两个 adapter：

- `HomeworkExamAdapter`
- `FormalExamAdapter`

当前只能先完整落地 `HomeworkExamAdapter`，因为 `doexamination` 对应 chunk 还没继续拆。

## 3. 答题不能再有“默认乱答”分支

答案策略必须改成：

1. 页面显式答案
2. 已验证题库
3. 组件数据层可确定的正确答案
4. 若仍无答案：**停留并标记 unresolved**

不再允许：

- 默认点第一项
- 默认填固定文本然后推进

## 4. 自动交卷只能复用原页面闭环

若后续开启自动交卷，唯一允许的路径应是：

1. 当前题 `saveData(0, 2)`
2. 父页面 `saveSuccessChild(..., 2)`
3. `submitJob()`
4. `autoSub()`
5. `submit(...)`

绝不应直接裸调 `/answer/submit`。

## 三、目标架构

## 1. 三层接入架构

### Layer A：Study Page Launcher

职责：

- 在学习页发现当前节存在 `studentExamDto`
- 记录 `studentExamId/examId/examUrl`
- 复用已有 `chapterExamEntry(...)` / `judgeLookAnswer(...)`
- 负责“打开平时测试”

这一层当前 runtime 已经基本具备，只需要补：

- 更明确区分即将打开的是 `dohomework` 还是 `doexamination`
- 补会话上下文

### Layer B：Homework Exam Runtime Adapter

职责：

- 在 `dohomework` 页捕获 root/store/page pointer
- 直接驱动父页面保存链
- 接管日志/检测/窗口关闭
- 接管最后一题自动提交流程

这是下一阶段实现主战场。

### Layer C：Network / DOM Fallback

职责：

- 观测关键接口是否真实发出
- 做 collector 黑名单兜底
- 在页面实例尚未拿到时，保留现有 DOM 识题能力作为过渡

但它不再是主控制面。

## 四、`HomeworkExamAdapter` 设计

## 1. 捕获时机

### 1.1 约束

页面会在早期做两件事：

- `checkoutNotTrustScript()` 在 `created` 里启动，并 1 秒后首次执行 `checkout()`
- `openHomework()` 完成后会执行 `hijackAllEls()`，把 DOM 上的 `__vue__` 基本废掉

关键位置：

- `1.js:32189-32203`
- `1.js:32815`
- `1.js:32179-32187`

### 1.2 设计要求

Userscript 必须在 `document-start` 安装“早期捕获器”，目标是在：

- `hijackAllEls()` 之前
- 最好在首次 `checkout()` 前

拿到以下对象之一：

1. 根 Vue 实例
2. 根 store
3. `doHomeWorkPointerObj`

## 2. 页面对象获取策略

### 首选

通过早期扫描拿到 root Vue / store，再从 store 取：

- `state.doHomeWorkObj.doHomeWorkPointerObj`

源码依据：

- `stuExamWeb.js:23`
- `stuExamWeb.js:68`
- `1.js:32001-32005`

### 次选

若 root/store 已拿到但指针未就绪，则等待：

- `openHomework()` 完成
- `doHomeWorkPointerObj` 出现

### 兜底

若上述都失败，才退回当前 DOM runtime。

## 3. PageContext 结构

建议在 runtime 内建立：

```js
{
  host: "onlineexamh5new.zhihuishu.com",
  routeName: "doHomework",
  routeParams: {
    recruitId,
    stuExamId,
    examId,
    courseId,
    schoolId,
    meetCourseType
  },
  rootVm,
  store,
  pageVm,
  capturedAt,
  captureMode: "store-pointer" | "root-vm" | "fallback-dom"
}
```

## 4. 题目驱动方式

### 4.1 不再以 DOM 作为主真相

主真相改成：

- `pageVm.examinationArr`
- `pageVm.answerData`
- `pageVm.allQuestionIdArray`
- `pageVm.currentQuestionIndex`

### 4.2 当前题读取

建议优先通过：

- `pageVm.currentQuestionIndex`
- `pageVm.$refs.answerData[currentIndex]`

读取当前题组件，而不是从 DOM 根节点再去猜题型。

### 4.3 题型行为统一入口

所有题型最终都统一暴露：

- `getAnswerData(...)`
- `saveData(...)`

所以自动化设计上应该围绕：

- 题目“如何填充本组件状态”
- 然后调用组件自身 `saveData(...)`

而不是自己额外拼一个“点击 + 下一题”协议。

## 5. 答案来源优先级

设计建议：

1. **页面显式答案**
2. **已验证题库**
3. **组件数据内可直接确认的答案**
4. **无答案则 unresolved，不推进**

当前 runtime 的这段逻辑应被替换：

- `auto-wisdom-tree.js:1653-1658`

也就是：

- 删除“默认取第一项答案”的兜底

## 6. 推进链

### 6.1 下一题

建议不再点击“下一题”按钮，而是调用：

- `pageVm.switchQuestion(1, 0)`

或更直接：

- `pageVm.$refs.answerData[currentIndex].saveData(1, 0)`

### 6.2 暂存

调用：

- `pageVm.beforeTemporarySave()`

### 6.3 提交

调用：

- `pageVm.beforeDirectSubmit()`

由页面原生逻辑继续走：

- `saveSuccessChild(..., 2)`
- `submitJob()`
- `autoSub()`
- `submit(...)`

## 五、风险控制设计

## 1. 日志与上报

考试页自身要 patch 的页面方法：

- `saveLog`
- `collectLog`
- `checkout`
- `checkoutNotTrustScript`

原因：

- 仅靠网络黑名单拦截是兜底
- 页面级方法 patch 更稳定，也能避免副作用链继续执行

但网络黑名单仍保留，用于最后兜底：

- `collector`
- `collector2c`
- `jsonp/collect`

## 2. `window.close`

页面会在：

- 异常脚本检测
- 某些完成态流程

中调用 `window.close()`。

设计上应引入可控守卫：

- 默认阻断非用户手动触发的 `window.close`
- 仅在明确完成态才允许放行或改为跳转

## 3. 验证码状态

验证码不建议在本设计阶段直接做“自动破解”。

建议先建状态机：

- `captcha_pending_yidun`
- `captcha_pending_message`
- `locked`
- `abnormal_422`
- `save_disabled`

做到：

- 能识别
- 能暂停
- 能恢复

## 4. 锁定态

只要命中：

- `courseIsLock`
- `rt.statu == -20`
- `checkIsLock() == true`

设计上应立即进入：

- `locked`

并停止自动推进。

## 六、状态机设计

建议增加统一考试状态机：

1. `bootstrapping`
2. `capturing_runtime`
3. `loading_paper`
4. `restoring_answers`
5. `ready`
6. `answering`
7. `save_pending`
8. `captcha_pending`
9. `locked`
10. `submit_pending`
11. `completed`
12. `abnormal`

核心转移：

- `bootstrapping -> capturing_runtime`
- `capturing_runtime -> loading_paper`
- `loading_paper -> restoring_answers`
- `restoring_answers -> ready`
- `ready -> answering`
- `answering -> save_pending`
- `save_pending -> ready | captcha_pending | locked | abnormal`
- `ready -> submit_pending`
- `submit_pending -> completed | abnormal`

## 七、与当前 `auto-wisdom-tree.js` 的改造映射

## 1. 保留

- 学习页自动打开平时测试
- 会话记录 `armExamSession(...)`
- GM 题库存储
- collector URL 黑名单兜底

## 2. 删除或降级

- DOM 主导识题
- 按按钮文案推进下一题
- 无答案默认第一项
- 最后一题停在手动交卷

## 3. 新增

- 早期 root/store/page pointer 捕获器
- `HomeworkExamAdapter`
- 题型组件级填充器
- 父页面提交驱动器
- 异常状态机
- `window.close` 守卫

## 八、建议实现顺序

### Phase 1

只做 runtime 捕获：

- 提前拿 root/store/pageVm
- 验证 `doHomeWorkPointerObj` 稳定可得

### Phase 2

只替换推进链：

- 从“按钮下一题”切到“父页面保存链”

### Phase 3

去掉危险回退：

- 删除默认第一项答案
- unresolved 停留

### Phase 4

接入自动交卷：

- 走 `beforeDirectSubmit()`

### Phase 5

接入页面级日志/检测 patch：

- `saveLog`
- `collectLog`
- `checkout`
- `window.close`

## 九、当前明确不做的事

1. 本设计不直接处理 `doexamination` 真考试 chunk 的具体组件逻辑。
2. 本设计不包含验证码自动破解实现。
3. 本设计不建议继续扩大 DOM 规则库。

## 十、最终建议

后续实现应以这句话为总原则：

**学习页负责“打开测试”，考试页负责“接管页面实例并复用页面原生保存链”，网络拦截只做兜底，不再做主驱动。**

这也是当前 `runtime/auto-wisdom-tree.js` 从“能跑的 DOM 方案”升级到“源码级稳定方案”的正确方向。
