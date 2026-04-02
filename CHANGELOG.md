# Changelog

harness-coding 基础设施优化日志。记录每次变更的内容与原因，便于长期维护和回溯决策。

---

## 2026-04-01 — AI 入口收敛回 `AGENTS.md`

### 优化了什么

1. **撤回 `README.md` 的 AI 路由职责**
   - `AGENTS.md` 现在明确规定：它是 AI 的唯一运行时入口
   - `README.md` 回到人类说明文档，不再承担 AI 的运行时 Skill 路由职责

2. **把默认执行循环写成硬模板**
   - `AGENTS.md` 新增默认执行循环：
     - `route -> edit -> build -> validate -> summary -> receipt -> reply`
   - 明确禁止把执行缩成 `edit -> build -> reply`

3. **把强制路由直接写进 `AGENTS.md`**
   - 任何代码变更先读 `scope-guard` / `dev-principles`
   - Apple 代码任务先读 `swift-testing`
   - 生产代码编辑前先读 `01-unit-test`
   - bugfix 先读 `systematic-debugging`，修复后立即跑受影响测试
   - 本地化改动补读 `localization-handler`

4. **收紧 `CLAUDE.md`**
   - 不再把 `README.md` 当 Claude Code 的运行时索引
   - 改为强制 Claude 回到 `AGENTS.md` 的“运行时强制路由”和“默认执行循环”

### 为什么要做这个优化

1. 第一性原理上，AI 运行时入口应该收敛到 `AGENTS.md` / `CLAUDE.md`，而不是让 `README.md` 同时承担人类说明与 AI 路由两种职责。
2. 之前把 `README.md` 提升为轻索引，虽然看起来更省 token，但会制造入口分裂；宿主项目一旦保留旧 README，就会把 AI 送回过期路径。
3. 仅靠“读过规则”不够，必须把默认执行循环写成更难被跳过的模板，否则 agent 仍会滑回 `edit -> build -> reply`。

---

## 2026-04-01 — Claude Code 桥接入口收紧

### 优化了什么

1. **把 `README.md` 明确提升为运行时 Skill 轻索引**
   - `AGENTS.md` 现在明确区分：
     - `README.md` = 运行时首跳 Skill 索引
     - `skills/**/SKILL.md` = 详细定义真相源
   - 明确禁止把整棵 `skills/` 目录当作默认运行时入口；只有索引失效或路径缺失时才回退到树扫描

2. **收紧生成的 `CLAUDE.md` 执行交接**
   - 新增 Claude Code 执行交接段落
   - 明确规定：`/plan` 或任何规划阶段**不替代**执行侧 rules / skills 加载
   - 对 Apple 代码任务增加“第一次代码编辑前必须补读测试规则与平台规则”的提醒
   - 对 `Critical` / `Medium+` / `Phase Gate` 任务增加测试 Skill 读取提醒
   - 对 Bug 修复增加 `systematic-debugging` 前置提醒
   - 对本地化变更加上 `localization-handler` 前置提醒
   - 明确 `BUILD SUCCEEDED` 不等于完成，必须输出 Testing Summary 与 Phase Gate receipt

3. **补强生成器回归测试**
   - 更新 `scripts/tests/test_generate_agents_readme.sh`
   - 更新 `scripts/tests/test_update_host_bridge.sh`
   - 现在会机械校验生成结果是否包含：
     - `README` 轻索引约定
     - `/plan` 到执行模式的交接提醒
     - `01-unit-test` / `systematic-debugging` / `localization-handler` 等关键路径提示
     - 任务结束时必须输出 `Rules Used / Skills Used` 回执

### 为什么要做这个优化

1. 实战 postmortem 说明：Claude Code 即使读了基础入口文件，也可能在编码阶段把 rules / skills 当成一次性仪式，而没有把它们继续当作执行框架。
2. 如果宿主项目桥接入口只写“先读 AGENTS、scope-guard、dev-principles”，Claude 很容易在 Plan 退出后直接开始编码，而没有补读测试规则、平台规则和关键 Skills。
3. Harness Engineering 的重点是“小而稳定的入口 + 按需展开”，不是让运行时递归扫描整棵技能树。把 `README` 作为轻索引、把 `SKILL.md` 保留为详细真相源，更接近这个原则。
4. 仅靠“相信 agent 照流程做”不够；执行回执至少能让用户看见本次到底实际用了哪些 rules / skills。

