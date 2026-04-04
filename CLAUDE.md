# CLAUDE.md

任何任务开始前，必须先读取以下文件：

1. `AGENTS.md` — 项目规则路由
2. `.agents/rules/shared/scope-guard.md` — Scope Card（强制前置）
3. `.agents/rules/shared/dev-principles.md` — 开发原则
4. 返回 `AGENTS.md`，按其中的“运行时强制路由”和“默认执行循环”继续执行

## Claude Code 执行交接（硬门禁）

1. `/plan`、规划阶段或任何高层方案输出，都**不替代**执行侧的 rules / skills 加载。进入第一次代码编辑前，必须重新回到执行模式并完成下面检查。
2. `AGENTS.md` 是唯一 AI 运行时入口；`README.md` 只给人读，不作为执行指令源。
3. 第一次代码编辑前，必须完成 `AGENTS.md` 中要求的 rules / skills 加载，不能靠“之前读过一次”代替。
4. 每次代码编辑后，默认下一步必须进入 `build -> validate -> summary -> receipt`，不能直接回复用户。
5. 对 Apple 代码任务，`validate` 阶段至少受 `.agents/rules/families/apple/swift-testing.mdc` 约束；Bug 修复若已改生产代码，修复后必须立即跑受影响测试。
6. 任何执行类任务结束时，必须按 `.agents/rules/shared/execution-receipt.md` 输出标准回复；至少包含 Status、Validation、Testing Summary、Gate Status、Rules Used、Skills Used。
7. 项目级 `.claude/settings.json` 与 `.claude/hooks/` 是本地 enforcement layer；它们会在 `UserPromptSubmit`、`PostToolUse`、`Stop` 阶段做机械校验，不能被视为可选文档。

读完上述文件与执行交接后，严格按照 AGENTS.md 中的上下文加载规则执行任务。
