# harness-coding 与 Harness Engineering 综合评估、结构方案与执行计划

> 评估日期：2026-03-31  
> 评估身份：AI Agent Harness Architect / 多平台工作流评审  
> 文档目标：沉淀一份可直接指导 `harness-coding` 优化执行的方案文档。  
> 1. 当前 `harness-coding` 与 OpenAI Harness Engineering 的差距是什么  
> 2. 基于现有仓库与实战复盘，最终推荐的目录结构、治理策略与执行计划是什么

---

## 0. 执行摘要

### 结论一句话

`harness-coding` 已经是一套有明显方法论深度的 **Full-Lifecycle Harness**，但它距离 OpenAI 所强调的 **Coding-Phase Harness** 还有三类关键差距：

1. **机械约束不足**：规则很多，但真正能被 CI / linter / structural tests 机械执行的约束很少  
2. **熵管理不足**：文档、Skill、脚本与实际仓库真相之间缺少持续校验  
3. **平台边界不够显式**：当前同时支持 iOS / macOS / Web / Browser Extension，但 shared / family / platform 三层尚未在目录与路由层面明确固化

### 总体判断

- 方向上：正确
- 广度上：明显超过 OpenAI 官方文章所覆盖的 coding 范围
- 深度上：在编码阶段的约束强度、自动验证和持续清理方面仍不足

### 最终建议

不要把 `harness-coding` 改造成 OpenAI Harness Engineering 的复制品。  
正确方向是：

- 保留你现有的全生命周期框架
- 在其下方补一层更机械的 coding harness
- 同时把目录结构重构为：
  - `shared`
  - `families`
  - `platforms`

也就是：

**继续做 Full-Lifecycle Harness，但把 Coding-Phase Harness 补强。**

---

## 1. 评估输入

本次综合评估基于以下材料：

### 当前仓库材料

- `AGENTS.md`
- `rules/scope-guard.md`
- `rules/dev-principles.md`
- `rules/testing-rules.mdc`
- `rules/macos-coding.mdc`
- `skills/03-testing/00-toolchain-generator/SKILL.md`
- `skills/04-merge-gate/merge-readiness/SKILL.md`
- `skills/01-design/05-architecture/SKILL.md`

### 实战验证材料

- `/Users/diffwang/NWA/Vibe-Capture/.vibe-doc/RELEASE_RETROSPECTIVE_v1.1.0.md`

### 官方对照材料

- OpenAI: Harness engineering: leveraging Codex in an agent-first world  
  https://openai.com/index/harness-engineering/
- OpenAI: Unlocking the Codex harness: how we built the App Server  
  https://openai.com/index/unlocking-the-codex-harness/

---

## 2. OpenAI Harness Engineering 的关键基线

为了避免对标失真，这里先明确 OpenAI 官方文章真正强调的基线。

### 2.1 核心关注点

OpenAI 的文章重点不是“如何设计一整套产品研发流程”，而是：

- 如何让 Agent 在仓库里稳定地产出代码
- 如何让代码、测试、文档、审查、验证构成闭环
- 如何把人类判断编码成结构化环境与机械约束

### 2.2 官方文章的几个关键点

根据 OpenAI 2026-02-11 的官方文章，几个最关键的实践是：

- `AGENTS.md` 应该是目录，不应变成巨大的百科全书
- 仓库知识应成为唯一真相源
- 需要渐进式披露，而不是一次性塞满上下文
- 需要机械化约束，而不是只靠口头规范
- 需要 custom lints 和 structural tests
- linter 错误消息本身应成为 Agent 的修复上下文
- 需要持续性的 garbage collection，而不是等技术债爆炸后再集中清理
- merge 哲学会因为 agent throughput 变化而变化，阻塞式 gate 需要重新权衡

### 2.3 对 `harness-coding` 的意义

这意味着对标时不能只看“有没有文档、有没有 Skill、有没有流程”，还必须看：

- 这些规则是否可机械执行
- 这些文档是否持续 freshness 校验
- 平台差异是否被明确建模
- 反馈是否足够早，而不是等到 release 才暴露

---

## 3. 当前 `harness-coding` 的整体判断

### 3.1 强项

当前仓库最强的部分有四个。

#### 1. Full-Lifecycle 覆盖很完整

和 OpenAI 官方文章聚焦 coding phase 不同，`harness-coding` 已经覆盖：

- 需求澄清
- PRD
- IA / User Flow
- Design Token
- Architecture
- Product Spec
- Development
- Testing
- Merge Gate
- Release / Fastlane

这一点不是弱项，而是你的核心差异化。

#### 2. Scope Guard 很强

`rules/scope-guard.md` 里的 Scope Card、预算上限、超限即停，是非常有价值的 agent 行为约束。  
这类机制在 OpenAI 官方文章里没有被同等明确地产品化表达。

#### 3. 渐进式知识加载已经做对

当前结构中：

- `rules/` 提供全局约束
- `skills/` 提供流程与方法论
- `references/` 提供深入参考

这本质上已经符合“AGENTS 做目录、下钻加载知识”的方向。

#### 4. 测试与发布意识比一般提示词框架强很多

`testing-rules.mdc`、`toolchain-generator`、`merge-readiness`、`release-audit` 说明你已经把测试与发布纳入了 agent workflow，而不是只关注“代码能不能写出来”。

### 3.2 核心差距

当前真正的短板主要集中在三类。

#### A. Mechanical Constraints 不够

目前很多规则还是“告诉 Agent 应该怎么做”，而不是“如果做错就一定跑不过去”。

典型表现：

- 缺少 dependency layer enforcement
- 缺少 structural tests
- 缺少统一的 custom lint 体系
- 缺少 remediation-oriented error messages
- 规则很多，但 hard gate 较少

这会导致：

- Agent 容易在大致正确、局部错误的路径上浪费时间
- 同类错误需要多轮返工
- review 成本上升

#### B. Entropy Management 不够

当前仓库已经存在“文档/Skill/脚本与实际情况不同步”的信号。

典型表现：

- `rules/project-overview.md` 已明显滞后于当前实际目录
- AGENTS 中既声明“不维护重复映射”，又维护了大表
- 实战项目中还出现了 Skill 和 Fastlane lane 不一致

这意味着：

- 你已经不是理论上的漂移风险，而是正在发生文档漂移
- 仓库正在接近“看起来像真相源，但并非持续可靠”的状态

#### C. 平台边界建模还不够显式

当前仓库已经有平台意识，但还没把边界做实。

当前的混合状态大致是：

- 有 shared 方法论
- 有部分 Apple 家族共享内容
- 有部分 Web / Extension 平台内容
- 但目录层面没有显式 shared / family / platform 模型

结果是：

- 某些规则会误以为自己是“全局规则”
- 某些 Skill 会被错误复用于不合适的平台
- 平台差异只能靠经验记住，而不是靠目录和路由固定

---

## 4. 逐维度对比：`harness-coding` vs Harness Engineering

### 4.1 Context Engineering

### 现状判断

这一维度整体偏强。

优点：

- 仓库内知识组织已成体系
- Skill 机制天然支持渐进式披露
- `.harness-docs/` 已经承载仓库自身的设计与过程资产
- Scope Guard 让任务边界更加清晰

缺点：

- `AGENTS.md` 仍有变成大路由清单的倾向
- 缺少文档 freshness 的自动化校验
- 缺少更明确的目录映射与 cross-link 验证
- 动态上下文还很弱，尤其是 logs / metrics / traces / CI status

### 结论

`harness-coding` 在静态 context engineering 上已经不错；  
真正不足的是：

- 动态 context
- 文档 freshness
- 目录与平台映射的机械校验

### 4.2 Architectural Constraints

### 现状判断

这是最大差距。

优点：

- 已经有一些“硬门禁”思想，例如 Scope Guard
- 已经开始引入本地化 hard gate、测试 gate、merge gate

不足：

- 还没有平台化 / 分层化的 architecture constraints
- 缺少真正的 structural tests
- 缺少统一 lint family
- 还没有把“错误消息 = 修复指令”做成通用模式

### 结论

你不是没有约束意识，而是约束的“工程化落地程度”还不够。

### 4.3 Entropy Management

### 现状判断

这是第二大差距。

优点：

- 有 `CHANGELOG.md`
- 有文档生成脚本
- 有 release retrospective 这类高价值反思文档

不足：

- 缺少周期性 doc gardening
- 缺少 Skill / script / Fastlane / config 的一致性检查
- 缺少 recurring cleanup / sweep 机制
- 缺少“平台切换时必须同步更新相关知识资产”的固定流程

### 结论

目前的回顾与复盘质量不低，但缺的是“复盘结果被自动再编码回 harness”的闭环速度。

---

## 5. Vibe-Capture 回顾与 `harness-coding` 差距之间的关联

`VibeCap v1.1.0` 回顾并不是一份独立问题清单，它几乎可以视作 `harness-coding` 当前差距的现场证据。

### 5.1 直接同源的问题

#### 1. 合规与发布要求后置发现

回顾中明确写到：

- PrivacyInfo
- Hardened Runtime
- debug 泄漏
- Fastlane 版本配置

这些问题“直到 release-audit 才发现”。

这对应的不是个人失误，而是：

- release checks 没有变成默认路径
- pre-archive gate 不够早
- release harness 仍偏后置

这和 Harness Engineering 的要求完全一致：  
**反馈应该尽量前移、机械化，而不是在 release 前人工发现。**

#### 2. Skill 与实际代码脱节

回顾中明确指出：

