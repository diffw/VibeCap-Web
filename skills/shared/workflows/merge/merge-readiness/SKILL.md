---
name: merge-readiness
description: Orchestrator Skill that determines whether a branch is safe to merge. Analyzes change scope, assigns risk level, dynamically selects and executes quality gates (Unit → Integration → UI → E2E → Acceptance → Smoke), and produces a structured Merge Readiness Report with a READY_TO_MERGE or NOT_READY verdict. Platform-neutral — uses profile injection for platform-specific checks. Triggered by "#merge检查", "#merge-check", "可以合并吗", "准备合并", "merge readiness".
---

# Merge Readiness

> 编排型 Skill（Orchestrator）— 不替代测试 Skill，负责"总调度 + 总裁决"。

---

## What This Skill Does

回答一个问题：**"这次改动是否可以安全合并？"**

- 现有测试 Skill = 单项能力（怎么跑）
- `merge-readiness` = 总调度（是否需要跑、跑哪些、结论是什么）

---

## Trigger Conditions

关键词：`#merge检查`、`#merge-check`、`准备合并`、`可以合并吗`、`merge readiness`

也可由其他 Skill 或流程显式调用。

---

## Depends On (Existing Skills)

| Skill | Role in Merge Gate |
|-------|-------------------|
| `01-unit-test` | G1 执行层 |
| `02-integration-test` | G2 执行层 |
| `03-api-test` | G2 执行层（接口契约） |
| `04-ui-test` | G3 执行层 |
| `05-snapshot-test` | G3 执行层 |
| `06-e2e-test` | G4 执行层 |
| `07-functional-test` | G4 执行层 |
| `08-smoke-test` | G6 执行层 |
| `09-acceptance-test` | G5 执行层 |
| `10-performance-test` | 按需（high/critical risk） |
| `11-accessibility-test` | 按需（high/critical risk） |
| `systematic-debugging` | 失败时调用 |
| `00-toolchain-generator` | G0 toolchain 缺失时调用 |

---

## Input Contract

### Required Inputs

```
base_branch:      目标合并基线（例如 main / develop）
head_branch:      当前分支
change_scope:     改动文件集合（由 git diff --name-only {base}...{head} 生成）
release_intent:   合并意图
                  - merge_only（仅合并，默认）
                  - release_candidate（准发布）
                  - store_submission（提审/上架）
platform_profile: 平台标识
                  - ios / macos / web / extension / backend
```

### Optional Inputs

```
risk_override:    人工指定风险等级（low/medium/high/critical），覆盖自动判定
strict_mode:      是否启用严格模式（默认 true）
```

### Input Auto-Detection

如果用户未显式提供 input，按以下规则自动获取：

```
base_branch   → 从 git remote HEAD 或仓库默认分支推导
head_branch   → 当前 checked-out 分支
change_scope  → git diff --name-only {base}...{head}
release_intent → 默认 merge_only
platform_profile → 从 toolchain 文件或项目文件推导（*.xcodeproj → macos/ios, package.json → web/extension）
```

---

## Output Contract

### Output 1 — Merge Readiness Report（人类可读）

固定结构（见 Section: Report Format）。

### Output 2 — Gate Result（机器可读）

```json
{
  "decision": "READY_TO_MERGE | NOT_READY",
  "risk_level": "low | medium | high | critical",
  "blockers": [],
  "warnings": [],
  "gates": [
    {"id": "G0", "name": "Preflight", "status": "passed|failed|skipped", "reason": "...", "duration_s": 0}
  ]
}
```

---

## Step 1 — Change Scope Analysis

### 1a. Collect Changed Files

```bash
git diff --name-only {base_branch}...{head_branch}
```

### 1b. Map Files to Modules

将文件路径映射到模块归属：

```
映射优先级：
1. 从 PRODUCT_SPEC / ARCHITECTURE_SPEC 读取模块定义（若存在）
2. 从目录结构推导：
   - 顶层目录 = 模块（例如 Services/, Views/, Models/）
   - 嵌套目录 = 子模块
3. 若无法推导 → 标记为 "unknown_module"，风险自动升一级
```

### 1c. Identify Change Categories

对每个改动文件标记类型：