---

## 2026-04-01 — 执行回执：显示实际调用的 Rules / Skills

### 优化了什么

1. **新增统一执行回执规则**
   - 新增 `rules/shared/execution-receipt.md`
   - 要求所有执行类任务在回复末尾输出：
     - `Rules Used`
     - `Skills Used`
   - 只允许列出本次真实读取 / 执行过的规则与 Skill；没有则明确写 `none`

2. **把回执要求接入根入口文档**
   - `AGENTS.md` 现在明确要求：执行结束后输出 `Rules Used / Skills Used` 回执
   - `CLAUDE.md` 现在把这条要求纳入 Claude Code 的执行交接清单

3. **补强桥接生成测试**
   - 更新 `test_generate_agents_readme.sh`
   - 更新 `test_update_host_bridge.sh`
   - 机械验证生成的宿主项目桥接文档包含这条回执要求

### 为什么要做这个优化

1. 如果没有执行可见性，用户很难确认 agent 是真的读取并遵守了规则，还是只是在结果里“看起来像做过”。
2. 对 Codex 和 Claude Code 这类 agent，最小成本的增强手段不是引入重型审计系统，而是先把“实际调用回执”写成硬约束。
3. 这条规则不能替代 gate 或测试，但能显著降低执行黑箱感。

---

## 2026-04-01 — 宿主项目桥接与自动刷新机制

### 优化了什么

1. **新增宿主项目桥接刷新脚本**
   - 新增 `scripts/update_host_bridge.sh`
   - 当仓库以 submodule 挂到宿主项目 `.agents/` 下时，可用单命令刷新宿主项目根目录的：
     - `AGENTS.md`
     - `CLAUDE.md`
     - `.claude/skills`
   - 默认不触碰宿主项目根目录 `README.md`

2. **新增可选自动刷新 hook 安装器**
   - 新增 `scripts/install_host_bridge_hooks.sh`
   - 可为宿主项目根仓库和 `.agents` submodule 安装 `post-merge` / `post-checkout` hooks
   - 从而在宿主项目 pull 或 submodule 更新后，自动刷新根目录桥接文档

3. **增强根文档生成器的输出控制**
   - `scripts/generate_agents_readme.sh` 新增 `--outputs` 参数
   - 允许只刷新指定根文档，例如只更新 `AGENTS.md` 与 `CLAUDE.md`
   - 解决宿主项目模式下误覆盖根目录 `README.md` 的风险

4. **更新生成文档 Skill 的宿主项目规则**
   - `generate-project-docs` 现在明确区分：
     - standalone harness 仓库
     - 宿主项目 `.agents` 模式
   - 在宿主项目中，默认使用 `update_host_bridge.sh` 作为桥接刷新入口

5. **新增桥接与 hook 真实回归测试**
   - 新增 `scripts/tests/test_update_host_bridge.sh`
   - 新增 `scripts/tests/test_install_host_bridge_hooks.sh`
   - 新增 `generate_agents_readme` 的“部分输出不改 README”用例

### 为什么要做这个优化

1. 之前仓库只支持“宿主项目模式”，但没有真正提供一条稳定、正式、可自动化的桥接刷新路径。
2. 宿主项目的 canonical `AGENTS.md` / `CLAUDE.md` 应位于根目录；而 `.agents/` 应退回为规则与能力仓。这个桥接层需要被明确支持。
3. 在宿主项目中，自动刷新 `AGENTS.md` / `CLAUDE.md` 是合理的，但自动覆盖根目录 `README.md` 并不合理，因此需要把桥接刷新和 README 生成解耦。

---

## 2026-04-01 — `.vibe-doc` 文档保全门禁

### 优化了什么

1. **新增 `.vibe-doc` 保全规则**
   - 新增 `rules/shared/vibe-doc-preservation.md`
   - 明确规定：不能删除已有 `.vibe-doc` 文档，不能用空内容或模板覆盖非空文档，默认采用 preserve-first 的增量更新策略

