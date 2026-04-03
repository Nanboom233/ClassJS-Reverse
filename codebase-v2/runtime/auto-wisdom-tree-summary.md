# auto-wisdom-tree

## 目标

在 `studyvideoh5.zhihuishu.com` 学习页内落地一份 Tampermonkey 脚本，完成：

- 自动答题
- 屏蔽异常上报 API
- 屏蔽异常检测 API
- 自动续播当前视频链路

## 产物

- 脚本：`C:\Users\Nanboom233\Desktop\Code\ob-jsjiami\codebase-v2\runtime\auto-wisdom-tree.js`
- 总结：`C:\Users\Nanboom233\Desktop\Code\ob-jsjiami\codebase-v2\runtime\auto-wisdom-tree-summary.md`

## 实现摘要

### 1. 油猴元数据

- `@run-at document-start`
- 显式声明 `@grant`
- 保留 `unsafeWindow`
- 增加 GM 存储 / 菜单 / 样式相关 grant

这样做的原因是要在页面首屏启动前就接管请求与页面方法，避免检测和上报先执行。

### 2. 异常上报拦截

脚本统一拦截以下 URL：

- `//collector.zhihuishu.com/public/collect`
- `https://collector2c.zhihuishu.com/public/collect`
- `https://collector2c.zhihuishu.com/public/jsonp/collect`
- `https://collector2c.zhihuishu.com/public/kafkaCollect`

拦截面：

- `fetch`
- `XMLHttpRequest`
- `$.ajax`
- `navigator.sendBeacon`
- 页面方法级补丁：`secondKafkaCollect`、`fetchLogData`

### 3. 异常检测拦截

脚本短路或补丁以下点：

- `/cheat/exceptionActionDetail`
- `/cheat/agreeExceptionActionDetail`
- `queryIsLimitFlow`
- `notTrustScript`
- `collectLog`
- `checkoutNotTrustScript`
- `checkout`
- `aberrantFun`
- `chapterExamEntry`
- `goToExamJudge`
- `hijackAllEls`
- 考试页 `collectLog`
- 考试页 `saveLog`
- `window.OCS = true`

### 4. 自动答题

当前脚本已经具备两条自动答题链：视频弹题链 + 平时测试链。

#### 4.1 视频弹题

通过扫描学习页 Vue 实例，直接接管已有页面方法：

- `popupAnswer`
- `testDotClick`
- `topicClickQot`
- `closeTest`

题组里已有正确答案字段，脚本会：

1. 等待题组进入 `topicInfo.lessonTestQuestionUseInterfaceDtos`
2. 读取题目选项中的正确答案
3. **每题固定延迟 5 秒** 后再调用原页面保存逻辑提交答案
4. 所有题目完成后自动关闭弹窗

#### 4.2 平时测试

脚本已额外覆盖以下平时测试域名：

- `onlineexamh5new.zhihuishu.com`
- `studentexambaseh5.zhihuishu.com`
- `exam.zhihuishu.com`

当前实现包含：

1. 学习页在当前节**记录进度完成后**，按配置自动打开当前节平时测试
2. 菜单新增 `自动打开平时测试` 开关，对应存储键 `awt:autoOpenRegularExam`
3. 考试页启动后会优先捕获 `rootVm / store / doHomeWorkPointerObj`，尽量在 `hijackAllEls()` 前拿到 `pageVm`
4. **中途打开脚本也会直接恢复自动答题**：只要当前测试页已经有题目，脚本会立刻切回自动答题模式
5. 当前题仍会解析题干、选项、显式答案和文本输入框，但**主推进链已经切到父页面 `switchQuestion(1, 0)`**
6. DOM “下一题”按钮现在只作为兜底；优先走页面原生 `saveData -> saveSuccessChild` 链
7. 命中显式答案或本地 GM 题库后才会自动作答，选项按**内容**匹配，不再默认点第一项
8. 当前题如果**没有命中答案**，会直接走“快速跳题”分支，自动跳到下一题，并提示：`当前平时测试题未命中答案，已自动跳过`
9. 这个“无答案跳过”分支**不受 5 秒答题节流限制**，只保留很短的切题防抖，直到一路跳完可跳题目
10. 命中答案的正常作答链仍保持：**每题固定延迟 5 秒** 后再自动作答并进入下一题
11. 到最后一题后**仍停在手动交卷态**，页面状态提示：`已到最后一题，等待手动交卷`
12. 新增 document-start 级别的考试页定时器防护：会直接识别 `created -> checkoutNotTrustScript -> checkout` 注册进去的旧检测回调，并把它替换成空回调，避免“还没抓到 pageVm 就先弹异常并强关窗口”
13. 额外给考试页补了两层兜底：一层短路 `检测到异常脚本` 的 `$alert`，一层只在检测链上下文中拦截 `window.close()`，不去影响正常交卷后的关闭行为

