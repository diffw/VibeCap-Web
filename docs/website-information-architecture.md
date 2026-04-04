# VibeCap 网站改版信息架构与信息布局设计

## 1. 文档目标

本文档用于定义 VibeCap 网站改版后的信息架构与信息布局，不涉及具体视觉风格、组件样式和高保真页面设计。

本次改版的核心目标是把网站从“截图工具宣传页”升级为“面向 AI workflows 的截图工作流产品网站”，让用户更快理解：

- VibeCap 是什么
- 它解决了什么效率问题
- 它和普通截图工具有什么不同
- 它的核心功能如何协同工作
- 为什么用户应该下载并升级 Pro

---

## 2. 信息架构设计原则

### 2.1 产品定位升级

网站对外口径不再只强调“截图工具”，而是强调：

> VibeCap 是一个为 AI workflows 设计的 macOS 截图工作流工具。  
> 它把 Capture、Annotate、Paste、Library、Keep、Auto Cleanup 串成一个完整闭环。

### 2.2 叙事顺序

网站内容顺序应遵循以下逻辑：

1. 先讲结果，而不是先讲功能
2. 先讲 AI workflow 场景，再讲截图能力
3. 先讲核心闭环，再讲附加功能
4. 先讲高频价值，再讲管理价值
5. 先讲为什么下载，再讲为什么付费

### 2.3 信息优先级

优先级从高到低建议如下：

1. 核心价值主张
2. Capture -> Annotate -> Paste 工作流
3. 与 AI 工具的兼容性
4. Screenshot Library / Keep / Auto Cleanup
5. 原生、轻量、隐私、本地处理
6. 定价与 FAQ

---

## 3. 最终网站页面布局

建议采用“1 个主转化首页 + 3 个辅助说明页 + 2 个法务页”的结构。

```text
VibeCap Website
├─ /
│  └─ 首页：主转化入口
├─ /features
│  └─ 功能总览页：完整讲解产品能力与使用场景
├─ /pricing
│  └─ 定价页：Free / Pro 差异与购买路径
├─ /faq
│  └─ 常见问题页：权限、兼容性、隐私、平台限制
├─ /privacy
│  └─ 隐私政策
└─ /terms
   └─ 服务条款
```

### 3.1 页面职责划分


| 页面          | 角色    | 目标                            |
| ----------- | ----- | ----------------------------- |
| `/`         | 主转化页  | 让用户快速理解产品、建立信任并下载             |
| `/features` | 说明页   | 系统展开功能能力、产品差异点与适用场景           |
| `/pricing`  | 成交页   | 解释 128 张免费截图与 Pro 无限截图，承接升级行为 |
| `/faq`      | 消除疑虑页 | 处理平台、权限、隐私、兼容性问题              |
| `/privacy`  | 法务页   | 建立隐私信任                        |
| `/terms`    | 法务页   | 完成基础法务信息闭环                    |


### 3.2 导航结构

建议顶部导航保持极简，但能覆盖核心转化路径。

```text
[Logo]
  ├─ Features
  ├─ Pricing
  ├─ FAQ
  └─ Download
```

说明：

- `Features` 指向功能页，承接深度浏览
- `Pricing` 指向定价页，承接付费决策
- `FAQ` 指向 FAQ 页，承接疑虑消解
- `Download` 始终作为主 CTA

---

## 4. 首页信息布局

首页是整个网站最重要的页面，承担主要转化任务。  
它不应该像传统产品页那样先铺功能卡片，而应该先建立“这是一个 AI workflow 工具”的认知。

### 4.1 首页结构总览

```text
Home
├─ Header
├─ Hero
├─ Core Capabilities
├─ Screenshot Management
├─ Works With
├─ Problem
├─ Workflow
├─ Trust Layer
├─ Pricing Preview
├─ FAQ
├─ Final CTA
└─ Footer
```

### 4.2 首页完整 ASCII 内容线框