- `release-audit` 按 iOS 写，未适配 macOS
- `deploy` Skill 指向不存在的 Fastlane lane

这与当前 `harness-coding` 的熵管理问题直接同源。  
这说明：

- “仓库是真相源”这件事还没有被机械校验
- Skill 可能被 Agent 当作权威，但它本身会陈旧

#### 3. 本地化补漏返工过多

回顾里的 4 轮本地化补漏说明一个事实：

仅靠规则文档不足以防止漏网，必须把规则变成机械检查。

这正是当前 `harness-coding` 最大短板之一。

#### 4. 热点文件职责膨胀

`CaptureModalViewController` 和 `SettingsWindowController` 成为债务汇聚点，说明当前 harness 对“模块边界”和“职责约束”的表达还不够硬。

这类问题只靠 code review 很难稳定压住，必须依赖结构约束和持续清理。

#### 5. Agent 确认不足

回顾中提到：

- 文案返工
- Fastlane 平台前缀返工
- Accessibility 引导逻辑返工

这说明当前 harness 对“先读真实接口 / 先确认用户判断项 / 再动手”的约束还不够强。

### 5.2 部分相关，但不是同一层级的问题

有些问题并非 harness 本身缺陷，但 harness 应该更早暴露它们：

- 多屏幕 / 全屏 Space：属于 macOS 平台知识 + 环境矩阵问题
- ASC 500 / 上传波动：属于外部系统稳定性问题

这些问题不能完全靠 harness 消灭，但 harness 应该做到：

- 更早发现
- 更清晰诊断
- 更低返工成本

### 5.3 结论

Vibe-Capture 回顾证明了：

`harness-coding` 当前最大的问题不是“Agent 不够聪明”，而是“很多问题发现得太晚”。  

这与 OpenAI 官方文章强调的方向是同一个结论。

---

## 6. 最终建议：`harness-coding` 应该长成什么样

### 6.1 总体方向

我的建议不是“按平台拆成四套完全独立的 Harness”，也不是“继续把所有平台逻辑混在一套目录里”。

正确方案是：

**单仓库 + 统一方法论 + 显式三层结构**

三层结构为：

- `shared`
- `families`
- `platforms`

### 6.2 为什么不能继续混在一起

如果继续混在一起，会持续出现以下问题：

- 全局规则实际只适用于部分平台
- 平台差异只能靠经验记忆
- 技术家族共享资产无法正确复用
- AGENTS 路由越来越长
- Skill 容易误配或过期

### 6.3 为什么也不建议完全拆开

如果拆成四套完全独立目录或四个仓库，又会丢掉你的真正优势：

- Full-Lifecycle 方法论复用
- Scope Guard 统一规范
- Testing / Merge / Release 的共通语言
- 设计与架构阶段的统一框架

所以应保留一套 shared harness，把平台差异放在更低层。

---

## 7. 推荐目录结构

下面这套结构是本次评估的最终推荐版本。

```text
harness-coding/
├── AGENTS.md
├── CLAUDE.md
├── CHANGELOG.md
├── .harness-docs/
│   ├── evaluations/
│   ├── retrospectives/
│   └── proposals/
├── rules/
│   ├── shared/
│   ├── families/
│   │   ├── apple/
│   │   └── browser/
│   └── platforms/
│       ├── ios/
│       ├── macos/
│       ├── web/
│       └── extension/
├── references/
│   ├── shared/
│   ├── families/
│   │   ├── apple/
│   │   └── browser/
│   └── platforms/
│       ├── ios/
│       ├── macos/
│       ├── web/
│       └── extension/
├── skills/
│   ├── shared/
│   ├── families/
│   │   ├── apple/
│   │   └── browser/
│   └── platforms/
│       ├── ios/
│       ├── macos/
│       ├── web/
│       └── extension/
├── scripts/
│   ├── shared/
│   ├── checks/
│   │   ├── shared/
│   │   ├── families/
│   │   └── platforms/
│   └── tests/
└── templates/
    ├── shared/
    ├── families/
    └── platforms/
```

### 7.1 哪些是跨平台共同维护的

应进入 `shared/` 的内容：

- Scope Guard
- Dev Principles
- 通用 Testing Methodology
- Merge Readiness 编排逻辑
- Backlog 管理
- 需求澄清
- PRD / IA / Architecture 通用工作流
- 文档与索引生成脚本
- 通用设计原则

### 7.2 哪些是平台家族共同维护的

应进入 `families/apple/` 的内容：

- Swift / Xcode / XCTest 共享规则
- Localization 共享规则
- Fastlane / App Store 类技能
- Apple Native 设计系统

应进入 `families/browser/` 的内容：

- React / TypeScript / 浏览器环境规则
- Web + Extension 共用 testing toolchain
- Browser shared design system

### 7.3 哪些是平台特有的

应进入 `platforms/ios/` 的内容：

- iOS Product Spec 模板
- iOS 特有发布和设备能力规则

应进入 `platforms/macos/` 的内容：

- macOS coding rules
- 多窗口 / 菜单栏 / Panel / Space / Hardened Runtime 规则

应进入 `platforms/web/` 的内容：

- Web Product Spec
- Web 部署与性能预算

应进入 `platforms/extension/` 的内容：

- Browser Extension Product Spec
- Popup / Side Panel / Manifest / permissions / store packaging

### 7.4 AGENTS 路由应该如何变化

调整后，AGENTS 不应再维护大而全的 Skill 映射表。  
推荐改成“路由说明书”：

1. 先加载 `shared`
2. 再加载 `family`
3. 最后加载 `platform`

例如：

- macOS 任务：`shared -> apple -> macos`
- Browser Extension 任务：`shared -> browser -> extension`
- 纯流程任务：仅 `shared`

### 7.5 `rules/` 需要比当前文档写得更完整

前面的总目录树已经说明了 `rules/` 要按 `shared / families / platforms` 分层，但如果只停留在这一层，落地时仍会继续模糊。  
更完整的推荐是：

```text
rules/
├── shared/
│   ├── scope-guard.md
│   ├── dev-principles.md
│   ├── testing-policy.mdc
│   └── doc-freshness.md
├── families/
│   ├── apple/
│   │   ├── swift-coding.mdc
│   │   ├── localization.mdc
│   │   └── release-constraints.mdc
│   └── browser/
│       ├── react-typescript.mdc
│       ├── browser-permissions.mdc
│       └── browser-packaging.mdc
└── platforms/
    ├── ios/
    │   ├── ios-coding.mdc
    │   └── ios-release.mdc
    ├── macos/
    │   ├── macos-coding.mdc
    │   └── macos-release.mdc
    ├── web/
    │   ├── web-coding.mdc
    │   └── web-release.mdc
    └── extension/
        ├── extension-coding.mdc
        └── extension-release.mdc
```

这里有三个关键点：

1. `scope-guard`、`dev-principles`、`testing-policy` 这类仍然是 shared
2. Apple / Browser 家族规则要显式单列，不能直接跳到单平台
3. 当前的 `macos-coding.mdc` 不应被粗暴整体改名成 `swift-coding.mdc`

更合理的演化方式是：

- 先把其中真正属于 Swift / Xcode 共享部分上提到 `families/apple/swift-coding.mdc`
- 再把窗口、菜单栏、Panel、Space、Sandbox、Hardened Runtime 这类 macOS 专属规则保留在 `platforms/macos/macos-coding.mdc`

也就是说：

**语言共享 != 平台共享。**

### 7.6 `references/` 也值得补得更完整

`references/` 看起来比 `skills/` 更“静态”，但它同样需要显式边界。  
否则后续会出现：

- 设计系统文件归属不清
- browser 技术参考和 shared 设计原则混放
- Agent 难以判断什么时候读 family 参考，什么时候读 platform 参考

更完整的推荐是：

```text
references/
├── shared/
│   ├── design-principle.md
│   ├── frontend-design/
│   ├── interactive-prototype/
│   └── engineering-practices/
├── families/
│   ├── apple/
│   │   └── design-system/
│   │       └── apple-native-app.md
│   └── browser/
│       ├── tech-best-practices/
│       └── design-system/
│           └── browser-shared.md
└── platforms/
    ├── ios/
    │   ├── ios-reference.md
    │   └── design-system/
    │       └── ios-app.md
    ├── macos/
    │   ├── macos-reference.md
    │   └── design-system/
    │       └── macos-app.md
    ├── web/
    │   ├── web-reference.md
    │   └── design-system/
    │       └── web-app.md
    └── extension/
        └── design-system/
            └── browser-extension.md
```

这里要特别区分两类东西：

- `shared` 里的 `frontend-design/`、`interactive-prototype/` 更像设计与交互 craft reference，本身不直接等于某个平台 runtime profile
- `families/browser/` 下的内容则是 React / TypeScript / 浏览器技术家族相关的参考

因此，虽然 `frontend-design` 这个 Skill 更适合归到 browser family，但 `references/frontend-design/*` 这组参考仍然可以继续留在 `shared`，因为它们更像通用设计方法，而不是平台约束。

另外，当前 `references/design system/` 这个目录名本身也建议调整：

- 使用 `design-system/`
- 避免目录名带空格
- 并把其中内容拆入 `families/` 与 `platforms/`

### 7.7 `skills/` 需要引入第二个轴

`skills/` 是当前最值得补细的部分。  
仅仅写成：

- `shared`
- `families`
- `platforms`

还不够，因为你现在的 `skills/` 里混了三种完全不同的东西：