说明：

- 当前阶段“平时测试”**不会自动交卷/自动提交试卷**
- 自动推进优先走父页面保存链；只有在 `pageVm` 未拿到时才退回“开始答题 / 下一题”类 DOM 按钮
- “无答案跳过”只跳题，不自动交卷；如果最后一题也无答案，当前阶段仍停在手动交卷
- 自动推进依旧**不覆盖**“提交答案 / 交卷 / 保存并提交”

### 5. 自动续播

脚本会持续：

- 静音
- 维持 `1x`
- 自动恢复播放
- **只有记录进度确认完成**后才自动 `videoNext()`
- 如果当前视频已完成，会优先在目录里查找**列表中第一个未完成视频**并直接跳转
- 即使当前视频只是“页面记录已完成”、还没有再次自然播完，也会直接跳到这个全列表自上而下找到的未完成目标
- 如果视频自然播完，但记录进度仍未完成，则自动跳回开头重试

当前实现里，“允许下一集”的条件不再直接依赖 `video.ended`，而是优先看页面记录状态：

- `currentLesson.isStudiedLesson === 1`
- 或当前播放条目已经出现完成图标

如果只是播放器播完、但页面记录还没完成，就会：

1. 记录一条 `WARN` 日志
2. 自动 `seek(0)` / `currentTime = 0`
3. 重新播放当前视频
4. 在界面状态中提示：`进度未完成，重播当前视频`

如果当前视频已经达到完成条件，则会：

1. 扫描 `videoList -> videoLessons -> videoSmallLessons`
2. 从**整个列表顶部开始**跳过已完成条目
3. 找到列表里第一个未完成视频
4. 页面初始化到一个已完成视频时，也会立刻走这条查找链，不再等播放器自然播完
5. 优先调用页面原生 `videoClick(...)` 直接切过去
6. 对同一个 `source -> target` 跳转增加了短时防抖，避免切集状态未落稳时重复触发
7. 只有在找不到未完成目标且当前视频已经自然播完时，才退回原页面的 `videoNext()`
8. 当前视频 ID 一旦变化，就会重置“重播当前视频”的状态，避免上一集的结束态误伤下一集
9. 对“已请求切集”和“刚切到新视频”都增加了短冷却，避免旧播放器的 `ended/currentTime` 残留值把新视频误判成需要回到开头

### 5.1 后台标签页不同步调试

用户指出“方向根本有误”后，这一轮先**回退了直接补偿进度**的思路，改成先采证定位根因。

源码核对结论：

- `stuStudy.js` 里真正累计进度的是 `totalStudyTime / totalTimeFinish / playTimes`
- 它依赖 `startTotalTimer()` 内的定时器周期累加
- 后台标签页时，这类定时器容易被浏览器拖慢或冻结
- 更关键的是：`totalStudyTime` 不是简单等于 `video.currentTime`，它是**累计学习时长**；真正该对齐的是“播放器实际前进了多少秒”与“页面累计字段实际增长了多少秒”的**增量差**

当前脚本新增的 debug 抓手：

1. 页面切后台 / 回前台时记录快照：
   - `document.hidden`
   - `visibilityState`
   - `video.currentTime`
   - `paused / ended / playbackRate`
   - `totalStudyTime / totalTimeFinish / playTimes`
   - `watchPointPost`
   - `isStudiedLesson / percentage / hasFinishIcon`

2. `runtimeTick` 定期输出趋势快照，用来确认：
   - 视频时间是否在涨
   - 页面累计字段是否同步增长
   - 后台回来后哪些值没有变化

在把根因钉死后，这一轮追加了一个只在脚本侧生效的补偿层：

1. 每次 `runtimeTick` 记录：
   - 当前 `video.currentTime`
   - 当前 `vm.totalStudyTime`
   - 上一次观测时这两个值分别是多少
2. 如果发现“真实播放增量”明显大于“页面累计增量”，就只补这段差值：
   - `totalStudyTime += lagDelta`
   - `totalTimeFinish += lagDelta`
   - `playTimes += lagDelta`
   - 同步补 `watchPointPost`
3. 补偿后立即重跑页面原生 `computeProgree()`
4. 如果视频已经自然播完，则再做一次**最终完成态刷新**：
   - 用真实播放百分比刷新当前节的 `percentage`
   - 必要时直接把 `isStudiedLesson` 提升为完成
   - 触发一次最终 `saveDdsjkTimeInWhileFn(...)`

这样做的原因是：