下面这份 ASCII 不是“模块目录”，而是首页最终呈现内容的无样式线框稿。  
它应该尽可能接近最终页面的内容结构、信息顺序和文案落点，只去掉视觉风格。

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                       │
│ [VibeCap Logo]                     [Features] [Pricing] [FAQ] [Download]     │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ HERO                                                                         │
│ [Eyebrow]                                                                    │
│ Built for AI workflows                                                       │
│                                                                              │
│ [H1]                                                                         │
│ Capture. Annotate. Paste. Done.                                              │
│                                                                              │
│ [Subheadline]                                                                │
│ Every screenshot saves you seconds. In the age of AI, every second counts.   │
│ VibeCap lets you capture any region, annotate it, and paste it directly      │
│ into ChatGPT, Claude, Cursor, VS Code, Windsurf, Figma, or your terminal.    │
│                                                                              │
│ [Primary CTA] [Download for macOS]                                           │
│ [Secondary Note] macOS menu bar app / Native / Local-first                   │
│                                                                              │
│ [Hero Preview Placeholder]                                                   │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ Product preview area                                                    │ │
│ │ - Capture overlay                                                       │ │
│ │ - Annotation tools                                                      │ │
│ │ - Copy / Save / Save & Keep action area                                 │ │
│ │ - Screenshot library preview                                            │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ CORE CAPABILITIES                                                            │
│ [Section Note]                                                               │
│ This section begins at the bottom edge of the first screen on desktop        │
│ and becomes the main focus of the second screen.                             │
│                                                                              │
│ [H2]                                                                         │
│ The core workflow, broken down.                                              │
│                                                                              │
│ ┌──────────────────────────────┐  ┌──────────────────────────────┐           │
│ │ CAPTURE                      │  │ ANNOTATE                     │           │
│ │ - Global shortcut            │  │ - Arrows                     │           │
│ │ - Region capture             │  │ - Circles                    │           │
│ │ - Full screen on double tap  │  │ - Rectangles                 │           │
│ │ - Multi-display support      │  │ - Numbered annotations       │           │
│ │                              │  │ - Add visual context first   │           │
│ └──────────────────────────────┘  └──────────────────────────────┘           │
│                                                                              │
│ ┌──────────────────────────────┐  ┌──────────────────────────────┐           │
│ │ PASTE ANYWHERE               │  │ TERMINAL FRIENDLY            │           │
│ │ - ChatGPT                    │  │ - Paste into Terminal        │           │
│ │ - Claude                     │  │ - Auto-convert to local path │           │
│ │ - Cursor / VS Code           │  │ - Works with iTerm2 / Warp   │           │
│ │ - Windsurf / Figma           │  │ - No extra export steps      │           │
│ │ - Any image-friendly app     │  │                              │           │
│ └──────────────────────────────┘  └──────────────────────────────┘           │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ SCREENSHOT MANAGEMENT                                                        │
│ [Section Note]                                                               │
│ This section sits directly under Core Capabilities so users understand       │
│ screenshot management before they scroll into lower-priority storytelling.   │
│                                                                              │
│ [H2]                                                                         │
│ Keep your screenshots useful, not messy.                                     │
│                                                                              │
│ [Intro Copy]                                                                 │
│ After you send a screenshot, two things matter: cleaning up what you do not  │
│ need, and keeping the ones you want to find again.                           │
│                                                                              │
│ ┌──────────────────────────────────────┐  ┌──────────────────────────────┐  │
│ │ AUTO CLEANUP                         │  │ LIBRARY                      │  │
│ │ - Clean on the schedule you choose  │  │ - All captures in one place  │  │
│ │ - Every day / every 3 days /        │  │ - Browse and preview         │  │
│ │   weekly / monthly                  │  │ - Filter by All / Kept       │  │
│ │ - Kept screenshots stay protected   │  │ - Multi-select and bulk copy │  │
│ │ - No manual housekeeping            │  │ - Mark important shots Keep  │  │
│ └──────────────────────────────────────┘  └──────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ WORKS WITH                                                                   │
│ [Section Label] Works with the tools you already use                         │
│                                                                              │
│ ChatGPT | Claude | Cursor | VS Code | Windsurf | Figma | Terminal | More    │
│                                                                              │
│ [Support Copy]                                                               │
│ Any app that accepts images. Copy once, paste anywhere.                      │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ PROBLEM                                                                      │
│ [H2]                                                                         │
│ Screenshots should speed up AI work, not interrupt it.                       │
│                                                                              │
│ [Intro Copy]                                                                 │
│ Traditional screenshot flows break concentration: capture, find the file,    │
│ drag it across windows, explain the context, repeat.                         │
│                                                                              │
│ [Pain Point 01]                                                              │
│ The screenshot is gone before you can use it.                                │
│ You miss the moment, then go hunting through folders.                        │
│                                                                              │
│ [Pain Point 02]                                                              │
│ Dragging images between windows is slow and fragile.                         │
│ It gets worse across multiple displays.                                      │
│                                                                              │
│ [Pain Point 03]                                                              │
│ AI still needs visual context.                                               │
│ Arrows, circles, and labels help you explain what matters.                   │
│                                                                              │
│ [Pain Point 04]                                                              │
│ Screenshot folders keep growing.                                             │
│ Important shots get buried. Everything else stays forever.                   │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ WORKFLOW                                                                     │
│ [H2]                                                                         │
│ One smooth motion from screenshot to AI.                                     │
│                                                                              │
│ [Intro Copy]                                                                 │
│ VibeCap is not trying to replace your editor, chat app, or terminal.         │
│ It fixes the handoff between seeing something and sending it.                │
│                                                                              │
│ [Step 01] Capture                                                            │
│ Grab any screen region instantly with a global shortcut.                     │
│ Double-click to capture the full screen you're on.                           │
│                                                                              │
│ [Step 02] Annotate                                                           │
│ Add arrows, circles, rectangles, and numbered markers before you send.       │
│                                                                              │
│ [Step 03] Paste                                                              │
│ Copy it straight into AI tools, design tools, editors, or terminal apps.     │
│                                                                              │
│ [Flow Summary]                                                               │
│ Capture -> Annotate -> Paste                                                 │
└──────────────────────────────────────────────────────────────────────────────┘