1. 真正可触发执行的 Skill
2. 平台适配层，例如 toolchain / profile
3. 资产文件，例如 template / question bank

如果不把这三类分开，目录再怎么分层，语义还是会继续混。

因此，`skills/` 的完整推荐结构应该是：

```text
skills/
├── shared/
│   ├── workflows/
│   │   ├── foundation/
│   │   │   ├── generate-project-docs/
│   │   │   ├── manage-backlog/
│   │   │   ├── sync-claude-skills/
│   │   │   ├── requirement-clarification/
│   │   │   └── commit-code/
│   │   ├── product/
│   │   │   ├── new-project-prd/
│   │   │   ├── ia-user-flow/
│   │   │   ├── design-token-generator/
│   │   │   ├── design-system-guide/
│   │   │   ├── architecture-design/
│   │   │   └── product-spec/
│   │   ├── develop/
│   │   │   └── systematic-debugging/
│   │   ├── testing/
│   │   │   ├── 00-toolchain-generator/
│   │   │   ├── 01-unit-test/
│   │   │   ├── 02-integration-test/
│   │   │   ├── 03-api-test/
│   │   │   ├── 04-ui-test/
│   │   │   ├── 05-snapshot-test/
│   │   │   ├── 06-e2e-test/
│   │   │   ├── 07-functional-test/
│   │   │   ├── 08-smoke-test/
│   │   │   ├── 09-acceptance-test/
│   │   │   ├── 10-performance-test/
│   │   │   └── 11-accessibility-test/
│   │   └── merge/
│   │       └── merge-readiness/
│   └── assets/
│       ├── prd/
│       ├── ia-user-flow/
│       ├── design-token/
│       └── architecture/
├── families/
│   ├── apple/
│   │   ├── workflows/
│   │   │   ├── develop/
│   │   │   │   └── localization-handler/
│   │   │   └── release/
│   │   │       ├── fastlane-base-metadata-builder/
│   │   │       ├── fastlane-metadata-localization/
│   │   │       ├── fastlane-keyword-refinement/
│   │   │       ├── fastlane-preflight-check/
│   │   │       └── fastlane-deploy/
│   │   ├── adapters/
│   │   │   └── testing/
│   │   │       └── swift-xcode/
│   │   │           ├── unit.md
│   │   │           ├── integration.md
│   │   │           ├── ui.md
│   │   │           ├── snapshot.md
│   │   │           ├── e2e.md
│   │   │           ├── performance.md
│   │   │           └── accessibility.md
│   │   └── assets/
│   │       └── architecture/
│   │           └── questions.md
│   └── browser/
│       ├── workflows/
│       │   └── design/
│       │       ├── frontend-design/
│       │       └── interactive-prototype/
│       └── assets/
│           └── architecture/
│               ├── questions-web.md
│               └── questions-extension.md
└── platforms/
    ├── ios/
    │   ├── workflows/
    │   │   └── release/
    │   │       └── release-audit/
    │   └── assets/
    │       └── product-spec/
    │           └── template.md
    ├── macos/
    │   └── assets/
    │       └── product-spec/
    │           └── template.md
    ├── web/
    │   └── assets/
    │       └── product-spec/
    │           └── template.md
    └── extension/
        └── assets/
            └── product-spec/
                └── template.md
```

### 7.8 `skills/` 的归类原则要写死

这套结构里最关键的不是目录名字，而是以下三条原则：

1. 只有包含 `SKILL.md` 的目录才算“可执行 Skill”
2. `toolchain`、`template`、`question bank` 不是 Skill，而是 adapters / assets
3. orchestrator Skill 不要因为依赖平台资产就被粗暴拆成四个平台版本

因此，下面这些 Skill 应保持为 shared orchestrator：

- `design-system-guide`
- `product-spec`
- `architecture-design`
- `00-toolchain-generator`
- `merge-readiness`

它们的做法应该是：

- Skill 本体留在 `shared/workflows`
- family / platform 差异通过 adapters 或 assets 注入

### 7.9 当前已有 Skill 的推荐归属

下面把当前仓库里的重点 Skill 再明确归一下类。

应进入 `shared/workflows`：

- `generate-project-docs`
- `manage-backlog`
- `sync-claude-skills`
- `requirement-clarification`
- `commit-code`
- `new-project-prd`
- `ia-user-flow`
- `design-token-generator`
- `design-system-guide`
- `architecture-design`
- `product-spec`
- `systematic-debugging`
- 全部 testing methodology skills
- `merge-readiness`

应进入 `families/apple/workflows`：

- `localization-handler`
- `fastlane-base-metadata-builder`
- `fastlane-metadata-localization`
- `fastlane-keyword-refinement`
- `fastlane-preflight-check`
- `fastlane-deploy`

应进入 `families/apple/adapters`：

- `skills/03-testing/toolchain/*-swift.md`

应进入 `families/browser/workflows`：

- `frontend-design`
- `interactive-prototype`

应进入 `platforms/ios/workflows`：

- `release-audit`

这里必须特别强调：

- 当前 `release-audit` 的内容是 iOS-only，不应现在就上提到 Apple family
- 当前 `frontend-design` / `interactive-prototype` 明显偏 React / Tailwind / Vite，不应继续假装全平台设计 Skill
- 当前 `Localization` 虽然描述看似通用，但执行细节明显偏 Apple / Swift 语境

### 7.10 结论

前面那张总目录树只回答了“要分 shared / families / platforms”。  
把 Skills 部分补细后，真正完整的结论应是：

- `rules/` 需要 shared / family / platform 三层
- `references/` 也需要 shared / family / platform 三层
- `skills/` 除了 shared / family / platform，还必须再加一层 `workflows / adapters / assets`

这是因为 `skills/` 的语义密度远高于 `rules/` 和 `references/`。  
如果不加第二个轴，Skills 仍然会是未来最容易继续漂移的地方。

---

## 8. 治理策略：不仅是目录，还要补哪几类机制

目录重构只是第一步。要真正缩小与 Harness Engineering 的差距，还需要治理层的补强。

### 8.1 P0：把规则变成机械约束

优先补以下能力：

- `doc-freshness` 检查
- `skill-consistency` 检查
- `fastlane-lane-consistency` 检查
- `check-hardcoded-strings` 升级为 remediation-oriented lint
- `check-platform-routing` 检查
- `pre-archive` / `pre-release` 硬闸门

### 8.2 P0：把平台 profile 提前绑定

对每个任务尽早确定：

- 当前平台
- 当前平台家族
- 当前 toolchain
- 当前 release profile

不要让 Agent 在混合上下文里自己猜。

### 8.3 P1：补齐 structural constraints

按 family / platform 定义 architecture constraints：

- Apple family 的分层边界
- Browser family 的分层边界
- 平台专属特殊限制

这些约束要落到：

- rule
- lint
- structural test

而不是只停留在文档。

### 8.4 P1：建立 entropy sweep

建议新增周期性 sweep，检查：

- 文档是否陈旧
- Skill 是否与脚本 / Fastlane / lane 名称一致
- 是否存在未引用的流程说明
- 是否有死代码、重复逻辑、热点文件膨胀

### 8.5 P2：补 observability 和 reviewer agent

这是有价值的，但应晚于前面几项。  
没有稳定的 shared/family/platform 边界前，observability 和 reviewer 只能增加复杂度。

### 8.6 模块级验收标准：按最严标准约束每个模块

如果这份文档要真正驱动后续优化，那么每个模块都必须有正式的验收标准，而不是只讲“建议”。

`rules/` 的验收标准：

- 每条 rule 必须声明作用域：`shared / family / platform`
- 每条 rule 必须区分“规范性约束”和“说明性背景”
- 规范性约束必须尽量可 lint、可脚本化或可 structural test
- 每条 rule 必须声明 freshness 触发条件和维护责任
- 不允许在同一条 rule 里混写多个平台的实施细节，除非它属于 shared 或 family

`skills/` 的验收标准：

- 每个条目必须先判定为 `workflow / adapter / asset` 三类之一
- `workflow` 必须声明触发条件、前置条件、输出物、必需 receipt、完成标准
- `adapter` 必须声明适用 family / platform，且不能被用户任务直接路由为“主 Skill”
- `asset` 必须声明由谁引用，不允许独立冒充 Skill
- 任何带 gate 性质的 workflow 都必须能映射到 strict execution 控制链

`references/` 的验收标准：

- 每份 reference 必须声明适用范围：shared / family / platform
- 每份 reference 必须声明它是“参考资料”而不是“规范来源”
- 参考资料必须尽量链接到权威来源，避免变成第二套过期规范
- 对外部生态变化敏感的 reference 必须声明复审周期

`scripts/` 的验收标准：

- 每个脚本必须有明确的 CLI 契约：输入、输出、退出码
- 每个脚本必须有对应的回归验证方式
- 任何生成型脚本都必须有 fixture 或 golden output
- 任何 gate 型脚本都必须能在本地和 CI 中稳定复现

`AGENTS.md` 的验收标准：

- 只保留路由原则、Scope Guard 和完成标准
- 不再手写重复的 Skill 映射总表
- 技能索引必须由脚本或 registry 生成，而不是人工维护
- AGENTS 必须短、准、稳定，不能再次演化成第二套过期目录说明

---

## 9. 严格执行标准

这一节回答一个更根本的问题：

**如果你希望 Agent 在写代码时绝对不漏掉 Unit Test，修 Bug 时绝不绕过 systematic-debugging，那么什么才算“严格执行”？**

结论很直接：