- 不去改页面核心 `startTotalTimer()` / `clearTimer()` 本身，避免再次破坏原始 `this` / 定时器语义
- 不再把“后台不同步”误判成“必须无限重播”
- 修复点直接对准根因：**浏览器节流掉的是定时器累计，不是播放器真实播放**

额外说明：

- 本轮顺手修复了一个会直接拖死页面的 bug：之前给 Vue 实例方法加 debug 包装时，没有保留原本的绑定语义。
- 这些方法后续会被 `setInterval(this.xxx, ...)` 直接拿去跑；一旦包装后 `this` 丢失，就可能让学习页计时链甚至页面加载本身一起失真。
- 当前脚本已统一通过带 `bind(vm)` 的包装方式保留方法上下文。

### 6. 浏览器日志

已补结构化浏览器日志，直接输出到控制台，带颜色和层级：

- `DEBUG`
- `INFO`
- `SUCCESS`
- `WARN`
- `ERROR`

当前重点日志域：

- `bootstrap`
- `config`
- `gm`
- `network`
- `vm`
- `answer`
- `player`
- `ui`

这样在浏览器里能直接看见：

- 哪个拦截器已经安装
- 哪个请求被拦截
- 哪一道题被自动提交
- 何时自动切到下一节
- 哪个配置被切换

本轮又把**控制台日志**和**页面日志**彻底分层：

- 控制台继续保留全量英文日志、payload 和 `DEBUG`
- 页面面板不再显示 `DEBUG`
- 页面面板只保留中文、用户可读的操作提示
- 页面日志里的 URL 会被压成短摘要，不再把原始 payload 整段摊给用户
- 已移除页面侧“已绕过异常脚本检测”提示
- 页面侧已隐藏前后台切换快照这类调试 spam 提示

### 6.1 状态栏进度

页面状态栏现在会持续显示两类进度：

- 当前视频：`当前播放时间 / 总时长`，并同时显示播放进度与记录进度
- 总课程进度：`已完成节数 / 总节数`，以及按各节 `percentage` 聚合后的整体百分比

这样做的原因是：

- 用户不需要打开控制台，也能直观看到脚本当前在跑什么
- 能区分“视频播放器已经在播”与“页面记录进度是否真的在涨”
- 当课程进度不同步时，状态栏能直接辅助判断问题是在单节还是全课程层面

### 7. 反反调试 / F12

已参考 `runtime/zhihuishu-old-v2.js`，把核心反反调试能力并入当前脚本，且做成可开关：

- `Function` 代理：移除动态构造代码里的 `debugger`
- `Function.prototype.constructor` 数据属性回指代理后的 `Function`，补上 `fn.constructor("debugger")` 这类调用链
- `eval` 代理：移除动态执行代码里的 `debugger`
- `setTimeout` / `setInterval` 代理：移除字符串形式定时器里的 `debugger`
- 上面这三层“无限 `debugger` 绕过模块”已恢复到**启动期安装**，不再等到学习页运行后才装
- 通过包装页面的 `addEventListener/removeEventListener` 与常见 `onkeydown/onkeypress/onkeyup` 赋值，直接让页面收不到以下快捷键，而不是由脚本自己吞掉事件
  - `F12`
  - `Ctrl+Shift+I`
  - `Ctrl+Shift+J`
  - `Ctrl+Shift+C`
  - `Ctrl+U`

说明：

- 这层能力的目标是“反反调试”，不是单纯屏蔽页面跳转。
- 这里修正了一个方向性错误：用户要的是**绕过页面对 F12/DevTools 的拦截**，不是由脚本自己去拦截浏览器默认 F12。
- 本轮恢复了 `Function.prototype.constructor`，但不是旧版那种 getter 劫持，而是更保守的**数据属性回指代理函数**，只补齐 `constructor -> Function` 这条缺口。
- 所以本轮没有把旧脚本里的 `window.open / location / beforeunload` 全量搬进来，只落了与 DevTools/F12 最直接相关的部分。
- 菜单中新增了 `反反调试/F12` 开关。

### 7.1 页面加载卡死修复

用户继续反馈“脚本仍然直接卡死页面加载”后，这一轮重新回到静态启动链排查，最后把根因收敛到**反反调试安装时机和侵入面过大**。

本轮落地的修复点：

- 保留 `document-start` 的轻量能力：
  - 页面键盘监听包装，用来绕过 DevTools/F12 热键拦截
  - `fetch / XHR / sendBeacon` 请求接管
- 把真正的 `debugger` 清洗链保留在启动期安装，避免页面在首屏阶段就缓存到原始 `Function`
- 把 `Function.prototype.constructor` 改成**数据属性回指代理**，不再使用高风险 getter 劫持

后续又根据用户反馈再次调整为：

