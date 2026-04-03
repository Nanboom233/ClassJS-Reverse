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
- `window.OCS = true`

### 4. 自动答题

通过扫描学习页 Vue 实例，直接接管已有页面方法：

- `popupAnswer`
- `testDotClick`
- `topicClickQot`
- `closeTest`

题组里已有正确答案字段，脚本会：

1. 等待题组进入 `topicInfo.lessonTestQuestionUseInterfaceDtos`
2. 读取题目选项中的正确答案
3. 自动调用原页面保存逻辑提交答案
4. 所有题目完成后自动关闭弹窗

### 5. 自动续播

脚本会持续：

- 静音
- 维持 `1x`
- 自动恢复播放
- **只有记录进度确认完成**后才自动 `videoNext()`
- 如果当前视频已完成，会优先在目录里查找**下一个未完成视频**并直接跳转
- 即使当前视频只是“页面记录已完成”、还没有再次自然播完，也会直接跳到后续未完成视频
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
2. 跳过已完成条目
3. 找到当前条目之后的第一个未完成视频
4. 页面初始化到一个已完成视频时，也会立刻走这条查找链，不再等播放器自然播完
5. 优先调用页面原生 `videoClick(...)` 直接切过去
6. 对同一个 `source -> target` 跳转增加了短时防抖，避免切集状态未落稳时重复触发
7. 只有在找不到未完成目标且当前视频已经自然播完时，才退回原页面的 `videoNext()`

### 5.1 后台标签页不同步调试

用户指出“方向根本有误”后，这一轮先**回退了直接补偿进度**的思路，改成先采证定位根因。

源码核对结论：

- `stuStudy.js` 里真正累计进度的是 `totalStudyTime / totalTimeFinish / playTimes`
- 它依赖 `startTotalTimer()` 内的定时器周期累加
- 后台标签页时，这类定时器容易被浏览器拖慢或冻结

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

这样做的原因是：不再碰页面核心计时方法本身，避免再次破坏原始 `this` / 定时器语义。

这轮目标不是直接“猜一个修复”，而是先把**不同步的根本原因**钉死。

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
- `eval` 代理：移除动态执行代码里的 `debugger`
- `setTimeout` / `setInterval` 代理：移除字符串形式定时器里的 `debugger`
- 上面这三层“无限 `debugger` 绕过模块”已恢复到**启动期安装**，不再等到学习页运行后才装
- `keydown` 捕获：只在捕获阶段切断页面对以下快捷键的监听传播，**不调用 `preventDefault`**，保留浏览器默认行为
  - `F12`
  - `Ctrl+Shift+I`
  - `Ctrl+Shift+J`
  - `Ctrl+Shift+C`
  - `Ctrl+U`

说明：

- 这层能力的目标是“反反调试”，不是单纯屏蔽页面跳转。
- 这里修正了一个方向性错误：用户要的是**绕过页面对 F12/DevTools 的拦截**，不是由脚本自己去拦截浏览器默认 F12。
- 同时保留了上一轮确认过的安全边界：不再改写 `Function.prototype.constructor`，避免为绕过 `debugger` 再次把页面初始化链打坏。
- 所以本轮没有把旧脚本里的 `window.open / location / beforeunload` 全量搬进来，只落了与 DevTools/F12 最直接相关的部分。
- 菜单中新增了 `反反调试/F12` 开关。

### 7.1 页面加载卡死修复

用户继续反馈“脚本仍然直接卡死页面加载”后，这一轮重新回到静态启动链排查，最后把根因收敛到**反反调试安装时机和侵入面过大**。

本轮落地的修复点：

- 保留 `document-start` 的轻量能力：
  - `keydown` DevTools/F12 快捷键拦截
  - `fetch / XHR / sendBeacon` 请求接管
- 把重型反调试能力延后到**已经拿到学习页 Vue 实例**之后再安装，而不是在 `DOMContentLoaded` 阶段直接全局改写。
- 删除对 `Function.prototype.constructor` 的改写。

后续又根据用户反馈再次调整为：

- **无限 `debugger` 绕过模块恢复到启动期安装**
- 但仍然**不恢复** `Function.prototype.constructor` 的全局 getter 改写

这样改的原因：

- 学习页源码里有大量依赖 `constructor` / `Function("return this")()` / 各类构造器判断的初始化逻辑。
- 之前那层 `Function.prototype.constructor` getter 会把**页面里所有函数对象**的 `constructor` 都改成代理对象，风险面太大。
- 这类全局原型改写即使不是语法错误，也很容易让页面初始化链表现成“白屏 / 卡加载 / 不继续渲染”。

为了便于继续定位，本轮还顺手做了两处收敛：

- `runtimeTick` 在 `document.readyState === "loading"` 时直接跳过，避免加载期反复扫 DOM。
- `stripDebuggerStatements` 的日志做了节流，避免动态代码较多时在启动期刷爆控制台。

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

本轮最终保留主脚本与总结文档；测试脚本已按最后指令清理。

清理前已执行过两层烟测：

1. 校验 userscript 自身是否包含关键拦截面、关键函数、关键 URL
2. 直接校验 `codebase-v2/v2-source` 混淆产物是否仍保留脚本依赖的方法名和接口字符串

当前可执行校验命令：

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
- `test-auto-wisdom-tree.js` 当前用于烟测、混淆产物兼容性校验、反反调试能力校验。