- 只靠目录结构，不够
- 只靠 AGENTS / SKILL.md，不够
- 只靠提示词，也不够

严格执行不能定义成“AI 应该记得”，而必须定义成：

**系统在状态机和校验层面，不允许它忘。**

### 9.1 严格执行的工程定义

在工程上，“严格执行”至少要满足四个条件：

1. 必走步骤由系统判定，不由 Agent 自由发挥
2. 必走步骤必须留下可检查的执行证据
3. 缺少证据时，任务不能进入完成状态
4. 如果要跳过，必须有显式 waiver，并留下记录

也就是说，Skill 不能只是“建议加载”，而必须成为：

- gate
- receipt
- completion check
- merge verification

这一条控制链中的正式组成部分。

### 9.2 推荐的控制链

对 `harness-coding` 来说，最值得优先建设的不是更多目录，而是这条链：

`policy registry -> preflight -> gate -> receipt -> completion guard -> merge check -> waiver`

这条链的含义如下：

- `policy registry`：机器可读地定义“什么任务必须走什么 Skill”
- `preflight`：任务开始时绑定 task type / platform / family / required skills
- `gate`：执行过程中必须经过的硬门禁
- `receipt`：每个 gate 的执行证据
- `completion guard`：没有 receipt，任务不能完成
- `merge check`：CI 或 merge gate 二次验证
- `waiver`：必要时允许跳过，但必须留痕

### 9.3 Unit Test Gate 的严格标准

如果目标是“写代码时绝对不能漏掉 Unit Test”，那就不能只写一条规则说“Every code change must have unit tests”。

更合理的严格标准是：

- 只要任务被判定为 feature / bugfix / refactor，且改动触及生产代码，就自动触发 `01-unit-test`
- Gate 触发后，必须满足以下至少一项：
  - 存在相关测试变更
  - 存在真实测试执行记录
  - 存在经批准的 waiver

如果三者都没有：

- 任务状态不能标记为完成
- merge readiness 不能给出通过结论

Unit Test Gate 必须至少记录以下 receipt 信息：

- 改动范围
- 测试命令
- 目标测试文件或测试用例
- 通过 / 失败数量
- 是否为豁免

### 9.4 Systematic Debugging Gate 的严格标准

如果目标是“遇到持续无法解决的问题时不能绕过根因分析”，那就必须明确什么情况下强制触发 `systematic-debugging`。

建议触发条件：

- 用户明确说这是 bug
- 现有测试失败
- 同一问题连续修复 2 次仍未通过
- 问题表现为 flaky / 环境相关 / 跨模块异常

一旦触发，必须先产出 root-cause receipt，至少包含：

- 复现步骤
- 预期行为 vs 实际行为
- 已观察到的信号
- 已排除的假设
- 最终根因
- 修复为何命中根因，而非只是表层症状

如果根因还没定位清楚，任务状态应是：

- `investigating`
- 或 `blocked`

而不是“先修一个试试看然后宣称完成”。

### 9.5 Waiver 机制

严格系统必须允许例外，但例外要留痕。

waiver 至少要记录：

- 为什么跳过
- 风险是什么
- 谁批准
- 何时过期

没有 waiver，就不允许跳过 gate。

### 9.6 对当前仓库的最高 ROI 落地顺序

按投入产出比，我建议先落这两类硬门禁：

1. `unit-test gate`
2. `systematic-debugging gate`

理由很简单：

- 它们对应你最明确的“严格执行”诉求
- 它们能直接减少“先做再说”“修了但没测”“没定位根因就改”的返工
- 它们比先补 reviewer agent 或 observability 更靠近当前真实痛点

换句话说，当前真正优先的不是“继续扩目录”，而是先把最关键的两条强约束落到控制面。

### 9.7 为什么这一节先放在总评文档里

这一部分现在适合作为 `master review` 的一个章节，而不是独立文档。  
原因是你当前还处在“方案收敛阶段”，不是“开始实现 registry / receipt schema”的阶段。

等你准备真正落地时，再把这一节拆成独立规范文档，例如：

- `strict-execution-standard.md`

届时再细化：

- 状态机
- policy registry 字段
- receipt JSON 结构
- waiver 审批规则

---

## 10. 实施前置交付物

按最严标准，这份文档要进入“可以直接开工”的状态，必须先补齐以下交付物。

### 10.1 完整迁移矩阵

目录方案只有在存在完整迁移矩阵时才具备实施价值。

矩阵至少必须包含这些列：

- `current_path`
- `target_path`
- `module_type`：`rule / workflow / adapter / asset / reference / script`
- `scope_layer`：`shared / family / platform`
- `family_or_platform`
- `migration_phase`
- `depends_on`
- `compatibility_required`
- `rollback_plan`

验收标准：

- 当前仓库中的每个 `rules/`、`skills/`、`references/`、`scripts/` 文件都必须出现在矩阵中
- 没有“待定归属”的文件
- 没有只写原则、不写路径的条目
- 第一阶段和后续阶段的依赖关系明确

### 10.2 Strict Execution 最小实现契约

严格执行不能只停留在概念层，至少需要一版最小可实现契约。

`policy registry` 最小字段建议如下：

```yaml
task_classes:
  feature_code_change:
    match:
      intents: ["feature", "implementation", "refactor"]
      touches_production_code: true
    required_workflows:
      - shared/workflows/testing/01-unit-test
    required_receipts:
      - unit_test

  bugfix:
    match:
      intents: ["bugfix"]
      touches_production_code: true
    required_workflows:
      - shared/workflows/develop/systematic-debugging
      - shared/workflows/testing/01-unit-test
    required_receipts:
      - root_cause
      - unit_test
```

`unit_test receipt` 最小字段建议如下：

```json
{
  "type": "unit_test",
  "status": "passed",
  "task_class": "feature_code_change",
  "scope": {
    "files": ["src/example.swift"],
    "tests": ["Tests/ExampleTests.swift"]
  },
  "command": "xcodebuild test ...",
  "result": {
    "passed": 12,
    "failed": 0
  },
  "waiver_id": null
}
```

`root_cause receipt` 最小字段建议如下：

```json
{
  "type": "root_cause",
  "status": "completed",
  "task_class": "bugfix",
  "repro_steps": ["..."],
  "expected_behavior": "...",
  "actual_behavior": "...",
  "signals": ["..."],
  "hypotheses_eliminated": ["..."],
  "root_cause": "...",
  "why_fix_hits_root_cause": "..."
}
```

`waiver` 最小字段建议如下：

```json
{
  "id": "waiver-001",
  "gate": "unit_test",
  "reason": "hotfix for broken CI environment",
  "risk": "regression risk remains unverified",
  "approved_by": "owner",
  "expires_at": "2026-04-15"
}
```

完成检查的最低规则：

- 缺必需 receipt，任务不能进入 `done`
- 缺 waiver，不允许跳过 gate
- 本地完成检查失败时不能宣称任务已完成
- CI merge check 失败时不能给出 merge-ready 结论

### 10.3 Harness 自验证方案

`harness-coding` 不是普通文档仓库，它本身就是工作流系统，因此必须验证自己。

最小自验证范围：

- `scripts/generate_agents_readme.sh` 在新结构下仍能扫描所有 `SKILL.md`
- `scripts/sync_claude_skills.sh` 在新结构下仍能同步
- 生成后的 AGENTS / README 不出现失效路径或重复索引
- `shared / family / platform` 路由能在 synthetic fixture repo 中被稳定验证
- strict execution gate 能拦住“缺 unit test receipt”“缺 root-cause receipt”的假任务

建议新增或补强的验证资产：

- `scripts/tests/test_generate_agents_readme.sh`
- `scripts/tests/test_sync_claude_skills.sh`
- `scripts/tests/test_strict_execution_guards.sh`
- `scripts/tests/fixtures/`：最小 shared / apple / browser / platform fixture
- `scripts/tests/fixtures/fake-tasks/`：用于验证 gate / receipt / waiver 行为

验收标准：

- 迁移前后脚本行为差异可比较
- 任一错误路径都能被测试拦下，而不是靠人工看输出
- 新目录结构下，生成脚本和校验脚本都能稳定跑通
- 每个关键脚本至少有一条成功路径和一条失败路径 fixture

### 10.4 First Implementation Slice

第一批改动必须足够小，能验证方向，但不能一上来重排整个仓库。

第一批只应触及：

- `[AGENTS.md](/Users/diffwang/NWA/harness-coding/AGENTS.md)`
- `[rules/project-overview.md](/Users/diffwang/NWA/harness-coding/rules/project-overview.md)`
- `[scripts/generate_agents_readme.sh](/Users/diffwang/NWA/harness-coding/scripts/generate_agents_readme.sh)`
- `[scripts/sync_claude_skills.sh](/Users/diffwang/NWA/harness-coding/scripts/sync_claude_skills.sh)`
- `[scripts/tests/test_generate_agents_readme.sh](/Users/diffwang/NWA/harness-coding/scripts/tests/test_generate_agents_readme.sh)`
- 新增的 `scripts/tests/fixtures/` 最小样本
- 必要的 `.harness-docs/` 实施说明更新

第一批明确不做：

- 不一次性迁移全部 `skills/`
- 不重写全部 `rules/`
- 不引入 reviewer agent
- 不引入 observability 体系
- 不铺开全平台 release workflow

第一批完成标准：

- AGENTS 从手写索引退回到“路由原则 + 生成结果”
- 生成脚本对深层结构兼容
- 至少有一版最小 policy registry / receipt 校验原型
- 至少有一组 fixture 能验证 shared / family / platform 路由

