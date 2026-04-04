import type { Locale } from '@/i18n/config';
import {
  INDUSTRY_SLUGS,
  industryCardsEn,
  industryCardsZh,
  industryPagesEn,
  industryPagesZh,
} from './use-cases-industries';

export const USE_CASE_SLUGS = [
  'everyday',
  'design',
  'developer',
  'brand',
  'qa',
  ...INDUSTRY_SLUGS,
] as const;
export type UseCaseSlug = (typeof USE_CASE_SLUGS)[number];

export function isValidUseCaseSlug(value: string): value is UseCaseSlug {
  return (USE_CASE_SLUGS as readonly string[]).includes(value);
}

export type UseCasePageContent = {
  slug: UseCaseSlug;
  metaTitle: string;
  metaDescription: string;
  title: string;
  subtitle: string;
  personaLabel: string;
  sections: {
    whyTitle: string;
    whyLead: string;
    whyPoints: string[];
    painTitle: string;
    painLead: string;
    painPoints: string[];
    howTitle: string;
    howSteps: Array<{ title: string; body: string }>;
    benefitsTitle: string;
    benefitPoints: string[];
  };
};

export type UseCasesIndexContent = {
  eyebrow: string;
  title: string;
  description: string;
  cards: Array<{ slug: UseCaseSlug; title: string; description: string }>;
  readMore: string;
  indexClosingTitle: string;
  detailFooterPrompt: string;
  ctaLabel: string;
};

export type LocaleUseCases = {
  index: UseCasesIndexContent;
  pages: Record<UseCaseSlug, UseCasePageContent>;
};