2. **收紧高风险文档 Skill**
   - 为 `new-project-prd`、`ia-user-flow`、`architecture-design`、`product-spec`、`design-token-generator`、`manage-backlog` 增加统一的 `.vibe-doc Preservation Gate`
   - 这些 Skill 现在都明确要求：非空目标文件先读取、再更新；只有目标缺失或为空时才允许从模板初始化

3. **新增机械检查脚本与测试**
   - 新增 `scripts/check_vibe_doc_skill_safety.sh`
   - 新增 `scripts/tests/test_check_vibe_doc_skill_safety.sh`
   - `run_entropy_sweep.sh` 现在会把 `.vibe-doc` skill safety 作为 blocking check 之一

4. **更新根文档生成逻辑**
   - `AGENTS.md` 生成结果现在会在任务触达 `.vibe-doc/` 时，明确要求先读取 `.vibe-doc` 保全规则

### 为什么要做这个优化

1. 宿主项目通常已经积累了历史 PRD、Product Spec、IA、backlog 等文档；如果生成型 Skill 默认把固定文件名视为“可重建模板”，就很容易破坏已有知识资产。
2. 对 `.vibe-doc` 这类项目文档，最合理的默认策略不是重建，而是 preserve-first 的增量更新。
3. 仅靠 Skill 文案不够稳定，所以增加了结构化检查脚本，把这条规则变成仓库自己的长期门禁。

---

## 2026-03-31 — 元信息生成与宿主项目接入修正

### 优化了什么

1. **修正 `generate_agents_readme.sh` 的元信息优先级**
   - 生成器现在优先识别 `PRODUCT_SPEC`、`PRODUCT_PRD`、`PRD-*`、`IMPLEMENTATION_PRODUCT_SPEC` 这类产品级文档
   - 降低 `report / guide / acceptance / retrospective / backlogs` 等文档对项目名与平台推断的干扰

2. **补强目标平台识别**
   - 除了原来的行内字段与独立章节外，现在额外支持从 `Platforms` 表格读取平台
   - 对产品级文档补充了更稳的叙述式平台识别，能覆盖 `VibeCap 是一个 macOS 菜单栏应用` 这类真实写法

3. **修正默认目标平台文案**
   - 宿主项目缺少平台声明时，生成结果不再保留模板占位符，而是明确标注 `未声明`
   - 仓库自身若是多平台 Harness 元仓库，则明确标注为 `Harness Repo（多平台元仓库）`

4. **收紧 `CLAUDE.md` 的默认加载说明**
   - 不再把 Apple 测试规则写成所有任务都必须读取的硬前置
   - 改为先读 `AGENTS.md`、`scope-guard`、`dev-principles`，再按任务类型继续读取对应规则

5. **新增真实宿主项目场景测试**
   - 在 `scripts/tests/test_generate_agents_readme.sh` 中增加“多份 spec 并存”的真实宿主项目用例
   - 覆盖项目名误判、平台表格识别、`.agents/` 模式输出和 `CLAUDE.md` 引导内容

### 为什么要做这个优化

1. 实际宿主项目通常会同时存在 `PRODUCT_SPEC`、功能 PRD、IAP 规格、验收报告等多份文档；如果生成器不能区分“产品级文档”和“功能级文档”，生成出来的根文档会直接误导 Agent。
2. 目标平台如果仍然停留在模板占位符，会让入口文档看起来像“没生成完整”，降低仓库对外使用体验。
3. `CLAUDE.md` 的桥接说明应该尽量保持最小前置，而不是在没有上下文的情况下强绑某个平台家族规则。

---

## 2026-03-31 — 内部文档目录改名：`.vibe-doc` → `.harness-docs`

### 优化了什么

1. **仓库自身内部文档目录改名**
   - 将 `harness-coding` 仓库自己的评估/方案目录从 `.vibe-doc/` 改为 `.harness-docs/`
   - 这样下游项目在 `.agents/` 中引用本仓库时，不会再与宿主项目自己的 `.vibe-doc/` 形成同名冲突