第一批逐文件目标：

- `AGENTS.md`：删除手写 Skill 索引依赖，保留路由原则、Scope Guard、完成标准
- `rules/project-overview.md`：改成真实结构概览，或明确退役并由生成文档替代
- `scripts/generate_agents_readme.sh`：支持深层目录、支持 `workflow / adapter / asset` 分类
- `scripts/sync_claude_skills.sh`：支持新结构扫描或至少对新结构保持兼容
- `scripts/tests/test_generate_agents_readme.sh`：增加 shared / family / platform fixture
- `scripts/tests/test_sync_claude_skills.sh`：验证同步脚本在新结构下不失效
- `scripts/tests/test_strict_execution_guards.sh`：验证缺 receipt / 缺 waiver 会被拦截

### 10.5 兼容与回滚策略

这类仓库会被下游项目消费，所以不能按“纯内部重构”处理。

最低要求：

- 旧路径在一个迁移窗口内保留兼容层，或提供清晰映射
- 关键脚本在迁移期间支持 old/new path 双读
- 生成文档在迁移期间明确标出新旧路径差异
- 每一阶段都能独立回滚，而不是把结构迁移绑成一个大爆炸改动

回滚标准：

- 任一阶段一旦破坏脚本扫描、Skill 同步或 AGENTS 生成，必须能回退到前一阶段
- 回滚不应要求手工恢复大量目录

### 10.6 Phase Gate System

按业界最佳实践，`harness-coding` 的优化过程本身也必须被 gate 约束。  
不能等所有 Phase 结束后再统一测试；正确做法是：

**每完成一个 Phase，就运行该 Phase 的 blocking checks；未通过，禁止进入下一 Phase。**

#### 10.6.1 核心原则

1. **Automation-first**
   - Phase gate 必须优先由脚本、fixture、CI 检查完成，不能依赖“人工看起来没问题”
2. **Fail-closed**
   - 只要 blocking gate 失败，Phase 状态就只能是 `needs-fix` 或 `blocked`
3. **No batch validation**
   - 不允许把多个 Phase 的验证堆到最后一次性执行
4. **Blocking vs advisory 分离**
   - gate 分为 `blocking` 和 `advisory`
   - 只有 advisory 可以在不阻断推进的前提下记录风险
5. **Promotion by receipt**
   - 每个 Phase 完成后必须生成 phase receipt；没有 receipt，不能进入下一 Phase
6. **Rollback-ready**
   - 每个 Phase 都必须有可独立回滚的边界，不能把多个结构变更绑成单个不可逆操作

#### 10.6.2 Gate 分类

`Structure Gate`

- 验证目录、生成脚本、路由和索引没有被破坏
- 适用于 Phase 1、Phase 4，且这些阶段必须把它视为 blocking

`Strict Execution Gate`

- 验证 `policy registry`、`receipt`、`completion guard`、`merge check` 真的在拦截错误任务
- 适用于 Phase 2，且必须是 blocking

`Compatibility Gate`

- 验证迁移期间 old/new path、旧脚本入口、下游消费方式仍可用
- 适用于 Phase 1、Phase 3、Phase 4，且迁移窗口内必须是 blocking

`Quality Gate`

- 验证 lint、structural tests、remediation messages 是否正常工作
- 适用于 Phase 5，必须是 blocking

`Observability Gate`

- 验证 sweep、tracking、reviewer / observability 机制不会破坏前面的基础能力
- 适用于 Phase 6，多数情况可以先作为 advisory，再逐步升级

#### 10.6.3 Phase Receipt 最小字段

每个 Phase 完成后都必须留下 phase receipt，至少包含：

```json
{
  "phase": "Phase 2",
  "status": "passed",
  "changed_files": [
    "scripts/tests/test_strict_execution_guards.sh"
  ],
  "blocking_checks": [
    {
      "name": "strict_execution_guards",
      "status": "passed",
      "command": "bash scripts/tests/test_strict_execution_guards.sh"
    }
  ],
  "advisory_checks": [],
  "waivers": [],
  "promoted_to_next_phase": true
}
```

最低要求：

- blocking check 必须逐项列出命令与结果
- advisory check 不能伪装成 blocking 通过
- 任何 waiver 都必须关联 gate 名称和过期时间
- `promoted_to_next_phase=false` 时，禁止启动下一 Phase

#### 10.6.4 不可豁免的 Gate

不是所有 gate 都允许 waiver。对这个项目，以下 gate 在对应 Phase 中应视为**不可豁免**：

- AGENTS / README 生成失败
- Skill 扫描缺失或路径失效
- `sync_claude_skills.sh` 在迁移后的结构上失效
- 缺 `unit_test receipt`
- 缺 `root_cause receipt`
- shared / family / platform fixture 路由错误

这些问题一旦出现，必须修复或回滚，不能靠 waiver 继续推进。

#### 10.6.5 阶段晋级规则

每个 Phase 的晋级必须同时满足：

1. 本阶段目标范围内的改动已完成
2. 本阶段所有 blocking gate 全部通过
3. phase receipt 已生成
4. 没有未过期且影响 blocking gate 的缺陷
5. 没有未批准的范围扩张

只要有一项不满足，就不得进入下一 Phase。

#### 10.6.6 每个 Phase 的 Blocking Gates

| Phase | Blocking Gates | Required Receipt | 进入下一 Phase 的硬条件 |
|---|---|---|---|
| `Phase 0` | migration matrix completeness check, scope classification review | `phase_0_receipt` | 所有现有文件已归类，无 `TBD` 条目 |
| `Phase 1` | Structure Gate, Compatibility Gate | `phase_1_receipt` | AGENTS/README 生成正常；同步脚本正常；overview 不再漂移 |
| `Phase 2` | Strict Execution Gate | `phase_2_receipt` | feature/bugfix 缺 receipt 会失败；completion guard 生效 |
| `Phase 3` | Compatibility Gate, release/localization checks | `phase_3_receipt` | pre-release 路径前移成功；本地化 gate 可执行 |
| `Phase 4` | Structure Gate, Compatibility Gate, fixture routing checks | `phase_4_receipt` | shared/family/platform 路由稳定；old/new path 在迁移窗口内可用 |
| `Phase 5` | Quality Gate | `phase_5_receipt` | lint / structural test / remediation output 稳定 |
| `Phase 6` | baseline regression checks；其余可先 advisory | `phase_6_receipt` | sweep / tracking / reviewer 不破坏前面全部 blocking gate |

#### 10.6.7 最佳实践约束

为了避免“为了 gate 而 gate”，还需要同时遵守这些约束：

- 每个 Phase 只验证一个主能力簇，不把无关改动塞进同一阶段
- 每个 blocking gate 都必须有稳定、可重复执行的命令
- phase receipt 应该优先由脚本生成，避免手写回执
- advisory check 的数量应受控，避免把噪音伪装成治理
- 如果某个 gate 连续两轮频繁误报，应先修 gate，再继续推进 Phase
- 如果某个 Phase 的 gate 设计导致无法稳定重复运行，说明 gate 本身尚未达标，不应提升到 blocking

---

## 11. 分阶段执行计划

下面给出一个建议的落地顺序。

### Phase 0：对齐边界模型

目标：

- 在不迁移文件的前提下，先确定 shared / family / platform 三层模型

输出：

- 目录规范文档
- 命名规范文档
- 当前文件归属 mapping
- 第一版迁移矩阵
- 第一版 self-test 设计

完成标准：

- 每个现有 rule / skill / reference / script 都能被归入一层
- `Phase 0` receipt 已生成，且 migration matrix 没有 `TBD`

### Phase 1：先修真相源和漂移

目标：

- 解决“仓库看起来是系统真相源，但并不持续可靠”的问题

动作：

1. 缩短 AGENTS，使其只保留路由原则
2. 引入 doc freshness 规则
3. 引入 Skill / Fastfile / lane consistency 检查
4. 修正过期目录说明与 overview 文档

完成标准：

- 变更平台或 lane 时，相关文档和 Skill 不会静默失效
- `Structure Gate` 与 `Compatibility Gate` 通过，才能进入 `Phase 2`

### Phase 2：先建立最小 strict execution 控制面

目标：

- 先把最关键的两条硬门禁落地：`unit-test gate` 与 `systematic-debugging gate`

动作：

1. 引入最小 `policy registry`
2. 定义 `unit_test receipt` 与 `root_cause receipt`
3. 增加本地 completion guard
4. 增加最小 CI merge check
5. 为 gate / waiver 准备 fake task fixtures

完成标准：

- feature / bugfix 任务缺 receipt 时无法宣称完成
- bugfix 任务缺 RCA 时无法通过 merge 检查
- `Strict Execution Gate` 通过，才能进入 `Phase 3`

### Phase 3：把 release 和 localization 前移成默认闸门

目标：

- 解决 Vibe-Capture retrospective 里最明确的“后置发现”问题

动作：

1. `pre-archive` / `pre-release` 检查脚本化
2. 本地化 hard gate 进入 build phase 或 pre-commit / CI
3. 平台级检查项前移到 release 默认路径

完成标准：

- 提审类问题不会再等到 `release-audit` 最后一轮才发现
- release / localization 的 blocking checks 通过，才能进入 `Phase 4`

### Phase 4：引入平台家族结构

目标：

- 解决多平台混杂问题

动作：