```
logic:     业务逻辑、算法、状态管理（.swift, .ts, .js 中的非 UI 文件）
ui:        视图、交互、样式（Views/, Components/, *.css, *.storyboard）
test:      测试文件（*Tests.swift, *.test.ts, *.spec.ts）
config:    构建配置、签名、脚本（*.xcodeproj, *.plist, webpack.config.*, CI files）
docs:      文档、注释（*.md, *.txt）
asset:     资源文件（images, fonts, localization files）
```

---

## Step 2 — Risk Assessment

### Risk Level Definitions

| Level | 定义 | Gate 深度 |
|-------|------|----------|
| `low` | 文档、注释、资源、非逻辑性改动 | G0 + G1 |
| `medium` | 单模块逻辑改动，不涉及关键链路 | G0 + G1 + G2 + G3(warning) |
| `high` | 多模块联动、核心流程、UI 交互主路径 | G0 ~ G5 |
| `critical` | 支付、鉴权、权限、数据安全、发布配置、数据库 schema、加密/签名逻辑 | G0 ~ G6（+ G7 if release intent） |

### Risk Upgrade Signals（任一命中可升级）

1. 修改 3 个及以上模块目录
2. 修改 `Service/Manager/Store/Provider` 等核心层
3. 修改权限、安全、支付、登录相关逻辑
4. 修改关键用户路径（核心功能流程、购买流程、onboarding）
5. 修改构建配置、签名、发布脚本
6. 修改数据库 schema 或加密/签名逻辑

### Risk Downgrade Signals

如果变更**仅**包含以下类型，自动降为 `low`，跳过 G2-G5：

- `docs/` 目录、`*.md`、`*.txt`
- 注释变更（无逻辑变更）
- `.gitignore`、`.editorconfig` 等开发工具配置
- 纯资源文件（图片、字体、本地化文本）

> **注意**：即使风险被降为 `low`，G0.6（硬编码字符串检查）仍然执行。该检查项不受 Risk Downgrade 影响。

---

## Step 3 — Gate Execution

### Gate Dependency Chain（强制）

```
G0 Preflight
  ↓ （必须通过）
G1 Unit Gate
  ↓ （必须通过）
G2 Integration/API Gate  ←→  G3 UI Gate （可并行）
  ↓                            ↓
  └──────────┬─────────────────┘
             ↓
G4 Functional/E2E Gate
  ↓ （必须通过）
G5 Acceptance Gate
  ↓ （必须通过）
G6 Smoke Gate
  ↓ （仅 release intent 触发）
G7 Release Audit Gate
```

**规则：上游 Gate 未通过时，禁止执行下游 Gate。G2 和 G3 可并行执行。**

---

### G0 — Preflight（任何 merge 请求）

检查项：

| # | 检查 | 失败处理 |
|---|------|---------|
| 0.1 | 分支与 base 无合并冲突 | Blocker — 先解决冲突 |
| 0.2 | 工作区干净（无 uncommitted changes） | Blocker — 先提交或 stash |
| 0.3 | 所需 toolchain 文件存在 | 触发 `00-toolchain-generator`，生成后继续；用户拒绝则 Blocker |
| 0.4 | 本次变更中无 unresolved TODO/FIXME | Warning（low risk）/ Blocker（high/critical risk） |
| 0.5 | 无敏感文件（.env, credentials, secrets）被提交 | Blocker |
| 0.6 | **UI 文件无硬编码用户可见字符串** | **Blocker** — 见下方 0.6 详细规则 |

#### 0.6 — Hardcoded String Check（强制，不可跳过）

> 本检查项适用于**所有**包含 `.swift` 文件变更的 merge 请求，无论风险等级。即使变更被 Risk Downgrade 降为 `low`，此检查仍然执行。

**检查范围**：`change_scope` 中所有 `.swift` 文件（新增 + 修改）

**检查方法**：

1. 扫描每个变更的 `.swift` 文件中的字符串字面量
2. 对于每个字符串字面量，判断是否赋值给 UI 属性：
   - `window.title`、`.stringValue`、`.placeholderString`、`.title`（按钮/菜单）
   - `Text()`、`Button()`、`Label()`、`Toggle()`、`NavigationTitle`
   - `.headerText`、`.messageText`（NSAlert）
   - `setLabel(_:forSegment:)`、tab/segment 标题
   - HUD 文案、空态文案、确认弹窗文案