2. **保留宿主项目 `.vibe-doc/` 约定**
   - Skills 中面向实际项目产出的 `.vibe-doc/PRD.md`、`.vibe-doc/product-spec-*.md`、`.vibe-doc/backlogs.md` 等路径不变
   - 只改仓库自身目录，不改外部项目工作流约定

3. **生成与 freshness 脚本双目录兼容**
   - `scripts/generate_agents_readme.sh` 同时识别 `.harness-docs/` 和 `.vibe-doc/`
   - `scripts/check_root_docs_freshness.sh` 及相关测试可同时复制两个目录

### 为什么要做这个优化

1. `harness-coding` 作为子仓库挂在 `.agents/` 下时，若它自己也带一个 `.vibe-doc/`，会和宿主项目根目录的 `.vibe-doc/` 在心智和目录浏览上冲突。
2. 仓库自身评估文档和宿主项目设计产出不是同一层资产，目录名应该明确区分。
3. 保留宿主项目 `.vibe-doc/` 约定，可以避免对既有 Skills 和实际项目工作流造成不必要破坏。

---

## 2026-03-31 — 内部文档收敛：只保留主执行文档

### 优化了什么

1. **收敛 `.harness-docs/` 内部文档**
   - 保留 `harness-engineering-master-review.md` 作为唯一主执行文档
   - 保留 `backlogs.md` 作为仓库内部 backlog 入口
   - 删除已被主文档吸收的评估/提案草案

2. **降低文档真相源分裂**
   - 不再同时保留多份并行评估与结构 proposal
   - 后续优化与执行统一以主文档为准

### 为什么要做这个优化

1. 当主文档已经吸收了结构方案、严格执行、阶段计划和迁移矩阵时，继续保留多份平行草案只会增加检索噪音和维护成本。
2. 让 `.harness-docs/` 只保留真正持续维护的文档，更符合“单一真相源”的目标。

---

## 2026-03-31 — Phase 6：entropy sweep 与 doc gardening

### 优化了什么

1. **新增 `scripts/check_root_docs_freshness.sh`**
   - 在临时副本中重跑根文档生成
   - 对比 `AGENTS.md / README.md / CLAUDE.md`
   - 若生成结果与当前文件不一致，直接报 stale 并给出 remediation

2. **新增 `scripts/run_entropy_sweep.sh`**
   - 把 `doc freshness`、`structure gate`、`legacy reference lint` 收敛成一个周期性 sweep 入口
   - 先跑 blocking checks，再输出 advisory hotspots

3. **新增 `scripts/report_hotspots.sh`**
   - 基于 git 历史输出最近窗口内的高频变更文件
   - 作为 advisory 信号，为后续热点治理提供低成本观察面

4. **新增 Phase 6 测试**
   - 新增 `scripts/tests/test_check_root_docs_freshness.sh`
   - 新增 `scripts/tests/test_run_entropy_sweep.sh`
   - 新增 `scripts/tests/test_report_hotspots.sh`
   - 覆盖 stale generated docs 的失败路径，而不只测试 happy path

### 为什么要做这个优化

1. `Phase 4/5` 解决的是“结构和约束”，`Phase 6` 要解决的是“这些东西以后怎么不再慢慢漂回去”。
2. `doc freshness` 和 `entropy sweep` 是当前最高 ROI 的长期维护入口，比直接上 reviewer agent 或 observability 更实用。
3. hotspots report 先作为 advisory 信号存在，足够轻量，不会在边界尚未完全稳定时引入额外复杂度。

---

## 2026-03-31 — Phase 5：mechanical constraints 与 Quality Gate

### 优化了什么

1. **新增 `scripts/check_harness_structure.sh`**
   - 把目录分层约束变成结构性检查
   - 校验必需锚点文件、旧路径残留、`workflows / adapters / assets` 语义边界
   - 对结构错误输出明确 remediation 提示

2. **新增 `scripts/lint_harness_references.sh`**
   - 把最常见的旧路径引用收敛成 remediation-oriented lint
   - 对 Rules、Skills、References、根文档中的 legacy path 输出替换建议
   - 让“发现问题”直接附带“应该改成什么”