│ TRUST LAYER                                                                  │
│ [H2]                                                                         │
│ Built to stay out of your way.                                               │
│                                                                              │
│ [Trust Item 01] Menu bar app                                                 │
│ Always available, never a cluttered workspace.                               │
│                                                                              │
│ [Trust Item 02] Quick preview                                                │
│ See what you saved, pause on hover, act fast.                                │
│                                                                              │
│ [Trust Item 03] Native macOS                                                 │
│ Lightweight, fast, and consistent with the system.                           │
│                                                                              │
│ [Trust Item 04] Local-first                                                  │
│ Your screenshots stay on your Mac. No cloud dependency.                      │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ PRICING PREVIEW                                                              │
│ [H2]                                                                         │
│ Start with 128 free screenshots. Upgrade to Pro for unlimited capture.       │
│                                                                              │
│ [Free]                                                                       │
│ 128 free screenshots / Full workflow while quota remains                     │
│                                                                              │
│ [Pro]                                                                        │
│ Unlimited screenshots / No capture limit / Monthly | Yearly | Lifetime       │
│                                                                              │
│ [Plan Row]                                                                   │
│ Monthly | Yearly | Lifetime                                                  │
│                                                                              │
│ [CTA]                                                                        │
│ View pricing                                                                 │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ FAQ                                                                          │
│ [H2]                                                                         │
│ VibeCap FAQ: Compatibility, privacy, pricing, and how this macOS screenshot  │
│ workflow works.                                                              │
│                                                                              │
│ [Intro Copy]                                                                 │
│ Answer the questions users search before downloading: what VibeCap does,     │
│ which apps it works with, how terminal paste works, what Free vs Pro         │
│ includes, which permissions are needed, and whether screenshots ever leave   │
│ your Mac.                                                                    │
│                                                                              │
│ [Default State] Show the 10 most important Q&A items                         │
│                                                                              │
│ [Q1] What is VibeCap?                                                        │
│ [A1] VibeCap is a native macOS screenshot workflow app built for AI work.    │
│      It helps you capture a region, annotate it, and paste it directly into  │
│      ChatGPT, Claude, Cursor, VS Code, Windsurf, Figma, Terminal, and more.  │
│                                                                              │
│ [Q2] How is VibeCap different from the built-in macOS screenshot tool?       │
│ [A2] VibeCap focuses on what happens after capture: annotation, direct paste,│
│      screenshot library, Keep, and Auto Cleanup. The built-in tool captures  │
│      well, but it does not manage the AI handoff or screenshot lifecycle.    │
│                                                                              │
│ [Q3] Does VibeCap only work on macOS?                                        │
│ [A3] Yes. VibeCap is a native macOS menu bar app and is positioned as a      │
│      Mac-first product.                                                      │
│                                                                              │
│ [Q4] Which apps can I paste screenshots into?                                │
│ [A4] ChatGPT, Claude, Cursor, VS Code, Windsurf, Figma, Terminal apps, and   │
│      any app that accepts image paste.                                       │
│                                                                              │
│ [Q5] How does terminal paste work?                                           │
│ [A5] When you paste into Terminal, VibeCap converts the screenshot into a    │
│      local file path so terminal-based workflows stay fast and natural.      │
│                                                                              │
│ [Q6] What annotation tools does VibeCap include?                             │
│ [A6] Arrows, circles, rectangles, and numbered annotations. These help you   │
│      add visual context before sending the image to AI or teammates.         │
│                                                                              │
│ [Q7] Can I capture screenshots across multiple displays?                     │
│ [A7] Yes. VibeCap supports multi-display workflows and also lets you         │
│      double-click to capture the full screen you are on.                     │
│                                                                              │
│ [Q8] How many free screenshots do I get?                                     │
│ [A8] Free users start with 128 screenshots. Each successful screenshot       │
│      that enters the preview flow uses 1 screenshot from that quota.         │
│                                                                              │
│ [Q9] What happens when I use all 128 free screenshots?                       │
│ [A9] You can no longer start new captures, but your existing screenshots     │
│      stay available to browse, save, and manage.                             │
│                                                                              │
│ [Q10] What does Pro unlock?                                                  │
│ [A10] Pro removes the screenshot quota. Monthly, Yearly, and Lifetime all    │
│       unlock the same Pro tier with unlimited screenshots.                   │
│                                                                              │
│ [Collapsed State] Hide Q11-Q20 behind a "View all FAQ" trigger               │
│                                                                              │
│ [Q11] What does Keep do?                                                     │
│ [A11] Keep marks important screenshots so they stay easy to find and are     │
│       never deleted by Auto Cleanup.                                         │
│                                                                              │
│ [Q12] How does Auto Cleanup work?                                            │
│ [A12] Auto Cleanup removes old screenshots on the schedule you choose,       │
│       while skipping anything marked Keep.                                   │
│                                                                              │
│ [Q13] Which cleanup intervals are available?                                 │
│ [A13] Every day, every 3 days, weekly, or monthly.                           │
│                                                                              │
│ [Q14] Are kept screenshots ever auto-deleted?                                │
│ [A14] No. Kept screenshots are explicitly protected from Auto Cleanup.       │
│                                                                              │
│ [Q15] Are screenshots uploaded anywhere?                                     │
│ [A15] No. VibeCap is positioned as local-first. Your screenshots stay on     │
│       your Mac and are not part of a cloud workflow.                         │
│                                                                              │
│ [Q16] Does VibeCap require an account?                                       │
│ [A16] No. The product is presented as a local macOS utility, not an          │
│       account-based SaaS app.                                                │
│                                                                              │
│ [Q17] What permissions does VibeCap need?                                    │
│ [A17] Screen Recording for capture and Accessibility for paste automation.    │
│                                                                              │
│ [Q18] Can I use VibeCap with ChatGPT and Claude?                             │
│ [A18] Yes. Both are first-class examples in the product story because they   │
│       are common AI destinations for screenshots.                            │
│                                                                              │
│ [Q19] Can I use VibeCap for design or non-coding work?                       │
│ [A19] Yes. The positioning is AI-workflow-first, not developer-only.         │
│       Figma, documentation, feedback, and visual collaboration all fit.      │
│                                                                              │
│ [Q20] Who is VibeCap for?                                                    │
│ [A20] Developers, designers, product teams, and anyone who frequently sends  │
│       screenshots into AI tools or other apps.                               │
│                                                                              │
│ [CTA] View all FAQ                                                           │
│ [Expanded Behavior] Clicking reveals Q11-Q20 inline below Q1-Q10            │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ FINAL CTA                                                                    │
│ [H2]                                                                         │
│ Download VibeCap for macOS.                                                  │
│                                                                              │
│ [Closing Copy]                                                               │
│ Faster screenshots for AI work, with the context, tools, and cleanup         │
│ workflow built in.                                                           │
│                                                                              │
│ [Primary CTA] [Download for macOS]                                           │
│ [Secondary Note] Native macOS app / Menu bar / Local-first                   │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ FOOTER                                                                       │
│ [VibeCap] [Privacy] [Terms] [Language] [Contact]                             │
│ [Meta Note] Copyright / Last updated / Support email                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 首页模块与功能点落位关系

这张表用来说明：每个功能点会落在哪个 section，以及为什么放在那里。


| 功能点                                     | 首页落位                                  | 排布原因                               |
| --------------------------------------- | ------------------------------------- | ---------------------------------- |
| Capture                                 | Hero、Core Capabilities、Workflow       | 这是最高频入口，必须首屏即建立认知                  |
| Annotate                                | Hero、Core Capabilities、Workflow       | 作为“解释上下文”的能力，必须尽早可见                |
| Paste Anywhere                          | Hero、Core Capabilities、Works With     | 这是和普通截图工具拉开差距的核心能力                 |
| Terminal Friendly                       | Core Capabilities、FAQ                 | 是高辨识度差异点，应该前置并被解释清楚                |
| Screenshot Library                      | Screenshot Management                 | 应紧跟核心能力出现，说明“截图发完之后如何管理”           |
| Keep                                    | Screenshot Management、Pricing Preview | 不再单独成块，而是作为 Library 与 Cleanup 的连接点 |
| Auto Cleanup                            | Screenshot Management、Pricing Preview | 与 Library 并列讲，比“Lifecycle”抽象概念更易理解 |
| Menu Bar / Quick Preview / Native macOS | Trust Layer                           | 属于产品信任层，不属于主功能叙事                   |
| Free / Pro / Plans                      | Pricing Preview                       | 承接转化，不应打断前面的价值建立                   |
| 权限、兼容性、隐私                               | FAQ                                   | 用于降低顾虑，放在转化后段最合适                   |


---

## 5. 各个模块的划分

首页模块建议按 5 个信息层组织，而不是简单按功能列表堆叠。

### 5.1 转化层

负责回答“这是什么，为什么值得继续看”。

包含模块：

- `Hero`
- `Core Capabilities`
- `Screenshot Management`
- `Works With`
- `Primary CTA`

职责：

- 快速定义产品
- 在最早的滚动区间内证明产品核心能力
- 尽早说明截图不会失控堆积，而是可被管理
- 建立 AI workflow 相关性
- 让用户知道它不是普通截图工具
- 给出明确下载入口

### 5.2 问题与解决方案层

