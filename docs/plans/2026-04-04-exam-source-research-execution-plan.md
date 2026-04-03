# 2026-04-04 Exam Source Research Execution Plan

## Internal Grade

XL

## Scope

研究 `codebase-v2/v2-source/exam/stuExamWeb.js` 与 `codebase-v2/v2-source/exam/1.js`，并补全 `codebase-v2/report_v2_exam.md`。

## Waves

### Wave 1

主线程完成 skeleton check、读取现有报告、冻结 requirement/plan。

### Wave 2

并行 sub-agent：

1. App Shell 线：
   - store
   - router
   - axios interceptor
   - service API 分类
   - captcha / monitor / lock / collector
2. Answer Flow 线：
   - 主答题页生命周期
   - 父子组件事件流
   - 各题型 `saveData(...)` 保存链
   - 暂存 / 提交 / 恢复链
3. Automation Surface 线：
   - 稳定 hook 点
   - 数据对象与路由参数
   - 本地缓存键
   - 后续脚本接入建议与风险

### Wave 3

主线程整合发现，更新报告并做一致性检查。

### Wave 4

通过 cunzhi 汇报最终研究结论。

## Ownership Boundaries

1. 主线程负责 requirement/plan、报告整合、最终交付。
2. Sub-agent 只负责指定分析范围，不得新开 sub-agent，不得使用 cunzhi。

## Verification

1. 报告内容需能回溯到具体源码片段或调用链。
2. 至少交叉核对：
   - 路由到页面入口
   - 父页面到题型子组件保存链
   - 接口 service 映射到业务动作
3. 研究完成后重新检查报告是否已覆盖 acceptance criteria。

## Rollback Rules

1. 若 sub-agent 结论与源码不一致，以主线程复核源码为准。
2. 若发现既有报告存在误判，直接修正文档，不保留错误结论。

## Phase Cleanup Expectations

1. 生成 skeleton / intent / cleanup 收据。
2. 关闭不再需要的 sub-agent。
3. 不遗留临时分析文件。