const en: LocaleUseCases = {
  index: {
    eyebrow: 'Use cases',
    title: 'VibeCap for every kind of screenshot workflow',
    description:
      'Whether you live in AI chats, design tools, terminals, tickets, support queues, sales cycles, marketing campaigns, or compliance reviews, VibeCap is built around capture → annotate → paste → library. Pick a role to see how it maps to real work.',
    readMore: 'Read more',
    indexClosingTitle: 'Ready to try the workflow?',
    detailFooterPrompt: 'Download VibeCap and run this workflow on your Mac.',
    ctaLabel: 'Download on the Mac App Store',
    cards: [
      {
        slug: 'everyday',
        title: 'Everyday & AI chat',
        description: 'ChatGPT, Claude, IM, and email — turn any screen moment into a clean, paste-ready image.',
      },
      {
        slug: 'design',
        title: 'UX / UI / Product design',
        description: 'Redlines, critique, and research captures with arrows, shapes, and numbered callouts.',
      },
      {
        slug: 'developer',
        title: 'Developers',
        description: 'Bug repro, docs, and terminal-first workflows with intelligent paste routing.',
      },
      {
        slug: 'brand',
        title: 'Graphic & brand design',
        description: 'High-fidelity references, client feedback, and organized visual libraries.',
      },
      {
        slug: 'qa',
        title: 'QA engineers',
        description: 'Repro bundles, step numbering, and batch copy for tickets and test runs.',
      },
      ...industryCardsEn,
    ],
  },
  pages: {
    everyday: {
      slug: 'everyday',
      metaTitle: 'VibeCap for everyday use — AI chats, messaging, and quick sharing',
      metaDescription:
        'Capture any region, annotate, and paste into ChatGPT, Claude, Slack, or iMessage. Preview, Keep, and Library keep screenshots under control.',
      title: 'Everyday use: AI, chat, and “just show me what you mean”',
      subtitle:
        'Primary persona: knowledge workers and power users who constantly jump between browsers, AI assistants, and messaging apps.',
      personaLabel: 'Everyday & mixed-tool workflows',
      sections: {
        whyTitle: 'Why screenshots matter in day-to-day digital life',
        whyLead:
          'Most “can you look at this?” moments are visual. A screenshot is the fastest shared ground truth — UI state, an error bubble, a paragraph in a doc, or a half-finished checkout flow.',
        whyPoints: [
          'Explaining a problem to ChatGPT or Claude without retyping the whole screen.',
          'Sending precise context in Slack, Teams, or iMessage when text alone is ambiguous.',
          'Keeping receipts, confirmations, or time-sensitive UI states before they disappear.',
          'Showing someone the exact button, toggle, or setting you mean — not an approximate description.',
        ],
        painTitle: 'Pain points with generic screenshot habits',
        painLead:
          'macOS’s built-in capture is excellent at grabbing pixels, but the handoff afterward is where friction piles up — especially when AI and chat apps are the destination.',
        painPoints: [
          'Captured images land on the desktop or Downloads with meaningless names, then get lost.',
          'You still need another tool to circle the one element that matters, or to number a short sequence of taps.',
          'Pasting into some apps feels inconsistent (image vs. file vs. accidental path text in web fields).',
          'You re-capture the same thing twice because you forgot where the first file went.',
        ],
        howTitle: 'How to use VibeCap in this flow',
        howSteps: [
          {
            title: 'Trigger capture from anywhere',
            body: 'Press your global capture shortcut (default ⌘⇧2). VibeCap freezes all displays, dims the screen, and lets you drag a precise region — or double-click for full-screen on that monitor.',
          },
          {
            title: 'Mark what matters before you share',
            body: 'In the capture window, use arrows, rectangles, circles, numeric badges, and numbered arrows in six colors. Annotations bake into the final image when you copy or save.',
          },
          {
            title: 'Copy, then paste where you already work',
            body: 'Use ⌘C in the modal (or Copy from the floating preview). VibeCap writes PNG and TIFF to the clipboard for broad compatibility with AI and chat apps.',
          },
          {
            title: 'Use preview, Keep, and Library as your safety net',
            body: 'After save/copy, the preview panel offers Keep (protect from cleanup), Copy, Show in Finder, and Open Library. Drag the thumbnail straight into another app if you prefer file-based sharing.',
          },
        ],
        benefitsTitle: 'What improves with VibeCap',
        benefitPoints: [
          'One continuous path from “see it” to “paste it” — fewer tabs and fewer mystery files.',
          'Annotations make AI prompts and chat messages self-explanatory without long prose.',
          'Saved shots use dated filenames (VC yyyymmdd-hhmmss.png) and can be filtered and found again in Library.',
          'Optional intelligent paste routing helps when your next hop is a terminal-style app versus a rich editor (requires Accessibility permission).',
        ],
      },
    },
    design: {
      slug: 'design',
      metaTitle: 'VibeCap for UX, UI, and product designers',
      metaDescription:
        'Region capture, annotation with arrows and numbered callouts, and a dated screenshot library for critique, research, and handoff.',
      title: 'UX / UI / Product design: critique with clarity',
      subtitle:
        'Primary persona: product designers, UX researchers, and design-adjacent PMs who review flows, ship specs, and synthesize visual feedback.',
      personaLabel: 'Design critique & research',
      sections: {
        whyTitle: 'Why designers live in screenshots',
        whyLead:
          'Design work is negotiated in images: what shipped, what diverged from spec, and what participants did in a study. Screenshots anchor async reviews when Figma links alone are not enough.',
        whyPoints: [
          'Documenting live product UI versus mocks — states, spacing, and copy that only appear in production.',
          'Highlighting violations or opportunities on marketing pages, onboarding, and edge-case screens.',
          'Building lightweight research evidence (quotes + UI context) for decks and tickets.',
          'Giving engineers and stakeholders a numbered sequence: “1 → 2 → 3” through a flow.',
        ],
        painTitle: 'Where typical tooling falls short',
        painLead:
          'Design tools excel at source files, but feedback on *implemented* UI still depends on fast capture plus clear markup — often spread across disparate apps.',
        painPoints: [
          'Exporting from design tools is heavy when you only need a quick crop of the live app.',
          'Comments in Figma do not replace “this pixel in Safari” — cross-surface review still needs screenshots.',
          'Numbered steps recreated in slides or docs drift from the actual capture and cost time.',
          'Asset folders fill with “Screen Shot 2026-…” files that nobody can search or relate to a ticket.',
        ],
        howTitle: 'How to use VibeCap on design workflows',
        howSteps: [
          {
            title: 'Freeze the real UI, then crop tightly',
            body: 'Start capture, drag a region around the component or flow you are discussing. Multi-monitor setups freeze in parallel so you select on the correct display at Retina resolution.',
          },
          {
            title: 'Use the annotation toolkit like a redline layer',
            body: 'Arrows and shapes call out regions; numeric badges and numbered arrows encode step order. Colors help separate severity, owner, or theme in one image.',
          },
          {
            title: 'Save or copy into your review surface',
            body: 'Save produces an atomic PNG write with a VC timestamp filename. Copy pushes annotated pixels to the clipboard for Notion, Slack, Google Docs, or Figma comments.',
          },
          {
            title: 'Curate with Keep and Library',
            body: 'Toggle Keep on shots that must survive auto-cleanup. Library groups thumbnails by day so you can find “that critique from Tuesday” without digging through Finder.',
          },
        ],
        benefitsTitle: 'Outcomes designers feel week to week',
        benefitPoints: [
          'Feedback travels as a single annotated image — less misread text, fewer round trips.',
          'Numbered callouts stay consistent because deletion triggers automatic renumbering in the editor.',
          'The library becomes a lightweight visual paper trail for decisions and research snapshots.',
          'Auto-cleanup (optional) keeps long-term disk use sane while Keep protects reference shots.',
        ],
      },
    },
    developer: {
      slug: 'developer',
      metaTitle: 'VibeCap for developers — terminal paths, Cursor, and bug repro',
      metaDescription:
        'Dual-format clipboard copy, terminal-aware paste routing, multi-image sequential paste, and atomic saves for reproducible bug reports.',
      title: 'Developers: from repro capture to the right paste target',
      subtitle:
        'Primary persona: software engineers who split time between editors, terminals, browsers, and AI coding assistants.',
      personaLabel: 'Engineering & DevOps-style workflows',
      sections: {
        whyTitle: 'Why engineers screenshot more than they admit',
        whyLead:
          'Reproducibility is visual: stack traces beside UI, config panels, network tabs, and “it works on my machine” deltas. Screenshots are the universal attachment format for issues and docs.',
        whyPoints: [
          'Bug tickets need a tight repro: UI state + the few lines of context that matter.',
          'Internal runbooks and READMEs benefit from inline images of CLI output or dashboards.',
          'Pairing with AI coding tools (Cursor, VS Code, web UIs) is faster when you paste the exact panel you mean.',
          'Sharing a local file path with a teammate or script is often preferable to pasting a huge bitmap into a shell.',
        ],
        painTitle: 'Friction in dev-specific capture → paste loops',
        painLead:
          'The hard part is not taking the screenshot — it is getting the *right representation* into the *right surface* without babysitting the clipboard.',
        painPoints: [
          'Terminals want escaped file paths; rich editors want images — the same naive paste fails one side or the other.',
          'Hybrid apps like Cursor mix terminal and editor panes; a dumb heuristic picks the wrong format.',
          'Pasting multiple screenshots into a doc or issue is repetitive when each needs its own manual paste.',
          'Accidental plain-text paths in browser fields leak filesystem details or paste as junk next to images.',
        ],
        howTitle: 'How VibeCap fits the engineering workflow',
        howSteps: [
          {
            title: 'Capture UI or logs with pixel-accurate crops',
            body: 'Use region select for panels; double-click an overlay for full-screen on that monitor. Cropping respects display scale so Retina captures stay sharp.',
          },
          {
            title: 'Annotate for triage, then copy',
            body: 'Circle the offending control, arrow to the error, or number a short repro sequence. ⌘C in the modal renders annotations into the exported bitmap.',
          },
          {
            title: 'Arm intelligent paste routing after Copy',
            body: 'When Accessibility is enabled and a saved file path exists, Copy can arm paste routing: your next ⌘V is interpreted against the frontmost app. Terminals receive shell-escaped path text; editors receive the image — including Cursor with AX-based terminal-vs-editor detection.',
          },
          {
            title: 'Paste several images in order from Library',
            body: 'Multi-select screenshots in Library and Copy. With Accessibility, VibeCap can paste images sequentially — first paste is yours; following images advance automatically with a short delay between each.',
          },
          {
            title: 'Rely on atomic saves for artifacts you keep',
            body: 'Enabled saves use atomic writes to avoid half-written PNGs. Filenames default to VC yyyymmdd-hhmmss.png with numeric suffixes on collision — predictable for attaching to tickets.',
          },
        ],
        benefitsTitle: 'What developers gain',
        benefitPoints: [
          'Less clipboard babysitting when jumping between Terminal, IDE, and browser.',
          'Fewer “wrong paste type” failures when sharing repros or doc screenshots.',
          'Multi-image capture sessions map cleanly to linear write-ups and AI chats.',
          'Library + Keep turns scattered repro shots into a searchable, retainable archive.',
        ],
      },
    },
    brand: {
      slug: 'brand',
      metaTitle: 'VibeCap for graphic and brand designers',
      metaDescription:
        'High-DPI region capture, color-aware annotations, drag-out sharing, and library organization for references and client feedback.',
      title: 'Graphic & brand design: references that stay sharp',
      subtitle:
        'Primary persona: visual designers, brand designers, and creative leads who collect references, document brand usage, and ship feedback loops.',
      personaLabel: 'Visual reference & brand governance',
      sections: {
        whyTitle: 'Why brand work is screenshot-driven',
        whyLead:
          'Brand reality lives on the web, in apps, and in decks — not only in master files. Teams compare live touchpoints (ads, landing pages, social) and need crisp captures that preserve type and color fidelity.',
        whyPoints: [
          'Tracking competitor campaigns and category trends from live surfaces.',
          'Capturing client-facing mockups in context (browser chrome, real devices, dark mode).',
          'Documenting off-brand usage or partner co-marketing that strays from guidelines.',
          'Building swipe files and mood boards where each image needs quick markup.',
        ],
        painTitle: 'Typical pain for visual professionals',
        painLead:
          'Low-res grabs, messy filenames, and unclear callouts make it harder to defend creative direction with evidence.',
        painPoints: [
          'Loose crops blur type edges — you need the full pixel grid from Retina displays.',
          'Feedback cycles slow down when you cannot point to exact logo clearspace or color breaks.',
          'Huge folders of unnamed shots are exhausting to curate or hand off to account teams.',
          'You duplicate files across chat, email, and cloud drives because there is no single library.',
        ],
        howTitle: 'How to use VibeCap for brand workflows',
        howSteps: [
          {
            title: 'Capture at native resolution',
            body: 'Region selection maps through display scale factors so exported PNGs reflect true pixel dimensions — important for inspecting type and texture on modern panels.',
          },
          {
            title: 'Annotate with a six-color palette',
            body: 'Use consistent colors to encode feedback types (e.g., structural vs. copy). Arrows, rectangles, and circles clarify hierarchy without opening a separate editor.',
          },
          {
            title: 'Share from preview or drag the file',
            body: 'The floating preview supports Copy, Keep, Show in Finder, and drag-out of the thumbnail as a file — handy for email attachments or asset buckets.',
          },
          {
            title: 'Organize retention with Keep and optional cleanup',
            body: 'Mark keeper references with Keep so automated retention skips them. Library’s day-grouped grid gives a time-based view of everything you have captured.',
          },
        ],
        benefitsTitle: 'Benefits for creative teams',
        benefitPoints: [
          'Evidence-based feedback arrives as one annotated image — clearer for clients and cross-functional partners.',
          'Your archive stays navigable by date, with explicit protection for long-lived references.',
          'Optional auto-cleanup reduces clutter while respecting what you marked as Keep.',
          'The same workflow scales from quick captures to deeper library management.',
        ],
      },
    },
    qa: {
      slug: 'qa',
      metaTitle: 'VibeCap for QA engineers — repro steps, evidence, and batch paste',
      metaDescription:
        'Numbered annotations, multi-select copy with sequential paste, trash-safe deletes, and predictable filenames for test evidence.',
      title: 'QA: evidence that matches how you already write tickets',
      subtitle:
        'Primary persona: manual and hybrid QA engineers who file defects, verify fixes, and communicate repro across browsers and builds.',
      personaLabel: 'Test execution & defect documentation',
      sections: {
        whyTitle: 'Why QA depends on screenshots',
        whyLead:
          'Test cases are procedural; evidence is visual. Screenshots prove environment, data, and UI state — the “actual” side of expected vs. actual — especially across browsers and devices.',
        whyPoints: [
          'Attaching repro steps with visuals reduces back-and-forth with engineering.',
          'Regression testing benefits from before/after captures tied to build numbers.',
          'Exploratory sessions generate many shots; you need fast capture without losing the trail.',
          'Compliance or release reviews often ask for a clear, ordered narrative.',
        ],
        painTitle: 'Operational pain in test documentation',
        painLead:
          'Ticket quality drops when evidence is inconsistent: missing steps, ambiguous crops, or attachments that are hard to correlate with a given build.',
        painPoints: [
          'Renumbering annotated steps after deleting one callout is tedious and error-prone.',
          'Pasting five screenshots into a report or Jira comment steals minutes per bug.',
          'Bulk deletion without safeguards risks removing the wrong evidence.',
          'Filenames like “image.png” make it impossible to sort chronologically in shared drives.',
        ],
        howTitle: 'How VibeCap supports QA workflows',
        howSteps: [
          {
            title: 'Capture each step with consistent framing',
            body: 'Freeze-and-crop keeps focus on the relevant control or message. Full-screen double-click helps when environment context (URL bar, feature flags) matters.',
          },
          {
            title: 'Number repro sequences automatically',
            body: 'Use numeric badges and numbered arrows; when you delete a numbered mark, remaining numbers re-sequence so your ticket stays logically ordered.',
          },
          {
            title: 'Batch copy for write-ups',
            body: 'In Library, marquee- or ⌘-select multiple items and Copy. With Accessibility enabled, sequential paste can place each image in order into your issue tracker or doc after your first ⌘V.',
          },
          {
            title: 'Manage lifecycle safely',
            body: 'Single-item delete moves to Trash immediately; multi-select delete confirms first. Keep marks screenshots that must not be purged by optional auto-cleanup.',
          },
        ],
        benefitsTitle: 'QA outcomes',
        benefitPoints: [
          'Tickets read cleaner because numbering stays coherent as you edit evidence.',
          'Predictable VC timestamps on disk make nightly folders and attachments easier to audit.',
          'Library filtering (All vs. Kept) separates throwaway runs from release-critical captures.',
          'Trash-based deletion avoids permanent mistakes while still letting you clear bulk noise.',
        ],
      },
    },
    ...industryPagesEn,
  },
};

