# 2026-04-04 Exam Source Research Requirement

## Goal

对 `codebase-v2/v2-source/exam` 下的新考试前端源码做完整研究，覆盖应用壳、题型组件、作答/暂存/提交链路、验证码与风控链，以及后续自动化脚本可接入的稳定切点。

## Deliverable

1. 更新 `codebase-v2/report_v2_exam.md`，形成更完整的研究报告。
2. 明确 `stuExamWeb.js` 与 `1.js` 的职责边界、关键模块、关键调用链。
3. 给出后续自动化接入建议，包括优先 hook 点、风险点、不可继续沿用的旧假设。

## Constraints

1. 以本地源码和现有报告为准，不臆测未证实行为。
2. 允许使用 sub-agent 并行分析。
3. 若使用 sub-agent，必须明确告知：
   - 其是 sub-agent
   - 其对话刚刚开始
   - 无权限新开 sub-agent
   - 无权限使用 cunzhi
4. 本轮目标是研究，不直接修改运行脚本。
5. 最终用户沟通通过 cunzhi 完成。

## Acceptance Criteria

1. 报告覆盖 `stuExamWeb.js` 全局骨架，包括 store、router、axios、service、captcha/monitor。
2. 报告覆盖 `1.js` 主答题页、题型组件保存链、恢复链、暂存链、提交流程、异常/锁定链。
3. 报告给出自动化接入面的稳定建议，而不是停留在 DOM 层猜测。
4. 报告明确当前仍需后续验证的部分与风险边界。

## Non-Goals

1. 本轮不实现新的油猴运行逻辑。
2. 本轮不伪造接口请求或直接绕过验证码。
3. 本轮不做线上运行验证。

## Autonomy Mode

interactive_governed with inferred clarifications from prior user instructions.

## Inferred Assumptions

1. `stuExamWeb.js` 是应用壳与接口层主入口。
2. `1.js` 是答题页主 chunk，内含多个题型与父子组件交互。
3. 用户下一步大概率会基于本报告继续要求自动化接入分析或实现。