1. 先迁移 `references/`
2. 再迁移 `skills/03-testing/toolchain/`
3. 再迁移 `rules/`
4. 最后迁移 `skills/` 与 `scripts/`

完成标准：

- 任何任务都能通过目录结构推断出 shared / family / platform 路由
- fixture routing checks 与迁移兼容检查通过，才能进入 `Phase 5`

### Phase 5：补齐 mechanical constraints

目标：

- 把“建议性规则”转为“可验证规则”

动作：

1. family / platform 级 architectural constraints
2. custom lint family
3. remediation-oriented error messages
4. structural tests

完成标准：

- Agent 常犯的错误可以通过工具直接拦截或指向修复动作
- Quality Gate 通过，才能进入 `Phase 6`

### Phase 6：持续熵管理与动态上下文

目标：

- 让仓库具备长期维护能力

动作：

1. entropy sweep
2. recurring doc gardening
3. hotspots tracking
4. observability adapter
5. reviewer agent

完成标准：

- 每周都能小步回收熵，而不是等到 release retrospective 再集中补课
- 新增能力不能破坏前面所有 blocking gate

---

## 12. 优先级建议

### P0

- 迁移矩阵完成
- strict execution 最小契约完成
- harness self-test 框架完成
- AGENTS 缩成真正目录
- doc freshness / consistency checks
- unit-test gate 与 systematic-debugging gate 落地
- platform/family/platform 路由模型定稿

### P1

- release / pre-archive gates 前移
- localization hard gate 机械化
- 目录结构迁移
- family/platform 级 architecture constraints
- lint error remediation 注入
- entropy sweep

### P2

- observability guide 与接入策略
- reviewer agent
- 更细粒度 quality scoring / hotspot scoring

---

## 13. 成功指标

如果这套方案有效，后续应该能看到以下变化。

### 13.1 过程指标

- release 前新发现的 blocker 数量下降
- Skill 与脚本不一致问题显著下降
- 因硬编码字符串 / 发布配置 / lane 名错误导致的返工下降
- AGENTS 长度下降，但路由准确性提高
- harness 自身回归失败能在脚本测试阶段被发现

### 13.2 结果指标

- retrospective 中“后置发现”类问题减少
- 热点文件的 commit 密度下降
- 平台相关问题更早在正确层被发现
- 文档不一致导致的误导减少
- 缺 unit test / 缺 RCA 的任务无法通过完成检查

### 13.3 组织指标

- Agent 更少依赖人工澄清平台上下文
- review 成本更低
- 多平台扩展时新增内容更容易找到归属

---

## 14. 最终结论

`harness-coding` 不需要放弃自己现有的 Full-Lifecycle 优势，也不应该机械模仿 OpenAI 的仓库形态。  

真正需要做的是三件事：

1. **把 coding-phase 约束补强到机械级别**
2. **把 shared / family / platform 边界显式化**
3. **把 retrospective 中反复出现的问题，持续回灌到 harness 本身**

如果做到这三点，`harness-coding` 会从：

- 一套很强的 AI 工作流与规则仓库

升级为：

- 一套既覆盖全生命周期、又具备 coding-phase mechanical rigor 的多平台 Agent Harness

这才是它相对于 OpenAI 官方 Harness Engineering 最有价值的演化方向。

---

## 15. 附录：推荐的下一步落地顺序

建议下一步按以下顺序推进，而不是并行铺开：

1. 固化目录分层模型
2. 补齐迁移矩阵与 self-test
3. 落最小 strict execution 控制面
4. 修正 AGENTS 与 doc freshness
5. release / localization 闸门前移
6. 目录迁移
7. structural constraints
8. entropy sweep
9. observability / reviewer

这个顺序的原因很简单：

- 先修真相源
- 再修实施契约
- 再修前置反馈
- 再修结构边界
- 最后再加高级能力

否则很容易出现“在漂移的结构上继续堆更复杂的机制”的情况。

### 15.1 第一批实施工作单

| 文件 | 第一批动作 | 不可妥协的完成标准 |
|---|---|---|
| `AGENTS.md` | 删除手写 Skill 列表依赖 | 不再维护重复索引；保留路由与硬门禁 |
| `rules/project-overview.md` | 修正或退役 | 不再与真实仓库结构冲突 |
| `scripts/generate_agents_readme.sh` | 支持深层扫描与分类输出 | 能覆盖 shared / family / platform 结构 |
| `scripts/sync_claude_skills.sh` | 增加新结构兼容 | 新旧结构至少一阶段内都能同步 |
| `scripts/tests/test_generate_agents_readme.sh` | 增加 fixture | 成功/失败路径都可验证 |
| `scripts/tests/test_sync_claude_skills.sh` | 新增 | 能验证同步脚本不因结构变化失效 |
| `scripts/tests/test_strict_execution_guards.sh` | 新增 | 缺 `unit_test` / 缺 `root_cause` 必须失败 |

### 15.2 Harness Self-Test 矩阵

| 测试对象 | 最小验证命令 | 必须拦住的问题 |
|---|---|---|
| AGENTS/README 生成 | `bash scripts/tests/test_generate_agents_readme.sh` | 深层 Skill 未被扫描、路径失效、重复索引 |
| Claude Skill 同步 | `bash scripts/tests/test_sync_claude_skills.sh` | 新结构下同步遗漏、路径错误 |
| Strict execution guards | `bash scripts/tests/test_strict_execution_guards.sh` | 缺 `unit_test receipt`、缺 `root_cause receipt`、缺 waiver |
| Fixture routing | 由测试脚本驱动 fixture repo | shared / family / platform 误路由 |

### 15.3 当前仓库完整迁移矩阵

以下矩阵覆盖当前仓库中已有的 `rules/`、`skills/`、`references/`、`scripts/` 文件。  
目标不是一次性全部迁移，而是确保**每个现有文件都已有明确归属**。

#### 15.3.1 Rules

| current_path | target_path | module_type | scope_layer | family_or_platform | migration_phase | depends_on | compatibility_required | rollback_plan |
|---|---|---|---|---|---|---|---|---|
| `rules/scope-guard.md` | `rules/shared/scope-guard.md` | `rule` | `shared` | `-` | `Phase 4` | `structure-model` | `no` | keep old path until generator rules are updated |
| `rules/dev-principles.md` | `rules/shared/dev-principles.md` | `rule` | `shared` | `-` | `Phase 4` | `structure-model` | `no` | restore old path if downstream links break |
| `rules/project-overview.md` | `retire` or replace with generated root docs | `rule` | `shared` | `-` | `Phase 1` | `agents-refresh` | `yes` | keep file as compatibility stub until generated docs are trusted |
| `rules/testing-rules.mdc` | `rules/families/apple/swift-testing.mdc` | `rule` | `family` | `apple` | `Phase 4` | `family-layer` | `yes` | preserve old glob until new apple family rule is active |
| `rules/macos-coding.mdc` | `rules/platforms/macos/macos-coding.mdc` | `rule` | `platform` | `macos` | `Phase 4` | `platform-layer` | `yes` | dual-load old/new path for one migration window |

#### 15.3.2 References