const zh: LocaleUseCases = {
  index: {
    eyebrow: '使用场景',
    title: '为每一种截图工作流而做的 VibeCap',
    description:
      '无论你主要在 AI 对话、设计、终端、工单、客服交付、销售售前、市场增长、培训文档、合规留痕还是项目协调中工作，VibeCap 都围绕「截取 → 标注 → 粘贴 → 图库」闭环设计。选择一个角色，看看它如何落到真实流程里。',
    readMore: '了解更多',
    indexClosingTitle: '准备试试这套工作流？',
    detailFooterPrompt: '下载 VibeCap，在 Mac 上跑通这套流程。',
    ctaLabel: '在 Mac App Store 下载',
    cards: [
      {
        slug: 'everyday',
        title: '日常使用与 AI 聊天',
        description: 'ChatGPT、Claude、IM、邮件——把屏幕上的瞬间变成可直接粘贴的清晰图片。',
      },
      {
        slug: 'design',
        title: 'UX / UI / 产品设计师',
        description: '红线、评审与用户研究截图：箭头、形状与数字标注一次完成。',
      },
      {
        slug: 'developer',
        title: '开发者',
        description: 'Bug 复现、文档与终端优先工作流，配合智能粘贴路由。',
      },
      {
        slug: 'brand',
        title: '平面与品牌设计',
        description: '高保真参考、客户反馈与可管理的视觉素材库。',
      },
      {
        slug: 'qa',
        title: 'QA 测试工程师',
        description: '复现步骤编号、批量复制粘贴，服务工单与测试记录。',
      },
      ...industryCardsZh,
    ],
  },
  pages: {
    everyday: {
      slug: 'everyday',
      metaTitle: '日常使用 VibeCap — AI 对话、即时通讯与快速分享',
      metaDescription:
        '框选截取、标注后粘贴到 ChatGPT、Claude、Slack 或信息。预览、Keep 与图库让截图不再散落。',
      title: '日常使用：AI、聊天与「直接给你看」',
      subtitle: '典型画像：在浏览器、AI 助手与通讯软件之间频繁切换的知识工作者与重度用户。',
      personaLabel: '日常与多工具混合工作流',
      sections: {
        whyTitle: '为什么日常生活里离不开截图',
        whyLead:
          '大多数「帮我看一下」的时刻都是视觉的。截图是最快的共同事实：界面状态、报错气泡、文档里的一段话，或做到一半的结账流程。',
        whyPoints: [
          '向 ChatGPT 或 Claude 说明问题，而不必把整屏内容手打一遍。',
          '在 Slack、Teams 或信息里发送精确上下文，单靠文字往往说不清楚。',
          '在凭证、确认页或稍纵即逝的 UI 状态消失前留下记录。',
          '指出具体的按钮、开关或设置项——而不是模糊描述。',
        ],
        painTitle: '通用截图习惯的痛点',
        painLead:
          '系统自带截图擅长抓取像素，但之后的交接才是摩擦来源——尤其是当目的地是 AI 和聊天应用时。',
        painPoints: [
          '图片落在桌面或「下载」里，文件名无意义，随后难以找回。',
          '仍需要别的工具圈出关键元素，或为短短几步操作编号。',
          '粘贴到不同应用时体验不一致（图片、文件或网页里误粘路径文字）。',
          '想不起第一次截的文件在哪，只好再截一遍。',
        ],
        howTitle: '在这种流程里怎么用 VibeCap',
        howSteps: [
          {
            title: '从任意位置触发截取',
            body: '按下全局快捷键（默认 ⌘⇧2）。VibeCap 冻结所有显示器、压暗屏幕，让你拖出精确区域——或在某块屏幕上双击完成全屏截取。',
          },
          {
            title: '分享前先标出重点',
            body: '在截取窗口中用箭头、矩形、圆形、数字角标与编号箭头，搭配六种颜色。复制或保存时，标注会烘焙进最终图像。',
          },
          {
            title: '复制后粘贴到你已经在用的应用',
            body: '在模态窗口用 ⌘C（或浮动预览里的 Copy）。VibeCap 将 PNG 与 TIFF 写入剪贴板，便于粘贴到各类 AI 与聊天客户端。',
          },
          {
            title: '用预览、Keep 与图库兜底',
            body: '保存或复制后，浮动预览提供 Keep（避免被自动清理）、Copy、在 Finder 中显示与打开图库。也可将缩略图直接拖到其他应用，走文件分享。',
          },
        ],
        benefitsTitle: '使用 VibeCap 后的改变',
        benefitPoints: [
          '从「看到」到「粘贴」一条链路——更少标签页、更少神秘文件。',
          '标注让 AI 提示词和聊天信息不言自明，减少长篇解释。',
          '已保存截图使用日期时间文件名（VC yyyymmdd-hhmmss.png），可在图库中按日期筛选找回。',
          '在开启辅助功能权限时，可选的智能粘贴路由会在终端类应用与富文本编辑器之间选择更合适的粘贴形式。',
        ],
      },
    },
    design: {
      slug: 'design',
      metaTitle: 'UX / UI / 产品设计师使用 VibeCap',
      metaDescription:
        '区域截取、箭头与数字标注，以及按日期分组的截图库——用于评审、研究与交付说明。',
      title: 'UX / UI / 产品设计师：把评审说清楚',
      subtitle: '典型画像：产品设计师、用研，以及参与视觉评审、规格说明的产设相关角色。',
      personaLabel: '设计评审与研究',
      sections: {
        whyTitle: '为什么设计师离不开截图',
        whyLead:
          '设计工作大量在图像中协商：上线效果、与稿子的差异、研究中的界面行为。仅有 Figma 链接往往不够，截图能把异步评审钉在真实像素上。',
        whyPoints: [
          '记录线上真实 UI 与稿子的差异——状态、间距、文案只在生产环境出现。',
          '在营销页、引导流程与边界界面上标注违规或机会点。',
          '为汇报与工单准备轻量研究证据（引用 + 界面上下文）。',
          '给工程与业务方编号步骤：「1 → 2 → 3」走完一条流程。',
        ],
        painTitle: '常见工具链的短板',
        painLead:
          '设计工具擅长源文件，但对「已上线界面」的快速截取与清晰标注，往往散落在多个应用里。',
        painPoints: [
          '只为裁一块线上界面就从设计工具导出，太重。',
          'Figma 批注替代不了「浏览器里这一像素」——跨界面评审仍要截图。',
          '在幻灯片或文档里重做编号步骤，既耗时又容易与原始截图脱节。',
          '文件夹里堆满「截屏 2026-…」难以搜索，也和工单对不上。',
        ],
        howTitle: '在设计工作流里怎么用 VibeCap',
        howSteps: [
          {
            title: '冻结真实界面再紧裁',
            body: '开始截取后拖选组件或流程相关区域。多显示器并行冻结，便于在正确的一块 Retina 屏上选取。',
          },
          {
            title: '把标注层当红线工具',
            body: '箭头与形状圈出区域；数字角标与编号箭头表达步骤顺序。颜色可区分严重程度、负责人或主题。',
          },
          {
            title: '保存或复制到评审载体',
            body: '保存会以原子写入方式生成带 VC 时间戳的文件名。复制将带标注的位图送到剪贴板，便于粘到 Notion、Slack、文档或 Figma 评论。',
          },
          {
            title: '用 Keep 与图库做策展',
            body: '对需要长期保留的截图打开 Keep，避免被自动清理删掉。图库按日历天分组，方便找回「周二那版评审」。',
          },
        ],
        benefitsTitle: '设计师每周能感知到的收益',
        benefitPoints: [
          '反馈以单张带标注图片传递——减少误读与来回确认。',
          '删除编号标注时会自动重排序号，编辑证据更省心。',
          '图库形成轻量的视觉决策与研究记录轨迹。',
          '可选自动清理控制长期磁盘占用，同时 Keep 保护参考素材。',
        ],
      },
    },
    developer: {
      slug: 'developer',
      metaTitle: '开发者使用 VibeCap — 终端路径、Cursor 与 Bug 复现',
      metaDescription:
        '双格式剪贴板、终端感知粘贴路由、多图顺序粘贴与原子保存，服务可复现缺陷报告。',
      title: '开发者：从复现截图到正确的粘贴目标',
      subtitle: '典型画像：在编辑器、终端、浏览器与 AI 编程助手之间切换的软件工程师。',
      personaLabel: '工程与类 DevOps 工作流',
      sections: {
        whyTitle: '工程师为什么频繁截图',
        whyLead:
          '可复现性是视觉的：堆栈旁的 UI、配置面板、网络面板，以及「我这边正常」的差异。截图是工单与文档里最通用的附件格式。',
        whyPoints: [
          '缺陷单需要紧凑复现：UI 状态 + 少量关键上下文。',
          '内部 runbook 与 README 适合嵌入 CLI 输出或面板截图。',
          '与 Cursor、VS Code、网页版 AI 协作时，粘贴准确面板比描述更快。',
          '给同事或脚本传本地文件路径，往往比往 shell 里塞整张位图更合适。',
        ],
        painTitle: '开发场景下截取 → 粘贴的摩擦',
        painLead:
          '难点不在截图本身，而是让剪贴板里的*表现形式*匹配*目标界面*，而无需反复手动处理。',
        painPoints: [
          '终端要转义后的路径，富编辑器要图片——朴素粘贴总有一边不对。',
          'Cursor 等混合终端与编辑区的应用，简单启发式容易选错格式。',
          '向文档或工单连续粘贴多张图时，每张都要手动操作一遍。',
          '在浏览器字段误粘纯文本路径，会泄露路径或和图片并排出现垃圾字符。',
        ],
        howTitle: 'VibeCap 如何嵌入工程工作流',
        howSteps: [
          {
            title: '像素级裁剪 UI 或日志',
            body: '区域选择适合面板；在遮罩上双击可在该显示器全屏截取。裁剪会考虑显示器 scale，Retina 截图保持锐利。',
          },
          {
            title: '先标注再复制',
            body: '圈出问题控件、箭头指向报错，或为短复现路径编号。在模态窗口 ⌘C 会把标注渲染进导出的位图。',
          },
          {
            title: 'Copy 之后武装智能粘贴路由',
            body: '在已授予辅助功能且存在已保存文件路径时，Copy 可武装粘贴路由：下一次 ⌘V 会结合前台应用解析。终端收到 shell 转义后的路径文本；编辑器收到图片——Cursor 还会用无障碍采样区分终端与编辑区域。',
          },
          {
            title: '从图库按顺序粘贴多图',
            body: '在图库多选截图后 Copy。在辅助功能可用时，VibeCap 可顺序粘贴多张图：首次 ⌘V 由你触发，后续图片在短间隔内自动推进。',
          },
          {
            title: '原子写入保存可追溯附件',
            body: '开启保存时使用原子写入，避免半截 PNG。默认文件名为 VC yyyymmdd-hhmmss.png，重名自动追加序号——便于挂到工单上。',
          },
        ],
        benefitsTitle: '开发者能得到的便利',
        benefitPoints: [
          '在 Terminal、IDE 与浏览器之间切换时，更少手动伺候剪贴板。',
          '分享复现或文档截图时，减少「粘贴类型不对」的失败。',
          '多图截取能线性对应到长文或 AI 对话结构。',
          '图库 + Keep 让分散的复现截图变成可检索、可保留的档案。',
        ],
      },
    },
    brand: {
      slug: 'brand',
      metaTitle: '平面与品牌设计师使用 VibeCap',
      metaDescription:
        '高 DPI 区域截取、多色标注、拖出分享与图库整理——服务参考收集与客户反馈。',
      title: '平面与品牌设计：参考图保持锐利',
      subtitle: '典型画像：视觉设计师、品牌设计师与需要维护品牌一致性的创意负责人。',
      personaLabel: '视觉参考与品牌治理',
      sections: {
        whyTitle: '品牌工作为什么依赖截图',
        whyLead:
          '品牌的真实状态在网页、应用与演示里——不只存在于主文件。团队对照线上触点（广告、落地页、社交），需要保留清晰像素以核对字体与色彩。',
        whyPoints: [
          '跟踪竞品与类目的线上活动与趋势。',
          '在真实环境（浏览器框、真机、深色模式）中截取对客户可见的稿。',
          '记录偏离指南的用法或合作方联合物料的问题。',
          '为情绪板与素材库快速做带标记的抓取。',
        ],
        painTitle: '视觉从业者的常见痛点',
        painLead:
          '低分辨率抓取、混乱文件名与含糊标注，都会削弱你用证据支撑创意决策的能力。',
        painPoints: [
          '松散的裁剪会让文字边缘发糊——你需要 Retina 下的完整像素网格。',
          '若不能精确指出 Logo 安全区或色带断裂，反馈周期会被拉长。',
          '大量无命名截图难以整理或交给客户团队。',
          '在聊天、邮件与网盘之间重复存同一张图，却没有统一图库。',
        ],
        howTitle: '品牌工作流中如何使用 VibeCap',
        howSteps: [
          {
            title: '按原生分辨率截取',
            body: '选区会经过显示器缩放换算，导出的 PNG 反映真实像素尺寸——对检视字体与质感很重要。',
          },
          {
            title: '用六种颜色做标注体系',
            body: '可用固定颜色区分反馈类型（如结构 vs. 文案）。箭头、矩形与圆形说明层次，无需再开单独修图软件。',
          },
          {
            title: '从预览分享或拖出文件',
            body: '浮动预览支持 Copy、Keep、在 Finder 中显示，以及将缩略图拖出为文件——适合邮件附件或素材桶。',
          },
          {
            title: '用 Keep 与可选清理管理留存',
            body: '长期参考打上 Keep，自动清理会跳过这些文件。图库按日网格浏览，按时间回顾所有抓取。',
          },
        ],
        benefitsTitle: '对创意团队的收益',
        benefitPoints: [
          '基于证据的反馈以单张标注图送达——客户与跨职能伙伴更容易对齐。',
          '档案按日期可浏览，并对长期素材显式保护。',
          '可选自动清理减轻杂乱，同时尊重 Keep 标记。',
          '同一套流程既适合随手截取，也适合深度图库管理。',
        ],
      },
    },
    qa: {
      slug: 'qa',
      metaTitle: 'QA 测试工程师使用 VibeCap — 复现步骤、证据与批量粘贴',
      metaDescription:
        '数字标注、多选复制与顺序粘贴、安全删除与可预期文件名，服务测试证据与工单。',
      title: 'QA：证据方式对齐你写工单的习惯',
      subtitle: '典型画像：负责提单、验证修复、在多浏览器与版本间沟通的测试工程师。',
      personaLabel: '测试执行与缺陷文档',
      sections: {
        whyTitle: 'QA 为什么依赖截图',
        whyLead:
          '用例是程序化的，证据是视觉的。截图证明环境、数据与 UI 状态——尤其是「实际结果」相对「预期」——并横跨浏览器与设备。',
        whyPoints: [
          '附带视觉的复现步骤减少与开发的来回沟通。',
          '回归测试适合为构建版本保留前后对比截图。',
          '探索式测试会产生大量图，需要快速截取且不丢线索。',
          '合规或发布评审常要求清晰、顺序化的叙述。',
        ],
        painTitle: '测试文档化中的操作痛点',
        painLead:
          '当证据不一致——缺步骤、裁切含糊、或与构建难以对应——工单质量会明显下降。',
        painPoints: [
          '删掉一张编号标注后手动重排序号，费时且易错。',
          '向报告或 Jira 评论连续粘贴五张图，每张都要重复操作。',
          '批量删除缺少保护时，容易误删证据。',
          '名为 image.png 的文件在共享盘上无法按时间线排序。',
        ],
        howTitle: 'VibeCap 如何支撑 QA 流程',
        howSteps: [
          {
            title: '用一致画幅截取每一步',
            body: '冻结后框选保留相关控件或提示；需要环境信息（地址栏、开关）时可双击全屏该显示器。',
          },
          {
            title: '让复现序号自动保持一致',
            body: '使用数字角标与编号箭头；删除某一编号标记后，其余数字会重新排序，工单叙述仍逻辑连贯。',
          },
          {
            title: '批量复制写长文',
            body: '在图库中用框选或 ⌘ 点击多选后 Copy。开启辅助功能时，顺序粘贴可在首次 ⌘V 后按顺序插入每张图到工单或文档。',
          },
          {
            title: '安全地管理生命周期',
            body: '单张删除直接进入废纸篓；多张删除会先确认。Keep 标记的截图不会被可选自动清理删除。',
          },
        ],
        benefitsTitle: 'QA 侧的收益',
        benefitPoints: [
          '编辑证据时节号保持连贯，工单更易读。',
          '磁盘上的 VC 时间戳命名便于按夜构建或附件审计。',
          '图库筛选（全部 / 已保留）区分一次性跑批与发布关键截图。',
          '基于废纸篓的删除降低误删永久文件的风险，同时仍能批量清理噪音。',
        ],
      },
    },
    ...industryPagesZh,
  },
};

export const useCasesByLocale: Record<Locale, LocaleUseCases> = {
  en,
  zh,
};

export function getUseCasePage(locale: Locale, slug: string): UseCasePageContent | undefined {
  if (!isValidUseCaseSlug(slug)) {
    return undefined;
  }
  return useCasesByLocale[locale].pages[slug];
}