3. **新增 Quality Gate 测试**
   - 新增 `scripts/tests/test_check_harness_structure.sh`
   - 新增 `scripts/tests/test_lint_harness_references.sh`
   - 覆盖 pass/fail fixture，而不是只测成功路径

4. **回归验证前四个阶段**
   - 重新跑 `generate_agents_readme`、`sync_claude_skills`、`strict execution`、`release preflight`、`hardcoded strings` 测试
   - 确认 Phase 5 的机械约束没有破坏既有 gate

### 为什么要做这个优化

1. 如果目录结构和旧路径引用只能靠人眼看，`shared / families / platforms` 很快又会退化成口头约定。
2. 结构校验和 remediation-oriented lint 是把“建议性规则”升级为“工具级门禁”的最低成本方式。
3. 先把高频、可机械化的错误收敛成 Quality Gate，比过早引入 reviewer agent 或 observability 更符合当前最高 ROI。

---

## 2026-03-31 — Phase 4：分层目录迁移与路径收敛

### 优化了什么

1. **落地 `shared / families / platforms` 目录结构**
   - `rules/` 已拆分为 `shared / families / platforms`
   - `references/` 已拆分为 `shared / families / platforms`
   - `skills/` 已拆分为 `shared / families / platforms`，并把模板与辅助资产迁入 `assets/`

2. **修复迁移后的内部路径引用**
   - Product、Design、Testing、Debugging 相关 Skills 全部改为引用新的分层路径
   - Apple testing 规则改为指向 shared methodology + apple adapters
   - Design system 和 shared assets 改为引用新的 `references/shared` 与平台化模板路径

3. **重生成根文档**
   - 重新生成 `AGENTS.md`
   - 重新生成 `README.md`
   - 重新生成 `CLAUDE.md`
   - 确保根文档与新目录结构一致

4. **回归验证 Phase 4 gate**
   - `test_generate_agents_readme.sh`
   - `test_sync_claude_skills.sh`
   - `test_strict_execution_guards.sh`
   - `test_release_preflight.sh`
   - `test_hardcoded_strings_gate.sh`

### 为什么要做这个优化

1. 目录已经物理迁移到分层结构后，如果 Skills、Rules、References 仍继续引用旧路径，仓库会同时存在“新结构”和“旧认知”，这会直接制造新的漂移。
2. `shared / families / platforms` 只有在根文档、规则说明、Skill 交叉引用都同步收敛后，才算真正落地，而不是只有文件被移动了位置。
3. 先把 Phase 4 的结构与路径彻底跑通，后续机械约束和更严格的 gate 才有稳定基础。

---

## 2026-03-31 — Phase 3：release / localization 前置 gate

### 优化了什么

1. **新增 `scripts/check_release_preflight.sh`**
   - 提供最小 release preflight gate。
   - 校验 `fastlane/Fastfile`、`fastlane/metadata/*` 结构、字符限制、市场配置与 Chinese review 标记。

2. **新增 release / localization 测试**
   - 新增 `scripts/tests/test_release_preflight.sh`
   - 新增 `scripts/tests/test_hardcoded_strings_gate.sh`
   - 覆盖 release pass/fail 与本地化硬编码字符串 pass/fail 路径

3. **对齐 Skills 与真相源**
   - `skills/02-develop/Localization/SKILL.md` 明确优先使用 `scripts/check-hardcoded-strings.sh`
   - `skills/fastlane-appstore/04-fastlane-preflight-check/SKILL.md` 明确 `reviewed-locales.json` 作为 Chinese review artifact
   - `rules/project-overview.md` 新增 release / localization gate 真相源

### 为什么要做这个优化

1. Phase 3 的目标是把 release 和 localization 的问题前移，而不是继续等到 `release-audit` 最后一轮才发现。
2. 仓库里已经有本地化扫描脚本和 Fastlane preflight skill，但没有真正的前置 gate 测试与统一脚本入口。
3. 把 Chinese review 和 metadata completeness 机械化后，能更早暴露提交前阻塞项。

---

## 2026-03-31 — Phase 2：最小 strict execution 控制面

