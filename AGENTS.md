# AGENTS.md — Backlogs Agent Context Router

## 项目概要

Backlogs：可复用的 AI Agent 工作流与规则仓库。

## 目标平台（单平台）

- 当前项目目标平台：`Harness Repo（多平台元仓库）`
- 当前仓库本身是多平台 Harness 元仓库；宿主项目应在 PRD / Spec 中声明单一目标平台。

## 模块总览

| 模块 | 路径 | 说明 |
|---|---|---|
| Skills | `skills/` | Agent workflow 能力定义 |
| Rules | `rules/` | 开发规范与测试规则 |
| References | `references/` | 技术与设计参考文档 |
| Scripts | `scripts/` | 自动化脚本与工具 |
| Harness Docs | `.harness-docs/` | 仓库自身评估与执行文档 |

## Skill 路由真相源

- `AGENTS.md` 是 AI 任务的唯一运行时路由入口。
- `README.md` 只服务人类说明，不作为运行时指令源。
- Skill 详细定义以 `skills/**/SKILL.md` 为真相源；仅在 `AGENTS.md` 已判定命中后再打开具体 Skill。
- 非必要禁止全量递归扫描 `skills/`；只有路径缺失、规则冲突或用户明确要求时才回退到树扫描。
- `AGENTS.md` 不维护手写 Skill 总表，避免重复索引漂移。

## 运行时强制路由（硬门禁）

- 任何代码变更任务：先读 `rules/shared/scope-guard.md` 与 `rules/shared/dev-principles.md`。
- 若任务涉及 Apple 平台代码、测试或发布：第一次代码编辑前必须读取 `rules/families/apple/swift-testing.mdc`。
- 任何生产代码编辑：第一次代码编辑前至少读取 `skills/shared/workflows/testing/01-unit-test/SKILL.md`，并在每个代码批次后执行 Validation Scaling 对应的测试。
- Bug 修复：第一次 patch 前先读取 `skills/shared/workflows/develop/systematic-debugging/SKILL.md`；修复后必须立即运行受影响测试，未跑测试不得回复“已修复”。
- 跨 3+ 模块、feature completion 或明确的集成改动：补读 `skills/shared/workflows/testing/02-integration-test/SKILL.md`。
- 修改 `.strings` 或新增用户可见文案：补读 `skills/families/apple/workflows/develop/localization-handler/SKILL.md`。

## 上下文加载规则（按需读取）

0. **Scope Lock（硬门禁 — 强制第一步）**：收到代码变更任务后，第一条工作消息**必须**是 Scope Card。在 Scope Card 输出之前，**禁止调用**任何文件读写、搜索、编辑、Bash 工具（唯一例外：读取 `rules/shared/scope-guard.md` 本身）。违反此门禁的操作视为无效。
1. 先读任务相关 `rules/`；Skill 路由只由 `AGENTS.md` 当前任务类型与“运行时强制路由”决定，再读对应 `skills/**/SKILL.md`。
2. 仅在 Skill 明确引用时读取 `references/`。
3. 若任务会创建或更新 `.vibe-doc/`，先读取 `rules/shared/vibe-doc-preservation.md` 并遵守 preserve-first 规则。
4. 完成修改后按 Scope Card 的验证计划执行测试/校验，并在回复末尾按 `rules/shared/execution-receipt.md` 输出 Rules Used / Skills Used 回执。
5. Skill 详细定义以 `skills/**/SKILL.md` 为准，但运行时禁止把整棵 Skills 树当作默认入口。
6. **超限即停**：操作过程中触达 Scope Card 声明的预算上限时，立即停止并向用户申请扩范围，未获批准不继续。

## 默认执行循环（硬模板）

1. `route`：按本文件确定 rules / skills。
2. `edit`：做最小必要改动。
3. `build`：执行编译或目标级验证。
4. `validate`：按 Validation Scaling 与已触发 testing tier 跑真实测试。
5. `summary`：输出 Testing Summary 或明确说明为何本次按规则无需测试。
6. `receipt`：输出 Rules Used / Skills Used。
7. `reply`：只有完成前六步后，才能向用户报告完成。

- 禁止把执行循环缩成 `edit -> build -> reply`。

## 完成标准（Definition of Done）

- 变更与需求一致，无未解释偏差。
- 相关测试已执行并给出真实结果。
- 路径引用有效，文档与实际结构一致。
- 不提交系统垃圾文件（如 `.DS_Store`）。
- **优化类变更必须记录 `CHANGELOG.md`**：对 rules、skills、agents、scripts 或任何工作流配置的优化性变更，必须在 `CHANGELOG.md` 顶部追加记录，包含"优化了什么"和"为什么要做这个优化"。未记录 = 未完成。

## 压缩恢复（Compaction Recovery）

1. 重新读取 `AGENTS.md`。
2. 重新读取当前任务计划（如有）。
3. 重新读取正在编辑的关键文件与相关规则/技能。