- **无限 `debugger` 绕过模块恢复到启动期安装**
- 恢复 `Function.prototype.constructor`，但仍然**不恢复**旧版全局 getter 改写

这样改的原因：

- 学习页源码里有大量依赖 `constructor` / `Function("return this")()` / 各类构造器判断的初始化逻辑。
- 之前那层 `Function.prototype.constructor` getter 劫持会把**页面里所有函数对象**都变成访问器路径，风险面太大。
- 这类访问器式全局原型改写即使不是语法错误，也很容易让页面初始化链表现成“白屏 / 卡加载 / 不继续渲染”。
- 这次改成普通 `value: FunctionProxy` 后，侵入面比 getter 小，但仍然能覆盖用户实际反馈的 `(function anonymous(){ debugger })` 这类动态构造路径。

为了便于继续定位，本轮还顺手做了两处收敛：

- `runtimeTick` 在 `document.readyState === "loading"` 时直接跳过，避免加载期反复扫 DOM。
- `stripDebuggerStatements` 仍保留代码清洗能力，但不再输出页面侧刷屏提示。

### 7.2 `cheat` 请求来源与源头规避

重新核对源码后，当前 `cheat` 相关请求的主要发送来源是：

- `stuStudy.js created()` 启动后，`getqueryCourse()` 成功分支里会主动调用 `aberrantFun()`
- `aberrantFun()` 内部会发 `/cheat/exceptionActionDetail`
- `aberrantCloseBtn()` 会发 `/cheat/agreeExceptionActionDetail`
- `chapterExamEntry()` / `goToExamJudge()` 会发 `queryStudentIsLimitFlow`

这一轮的处理原则改成：

- **优先源头规避**
  - 保留并提前安装 `vm.aberrantFun` 的实例补丁
  - 新增 `vm.aberrantCloseBtn` 的实例补丁
  - 保留 `chapterExamEntry` / `goToExamJudge` 的入口短路
- **网络层只做兜底**
  - `fetch / XHR / $.ajax / sendBeacon` 仍保留黑名单拦截
  - 相关日志也改成 `fallback blocked`，明确这只是漏网兜底，不是主策略

为尽量抢在页面首次调用这些方法之前安装补丁，本轮新增了一个**早期 vm 探针**：

- 在 `document-start` 阶段启动轻量轮询
- 一旦找到学习页 Vue 实例，就立即安装检测相关方法补丁
- 这样可以缩短 `created()` 到 `runtimeTick()` 之间的空窗期

## 验证

### 编译

这里没有独立构建系统，本轮把 `node --check` 作为 JS 语法编译校验：

```powershell
node --check C:\Users\Nanboom233\Desktop\Code\ob-jsjiami\codebase-v2\runtime\auto-wisdom-tree.js
node --check C:\Users\Nanboom233\Desktop\Code\ob-jsjiami\codebase-v2\runtime\test-auto-wisdom-tree.js
```

### 运行

本轮保留并持续使用以下三个文件：

- `auto-wisdom-tree.js`
- `test-auto-wisdom-tree.js`
- `auto-wisdom-tree-summary.md`

测试脚本当前覆盖：

1. userscript 关键元数据、拦截面、反反调试安装点
2. 续播链、进度同步链、页面日志裁剪逻辑
   - 当前视频完成后，从整个列表自上而下找第一个未完成视频
3. 平时测试能力：
   - 自动打开平时测试开关
   - 中途打开脚本也能直接恢复自动答题
   - 每题固定延迟 5 秒
   - 仅自动进入下一题、不自动交卷
   - 页面侧隐藏异常检测与快照 spam 提示
4. `codebase-v2/v2-source` 混淆产物兼容性字符串校验

本轮实际执行命令如下：

```powershell
node --check C:\Users\Nanboom233\Desktop\Code\ob-jsjiami\codebase-v2\runtime\auto-wisdom-tree.js
node --check C:\Users\Nanboom233\Desktop\Code\ob-jsjiami\codebase-v2\runtime\test-auto-wisdom-tree.js
node C:\Users\Nanboom233\Desktop\Code\ob-jsjiami\codebase-v2\runtime\test-auto-wisdom-tree.js
```

## 参考

- Tampermonkey 官方文档：`https://www.tampermonkey.net/documentation.php`
- Tampermonkey 更新日志：`https://www.tampermonkey.net/changelog.php?locale=en&more=true&show=mfdh`

## 备注

- `queryUserRecruitIdLastVideoId` 已确认是续播定位链，不在默认拦截名单内。
- 本轮所有新增文件都只写在 `codebase-v2/runtime`。
- `test-auto-wisdom-tree.js` 当前用于烟测、混淆产物兼容性校验、反反调试能力校验，以及平时测试链路回归校验。