| current_path | target_path | module_type | scope_layer | family_or_platform | migration_phase | depends_on | compatibility_required | rollback_plan |
|---|---|---|---|---|---|---|---|---|
| `references/design-principle.md` | `references/shared/design-principle.md` | `reference` | `shared` | `-` | `Phase 4` | `structure-model` | `no` | restore original path if doc links fail |
| `references/ios-reference.md` | `references/platforms/ios/ios-reference.md` | `reference` | `platform` | `ios` | `Phase 4` | `platform-layer` | `yes` | keep redirect note in old location during migration |
| `references/macos-reference.md` | `references/platforms/macos/macos-reference.md` | `reference` | `platform` | `macos` | `Phase 4` | `platform-layer` | `yes` | keep redirect note in old location during migration |
| `references/web-reference.md` | `references/platforms/web/web-reference.md` | `reference` | `platform` | `web` | `Phase 4` | `platform-layer` | `yes` | keep redirect note in old location during migration |
| `references/frontend-design/responsive-design.md` | `references/families/browser/frontend-design/responsive-design.md` | `reference` | `family` | `browser` | `Phase 4` | `family-layer` | `yes` | preserve old folder until browser references are relinked |
| `references/frontend-design/color-and-contrast.md` | `references/families/browser/frontend-design/color-and-contrast.md` | `reference` | `family` | `browser` | `Phase 4` | `family-layer` | `yes` | preserve old folder until browser references are relinked |
| `references/frontend-design/interaction-design.md` | `references/families/browser/frontend-design/interaction-design.md` | `reference` | `family` | `browser` | `Phase 4` | `family-layer` | `yes` | preserve old folder until browser references are relinked |
| `references/frontend-design/typography.md` | `references/families/browser/frontend-design/typography.md` | `reference` | `family` | `browser` | `Phase 4` | `family-layer` | `yes` | preserve old folder until browser references are relinked |
| `references/frontend-design/motion-design.md` | `references/families/browser/frontend-design/motion-design.md` | `reference` | `family` | `browser` | `Phase 4` | `family-layer` | `yes` | preserve old folder until browser references are relinked |
| `references/frontend-design/spatial-design.md` | `references/families/browser/frontend-design/spatial-design.md` | `reference` | `family` | `browser` | `Phase 4` | `family-layer` | `yes` | preserve old folder until browser references are relinked |
| `references/frontend-design/ux-writing.md` | `references/families/browser/frontend-design/ux-writing.md` | `reference` | `family` | `browser` | `Phase 4` | `family-layer` | `yes` | preserve old folder until browser references are relinked |
| `references/interactive-prototype/animation-system.md` | `references/families/browser/interactive-prototype/animation-system.md` | `reference` | `family` | `browser` | `Phase 4` | `family-layer` | `yes` | preserve old folder until browser references are relinked |
| `references/interactive-prototype/interaction-recipes.md` | `references/families/browser/interactive-prototype/interaction-recipes.md` | `reference` | `family` | `browser` | `Phase 4` | `family-layer` | `yes` | preserve old folder until browser references are relinked |
| `references/interactive-prototype/data-mocking.md` | `references/families/browser/interactive-prototype/data-mocking.md` | `reference` | `family` | `browser` | `Phase 4` | `family-layer` | `yes` | preserve old folder until browser references are relinked |
| `references/interactive-prototype/component-patterns.md` | `references/families/browser/interactive-prototype/component-patterns.md` | `reference` | `family` | `browser` | `Phase 4` | `family-layer` | `yes` | preserve old folder until browser references are relinked |
| `references/design system/apple-native-app.md` | `references/families/apple/design-system/apple-native-app.md` | `reference` | `family` | `apple` | `Phase 4` | `family-layer` | `yes` | keep old path note until family references migrate |
| `references/design system/macos-app.md` | `references/platforms/macos/design-system/macos-app.md` | `reference` | `platform` | `macos` | `Phase 4` | `platform-layer` | `yes` | keep old path note until platform references migrate |
| `references/design system/web.md` | `references/platforms/web/design-system/web.md` | `reference` | `platform` | `web` | `Phase 4` | `platform-layer` | `yes` | keep old path note until platform references migrate |
| `references/design system/browser-extension.md` | `references/platforms/extension/design-system/browser-extension.md` | `reference` | `platform` | `extension` | `Phase 4` | `platform-layer` | `yes` | keep old path note until platform references migrate |
| `references/tech-best-practices/golang-google-best-practices.md` | `references/shared/tech-best-practices/golang-google-best-practices.md` | `reference` | `shared` | `-` | `Phase 4` | `structure-model` | `no` | restore original path if external links break |
| `references/tech-best-practices/react-official-best-practices.md` | `references/families/browser/tech-best-practices/react-official-best-practices.md` | `reference` | `family` | `browser` | `Phase 4` | `family-layer` | `yes` | preserve old folder until browser references are relinked |
| `references/tech-best-practices/nextjs-official-best-practices.md` | `references/platforms/web/tech-best-practices/nextjs-official-best-practices.md` | `reference` | `platform` | `web` | `Phase 4` | `platform-layer` | `yes` | preserve old folder until web references are relinked |

#### 15.3.3 Scripts

| current_path | target_path | module_type | scope_layer | family_or_platform | migration_phase | depends_on | compatibility_required | rollback_plan |
|---|---|---|---|---|---|---|---|---|
| `scripts/generate_agents_readme.sh` | `scripts/shared/generate-agents-readme.sh` | `script` | `shared` | `-` | `Phase 1` | `agents-refresh` | `yes` | keep wrapper at old path until downstream callers migrate |
| `scripts/sync_claude_skills.sh` | `scripts/shared/sync-claude-skills.sh` | `script` | `shared` | `-` | `Phase 1` | `agents-refresh` | `yes` | keep wrapper at old path until downstream callers migrate |
| `scripts/check-hardcoded-strings.sh` | `scripts/checks/families/apple/check-hardcoded-strings.sh` | `script` | `family` | `apple` | `Phase 3` | `family-layer` | `yes` | keep old entrypoint until apple family checks are stable |
| `scripts/tests/test_generate_agents_readme.sh` | `scripts/tests/shared/test-generate-agents-readme.sh` | `script` | `shared` | `-` | `Phase 1` | `self-test` | `yes` | keep old test path while CI switches to new command |

#### 15.3.4 Skills