3. 如果字符串未被 `String(localized:)` 或 `NSLocalizedString` 包裹 → **标记为违规**

**排除项**：
- `logger.*()` / `print()` 内的字符串
- `#if DEBUG` 块内的字符串
- 标识符类参数（`UserDefaults` key、`NotificationCenter` name、`.accessibilityIdentifier`）
- SF Symbol 名称（`systemName:`）
- 文件路径、URL、正则表达式

**失败处理**：**Blocker** — 列出所有违规位置（文件名:行号 + 硬编码内容），要求修复后重跑 G0。

---

### G1 — Unit Gate（修改函数/方法/类时触发）

- 执行 Skill：`01-unit-test`
- 范围：变更涉及的所有函数/方法/类的 unit tests
- 阻断级别：**Blocker**
- 通过条件：所有相关 unit tests 通过 + 覆盖率不低于门槛（行 80%，核心模块 90%）

---

### G2 — Integration/API Gate（跨模块或接口契约变更时触发）

- 执行 Skill：`02-integration-test` + `03-api-test`
- 范围：变更涉及的模块交互链路
- 触发信号：变更跨 2+ 模块目录、修改 Service/Manager 协作、接口签名变更
- 阻断级别：**Blocker**
- 前置条件：G1 通过

---

### G3 — UI Gate（交互/UI 变更时触发）

- 执行 Skill：`04-ui-test` + `05-snapshot-test`
- 范围：变更涉及的 UI 组件和交互流程
- 阻断级别：
  - **Blocker** — 修改状态管理、导航流程、手势/快捷键（high risk UI）
  - **Warning** — 仅修改文案、间距、颜色等非交互性变更（low risk UI）
- 前置条件：G1 通过（可与 G2 并行）

---

### G4 — Functional/E2E Gate（关键业务流程变更时触发）

- 执行优先级：
  1. 先跑 `07-functional-test`（功能维度验证，速度较快）
  2. 仅在 **high/critical risk** 时追加 `06-e2e-test`（完整用户旅程）
- 阻断级别：**Blocker**
- 前置条件：G2 通过

E2E 触发规则（严格控制，遵循测试金字塔）：
- `low/medium` risk → **不跑 E2E**
- `high` risk → 跑关键路径 E2E（≤ 3 条）
- `critical` risk → 跑全量 E2E

---

### G5 — Acceptance Gate（涉及需求交付声明时触发）

- 执行 Skill：`09-acceptance-test`
- 范围：对照 Spec/PRD 验证已完成的需求项
- 阻断级别：**Blocker**
- 前置条件：G4 通过（若 G4 被触发）

---

### G6 — Smoke Gate（merge 到主干或 release 分支时触发）