负责回答“为什么这个产品存在”。

包含模块：

- `Problem`
- `Workflow`

职责：

- 解释传统截图流程的断点
- 说明 VibeCap 如何缩短从截图到发送给 AI 的路径
- 建立 Capture -> Annotate -> Paste 的心智模型

### 5.3 功能能力层

负责回答“它具体能做什么”。

包含模块：

- `Capture`
- `Annotate`
- `Paste Anywhere`
- `Terminal Friendly`

职责：

- 把高频使用能力讲清楚
- 让用户看到与竞品不同的功能组合
- 把 Terminal paste 单独提升为差异化卖点

### 5.4 截图管理层

负责回答“截图发出去之后，怎么继续保持整洁和可找回”。

包含模块：

- `Auto Cleanup`
- `Library`

职责：

- 从“即时发送”延伸到“后续管理”
- 用更具体的语言解释“保存、筛选、保留、清理”这组能力
- 为 Pro 价值提供合理铺垫

### 5.5 信任与成交层

负责回答“我能不能放心用，以及是否值得付费”。

包含模块：

- `Trust Layer`
- `Pricing Preview`
- `FAQ`
- `Final CTA`

职责：

- 建立原生、轻量、隐私、本地处理的信任
- 清楚划分 Free / Pro
- 提前解决权限、兼容性、平台限制等疑虑

---

## 6. 各页面的信息布局建议

## 6.1 首页 `/`

首页负责主叙事与主转化。

建议模块顺序如下：

1. Hero
2. Core Capabilities
3. Screenshot Management
4. Works With
5. Problem
6. Workflow
7. Trust Layer
8. Pricing Preview
9. FAQ
10. Final CTA

### 6.1.1 首页最终文案稿

以下文案是首页的接近最终上线草稿，目标是让用户在最短时间内理解产品价值、核心流程，以及 `128 free screenshots -> Pro unlimited screenshots` 的付费模型。

```text
HERO

[Eyebrow]
Built for AI workflows

[H1]
Capture. Annotate. Paste. Done.

[Supporting H1 / SEO-safe direction]
The screenshot workflow tool for AI on macOS

[Body]
Every screenshot saves you seconds. In AI workflows, every second counts.
VibeCap lets you capture any screen region, annotate it, and paste it directly
into ChatGPT, Claude, Cursor, VS Code, Windsurf, Figma, or Terminal without
breaking focus.

[Primary CTA]
Download for macOS

[Secondary Note]
Start with 128 free screenshots, then upgrade to Pro for unlimited capture.
```

```text
CORE CAPABILITIES

[H2]
The core workflow, broken down.

[Capture]
Grab any screen region instantly with a global shortcut.
Double-click to capture the full screen you're on.
Works across multiple displays.

[Annotate]
Add arrows, circles, rectangles, and numbered markers before you send.
Show the point before AI has to guess.

[Paste Anywhere]
Paste into ChatGPT, Claude, Cursor, VS Code, Windsurf, Figma, and any app that
accepts image paste.

[Terminal Friendly]
Paste into Terminal and VibeCap turns the screenshot into a local file path.
No extra export steps.
```

```text
SCREENSHOT MANAGEMENT

[H2]
Keep your screenshots useful, not messy.

[Body]
After you send a screenshot, you still need to find the good ones and get rid
of the rest. VibeCap gives you a local screenshot library, Keep, and Auto
Cleanup so screenshots do not pile up in Finder folders.

[Library]
Browse, preview, filter, multi-select, and bulk copy screenshots from one
place.

[Keep]
Mark important screenshots so they stay easy to find.

[Auto Cleanup]
Clean on the schedule you choose while leaving kept screenshots alone.
```

```text
WORKS WITH

[H2]
Works with the tools you already use.

[Body]
ChatGPT, Claude, Cursor, VS Code, Windsurf, Figma, Terminal, and more.
Any app that accepts images. Copy once, paste anywhere.
```

```text
PROBLEM + WORKFLOW

[Problem H2]
Screenshots should speed up AI work, not interrupt it.

[Problem Body]
Traditional screenshot flows slow you down. You capture, hunt for the file,
drag it across windows, and still need to explain what matters.

[Workflow H2]
One smooth motion from screenshot to AI.

[Workflow Steps]
1. Capture any region.
2. Add visual context.
3. Paste it where you already work.
```

```text
TRUST LAYER

[H2]
Built to stay out of your way.

[Items]
- Menu bar app
- Quick preview after save
- Native macOS performance
- Local-first screenshot handling
```

```text
PRICING PREVIEW

[H2]
Start with 128 free screenshots. Upgrade when you need unlimited capture.

[Free]
128 free screenshots
Capture / Annotate / Paste / Save / Library

[Pro]
Unlimited screenshots
Monthly / Yearly / Lifetime

[CTA]
View pricing
```

```text
FINAL CTA

[H2]
Faster screenshots for AI work, from the first capture onward.

[Body]
Use VibeCap free with 128 screenshots included, then upgrade only if your
workflow needs unlimited capture.

[Primary CTA]
Download for macOS
```

### 首页不应该做的事

- 不要一开始就进入大量功能卡片
- 不要把定价提前到 Hero 之后
- 不要把 Keep / Auto Cleanup 埋在 FAQ 里
- 不要继续以“vibe coding 截图工具”作为唯一叙事

## 6.2 功能页 `/features`

功能页用于系统化介绍产品能力，不承担首页那种强节奏转化任务。

建议结构：

```text
Features
├─ Page Hero
├─ Capture
├─ Annotate
├─ Paste Anywhere
├─ Terminal Friendly
├─ Screenshot Library
├─ Keep
├─ Auto Cleanup
├─ Menu Bar / Preview / Native Experience
└─ CTA
```

功能页的写法应偏“能力说明 + 使用场景”，而不是简单参数表。

### 6.2.1 功能页最终文案稿

功能页应更像“能力说明书”，让用户在不被定价打断的前提下，把产品能做什么看明白。

```text
PAGE HERO

[H1]
Capture, annotate, paste, and manage screenshots with VibeCap.

[Body]
VibeCap is built for AI workflows on macOS. It helps you move from seeing
something on screen to sending it into the right app with less friction, less
file dragging, and better visual context.

[Support Note]
Start with 128 free screenshots. Upgrade to Pro for unlimited capture.
```

```text
CAPTURE

[H2]
Capture what matters, fast.

[Body]
Launch capture from a global shortcut, select any screen region, or double-click
to capture the full screen you're on. VibeCap is designed for quick use across
single- and multi-display setups.
```