| current_path | target_path | module_type | scope_layer | family_or_platform | migration_phase | depends_on | compatibility_required | rollback_plan |
|---|---|---|---|---|---|---|---|---|
| `skills/00-start/generate-project-docs/SKILL.md` | `skills/shared/workflows/foundation/generate-project-docs/SKILL.md` | `workflow` | `shared` | `-` | `Phase 4` | `structure-model` | `yes` | keep stub index at old path during migration |
| `skills/00-start/manage-backlog/SKILL.md` | `skills/shared/workflows/foundation/manage-backlog/SKILL.md` | `workflow` | `shared` | `-` | `Phase 4` | `structure-model` | `yes` | keep stub index at old path during migration |
| `skills/00-start/sync-claude-skills/SKILL.md` | `skills/shared/workflows/foundation/sync-claude-skills/SKILL.md` | `workflow` | `shared` | `-` | `Phase 4` | `structure-model` | `yes` | keep stub index at old path during migration |
| `skills/requirements-clarification/SKILL.md` | `skills/shared/workflows/foundation/requirement-clarification/SKILL.md` | `workflow` | `shared` | `-` | `Phase 4` | `structure-model` | `yes` | keep stub index at old path during migration |
| `skills/commit-code/SKILL.md` | `skills/shared/workflows/foundation/commit-code/SKILL.md` | `workflow` | `shared` | `-` | `Phase 4` | `structure-model` | `yes` | keep stub index at old path during migration |
| `skills/01-design/01-new-project-prd/SKILL.md` | `skills/shared/workflows/product/new-project-prd/SKILL.md` | `workflow` | `shared` | `-` | `Phase 4` | `structure-model` | `yes` | keep stub index at old path during migration |
| `skills/01-design/01-new-project-prd/prd-template.md` | `skills/shared/assets/prd/prd-template.md` | `asset` | `shared` | `-` | `Phase 4` | `asset-split` | `yes` | leave compatibility copy until skill references are updated |
| `skills/01-design/02-ia-user-flow/SKILL.md` | `skills/shared/workflows/product/ia-user-flow/SKILL.md` | `workflow` | `shared` | `-` | `Phase 4` | `structure-model` | `yes` | keep stub index at old path during migration |
| `skills/01-design/02-ia-user-flow/ia-user-flow-template.md` | `skills/shared/assets/ia-user-flow/ia-user-flow-template.md` | `asset` | `shared` | `-` | `Phase 4` | `asset-split` | `yes` | leave compatibility copy until skill references are updated |
| `skills/01-design/03-design-token/SKILL.md` | `skills/shared/workflows/product/design-token-generator/SKILL.md` | `workflow` | `shared` | `-` | `Phase 4` | `structure-model` | `yes` | keep stub index at old path during migration |
| `skills/01-design/03-design-token/design-token-template.json` | `skills/shared/assets/design-token/design-token-template.json` | `asset` | `shared` | `-` | `Phase 4` | `asset-split` | `yes` | leave compatibility copy until skill references are updated |
| `skills/01-design/04-design-system-guide/SKILL.md` | `skills/shared/workflows/product/design-system-guide/SKILL.md` | `workflow` | `shared` | `-` | `Phase 4` | `structure-model` | `yes` | keep stub index at old path during migration |
| `skills/01-design/05-architecture/SKILL.md` | `skills/shared/workflows/product/architecture-design/SKILL.md` | `workflow` | `shared` | `-` | `Phase 4` | `structure-model` | `yes` | keep stub index at old path during migration |
| `skills/01-design/05-architecture/architecture-template.md` | `skills/shared/assets/architecture/architecture-template.md` | `asset` | `shared` | `-` | `Phase 4` | `asset-split` | `yes` | leave compatibility copy until skill references are updated |
| `skills/01-design/05-architecture/questions-apple.md` | `skills/families/apple/assets/architecture/questions-apple.md` | `asset` | `family` | `apple` | `Phase 4` | `family-layer` | `yes` | leave compatibility copy until skill references are updated |
| `skills/01-design/05-architecture/questions-web.md` | `skills/platforms/web/assets/architecture/questions-web.md` | `asset` | `platform` | `web` | `Phase 4` | `platform-layer` | `yes` | leave compatibility copy until skill references are updated |
| `skills/01-design/05-architecture/questions-extension.md` | `skills/platforms/extension/assets/architecture/questions-extension.md` | `asset` | `platform` | `extension` | `Phase 4` | `platform-layer` | `yes` | leave compatibility copy until skill references are updated |
| `skills/01-design/06-product-spec/SKILL.md` | `skills/shared/workflows/product/product-spec/SKILL.md` | `workflow` | `shared` | `-` | `Phase 4` | `structure-model` | `yes` | keep stub index at old path during migration |
| `skills/01-design/06-product-spec/product-spec-ios-app-template.md` | `skills/platforms/ios/assets/product-spec/product-spec-ios-app-template.md` | `asset` | `platform` | `ios` | `Phase 4` | `platform-layer` | `yes` | leave compatibility copy until skill references are updated |
| `skills/01-design/06-product-spec/product-spec-macos-app-template.md` | `skills/platforms/macos/assets/product-spec/product-spec-macos-app-template.md` | `asset` | `platform` | `macos` | `Phase 4` | `platform-layer` | `yes` | leave compatibility copy until skill references are updated |
| `skills/01-design/06-product-spec/product-spec-web-template.md` | `skills/platforms/web/assets/product-spec/product-spec-web-template.md` | `asset` | `platform` | `web` | `Phase 4` | `platform-layer` | `yes` | leave compatibility copy until skill references are updated |
| `skills/01-design/06-product-spec/product-spec-browser-extension.md` | `skills/platforms/extension/assets/product-spec/product-spec-browser-extension.md` | `asset` | `platform` | `extension` | `Phase 4` | `platform-layer` | `yes` | leave compatibility copy until skill references are updated |
| `skills/01-design/frontend-design/SKILL.md` | `skills/families/browser/workflows/design/frontend-design/SKILL.md` | `workflow` | `family` | `browser` | `Phase 4` | `family-layer` | `yes` | keep stub index at old path during migration |
| `skills/01-design/interactive-prototype/SKILL.md` | `skills/families/browser/workflows/design/interactive-prototype/SKILL.md` | `workflow` | `family` | `browser` | `Phase 4` | `family-layer` | `yes` | keep stub index at old path during migration |
| `skills/02-develop/Localization/SKILL.md` | `skills/families/apple/workflows/develop/localization-handler/SKILL.md` | `workflow` | `family` | `apple` | `Phase 3` | `family-layer` | `yes` | keep stub index at old path during migration |
| `skills/02-develop/systematic-debugging/SKILL.md` | `skills/shared/workflows/develop/systematic-debugging/SKILL.md` | `workflow` | `shared` | `-` | `Phase 2` | `strict-execution` | `yes` | keep old path active until receipts/checks are wired |
| `skills/02-develop/systematic-debugging/root-cause-tracing.md` | `skills/shared/assets/develop/systematic-debugging/root-cause-tracing.md` | `asset` | `shared` | `-` | `Phase 2` | `strict-execution` | `yes` | leave compatibility copy until skill references are updated |
| `skills/02-develop/systematic-debugging/defense-in-depth.md` | `skills/shared/assets/develop/systematic-debugging/defense-in-depth.md` | `asset` | `shared` | `-` | `Phase 2` | `strict-execution` | `yes` | leave compatibility copy until skill references are updated |
| `skills/02-develop/systematic-debugging/condition-based-waiting.md` | `skills/shared/assets/develop/systematic-debugging/condition-based-waiting.md` | `asset` | `shared` | `-` | `Phase 2` | `strict-execution` | `yes` | leave compatibility copy until skill references are updated |
| `skills/03-testing/00-toolchain-generator/SKILL.md` | `skills/shared/workflows/testing/00-toolchain-generator/SKILL.md` | `workflow` | `shared` | `-` | `Phase 2` | `strict-execution` | `yes` | keep old path active until registry references move |
| `skills/03-testing/01-unit-test/SKILL.md` | `skills/shared/workflows/testing/01-unit-test/SKILL.md` | `workflow` | `shared` | `-` | `Phase 2` | `strict-execution` | `yes` | keep old path active until registry references move |
| `skills/03-testing/02-integration-test/SKILL.md` | `skills/shared/workflows/testing/02-integration-test/SKILL.md` | `workflow` | `shared` | `-` | `Phase 4` | `structure-model` | `yes` | keep old path active until registry references move |
| `skills/03-testing/03-api-test/SKILL.md` | `skills/shared/workflows/testing/03-api-test/SKILL.md` | `workflow` | `shared` | `-` | `Phase 4` | `structure-model` | `yes` | keep old path active until registry references move |
| `skills/03-testing/04-ui-test/SKILL.md` | `skills/shared/workflows/testing/04-ui-test/SKILL.md` | `workflow` | `shared` | `-` | `Phase 4` | `structure-model` | `yes` | keep old path active until registry references move |
| `skills/03-testing/05-snapshot-test/SKILL.md` | `skills/shared/workflows/testing/05-snapshot-test/SKILL.md` | `workflow` | `shared` | `-` | `Phase 4` | `structure-model` | `yes` | keep old path active until registry references move |
| `skills/03-testing/06-e2e-test/SKILL.md` | `skills/shared/workflows/testing/06-e2e-test/SKILL.md` | `workflow` | `shared` | `-` | `Phase 4` | `structure-model` | `yes` | keep old path active until registry references move |
| `skills/03-testing/07-functional-test/SKILL.md` | `skills/shared/workflows/testing/07-functional-test/SKILL.md` | `workflow` | `shared` | `-` | `Phase 4` | `structure-model` | `yes` | keep old path active until registry references move |
| `skills/03-testing/08-smoke-test/SKILL.md` | `skills/shared/workflows/testing/08-smoke-test/SKILL.md` | `workflow` | `shared` | `-` | `Phase 4` | `structure-model` | `yes` | keep old path active until registry references move |
| `skills/03-testing/09-acceptance-test/SKILL.md` | `skills/shared/workflows/testing/09-acceptance-test/SKILL.md` | `workflow` | `shared` | `-` | `Phase 4` | `structure-model` | `yes` | keep old path active until registry references move |
| `skills/03-testing/10-performance-test/SKILL.md` | `skills/shared/workflows/testing/10-performance-test/SKILL.md` | `workflow` | `shared` | `-` | `Phase 4` | `structure-model` | `yes` | keep old path active until registry references move |
| `skills/03-testing/11-accessibility-test/SKILL.md` | `skills/shared/workflows/testing/11-accessibility-test/SKILL.md` | `workflow` | `shared` | `-` | `Phase 4` | `structure-model` | `yes` | keep old path active until registry references move |
| `skills/03-testing/toolchain/unit-swift.md` | `skills/families/apple/adapters/testing/swift-xcode/unit.md` | `adapter` | `family` | `apple` | `Phase 4` | `family-layer` | `yes` | keep compatibility copy until toolchain generator is updated |
| `skills/03-testing/toolchain/integration-swift.md` | `skills/families/apple/adapters/testing/swift-xcode/integration.md` | `adapter` | `family` | `apple` | `Phase 4` | `family-layer` | `yes` | keep compatibility copy until toolchain generator is updated |
| `skills/03-testing/toolchain/accessibility-swift.md` | `skills/families/apple/adapters/testing/swift-xcode/accessibility.md` | `adapter` | `family` | `apple` | `Phase 4` | `family-layer` | `yes` | keep compatibility copy until toolchain generator is updated |
| `skills/03-testing/toolchain/ui-swift.md` | `skills/families/apple/adapters/testing/swift-xcode/ui.md` | `adapter` | `family` | `apple` | `Phase 4` | `family-layer` | `yes` | keep compatibility copy until toolchain generator is updated |
| `skills/03-testing/toolchain/performance-swift.md` | `skills/families/apple/adapters/testing/swift-xcode/performance.md` | `adapter` | `family` | `apple` | `Phase 4` | `family-layer` | `yes` | keep compatibility copy until toolchain generator is updated |
| `skills/03-testing/toolchain/snapshot-swift.md` | `skills/families/apple/adapters/testing/swift-xcode/snapshot.md` | `adapter` | `family` | `apple` | `Phase 4` | `family-layer` | `yes` | keep compatibility copy until toolchain generator is updated |
| `skills/03-testing/toolchain/e2e-swift.md` | `skills/families/apple/adapters/testing/swift-xcode/e2e.md` | `adapter` | `family` | `apple` | `Phase 4` | `family-layer` | `yes` | keep compatibility copy until toolchain generator is updated |
| `skills/04-merge-gate/merge-readiness/SKILL.md` | `skills/shared/workflows/merge/merge-readiness/SKILL.md` | `workflow` | `shared` | `-` | `Phase 2` | `strict-execution` | `yes` | keep old path active until completion guard is wired |
| `skills/fastlane-appstore/01-fastlane-base-metadata-builder/SKILL.md` | `skills/families/apple/workflows/release/fastlane-base-metadata-builder/SKILL.md` | `workflow` | `family` | `apple` | `Phase 3` | `family-layer` | `yes` | keep stub index at old path during migration |
| `skills/fastlane-appstore/02-fastlane-metadata-localization/SKILL.md` | `skills/families/apple/workflows/release/fastlane-metadata-localization/SKILL.md` | `workflow` | `family` | `apple` | `Phase 3` | `family-layer` | `yes` | keep stub index at old path during migration |
| `skills/fastlane-appstore/03-fastlane-keyword-refinement/SKILL.md` | `skills/families/apple/workflows/release/fastlane-keyword-refinement/SKILL.md` | `workflow` | `family` | `apple` | `Phase 3` | `family-layer` | `yes` | keep stub index at old path during migration |
| `skills/fastlane-appstore/04-fastlane-preflight-check/SKILL.md` | `skills/families/apple/workflows/release/fastlane-preflight-check/SKILL.md` | `workflow` | `family` | `apple` | `Phase 3` | `family-layer` | `yes` | keep stub index at old path during migration |
| `skills/fastlane-appstore/05-fastlane-deploy/SKILL.md` | `skills/families/apple/workflows/release/fastlane-deploy/SKILL.md` | `workflow` | `family` | `apple` | `Phase 3` | `family-layer` | `yes` | keep stub index at old path during migration |
| `skills/release-audit/SKILL.md` | `skills/platforms/ios/workflows/release/release-audit/SKILL.md` | `workflow` | `platform` | `ios` | `Phase 3` | `platform-layer` | `yes` | keep old path active until iOS release routing is updated |

#### 15.3.5 使用说明

- `Phase 1` 优先处理真相源、生成脚本和测试脚本
- `Phase 2` 优先处理 strict execution 相关 workflow 与 assets
- `Phase 3` 优先处理 Apple family release / localization 与 iOS release audit
- `Phase 4` 再统一迁移 rules、references 和剩余 skills

只有在 15.2 的 self-test 矩阵能稳定通过后，才允许从一个阶段推进到下一个阶段。