### 优化了什么

1. **新增 `scripts/strict_execution_policy.json`**
   - 定义了最小 task class 到 required receipt 的映射。
   - 当前覆盖 `feature_code_change`、`bugfix`、`metadata_only_change` 三类任务。
   - 支持 `waiver_allowed` 和 `pass_statuses`，为后续扩展保留结构。

2. **新增 `scripts/check_strict_execution.sh`**
   - 作为本地 completion guard 和 CI merge check 的最小共享入口。
   - 校验 `task.json`、required receipts、waiver 是否存在且有效。
   - 对非可豁免 receipt 明确返回失败。

3. **新增 strict execution 测试与 fake task fixtures**
   - 新增 `scripts/tests/test_strict_execution_guards.sh`
   - 新增 `scripts/tests/fixtures/fake-tasks/`
   - 覆盖通过路径、缺 `unit_test receipt`、缺 `root_cause receipt`、非可豁免 waiver 失败、可豁免 waiver 成功

4. **`rules/project-overview.md`**
   - 新增 strict execution policy 与 guard 的真相源说明。

### 为什么要做这个优化

1. 之前的 strict execution 只有文档定义，没有任何可执行控制面，无法真正拦截“缺测试”“缺根因分析”的任务。
2. `Phase 2` 的目标不是做完整平台化控制系统，而是先提供一个最小、可脚本验证、可被 CI 复用的硬门禁入口。
3. 先用固定 fixtures 验证失败路径，能避免把“receipt / waiver / completion guard”继续停留在口头约束层。

---

## 2026-03-31 — Scope Guard 预算分层：从统一硬预算升级为 Hard / Soft / Phase Gate

### 优化了什么

1. **`rules/scope-guard.md`**
   - Scope Card 新增 `执行模式` 字段，明确区分 `Hard Budget / Soft Budget / Phase Gate`。
   - 检索预算章节升级为“预算与检查点”，不再默认用同一种文件/搜索硬上限约束所有任务。
   - 新增 `Soft Budget` 规则：对 `Small` 任务使用预警阈值，而不是一触即停。
   - 新增 `Phase Gate` 规则：对 `Medium+`、RCA、脚本/CI/生成器、目录迁移、harness 优化等任务，改用阶段 gate、receipt、晋级规则控制。
   - 新增 Bug/RCA 和 Harness/Infra/Meta 优化的额外约束，明确它们不应主要被文件计数驱动。
   - 新增 `Phase Gate 模式的最低要求` 与 `Phase Receipt` 回执模板。

### 为什么要做这个优化

1. 统一的文件数/搜索轮次硬预算，对 `Micro` 任务有效，但对 RCA、脚本、生成器、目录迁移和 harness 优化并不合理。
2. 对 infra / harness 类工作，真正应控制的是阶段边界、blocking checks 和晋级条件，而不是机械地数读了多少文件。
3. 如果不做这层分化，Scope Guard 会从“防漂移的保险丝”退化成“阻碍必要工作的统一油门”，这不符合业界最佳实践。

---

## 2026-03-31 — Phase 1：真相源收敛 + 生成/同步脚本防漂移

### 优化了什么

1. **`scripts/generate_agents_readme.sh`**
   - 生成的 `AGENTS.md` 不再维护手写 Skill 总表，改为只声明 Skill 路由真相源与加载原则。
   - `README.md` 的 Skills 清单标题改为更通用的“按实际扫描顺序”。
   - Skill 排序逻辑新增对 `shared / families / platforms` 结构的兼容。
   - 项目元信息提取收紧为“只从 PRD / Spec 类文档读取平台与一句话描述”，避免普通评估文档污染根文档。
   - 同时保留对 `## Launch Platform` / `## Target Platform` 这种 section 形式的正式支持。

2. **`scripts/sync_claude_skills.sh`**
   - 同步完成后会清理 `.claude/skills/` 下已不再存在于源目录中的陈旧 `SKILL.md` 指针。
   - 清理空目录，减少结构迁移时的静默漂移。