```text
ANNOTATE

[H2]
Add context before you send.

[Body]
Use arrows, circles, rectangles, and numbered markers to point out exactly what
matters. The goal is not decoration. The goal is faster understanding.
```

```text
PASTE ANYWHERE

[H2]
Paste directly into the tools you already use.

[Body]
Send screenshots into ChatGPT, Claude, Cursor, VS Code, Windsurf, Figma, and
other apps that accept image paste. No dragging files around. No export step.
```

```text
TERMINAL FRIENDLY

[H2]
Built for terminal workflows too.

[Body]
When you paste into Terminal, VibeCap converts the screenshot into a local file
path so CLI-based work feels natural in Terminal, iTerm2, Warp, and similar
apps.
```

```text
SCREENSHOT LIBRARY

[H2]
Keep every capture in one place.

[Body]
Browse, preview, filter, and reuse screenshots from a local library instead of
digging through Finder folders.
```

```text
KEEP

[H2]
Mark the screenshots that matter.

[Body]
Keep helps you protect important screenshots and makes them easier to find again
later.
```

```text
AUTO CLEANUP

[H2]
Clean up old screenshots automatically.

[Body]
Choose a cleanup schedule and let VibeCap remove older screenshots while
skipping anything you have marked Keep.
```

```text
NATIVE EXPERIENCE

[H2]
Designed to stay out of your way.

[Body]
VibeCap lives in your menu bar, stays lightweight, and keeps screenshots local
to your Mac.
```

```text
FEATURES CTA

[H2]
Start free, then keep going when your workflow gets heavier.

[Body]
VibeCap includes 128 free screenshots so you can use the full workflow before
deciding whether you need unlimited capture with Pro.

[Primary CTA]
Download for macOS

[Secondary CTA]
View pricing
```

## 6.3 定价页 `/pricing`

定价页用于完成 Free 与 Pro 的价值拆分。

建议结构：

```text
Pricing
├─ Pricing Hero
├─ Free vs Pro Comparison
├─ Plan Options
├─ Why Upgrade
├─ Purchase FAQ
└─ CTA
```

关键原则：

- Free 负责“先用 128 张截图完成完整工作流”
- Pro 负责“移除截图额度限制，进入无限截图”

因此定价页应重点讲：

- Free：128 free screenshots / Capture / Annotate / Paste / Save / Library
- Pro：Unlimited screenshots / No capture limit / Monthly / Yearly / Lifetime

### 6.3.1 定价页最终文案稿

以下文案是接近最终上线的页面内容草稿，价格数字本身应从 App Store / StoreKit 动态注入，不在页面文案里手写伪价格。

```text
PRICING HERO

[H1]
Start with 128 free screenshots. Upgrade to Pro for unlimited capture.

[Body]
VibeCap gives you the full screenshot workflow from day one. Capture, annotate,
paste, save, and manage screenshots for free while your quota remains. Upgrade
when you want unlimited screenshots for heavier daily use.

[Support Note]
Available as Monthly, Yearly, or Lifetime.
All paid plans unlock the same Pro tier.
```

```text
FREE VS PRO COMPARISON

[Free]
- 128 screenshots total
- Capture any screen region
- Annotate before you send
- Paste into AI tools, editors, design tools, and terminal apps
- Save screenshots locally
- Browse and manage existing screenshots

[Pro]
- Unlimited screenshots
- No capture quota barrier
- Better fit for heavy daily AI workflows
- Available as Monthly, Yearly, or Lifetime
- Same workflow, without usage limits
```

```text
PLAN OPTIONS

[Section Title]
Choose the plan that fits how often you work with screenshots.

[Monthly]
- Flexible subscription
- Best for trying Pro without commitment
- [Price comes from StoreKit]

[Yearly]
- Lower effective monthly cost
- Best for regular AI workflow users
- [Price comes from StoreKit]

[Lifetime]
- One-time purchase
- Best for long-term Mac users
- [Price comes from StoreKit]

[Plan Note]
Monthly, Yearly, and Lifetime all unlock the same Pro entitlement.
```

```text
WHY UPGRADE

[H2]
Upgrade when screenshot limits start getting in your way.

[Point 01]
Keep capturing during real work.
You do not have to think about whether this screenshot is worth spending.

[Point 02]
Better for high-frequency AI workflows.
If you send screenshots into ChatGPT, Claude, Cursor, or VS Code every day,
unlimited capture removes friction.

[Point 03]
Pick the payment style that matches your usage.
Go Monthly, Yearly, or Lifetime without changing what Pro includes.
```

```text
PURCHASE FAQ

[Q1] How many free screenshots do I get?
[A1] Free users start with 128 screenshots total.

[Q2] What happens when I use all 128 screenshots?
[A2] You can no longer start new captures, but your existing screenshots remain
     available to browse, save, and manage.

[Q3] What does Pro unlock?
[A3] Pro removes the screenshot quota and gives you unlimited screenshots.

[Q4] Do Monthly, Yearly, and Lifetime include the same Pro features?
[A4] Yes. They all unlock the same Pro tier. The difference is billing model,
     not feature scope.

[Q5] Is there still a subscription free trial?
[A5] If introductory offers are available through StoreKit, they may be shown
     as secondary purchase details. The main free experience is still 128 free
     screenshots.
```

```text
FINAL CTA

[H2]
Start free, upgrade only when you need unlimited screenshots.

[Primary CTA]
Download for macOS

[Secondary Note]
128 free screenshots included.
```

## 6.4 FAQ 页 `/faq`

FAQ 页用于统一承接所有疑问，不在首页无限拉长。

### FAQ 最终标题

建议首页与 FAQ 页统一使用以下标题：

`VibeCap FAQ: Compatibility, privacy, pricing, and how this macOS screenshot workflow works.`

这个标题同时满足两件事：

- 包含 SEO 关键语义：`VibeCap`、`FAQ`、`macOS`、`privacy`、`pricing`
- 对应用户下载前最关心的问题：兼容性、隐私、安全感、价格、产品工作方式

### FAQ 展示机制

- 首页默认展示最关键的前 10 条 Q&A
- 第 11 条及以后默认折叠
- 用户点击 `View all FAQ` 后，Q11-Q20 原位展开
- FAQ 专页展示完整问答，不做首页那种强折叠限制

建议问题类型：