- 执行 Skill：`08-smoke-test`
- 范围：5-10 条核心功能快速检查 + 回归测试
- 阻断级别：**Blocker**
- 触发条件：
  - 目标分支为 main/master/release/*
  - 或 `release_intent` 为 `release_candidate` / `store_submission`
  - 或 risk level 为 `critical`

---

### G7 — Release Audit Gate（仅发布意图时触发）

- 执行 Skill：`release-audit`（按 platform_profile 选择审计项）
- 触发条件：`release_intent` = `store_submission`
- 阻断级别：**Blocker**（发布场景）
- 不在日常 merge 中启用

---

## Step 4 — Failure Protocol

### Gate 失败时

1. **立即停止**后续 Gate（除非用户显式要求"继续收集所有 Gate 信息"）
2. 输出失败摘要：哪一关失败、失败证据（命令、输出、错误信息）
3. 调用 `systematic-debugging` 进入根因定位流程
4. 未经用户确认，不进行大范围"猜测式修复"

### 修复后重跑规则

```
修复涉及的模块 ≤ 失败 Gate 的范围
  → 仅重跑失败 Gate + 其下游 Gate

修复涉及新模块（超出原始 change_scope）
  → 从 G1 重新开始全部 Gate
```

---

## Step 5 — Evidence & Auditability

每个 Gate 必须记录真实执行证据：

| 字段 | 要求 |
|------|------|
| 执行命令 | 实际在终端运行的命令 |
| 时间戳 | 执行开始和结束时间 |
| 结果 | passed / failed / skipped + 原因 |
| 失败摘要 | 失败测试名称、错误信息、文件位置 |
| 耗时 | 该 Gate 执行时长（秒） |

### 禁止以下结论

- "理论上通过"
- "建议你执行某命令"（必须实际执行）
- "未运行但看起来没问题"
- "根据代码审查判断应该没有问题"

---

## Report Format（固定结构）

```
🔒 Merge Readiness Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Branch:   {head_branch} → {base_branch}
Date:     {date}
Risk:     {risk_level}
Profile:  {platform_profile}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Decision

  ✅ READY_TO_MERGE
  or
  🚫 NOT_READY — {N} blocker(s)

## Gate Matrix

  | Gate | Status | Duration | Detail |
  |------|--------|----------|--------|
  | G0 Preflight       | ✅ passed | 2s  | |
  | G1 Unit            | ✅ passed | 15s | 24/24 tests |
  | G2 Integration/API | ✅ passed | 8s  | 6/6 tests |
  | G3 UI              | ⚠️ warning | 5s | snapshot diff in SettingsView |
  | G4 Functional/E2E  | ✅ passed | 12s | functional only (medium risk) |
  | G5 Acceptance      | ⏭️ skipped | -  | no acceptance criteria claimed |
  | G6 Smoke           | ⏭️ skipped | -  | not merging to main |
  | G7 Release Audit   | ⏭️ skipped | -  | merge_only intent |

## Blockers
  (none)

## Warnings
  - G3: snapshot diff detected in SettingsView — review visually

## Evidence Summary
  - Unit: `xcodebuild -scheme {SCHEME} test -only-testing:{TEST_TARGET}` → 24 passed, 0 failed
  - Integration: `xcodebuild ...` → 6 passed, 0 failed
  ...

## Total Duration
  42s

## Next Actions
  - Review snapshot diff in G3 before merging
  - Consider updating baseline if diff is intentional
```

---

## Platform Profile Mechanism

Gate 语义一致（G0-G7），平台差异通过 profile 注入。

### profile-macos

- 默认 Gate：G0 → G1 → G2 → G3 → G4(functional) → G5 → G6
- E2E：仅 high/critical
- G7：仅 `store_submission`（Mac App Store）
- toolchain 前缀：`*-swift.md`

### profile-ios

- 与 macos 基本一致
- G7 在 `store_submission` 时启用 iOS App Store 审计项
- toolchain 前缀：`*-swift.md`

### profile-web

- G2 更强调 API contract 测试
- G4 默认包含 E2E（Web 端 E2E 成本低于原生）
- G7 替换为 Web 部署审计（HTTPS、CSP、Core Web Vitals）
- toolchain 前缀：`*-react-ts.md` 或对应框架

### profile-extension

- G0 增加：manifest.json 权限声明检查
- G2 增加：host page 兼容性、注入策略验证
- toolchain 前缀：按框架选择

---

## Decisions (Confirmed)

| # | 决策 | 结论 |
|---|------|------|
| 1 | 默认严格模式 | **是** — 宁严勿松，后续按需放宽 |
| 2 | 哪些 Gate 可 warning 不阻断 | **仅 G3（UI/Snapshot）在 low risk 时** 可降为 warning |
| 3 | merge 到主干必跑 smoke | **是** — 最后一道防线 |
| 4 | E2E 默认必跑 | **否** — 仅 high/critical risk 触发，遵循测试金字塔 |
| 5 | release audit 并入 merge gate | **仅 `store_submission` 意图时启用** |

---

## Relationship to Other Skills

```
merge-readiness（编排层）
  ├── 决定"是否需要跑"、"跑哪些"、"结论是什么"
  │
  ├── 01~11 测试 Skills（执行层）
  │     └── 负责"怎么跑"
  │
  ├── commit-code（提交层）
  │     └── 负责"怎么提交"
  │
  ├── release-audit（审计层）
  │     └── 负责"是否可发布"（仅 release 场景）
  │
  └── systematic-debugging（诊断层）
        └── 负责"失败后怎么定位根因"
```

编排层与执行层分离，减少耦合。