3. **`rules/project-overview.md`**
   - 从过期的静态目录树，改为真实职责边界与真相源说明。
   - 明确 `AGENTS.md` 和 Skills 索引应由脚本生成，而不是人工复制维护。

4. **脚本测试**
   - `scripts/tests/test_generate_agents_readme.sh` 新增对 layered structure 的覆盖，并验证 AGENTS 不再输出重复 Skill 总表。
   - 同一测试新增“忽略 incidental platform mentions”的用例，防止普通文档误改项目目标平台。
   - 新增 `scripts/tests/test_sync_claude_skills.sh`，验证深层目录同步和陈旧指针清理。

### 为什么要做这个优化

1. `AGENTS.md` 手写 Skill 总表与 `skills/**/SKILL.md` 同时存在，会天然制造双真相源和结构漂移。
2. 目录迁移到 `shared / families / platforms` 后，生成脚本和同步脚本必须先具备兼容能力，否则后续结构重组会先把基础设施改坏。
3. `.claude/skills` 如果不清理陈旧指针，会在结构迁移过程中累积脏状态，导致下游读取到过期 Skill 路径。

---

## 2026-03-22 — manage-backlog: AI 自动推断模块和验收标准 + 图片自动转存

### 优化了什么

- `skills/00-start/manage-backlog/SKILL.md`：
  - 第 5 条 模块(area) 改为可留空，AI 根据描述和项目目录结构自动推断。
  - 第 7 条 验收标准改为可留空，AI 根据需求描述和项目上下文自动生成（fix 类包含"问题不再复现"，feature 类包含功能检查+边界检查）。
  - 新增 Step 4 "Image auto-archive"：用户贴图时自动 `cp` 到 `.vibe-doc/backlog-images/{task-id}-{seq}.{ext}`。区分"有文件路径"和"内嵌贴图"两种场景，内嵌贴图时主动向用户索要路径。标注此步骤为必执行，不可跳过。
  - Backlog 模板新增 `attachments` 字段。

### 为什么要做这个优化

1. 模块和验收标准让用户手填增加了录入摩擦，AI 能根据项目上下文自动推断，用户只需在确认环节审核即可。
2. 用户贴图的原始路径在临时目录中会被定期清理，自动转存到 `.vibe-doc/backlog-images/` 确保截图不丢失。

---

## 2026-03-21 — 生成脚本升级：同步最新规则 + 新增 CLAUDE.md 桥接

### 优化了什么

1. **`scripts/generate_agents_readme.sh`**
   - AGENTS.md 模板新增 Scope Lock 硬门禁（Step 0）、超限即停（Step 5）、CHANGELOG 记录要求。
   - 新增 CLAUDE.md 生成：为 Claude Code 创建桥接文件，引导其自动加载 AGENTS.md 和核心规则。
   - 生成文件从 2 个（AGENTS.md + README.md）扩展为 3 个（+ CLAUDE.md）。

2. **`skills/00-start/generate-project-docs/SKILL.md`**
   - description 和 workflow 同步更新，覆盖 CLAUDE.md 生成和验证。

### 为什么要做这个优化

**触发事件**：在 VibeCap 项目中发现两个问题：(1) 生成脚本输出的 AGENTS.md 不包含最新的 Scope Lock 硬门禁和超限即停规则，每次重新生成会丢失手动添加的规则；(2) Claude Code 不会自动加载 AGENTS.md，需要 CLAUDE.md 做桥接。同时 `.agents/AGENTS.md` 与根目录 `AGENTS.md` 内容重复且路径错误，确认 `.agents/AGENTS.md` 为冗余文件。

---

## 2026-03-21 — Scope Guard 强化：从文本规则升级为硬门禁

### 优化了什么

1. **`rules/scope-guard.md`**
   - 顶部新增硬门禁声明：未输出 Scope Card 前禁止调用任何工具。
   - Scope Card 模板新增"预算上限"字段，要求在卡片中显式声明文件读取/搜索/测试的预算。
   - 检索预算表新增"最大测试执行次数"列。
   - 新增"超限即停机制"段：运行时计数 → 触达即停 → 发起扩范围申请 → 未获确认不继续。
   - 新增"Micro 快车道"段：Micro + 非 Critical 任务的精简 5 步流程，目标 ≤5 分钟。
   - 新增"完成回执"模板：任务结束时输出预算消耗对比。