- VibeCap 是什么
- 和 macOS 自带截图有什么区别
- 是不是只支持 macOS
- 支持哪些 AI 工具和应用
- Terminal paste 是怎么工作的
- 支持哪些标注方式
- 是否支持多屏截图
- 免费用户一共有多少张截图额度
- 128 张免费截图用完之后会发生什么
- Pro 到底改变了什么
- Monthly / Yearly / Lifetime 是否解锁同一套 Pro 权益
- 截图是否会自动保存
- Screenshot Library 有什么作用
- 会不会上传截图
- 是否需要账号
- 需要哪些权限
- Keep 是什么
- Auto Cleanup 是怎么工作的
- 清理周期有哪些
- 自动清理会不会删掉我想保留的截图

### 6.4.1 FAQ 页最终文案稿

FAQ 专页应使用更完整的答案版本，不要与首页 FAQ 保持完全相同的长度和颗粒度。

```text
FAQ PAGE HERO

[H1]
VibeCap FAQ: Compatibility, privacy, pricing, and how this macOS screenshot
workflow works.

[Intro]
These are the questions people ask before downloading VibeCap: what it does,
which apps it works with, what permissions it needs, how the free quota works,
and what changes after upgrading to Pro.
```

```text
FAQ GROUP 01 — PRODUCT

[Q1] What is VibeCap?
[A1] VibeCap is a native macOS screenshot workflow app built for AI work. It
     helps you capture a screen region, annotate it, and paste it directly into
     ChatGPT, Claude, Cursor, VS Code, Windsurf, Figma, Terminal, and other
     apps that accept images.

[Q2] How is VibeCap different from the built-in macOS screenshot tool?
[A2] The built-in tool is good at capture. VibeCap focuses on what happens
     after capture: annotation, direct paste into AI tools, a browsable local
     screenshot library, and smoother handoff into real workflows.

[Q3] Does VibeCap only work on macOS?
[A3] Yes. VibeCap is designed as a native macOS menu bar app.
```

```text
FAQ GROUP 02 — COMPATIBILITY

[Q4] Which apps can I paste screenshots into?
[A4] ChatGPT, Claude, Cursor, VS Code, Windsurf, Figma, Terminal apps, and any
     app that accepts image paste.

[Q5] How does terminal paste work?
[A5] When you paste into Terminal, VibeCap converts the screenshot into a local
     file path so terminal-based workflows feel natural instead of forcing image
     attachment behavior.

[Q6] Does VibeCap support multiple displays?
[A6] Yes. VibeCap supports multi-display capture workflows and also lets you
     double-click to capture the full screen you are currently on.
```

```text
FAQ GROUP 03 — PRICING

[Q7] How many free screenshots do I get?
[A7] Free users start with 128 screenshots total.

[Q8] When is quota consumed?
[A8] Quota is consumed only after a screenshot is successfully created and
     enters the preview flow. Canceled or failed screenshots do not consume
     quota.

[Q9] What happens when I use all 128 free screenshots?
[A9] You can no longer start new captures, but your existing screenshots remain
     available to browse, save, and manage.

[Q10] What does Pro unlock?
[A10] Pro removes the screenshot quota and gives you unlimited screenshots.

[Q11] Do Monthly, Yearly, and Lifetime include the same Pro entitlement?
[A11] Yes. All three unlock the same Pro tier. The difference is payment model,
      not functionality.

[Q12] Is a subscription trial still part of the product?
[A12] Introductory offers may appear as StoreKit purchase details when eligible,
      but the primary free experience is 128 free screenshots.
```

```text
FAQ GROUP 04 — PRIVACY AND PERMISSIONS

[Q13] Are screenshots uploaded anywhere?
[A13] No. VibeCap is positioned as a local-first macOS utility. Your
      screenshots stay on your Mac.

[Q14] Does VibeCap require an account?
[A14] No. VibeCap is not positioned as an account-based SaaS product.

[Q15] What permissions does VibeCap need?
[A15] Screen Recording is required for capture. Accessibility is required for
      automated paste behavior.
```

```text
FAQ GROUP 05 — LIBRARY AND MANAGEMENT

[Q16] What is the screenshot library for?
[A16] It gives you one place to browse, preview, filter, multi-select, and bulk
      copy screenshots instead of hunting through Finder folders.

[Q17] What does Keep do?
[A17] Keep marks important screenshots so they stay easy to find and are
      protected from cleanup.

[Q18] How does Auto Cleanup work?
[A18] Auto Cleanup removes older screenshots on the schedule you choose while
      skipping items you want to keep.

[Q19] Which cleanup intervals are available?
[A19] Every day, every 3 days, weekly, or monthly.

[Q20] Are kept screenshots ever auto-deleted?
[A20] No. Kept screenshots are explicitly protected from Auto Cleanup.
```

---

## 7. 你打算如何介绍这个产品以及各个功能点

本次改版建议采用“产品闭环”而不是“功能罗列”的介绍方式。

### 7.1 产品介绍方式

建议用一句总述统一全站口径：

> VibeCap is the screenshot workflow layer for AI work.  
> Capture any region, annotate it, and paste it anywhere without breaking focus.

中文表达可对应为：

> VibeCap 是面向 AI 工作流的截图工作流工具。  
> 你可以快速截图、添加标注，并把结果直接粘贴到 AI 工具、设计工具或终端里。

### 7.2 功能点介绍顺序

功能点不按“技术实现顺序”介绍，而按“用户感知价值顺序”介绍。

推荐顺序：

1. `Capture`
2. `Annotate`
3. `Paste Anywhere`
4. `Terminal Friendly`
5. `Screenshot Library`
6. `Keep`
7. `Auto Cleanup`
8. `Stays Out of Your Way`

### 7.3 各功能点的介绍策略

#### Capture

介绍重点：

- 全局快捷键立即进入截图
- 支持任意屏幕区域
- 多显示器场景可用
- 双击可整屏截图

用户感知价值：

> 快，不打断思路。

#### Annotate

介绍重点：

- 箭头、圆形、矩形、编号
- 在发送前补充视觉上下文
- 标注渲染是非破坏式的

用户感知价值：

> 不是为了“画图”，而是为了让 AI 或协作者更快看懂重点。

#### Paste Anywhere

介绍重点：

- 支持 ChatGPT、Claude、Cursor、VS Code、Windsurf、Figma 等
- 凡是支持图片粘贴的应用都可以工作
- 减少拖文件和导出步骤

用户感知价值：

> 截完就能发，不需要整理“怎么把图送进去”。

#### Terminal Friendly

介绍重点：

- 粘贴到 Terminal 时自动转成本地文件路径
- 兼容 Terminal、iTerm2、Warp 等
- 不需要手动找图、拖图、复制路径

用户感知价值：

> 让截图在终端场景下也自然可用。

#### Screenshot Library

介绍重点：

- 所有截图集中浏览
- 可筛选、预览、多选、批量复制
- 不用回 Finder 翻历史截图

用户感知价值：

> 截图不是发完就消失，而是可回看、可管理的工作资料。

#### Keep

介绍重点：

- 标记重要截图
- 被标记的截图不会被自动清理
- 和图库一起形成“保留重点内容”的机制

用户感知价值：

> 重要的留下，不重要的交给系统。

#### Auto Cleanup

介绍重点：

- 支持按周期自动清理
- 可选每天、每 3 天、每周、每月
- 被 Keep 的截图不参与清理

用户感知价值：

> 截图库不会无限增长，也不用手动打扫。

#### Stays Out of Your Way

介绍重点：

- 菜单栏常驻
- Quick preview
- 轻量、原生、本地处理

用户感知价值：

> 它始终可用，但不会成为负担。

---

## 8. 首页核心文案方向

以下是信息架构层面的建议口径，不等同于最终视觉文案。

### 8.1 Hero 口径

建议主标题方向：

- Capture. Annotate. Paste. Done.
- The fastest way to send screenshots into AI.
- Your screenshot workflow for AI work.
- Start with 128 free screenshots, then upgrade for unlimited capture.

建议副标题方向：

- 强调 AI 工作流
- 强调速度
- 强调“从截图到发送”的完整路径
- 在首页前半段明确出现 `128 free screenshots` 与 `unlimited Pro`

### 8.2 中段文案口径

建议中段内容围绕以下句式展开：

- Every screenshot saves you seconds.
- In AI workflows, every second counts.
- Stop dragging files across windows.
- Show the context, mark the point, and paste it where you work.

### 8.3 生命周期文案口径

建议用“管理截图生命周期”的口径统一 Library / Keep / Cleanup：

> VibeCap doesn’t just help you send screenshots.  
> It helps you keep the right ones and clean up the rest.

---

## 9. 推荐的站点层级关系

```text
Level 1: 产品认知
  ├─ 它是什么
  ├─ 它为谁服务
  └─ 为什么比普通截图更适合 AI workflows

Level 2: 核心闭环
  ├─ Capture
  ├─ Annotate
  └─ Paste

Level 3: 差异化能力
  ├─ Works With AI Tools
  ├─ Terminal Friendly
  └─ Native macOS Experience

Level 4: 生命周期管理
  ├─ Screenshot Library
  ├─ Keep
  └─ Auto Cleanup

Level 5: 转化与疑虑消解
  ├─ Pricing
  ├─ FAQ
  ├─ Privacy
  └─ Download CTA
```

---

## 10. 结论

改版后的 VibeCap 网站应从“截图产品介绍页”升级成“AI 工作流效率产品网站”。

它的信息架构核心不是罗列所有功能，而是明确建立这条产品认知链路：

```text
AI workflow problem
-> VibeCap shortens the screenshot loop
-> Core workflow: Capture / Annotate / Paste
-> Lifecycle management: Library / Keep / Cleanup
-> Trust and pricing
-> Download
```

如果后续进入页面结构设计阶段，建议优先细化：

1. 首页模块的具体 section 拆分
2. 功能页与首页之间的内容边界
3. 定价页中 Free / Pro 的功能映射
4. FAQ 的问题分组与排序

---

## 11. SEO 架构附录

这一节补充“用户怎么通过搜索引擎进入网站”这一层。  
前面的 IA 解决的是转化路径，这一节解决的是可发现性、关键词承载和页面索引结构。

### 11.1 SEO 页面优先级

#### P0：必须首批上线

这些页面直接承接最清晰的搜索意图，优先级最高。

```text
/
/pricing
/faq
/use-cases/cursor
/use-cases/claude
/use-cases/chatgpt
/use-cases/terminal-workflow
/compare/cleanshot-x
```

#### P1：第二批上线

这些页面用于扩大工具词、竞品词和场景词覆盖。

```text
/features
/use-cases/windsurf
/use-cases/figma
/use-cases/bug-reporting
/compare/copycut
/compare/snapcode
```

#### P2：后续增长层

这些页面用于长期内容积累和站点权重建设。

```text
/blog
/blog/[slug]
/compare/[future-competitors]
/use-cases/[future-scenarios]
```

### 11.2 SEO 扩展站点结构

```text
VibeCap Website
├─ /
├─ /features
├─ /pricing
├─ /faq
├─ /privacy
├─ /terms
├─ /use-cases
│  ├─ /use-cases/cursor
│  ├─ /use-cases/claude
│  ├─ /use-cases/chatgpt
│  ├─ /use-cases/windsurf
│  ├─ /use-cases/figma
│  ├─ /use-cases/terminal-workflow
│  └─ /use-cases/bug-reporting
├─ /compare
│  ├─ /compare/cleanshot-x
│  ├─ /compare/copycut
│  └─ /compare/snapcode
└─ /blog
   └─ /blog/[slug]
```

### 11.3 页面级 metadata 规划

下表定义的是首批最重要页面的 metadata 基线。  
后续可以继续扩展，但这些页面的 title / description / H1 应先定下来。