2. **`AGENTS.md`**
   - Scope Lock 从"强制第一步"升级为"硬门禁"，明确禁止 Scope Card 之前的工具调用。
   - 完成修改后的验证步骤新增"输出预算消耗回执"要求。
   - 新增第 5 条"超限即停"规则。

### 为什么要做这个优化

**触发事件**：VibeCap 中一个 Micro 级 UI 样式修复（Keep/Copy 按钮加边框阴影）花了 19 分钟。

**根因分析**：`scope-guard.md` 的规则内容已经到位（风险分级、检索预算、验证矩阵都有），但 Agent 在实际执行时完全跳过了 Step 0 Scope Card，导致检索过宽（6-7 min）、验证过重（6-7 min，且被 sandbox 打断后重跑全量）。原因是规则只是"文本建议"，没有硬门禁机制——系统不会在 Agent 跳过 Scope Card 时自动拦截。

**本次修复思路**：将"应该做"升级为"必须做 + 不做就停"——在 AGENTS.md 层面设置门禁，在 scope-guard.md 层面增加运行时计数和自动停机，形成闭环约束。

---

## 2026-03-20 — Scope Guard：范围锁定与分级验证机制

### 优化了什么

1. **新增 `rules/scope-guard.md`**
   - 引入强制性的 Scope Card 前置步骤：任何代码变更任务启动前，Agent 必须先输出 Scope Card，锁定目标文件、风险区域、改动规模、验证计划。
   - 定义了三级风险区域（Critical / Standard / Low）和三级改动规模（Micro / Small / Medium+）。
   - 建立了验证路径矩阵：根据"风险 × 规模"两个维度决定测试深度，而非一刀切跑全量。
   - 设置了检索预算：Micro 改动最多读 2 个文件、搜索 2 轮，超出必须向用户说明。
   - 明确了任务类型路由：新功能不需要"排查根因"式的广搜，Bug 修复的排查也须遵循预算。

2. **修改 `rules/testing-rules.mdc`**
   - 在 Testing Tiers 之前新增 Validation Scaling 段，明确测试深度跟随 Scope Card 分级。
   - Tier 1 AUTO 触发增加了 scope 限定：Micro/Small 改动只跑目标测试用例。
   - Regression Awareness 段的"Run ALL existing tests"改为按 Scope Card 分级执行。

3. **修改 `rules/dev-principles.md`**
   - 第 3 条"修复 Bug 必须定位根因"增加了适用范围限定：仅适用于 Bug 修复，新功能开发不适用。
   - 所有检索行为须遵循 Scope Card 的检索预算。

4. **修改 `AGENTS.md`**
   - 上下文加载规则新增 Step 0 Scope Lock：收到任务后第一步是读 scope-guard 并输出 Scope Card。
   - 完成标准从"执行相关测试"改为"按 Scope Card 的验证计划执行测试"。

### 为什么要做这个优化

**触发事件**：在 Vibe-Capture 项目中使用 Codex 实现一个微小功能（Library 页面按 ESC 取消选择，实际只需改 2 处代码 + 1 条测试），但 Agent 花了 8 分 41 秒才完成。

**根因分析**：

- **范围漂移**：没有范围锁定机制，Agent 沿用了上下文中"多问题并行排查"的模式，读了 4+ 个不相关文件。
- **检索过宽**：`dev-principles.md` 的"定位根因"规则被泛化到新功能开发，导致 Agent 做了不必要的广泛搜索。
- **验证过重**：`testing-rules.mdc` 的 Tier 1 AUTO + Regression Awareness 没有任何微改动豁免，导致 Agent 跑了全套 314 个测试。
- **无分级验证**：所有规则对所有大小的改动施加相同力度，缺少"快车道"。

**设计约束**：改动大小不等于风险大小。一个 2 行的支付逻辑修改（Critical）必须完整验证，一个 2 行的 ESC 键盘映射（Standard）则可以只跑目标测试。所以验证路径必须由"风险 × 规模"两个维度共同决定。