| 页面                             | 搜索意图        | 核心关键词                                                                                       | H1                                                              | Title Tag                                                                | Meta Description                                                                                                                                                             |
| ------------------------------ | ----------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                            | 品牌词 + 核心产品词 | `screenshot workflow tool`, `AI screenshot tool`, `macOS screenshot tool`                   | `The screenshot workflow tool for AI on macOS`                  | `VibeCap — Screenshot Workflow Tool for AI on macOS`                     | `Capture, annotate, and paste screenshots into ChatGPT, Claude, Cursor, VS Code, Figma, and Terminal. VibeCap is a native macOS screenshot workflow tool built for AI work.` |
| `/features`                    | 功能总览词       | `screenshot annotation tool`, `paste screenshots to AI`, `terminal screenshot tool`         | `Capture, annotate, paste, and manage screenshots with VibeCap` | `VibeCap Features — Capture, Annotate, Paste, Library, and Auto Cleanup` | `See how VibeCap handles screenshot capture, annotation, direct paste to AI tools, screenshot library management, and auto cleanup on macOS.`                                |
| `/pricing`                     | 品牌定价词       | `VibeCap pricing`, `screenshot tool pricing`, `macOS screenshot app pricing`                | `VibeCap pricing`                                               | `VibeCap Pricing — 128 Free Screenshots and Unlimited Pro on macOS`      | `Compare Free and Pro plans for VibeCap. Start with 128 free screenshots, then upgrade to Pro for unlimited capture on macOS.`                                               |
| `/faq`                         | 疑问词         | `VibeCap FAQ`, `VibeCap permissions`, `VibeCap privacy`, `VibeCap compatibility`            | `VibeCap FAQ`                                                   | `VibeCap FAQ — Permissions, Privacy, Compatibility, and Pricing`         | `Find answers about VibeCap permissions, privacy, compatibility with AI tools, 128 free screenshots, unlimited Pro, and how screenshot quota works on macOS.`                |
| `/use-cases/cursor`            | 工具场景词       | `send screenshots to Cursor`, `paste screenshots into Cursor`, `Cursor screenshot workflow` | `How to send screenshots to Cursor on macOS`                    | `Send Screenshots to Cursor on macOS — VibeCap`                          | `Use VibeCap to capture, annotate, and paste screenshots directly into Cursor on macOS without dragging files between windows.`                                              |
| `/use-cases/claude`            | 工具场景词       | `send screenshots to Claude`, `paste screenshots into Claude`                               | `How to send screenshots to Claude on macOS`                    | `Send Screenshots to Claude on macOS — VibeCap`                          | `Capture a screenshot, add visual context, and paste it directly into Claude with VibeCap on macOS.`                                                                         |
| `/use-cases/chatgpt`           | 工具场景词       | `send screenshots to ChatGPT`, `paste screenshots into ChatGPT`                             | `How to send screenshots to ChatGPT on macOS`                   | `Send Screenshots to ChatGPT on macOS — VibeCap`                         | `VibeCap helps you capture and annotate screenshots, then paste them directly into ChatGPT from your Mac.`                                                                   |
| `/use-cases/terminal-workflow` | 功能场景词       | `paste screenshot to terminal`, `terminal screenshot workflow`, `image path paste macOS`    | `How to use screenshots in Terminal on macOS`                   | `Paste Screenshots into Terminal on macOS — VibeCap`                     | `VibeCap converts screenshots into local file paths when pasting into Terminal, making terminal-based screenshot workflows faster on macOS.`                                 |
| `/compare/cleanshot-x`         | 竞品对比词       | `VibeCap vs CleanShot X`, `best screenshot tool for AI coding`                              | `VibeCap vs CleanShot X for AI screenshot workflows`            | `VibeCap vs CleanShot X — Which Is Better for AI Workflows?`             | `Compare VibeCap and CleanShot X for AI-focused screenshot workflows, including annotation, paste flow, screenshot library, and auto cleanup.`                               |
| `/compare/copycut`             | 竞品对比词       | `VibeCap vs CopyCut`, `CopyCut alternative`                                                 | `VibeCap vs CopyCut`                                            | `VibeCap vs CopyCut — A Better Screenshot Workflow for AI`               | `See how VibeCap compares with CopyCut for screenshot capture, annotation, direct paste, and screenshot management on macOS.`                                                |
| `/compare/snapcode`            | 竞品对比词       | `VibeCap vs SnapCode`, `SnapCode alternative`                                               | `VibeCap vs SnapCode`                                           | `VibeCap vs SnapCode — Which Screenshot Workflow Fits Better?`           | `Compare VibeCap and SnapCode for AI screenshot workflows on macOS, including paste flow, annotation, and screenshot management.`                                            |


### 11.4 首页 H1 与视觉文案分工

首页需要把 SEO 和品牌表达分开处理，但必须都在真实可见内容里完成。

推荐结构：

- `H1`：`The screenshot workflow tool for AI on macOS`
- Hero visual line：`Capture. Annotate. Paste. Done.`
- Supporting paragraph：解释它如何把截图直接送进 ChatGPT、Claude、Cursor、VS Code、Figma 和 Terminal

原则：

- `H1` 承载关键词：`screenshot`、`AI`、`macOS`
- Hero 口号继续承载品牌记忆点
- 不要使用隐藏 H1 或仅视觉可见但语义缺失的做法

### 11.5 FAQ 分层与 SEO 规则

首页 FAQ 和 FAQ 专页不能完全重复。

首页 FAQ：

- 默认只展示前 5 条
- 每条答案使用短版：2-3 句
- 目的是快速消除下载阻力

`/faq` 专页：

- 展示完整 FAQ 列表
- 使用长版答案
- 承载权限、隐私、兼容性、定价等搜索流量

FAQ schema 规则：

- 首页只标记首页实际展示的 5 条
- `/faq` 只标记 FAQ 专页上的完整问答
- 两个页面不要复用完全相同的 question + answer 文本

### 11.6 metadata 技术规则

每个索引页都需要统一遵循以下规则：

- 定义唯一 `title tag`
- 定义唯一 `meta description`
- 使用规范化 `canonical URL`
- 对中英文页面补齐 `hreflang`
- 配置 `Open Graph` 与 `Twitter Card`
- 所有公开页面进入 `sitemap.xml`

多语言规则：

- 英文页使用英文 metadata
- 中文页使用中文 metadata
- `title` 与 `description` 不做直接机翻
- 每个语言版本都应指向对应 canonical 与 hreflang alternate

### 11.7 内部链接规则

内部链接不是附属问题，而是 SEO 结构的一部分。

首页：

- `Works With` 中每个工具名链接到对应 `/use-cases/*`
- FAQ 区块底部链接到 `/faq`
- Pricing Preview 链接到 `/pricing`

`/features`：

- 每个功能块链接到对应 use-case 或 compare 页面
- 不承担唯一 SEO 内容页角色，更适合做 hub

`/use-cases/*`：

- 回链首页
- 交叉链接相关工具场景页
- 链接到 `/pricing`

`/compare/*`：

- 回链首页
- 链接相关 `/use-cases/*`
- 链接 `/pricing`

`/faq`：

- 答案中出现功能点时，链接到 `/features` 或对应 `/use-cases/*`

### 11.8 Social Proof 与结构化数据

这部分优先级低于页面扩展和 metadata，但应预留位。

可用内容：

- Mac App Store 评分
- 下载量或用户数量
- 用户评价引用

可考虑的结构化数据：

- `SoftwareApplication`
- `FAQPage`
- `BreadcrumbList`

`Review` / `AggregateRating` 只在页面上真实展示评分和评论时使用，不做空挂。