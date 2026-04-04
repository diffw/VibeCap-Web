/**
 * Additional industry / role use cases (customer success, sales, growth, etc.).
 * Merged into use-cases-content.ts — structure mirrors UseCasePageContent.
 */
export const INDUSTRY_SLUGS = [
  'customer-success',
  'sales',
  'growth',
  'training',
  'compliance',
  'business-ops',
  'research-media',
  'project-coordination',
] as const;

export type IndustrySlug = (typeof INDUSTRY_SLUGS)[number];

type IndustryPage = {
  slug: IndustrySlug;
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

export const industryCardsEn: Array<{ slug: IndustrySlug; title: string; description: string }> = [
  {
    slug: 'customer-success',
    title: 'Customer success & support',
    description:
      'Tickets, screen shares, and handoffs — capture errors, settings, and repro with annotations for Zendesk, Salesforce, and internal tools.',
  },
  {
    slug: 'sales',
    title: 'Sales & pre-sales',
    description:
      'Demos, CRM states, and approval quirks — paste evidence into Slack, email, or AI assistants without losing pixel context.',
  },
  {
    slug: 'growth',
    title: 'Marketing, growth & SEO',
    description:
      'Campaign pages, SERPs, and social UI — crisp Retina crops and dated files for retros and stakeholder updates.',
  },
  {
    slug: 'training',
    title: 'Training & technical writing',
    description:
      'SOPs, help centers, and release notes — numbered steps and shapes that bake into the image you publish.',
  },
  {
    slug: 'compliance',
    title: 'Compliance, legal & risk',
    description:
      'Point-in-time UI and workflow evidence — organized filenames, Keep, and Library for audit-friendly archives.',
  },
  {
    slug: 'business-ops',
    title: 'HR, finance & operations',
    description:
      'ATS, payroll portals, invoicing, and back-office tools — fast capture and paste into IM or docs.',
  },
  {
    slug: 'research-media',
    title: 'Research, media & accessibility',
    description:
      'UR artifacts, editorial captures, and a11y audits — compare before/after with arrows and numbering.',
  },
  {
    slug: 'project-coordination',
    title: 'PM, BA & delivery leads',
    description:
      'Boards, burn-downs, and “current prod” snapshots — one library for stand-ups and async updates.',
  },
];

export const industryCardsZh: Array<{ slug: IndustrySlug; title: string; description: string }> = [
  {
    slug: 'customer-success',
    title: '客服、客户成功与交付',
    description: '工单与远程排障——截取报错、配置界面与复现步骤，标注后粘贴到 Zendesk、Salesforce 或内部系统。',
  },
  {
    slug: 'sales',
    title: '销售与售前',
    description: 'Demo 画面、CRM 与审批异常——把像素级证据贴进 Slack、邮件或 AI 对话，减少文字误读。',
  },
  {
    slug: 'growth',
    title: '市场、增长与 SEO',
    description: '活动页、搜索结果与社媒界面——Retina 区域截取与可排序文件名，服务复盘与汇报。',
  },
  {
    slug: 'training',
    title: '培训与知识文档',
    description: 'SOP、帮助中心与 Release Note——数字步骤与形状标注直接烘焙进最终配图。',
  },
  {
    slug: 'compliance',
    title: '合规、法务与风控',
    description: '某一时刻的界面与流程留痕——VC 时间戳命名、Keep 与图库便于归档与检索。',
  },
  {
    slug: 'business-ops',
    title: '人力、财务与业务运营',
    description: '招聘系统、对账门户与后台配置——快速截取并粘贴到 IM 或文档，对齐异常状态。',
  },
  {
    slug: 'research-media',
    title: '研究、媒体与无障碍',
    description: '用研素材、报道取证与 a11y 审计——箭头与编号对比修复前后。',
  },
  {
    slug: 'project-coordination',
    title: '项目经理与业务分析',
    description: '看板、燃尽图与线上现状——统一图库支撑站会与异步同步。',
  },
];

export const industryPagesEn: Record<IndustrySlug, IndustryPage> = {
  'customer-success': {
    slug: 'customer-success',
    metaTitle: 'VibeCap for customer support, success, and IT helpdesk',
    metaDescription:
      'Freeze-and-crop captures, annotations for tickets, PNG+TIFF clipboard paste, Library batch copy, and optional sequential paste for long repro threads.',
    title: 'Customer success & support: tickets that show, not tell',
    subtitle:
      'Primary persona: L1–L3 support, customer success, implementation consultants, and IT helpdesk staff who live in Zendesk, Salesforce, Jira, and screen shares.',
    personaLabel: 'Support · CS · implementation · IT',
    sections: {
      whyTitle: 'Why support and delivery teams screenshot constantly',
      whyLead:
        'Customers rarely describe UI state accurately. A single frame can replace ten messages — error text, toggle positions, permission banners, and the exact step where a flow breaks.',
      whyPoints: [
        'Attaching repro evidence to cases so engineering sees the same surface the customer saw.',
        'Teaching “click here, then here” during onboarding without scheduling yet another call.',
        'Documenting before/after for configuration changes, migrations, or break-fix work.',
        'Creating knowledge-base articles where step imagery is faster than perfect prose.',
      ],
      painTitle: 'Pain points in ticket and handoff workflows',
      painLead:
        'Screen sharing helps live, but async work needs durable, shareable captures — and many teams still fight messy files and unclear callouts.',
      painPoints: [
        'Generic screenshots omit the one control that matters unless someone manually circles it in Preview.',
        'Filenames like “Screen Shot” do not map to case IDs or dates when you search a month later.',
        'Pasting into web-based ticket bodies vs. internal wikis behaves differently; path text leaking into browsers is a recurring annoyance.',
        'Multi-step repros mean multiple images; attaching and ordering them manually burns handle time.',
      ],
      howTitle: 'How to use VibeCap in support and CS',
      howSteps: [
        {
          title: 'Capture the customer-visible state in one shortcut',
          body: 'Press the global hotkey to freeze all monitors, dim overlays, and drag-select the region (or double-click for full-screen on that display). Retina scale is preserved in the crop.',
        },
        {
          title: 'Annotate like you would on a screen share',
          body: 'Use arrows, rectangles, circles, numeric badges, and numbered arrows in six colors. Everything renders into the bitmap on Copy or Save — ideal for Zendesk, Confluence, or Slack.',
        },
        {
          title: 'Paste into the app in front of you',
          body: '⌘C from the modal or Copy on the preview writes PNG + TIFF. With Accessibility enabled and a saved path, paste routing can send shell-escaped paths to Terminal-style apps and images to rich editors on your next ⌘V.',
        },
        {
          title: 'Batch evidence from Library',
          body: 'Marquee- or ⌘-select multiple captures and Copy; sequential paste (when armed and permitted) helps drop an ordered image series into a long ticket comment or doc after the first manual paste.',
        },
        {
          title: 'Keep critical cases out of cleanup',
          body: 'Mark must-keep screenshots with Keep so optional auto-cleanup skips them. Show in Finder jumps straight from preview to the VC timestamped PNG on disk.',
        },
      ],
      benefitsTitle: 'What improves for support orgs',
      benefitPoints: [
        'Shorter mean-time-to-clarity — reviewers see labeled evidence instead of parsing paragraphs.',
        'A dated Library reduces “do you still have that screenshot?” across shifts and time zones.',
        'Safer deletes: Trash for bulk cleanup, confirmation for multi-select, Keep for retention-sensitive shots.',
        'One tool chain from capture to paste, aligned with how VibeCap handles clipboard and library flows.',
      ],
    },
  },
  sales: {
    slug: 'sales',
    metaTitle: 'VibeCap for sales, solutions, and RevOps',
    metaDescription:
      'Capture demo UI, CRM anomalies, and quotes; annotate highlights; paste into Slack, email, or AI chat with dual-format clipboard support.',
    title: 'Sales & pre-sales: evidence that closes internal gaps',
    subtitle:
      'Primary persona: AEs, solutions engineers, sales engineers, and RevOps folks who reconcile CRM truth with what prospects actually see.',
    personaLabel: 'Sales · solutions · RevOps',
    sections: {
      whyTitle: 'Why revenue teams reach for screenshots',
      whyLead:
        'Deals stall on ambiguity: a mis-set stage, a pricing field, an approval stuck in workflow. A capture aligns RevOps, manager, and rep on the same UI truth without another live call.',
      whyPoints: [
        'Preserving “this is what the demo showed” for SE handoffs and post-call follow-ups.',
        'Escalating CRM, CPQ, or billing oddities with visual proof attached to Slack or email.',
        'Capturing competitor or legacy-system comparisons during discovery.',
        'Feeding AI assistants (ChatGPT, Claude) a specific panel instead of retyping metadata.',
      ],
      painTitle: 'Where ad-hoc captures break down',
      painLead:
        'Sales moves fast; screenshots that are not labeled, dated, or easy to find become liabilities during quarter-end reviews or deal desk questions.',
      painPoints: [
        'Cropping the wrong region leaves reps explaining context in text anyway.',
        'Sensitive path strings pasted into browser-based tools create awkward leaks or double content.',
        'Screenshots scattered across downloads and desktop folders are hard to correlate with opportunity IDs.',
        'Numbered “step 1–3” flows recreated in slides drift from what was actually shown live.',
      ],
      howTitle: 'How to use VibeCap on the revenue cycle',
      howSteps: [
        {
          title: 'Grab the exact panel',
          body: 'Freeze the screen, drag a tight rectangle around the quote line, stage field, or product UI you need. Double-click the overlay when the full monitor tells the story.',
        },
        {
          title: 'Highlight the decision-relevant pixels',
          body: 'Use color-coded arrows or numbered callouts so finance or deal desk sees the anomaly instantly in one image.',
        },
        {
          title: 'Copy into your collaboration stack',
          body: 'Paste into Slack, Gmail, Notion, or AI chat windows — PNG and TIFF maximize compatibility across macOS and Electron apps.',
        },
        {
          title: 'File for the record',
          body: 'Saving emits VC yyyymmdd-hhmmss.png via atomic write; drag from preview to attach as a file when your policy prefers attachments over inline paste.',
        },
      ],
      benefitsTitle: 'Benefits for GTM teams',
      benefitPoints: [
        'Faster internal alignment on “what the system shows” vs. verbal summaries.',
        'Library gives a chronological trail of deal-critical captures without manual renaming projects.',
        'Keep protects screenshots you must not lose to automated retention policies.',
        'Optional paste routing keeps terminal-style tooling and rich editors from fighting over clipboard formats.',
      ],
    },
  },
  growth: {
    slug: 'growth',
    metaTitle: 'VibeCap for marketing, growth, community, and SEO',
    metaDescription:
      'Retina-accurate crops of landing pages, SERPs, and social UIs; annotations for reviews; Library and Keep for campaign archives.',
    title: 'Marketing & growth: live surfaces, captured cleanly',
    subtitle:
      'Primary persona: growth marketers, performance marketers, community managers, and SEO specialists who benchmark live experiences.',
    personaLabel: 'Marketing · growth · social · SEO',
    sections: {
      whyTitle: 'Why growth orgs screenshot beyond “pretty pictures”',
      whyLead:
        'Campaign reality is a moving target: hero copy changes, bids shift, SERP features rotate. Screenshots are the lightweight instrument for “what users saw that week.”',
      whyPoints: [
        'Documenting landing-page variants, UTMs, and on-site messaging for retros.',
        'Capturing SERP layouts, featured snippets, and ranking volatility for stakeholders.',
        'Recording moderation states, warnings, or platform-specific UI in community ops.',
        'Building swipe files of competitor funnels with quick markup.',
      ],
      painTitle: 'Operational pain in growth capture',
      painLead:
        'When captures are fuzzy, uncropped, or unnamed, analytics narratives lose credibility — and legal/comms reviews get harder.',
      painPoints: [
        'Low-resolution grabs blur small type on Retina displays.',
        'Without annotation, reviewers still ask “which CTA?” on busy pages.',
        'Screenshots detached from dates and campaigns are painful to reconcile in QBR decks.',
        'Pasting into docs alongside accidental plain-text paths looks unprofessional.',
      ],
      howTitle: 'How to use VibeCap in growth workflows',
      howSteps: [
        {
          title: 'Freeze the live page',
          body: 'Capture the browser or desktop region at native pixel density so text and color blocks stay legible in decks.',
        },
        {
          title: 'Mark the insight',
          body: 'Circle the hero module, arrow to the disclaimer, or number a multi-step funnel capture — annotations bake into exports.',
        },
        {
          title: 'Drop into reports or AI summaries',
          body: 'Copy to clipboard for Google Slides, Notion, or ChatGPT/Claude threads analyzing creative performance.',
        },
        {
          title: 'Archive by campaign',
          body: 'Use Library’s day grouping and Keep for hero references; optional auto-cleanup trims old experiments while preserving marked files.',
        },
      ],
      benefitsTitle: 'Benefits for growth teams',
      benefitPoints: [
        'Crisp evidence that matches what prospects saw in the wild.',
        'Faster slide and memo prep with pre-labeled captures.',
        'Shared Library habits reduce duplicate screenshots in team drives.',
        'Clipboard behavior stays predictable across marketing’s mix of web and native apps.',
      ],
    },
  },
  training: {
    slug: 'training',
    metaTitle: 'VibeCap for L&D, docs, and knowledge bases',
    metaDescription:
      'Numbered annotations, shapes, and export-to-PNG for SOPs; atomic saves; Library for reusable training assets.',
    title: 'Training & docs: steps your readers can follow',
    subtitle:
      'Primary persona: instructional designers, enablement leads, and technical writers who ship SOPs, LMS modules, and help centers.',
    personaLabel: 'L&D · tech writing · knowledge base',
    sections: {
      whyTitle: 'Why documentation stays screenshot-centric',
      whyLead:
        'Procedural knowledge is visual: which menu, which toggle, which confirmation. Even video-first programs still need stills for search, PDFs, and quick fixes.',
      whyPoints: [
        'Building step-by-step guides where each frame matches the current product UI.',
        'Updating release notes and “what changed” articles with annotated diffs.',
        'Supporting customer education portals where learners skim images before text.',
        'Localizing screenshots consistently across languages while keeping layout fidelity.',
      ],
      painTitle: 'Authoring pain without a disciplined capture flow',
      painLead:
        'Writers lose hours re-cropping, re-numbering, and hunting files every time the product ships a minor UI tweak.',
      painPoints: [
        'Step numbers fall out of order when an intermediate screenshot is removed.',
        'Inconsistent crops make columns hard to scan in Confluence or GitBook.',
        'Authors maintain parallel folders outside the CMS with no shared catalog.',
        'Pasting into WYSIWYG editors sometimes strips metadata or mangles aspect ratios.',
      ],
      howTitle: 'How to use VibeCap for documentation',
      howSteps: [
        {
          title: 'Capture each step from the live app',
          body: 'Use region select so every image shares similar width and focus; double-click for full-screen when context matters.',
        },
        {
          title: 'Lean on automatic numbering',
          body: 'Place numeric badges or numbered arrows; deletions renumber remaining callouts so your article order stays coherent.',
        },
        {
          title: 'Export the final pixel',
          body: 'Copy or Save — VibeCap composites your marks into the PNG you embed in docs; if you did not draw anything, the original bitmap is unchanged.',
        },
        {
          title: 'Curate reusable shots',
          body: 'Keep evergreen tutorials marked in Library; drag from preview into CMS attachments when inline paste is not ideal.',
        },
      ],
      benefitsTitle: 'Benefits for documentation teams',
      benefitPoints: [
        'Less rework when editing numbered sequences.',
        'Atomic saves avoid half-written assets during crashy beta builds.',
        'Library + Keep create a shared, date-aware pool of approved screenshots.',
        'Authors spend more time on clarity and less on file janitor work.',
      ],
    },
  },
  compliance: {
    slug: 'compliance',
    metaTitle: 'VibeCap for compliance, legal, and audit support',
    metaDescription:
      'Timestamped PNG saves, Keep for retention, Library browsing, and annotated captures for point-in-time UI evidence (alongside your formal logs).',
    title: 'Compliance & legal: visual timestamps alongside records',
    subtitle:
      'Primary persona: compliance analysts, risk ops, internal audit partners, and legal specialists who document controls and public-facing states.',
    personaLabel: 'Compliance · legal · risk',
    sections: {
      whyTitle: 'Why regulated contexts still need screenshots',
      whyLead:
        'Systems of record hold logs, but humans often need to show “this is what the approver saw” or “this is what the public page displayed.” Screenshots are a complement — not a replacement — for authoritative exports.',
      whyPoints: [
        'Demonstrating control effectiveness with UI-level evidence during walkthroughs.',
        'Recording marketing or policy pages as they appeared on a given date.',
        'Supporting IP or brand disputes with captures of public digital surfaces.',
        'Explaining access reviews or permission matrices to non-technical stakeholders.',
      ],
      painTitle: 'Risks of unmanaged capture habits',
      painLead:
        'If images are undated, unlabeled, or stored only in chat threads, they weaken traceability and create discovery headaches.',
      painPoints: [
        'Casual captures lack metadata tying them to systems, owners, or time windows.',
        'Sensitive filesystem paths accidentally pasted into the wrong channel.',
        'Authors cannot prove which build or environment a screenshot reflects.',
        'Auto-deletion policies may purge evidence unless files are explicitly protected.',
      ],
      howTitle: 'How to use VibeCap responsibly in compliance workflows',
      howSteps: [
        {
          title: 'Capture with environment context when needed',
          body: 'Include URL bars, version badges, or account banners in the crop when your policy requires environmental proof.',
        },
        {
          title: 'Annotate sparingly but precisely',
          body: 'Use shapes and numbers to highlight the control in question without obscuring legally relevant text.',
        },
        {
          title: 'Save with deterministic filenames',
          body: 'Atomic writes produce VC yyyymmdd-hhmmss.png (suffix on collision) — easy to sort chronologically beside case folders.',
        },
        {
          title: 'Protect retention-sensitive files',
          body: 'Toggle Keep for captures that must survive optional auto-cleanup; Library’s All vs. Kept filters separate working shots from official holds.',
        },
      ],
      benefitsTitle: 'Benefits for governance teams',
      benefitPoints: [
        'Better alignment between narrative descriptions and what reviewers can see.',
        'Reduced ambiguity about when a capture was taken thanks to naming and Library ordering.',
        'Clear separation between ephemeral working screenshots and kept records.',
        'A single macOS-native workflow that still respects your broader records policy.',
      ],
    },
  },
  'business-ops': {
    slug: 'business-ops',
    metaTitle: 'VibeCap for HR, finance, procurement, and ecommerce ops',
    metaDescription:
      'Back-office portals, ATS, and inventory tools — quick region capture, paste into Slack or email, Library for payroll and month-end trails.',
    title: 'HR, finance & ops: back-office truth in one image',
    subtitle:
      'Primary persona: HRBPs and recruiters, accountants and AP clerks, procurement coordinators, and ecommerce ops leads.',
    personaLabel: 'HR · finance · procurement · ecommerce ops',
    sections: {
      whyTitle: 'Why business ops screenshots every week',
      whyLead:
        'Payroll systems, ATS stages, invoice portals, and OMS screens are where exceptions show up first. A capture gets payroll, manager, and vendor on the same page faster than forwarding logins.',
      whyPoints: [
        'Escalating “button grayed out” or permission errors with exact UI context.',
        'Showing month-end reconciliation discrepancies across two browser tabs.',
        'Sharing inventory or promo configuration states with suppliers or marketplace teams.',
        'Explaining benefits or time-off balances to employees with visual proof.',
      ],
      painTitle: 'Pain in sensitive operational comms',
      painLead:
        'These flows mix PII and money movement — sloppy captures (wrong window, leaked paths) create trust and audit issues.',
      painPoints: [
        'Full-screen grabs overshare unrelated employee or financial data.',
        'Chat threads become the “system of record” because nobody files images properly.',
        'Explaining multi-step approvals in text alone invites mis-clicks on follow-up.',
        'Different apps accept paste differently, slowing down month-end fire drills.',
      ],
      howTitle: 'How to use VibeCap in business ops',
      howSteps: [
        {
          title: 'Crop to the minimum necessary surface',
          body: 'Drag-select only the table, banner, or form section needed so adjacent PII stays out of frame.',
        },
        {
          title: 'Redact with shapes if policy requires',
          body: 'Use rectangles or arrows to mask or point while keeping context — annotations become part of the exported PNG.',
        },
        {
          title: 'Paste or attach quickly',
          body: 'Copy for Slack/Teams/email; drag from preview when your policy prefers attaching a VC-named file from disk.',
        },
        {
          title: 'File for payroll or close',
          body: 'Library groups by day for “close week” references; Keep ensures critical evidence is not purged by cleanup jobs.',
        },
      ],
      benefitsTitle: 'Benefits for ops teams',
      benefitPoints: [
        'Faster escalations with less back-and-forth clarifying which screen someone meant.',
        'Consistent filenames aid month-end folders without manual renaming marathons.',
        'Keep + optional cleanup balance hygiene against legal hold-style needs.',
        'Clipboard dual formats keep macOS-native mail and web apps predictable.',
      ],
    },
  },
  'research-media': {
    slug: 'research-media',
    metaTitle: 'VibeCap for user research, editorial, and accessibility audits',
    metaDescription:
      'Session artifacts, SERP/news captures, and a11y issue markup with arrows, numbers, and Library organization.',
    title: 'Research, media & a11y: evidence with context',
    subtitle:
      'Primary persona: user researchers, journalists, editors, and accessibility specialists who cite what was on screen.',
    personaLabel: 'UR · media · accessibility',
    sections: {
      whyTitle: 'Why evidence-based roles screenshot differently',
      whyLead:
        'These disciplines argue from observation: what participants saw, what a site displayed at publication time, or where focus order breaks. The image is part of the method.',
      whyPoints: [
        'Capturing stimulus or competitor flows during research synthesis.',
        'Preserving ephemeral web or social states for fact-checking.',
        'Documenting WCAG issues with precise on-screen location.',
        'Comparing before/after fixes for design or engineering sign-off.',
      ],
      painTitle: 'Ethical and practical pain points',
      painLead:
        'Researchers and reporters must balance fidelity with privacy; accessibility audits need repeatable framing across builds.',
      painPoints: [
        'Uncropped screenshots leak PII from adjacent UI elements.',
        'Without numbering, issue lists drift from the order discussed in readouts.',
        'Large unstructured folders make it hard to pair captures with session IDs or story slugs.',
        'Pasting into CMS or newsroom tools varies wildly by platform.',
      ],
      howTitle: 'How to use VibeCap in research and media workflows',
      howSteps: [
        {
          title: 'Frame the minimum viable context',
          body: 'Region select to exclude unrelated tabs or personal data; use full-screen only when the story requires full-page context.',
        },
        {
          title: 'Number findings for traceability',
          body: 'Numeric badges map cleanly to issue spreadsheets or editorial comment threads; auto-renumber after edits.',
        },
        {
          title: 'Pair with your notes pipeline',
          body: 'Copy into research repositories, Notion, or AI summarization tools; save when your IRB or newsroom policy demands originals on disk.',
        },
        {
          title: 'Organize by day or study',
          body: 'Library’s chronological grid helps locate “session 12 screenshots from Tuesday”; Keep protects participant-sensitive references per policy.',
        },
      ],
      benefitsTitle: 'Benefits for evidence-heavy work',
      benefitPoints: [
        'Clearer alignment between written findings and pixels.',
        'Faster a11y reviews with consistent markup baked into shared PNGs.',
        'Less time hunting files named “Screen Shot”.',
        'Workflow stays on-mac with the same capture → annotate → paste → library loop as other roles.',
      ],
    },
  },
  'project-coordination': {
    slug: 'project-coordination',
    metaTitle: 'VibeCap for PMs, BAs, and Scrum leads',
    metaDescription:
      'Boards, dashboards, and prod snapshots — capture, annotate, and paste into stand-up threads; Library for sprint history.',
    title: 'PM & delivery leads: one picture for the whole room',
    subtitle:
      'Primary persona: project managers, business analysts, Scrum Masters, and engineering managers who coordinate async status.',
    personaLabel: 'PM · BA · Scrum · EM',
    sections: {
      whyTitle: 'Why delivery coordination is screenshot-heavy',
      whyLead:
        'Roadmaps, burndowns, and incident timelines live in tools — but stakeholders often need a frozen moment to agree on “where we are now.”',
      whyPoints: [
        'Sharing Jira/Linear/Asana board states during stand-ups and exec readouts.',
        'Highlighting dependency or risk columns without granting full tool access.',
        'Capturing analytics dashboards for “this is our week-over-week reality.”',
        'Documenting production incidents for postmortems alongside log excerpts.',
      ],
      painTitle: 'Coordination pain without visual anchors',
      painLead:
        'Text-only updates invite misalignment; too many live links fatigue leadership; screenshots without labels still spark “which column?” questions.',
      painPoints: [
        'Board screenshots without callouts force readers to hunt for the single blocked card.',
        'Different zoom levels make week-to-week comparisons inconsistent.',
        'Screenshots trapped in chat scrollback are impossible to find next sprint.',
        'Multiple tools mean multiple capture habits across the team.',
      ],
      howTitle: 'How to use VibeCap for delivery communication',
      howSteps: [
        {
          title: 'Freeze the tool at the right zoom',
          body: 'Capture after you set browser zoom or column filters so each week’s shot matches the last.',
        },
        {
          title: 'Call out the signal',
          body: 'Arrow to the blocked story, number dependencies, or circle the metric that changed — annotations export with the image.',
        },
        {
          title: 'Paste into stand-up channels',
          body: 'Slack, Teams, or email — PNG/TIFF clipboard coverage keeps inline previews crisp on macOS.',
        },
        {
          title: 'Keep a sprint trail',
          body: 'Library gives dated thumbnails; Keep marks milestone captures you will reference in QBRs.',
        },
      ],
      benefitsTitle: 'Benefits for delivery orgs',
      benefitPoints: [
        'Faster shared understanding in async stand-ups.',
        'Less rework explaining status with paragraphs when one labeled image suffices.',
        'Historical captures stay sortable thanks to VC filenames and Library grouping.',
        'Optional sequential paste helps dump multi-board updates into a doc in order.',
      ],
    },
  },
};

export const industryPagesZh: Record<IndustrySlug, IndustryPage> = {
  'customer-success': {
    slug: 'customer-success',
    metaTitle: '客服、客户成功与 IT 服务台使用 VibeCap',
    metaDescription:
      '冻结选区、工单标注、PNG+TIFF 剪贴板、图库多选复制与可选顺序粘贴，服务长线程复现。',
    title: '客服与客户成功：工单能「看见」，不必猜',
    subtitle:
      '典型画像：L1–L3 技术支持、客户成功、实施顾问与 IT 服务台，日常在 Zendesk、Salesforce、Jira 与远程桌面间切换。',
    personaLabel: '支持 · 客户成功 · 实施 · IT',
    sections: {
      whyTitle: '为什么支持团队高频截图',
      whyLead:
        '客户很少能准确描述界面状态。一帧画面可替代十句来回——报错文案、开关位置、权限提示与卡住的步骤一目了然。',
      whyPoints: [
        '在工单里附上复现证据，让研发看到与客户一致的界面。',
        '在实施与培训中说明「先点这里再点那里」，减少重复会议。',
        '记录配置变更、迁移或紧急修复前后的对比。',
        '撰写知识库文章时，分步配图往往比纯文字更快。',
      ],
      painTitle: '工单与交接中的典型痛点',
      painLead:
        '远程共享能解决当下，但异步协作需要可分享、可留存的截取——许多团队仍被杂乱文件与含糊圈点拖累。',
      painPoints: [
        '普通截图若不圈重点，评审仍猜不到是哪个控件。',
        '「截屏」式文件名难以与工单号或日期对应，事后检索困难。',
        '网页类工单正文与内部 Wiki 对粘贴表现不一；路径文本误入浏览器字段令人头疼。',
        '多步复现需要多张图，手动上传与排序消耗处理时长。',
      ],
      howTitle: '支持与客户成功如何用 VibeCap',
      howSteps: [
        {
          title: '一键截取客户可见状态',
          body: '全局快捷键冻结所有显示器，遮罩选区或双击单屏全屏；裁剪按 Retina 换算保留清晰像素。',
        },
        {
          title: '像远程演示一样标注',
          body: '箭头、矩形、圆形、数字角标与编号箭头共六色，复制或保存时标注烘焙进位图，适合 Zendesk、Confluence、Slack。',
        },
        {
          title: '粘贴到当前前台应用',
          body: '模态窗 ⌘C 或预览 Copy 写入 PNG+TIFF；在已保存路径且开启辅助功能时，可武装粘贴路由：终端类应用收转义路径，富编辑器收图片。',
        },
        {
          title: '从图库批量取证',
          body: '框选或 ⌘ 多选后 Copy；在允许时顺序粘贴有助于在长评论中按序插入多张图。',
        },
        {
          title: '用 Keep 抵御误删',
          body: '对必须保留的截图开 Keep，可选自动清理会跳过；「在 Finder 中显示」可从预览直达 VC 时间戳文件。',
        },
      ],
      benefitsTitle: '对支持团队的收益',
      benefitPoints: [
        '缩短「搞清楚发生了什么」的时间，少写长段文字。',
        '按日分组的图库减少跨班次、跨时区的「图还在吗」。',
        '废纸篓与多选删除确认更安全；Keep 服务需留存证据的工单。',
        '截取 → 标注 → 粘贴 → 图库与产品剪贴板/图库规格一致。',
      ],
    },
  },
  sales: {
    slug: 'sales',
    metaTitle: '销售、售前与 RevOps 使用 VibeCap',
    metaDescription:
      '截取 Demo 界面、CRM 异常与报价状态；标注后粘贴到 Slack、邮件或 AI 对话，双格式剪贴板兼容多应用。',
    title: '销售与售前：对齐内部争议的像素证据',
    subtitle: '典型画像：销售代表、解决方案/售前工程师，以及核对 CRM 与前台展示的 RevOps。',
    personaLabel: '销售 · 售前 · RevOps',
    sections: {
      whyTitle: '为什么收入团队离不开截图',
      whyLead:
        '成单卡在模糊：阶段填错、价格字段异常、审批悬停。一张图能让经理、运营与销售对系统里「长什么样」立刻一致，而不必再约会议。',
      whyPoints: [
        '保留「Demo 上到底展示了什么」便于 SE 交接与会后跟进。',
        '把 CRM、CPQ、账务异常以视觉证明发到 Slack 或邮件。',
        '在需求发现中对比竞品或旧系统界面。',
        '向 ChatGPT、Claude 提供具体面板而非手打字段说明。',
      ],
      painTitle: '临时截图的常见失效点',
      painLead:
        '销售节奏快；未标注、未归档的截图在季末复盘或交易台问询时会变成负担。',
      painPoints: [
        '裁错区域仍要用大段文字补上下文。',
        '路径字符串误入浏览器工具会造成尴尬或双重内容。',
        '散落在下载与桌面的截图难与商机 ID 对应。',
        '在幻灯片里重做的「1–3 步」与真实演示逐渐脱节。',
      ],
      howTitle: '在收入周期里怎么用 VibeCap',
      howSteps: [
        {
          title: '精确框选面板',
          body: '冻结后拖选报价行、阶段字段或产品界面；需要整屏叙事时对遮罩双击全屏该显示器。',
        },
        {
          title: '标出决策相关信息',
          body: '用颜色区分箭头或数字标注，让财务或交易台一眼看到异常点。',
        },
        {
          title: '粘贴到协作栈',
          body: '粘贴到 Slack、Gmail、Notion 或 AI——PNG 与 TIFF 在 macOS 与 Electron 应用中兼容性广。',
        },
        {
          title: '需要时落盘',
          body: '原子写入生成 VC 时间戳 PNG；从预览拖出文件，适合必须附件而非内嵌的策略。',
        },
      ],
      benefitsTitle: '对 GTM 团队的收益',
      benefitPoints: [
        '更快在内部对齐「系统显示」与口头描述。',
        '图库提供按时间排列的交易相关截取，少做手工重命名项目。',
        'Keep 避免关键证据被自动清理误伤。',
        '可选粘贴路由减少终端类与富文本工具争抢剪贴板。',
      ],
    },
  },
  growth: {
    slug: 'growth',
    metaTitle: '市场、增长、社群与 SEO 使用 VibeCap',
    metaDescription:
      '落地页、搜索结果与社媒界面的 Retina 裁剪；评审标注；图库与 Keep 做活动归档。',
    title: '市场与增长：线上实况，干净留存',
    subtitle: '典型画像：增长与市场运营、社群运营、SEO/增长分析，需要对线上体验做对标与复盘。',
    personaLabel: '市场 · 增长 · 社群 · SEO',
    sections: {
      whyTitle: '为什么增长团队不只为了「好看」而截图',
      whyLead:
        '投放现实一直在变：头图文案、出价、SERP 组件都在轮换。截图是记录「那一周用户看到什么」的轻量手段。',
      whyPoints: [
        '记录落地页变体、UTM 与站内文案供复盘。',
        '保存结果页布局、摘要与排名波动供汇报。',
        '在社群运营中记录平台提示、限流或异常状态。',
        '快速建立竞品漏斗素材并加标注。',
      ],
      painTitle: '增长场景下的操作痛点',
      painLead:
        '若截图模糊、未裁切或未标注，数据叙事难服众，法务与公关复核也更费力。',
      painPoints: [
        '低分辨率抓取在 Retina 屏上让小字发糊。',
        '不标注时评审仍问「哪个按钮」。',
        '缺少日期与活动关联时，QBR 难以对齐。',
        '文档里误夹路径纯文本显得不专业。',
      ],
      howTitle: '增长工作流中如何用 VibeCap',
      howSteps: [
        {
          title: '冻结线上页面',
          body: '按原生像素密度截取浏览器或桌面区域，保证型录与色彩块在汇报中可读。',
        },
        {
          title: '标出洞察',
          body: '圈主模块、箭头指向声明，或为多步漏斗编号——标注进入导出图。',
        },
        {
          title: '放入报告或 AI 摘要',
          body: '复制到 Google Slides、Notion 或 ChatGPT/Claude 分析创意表现。',
        },
        {
          title: '按活动归档',
          body: '利用图库按日分组与 Keep 保存标杆素材；可选自动清理淘汰旧实验同时保护标记文件。',
        },
      ],
      benefitsTitle: '对增长团队的收益',
      benefitPoints: [
        '与用户真实所见一致的清晰证据。',
        '预标注减少做片与写 memo 的时间。',
        '统一图库习惯减少网盘重复截图。',
        '剪贴板在 Web 与原生应用间表现稳定。',
      ],
    },
  },
  training: {
    slug: 'training',
    metaTitle: '企业培训、技术写作与知识库使用 VibeCap',
    metaDescription:
      '数字标注与形状导出到 PNG；原子保存；图库管理可复用培训配图。',
    title: '培训与文档：读者能跟着走的步骤',
    subtitle: '典型画像：教学设计、企业培训负责人与技术文档工程师，产出 SOP、帮助中心与 LMS。',
    personaLabel: '培训 · 技术写作 · 知识库',
    sections: {
      whyTitle: '为什么文档工作仍以截图为核心',
      whyLead:
        '操作知识是视觉的：哪个菜单、哪个开关、哪条确认。即便视频为主，仍需要静帧供搜索、PDF 与快速查阅。',
      whyPoints: [
        '编写与当前产品 UI 一致的分步指南。',
        '用带标注的差异图更新 Release Note 与「变更说明」。',
        '在客户自学门户中让读者先扫图再读字。',
        '在多语言发布中保持版式一致的截图基线。',
      ],
      painTitle: '缺少规范截取流程时的写作痛苦',
      painLead:
        '产品小改版就会让作者反复重裁、重编号、在 CMS 外维护平行文件夹。',
      painPoints: [
        '删掉中间一步后手动改序号易出错。',
        '裁切不一致让 Confluence/GitBook 排版难扫。',
        '作者在 CMS 外维护散落目录，没有共享目录。',
        '粘贴进所见即所得编辑器时偶发比例或元数据异常。',
      ],
      howTitle: '文档团队如何用 VibeCap',
      howSteps: [
        {
          title: '对真实应用逐步截取',
          body: '区域选择使每张宽度与焦点相近；需要环境时双击全屏该屏。',
        },
        {
          title: '依赖自动编号',
          body: '数字角标与编号箭头在删除后会重排，文章顺序保持可读。',
        },
        {
          title: '导出最终像素',
          body: '复制或保存时标注合成进 PNG；无标注时返回原始位图。',
        },
        {
          title: '策展可复用素材',
          body: '在图库为长青教程开 Keep；需附件时从预览拖到 CMS。',
        },
      ],
      benefitsTitle: '对文档团队的收益',
      benefitPoints: [
        '编辑编号步骤时返工更少。',
        '原子写入减少半成品文件风险。',
        '图库 + Keep 形成经批准的截图池。',
        '作者把时间花在讲清楚，而不是整理文件。',
      ],
    },
  },
  compliance: {
    slug: 'compliance',
    metaTitle: '合规、法务与风控场景使用 VibeCap',
    metaDescription:
      '带时间戳的 PNG 保存、Keep 与图库浏览、标注截取——作为正式日志之外的界面留痕补充。',
    title: '合规与法务：视觉时间戳配合正式记录',
    subtitle:
      '典型画像：合规分析、风险运营、内审协作与法务同事，需要说明控制点与公开页面状态。',
    personaLabel: '合规 · 法务 · 风险',
    sections: {
      whyTitle: '为什么合规场景仍需要截图',
      whyLead:
        '系统里有日志，但人往往需要展示「审批人当时看到的界面」或「某日公开页面长什么样」。截图是补充手段，不能替代权威导出与审计轨迹。',
      whyPoints: [
        '在穿行测试中展示控制运行与界面层面的证据。',
        '按日期记录营销或政策页面的对外展示。',
        '在品牌或知识产权争议中固定公开数字界面。',
        '向非技术干系人解释权限矩阵或访问评审。',
      ],
      painTitle: '无序截取带来的风险',
      painLead:
        '若图片无日期、无归档或只存在聊天记录里，可追溯性弱，也可能增加发现成本。',
      painPoints: [
        '随意截取缺少与系统、负责人或时间窗的对应关系。',
        '路径误贴到错误渠道造成敏感信息外泄。',
        '难以说明截图对应哪次构建或哪套环境。',
        '自动清理可能删掉本应保留的材料，除非显式保护。',
      ],
      howTitle: '在合规流程中如何谨慎使用 VibeCap',
      howSteps: [
        {
          title: '在需要时带上环境信息',
          body: '在策略允许下把地址栏、版本徽标或账号提示纳入选区，以证明环境上下文。',
        },
        {
          title: '精准标注、少遮挡',
          body: '用形状与编号突出控件，避免盖住具有法律意义的文字。',
        },
        {
          title: '用可排序文件名保存',
          body: '原子写入生成 VC yyyymmdd-hhmmss.png（重名追加序号），便于与案件文件夹并列排序。',
        },
        {
          title: '保护需留存文件',
          body: '对须保留的截取开 Keep；图库「全部 / 已保留」区分工作草稿与正式留存。',
        },
      ],
      benefitsTitle: '对治理团队的收益',
      benefitPoints: [
        '文字叙述与可见界面对齐，减少歧义。',
        '命名与图库顺序帮助回答「何时截取」。',
        '清晰区分临时截图与 Keep 保护的记录。',
        '在符合整体档案政策的前提下统一 macOS 端工作流。',
      ],
    },
  },
  'business-ops': {
    slug: 'business-ops',
    metaTitle: '人力、财务、采购与电商运营使用 VibeCap',
    metaDescription:
      'ATS、对账门户与后台配置——快速区域截取，粘贴到 IM 或邮件；图库服务月末与薪资轨迹。',
    title: '人力、财务与运营：后台真相一图搞定',
    subtitle:
      '典型画像：招聘与 HRBP、会计与应付、采购协调、电商与供应链运营，频繁处理门户异常。',
    personaLabel: '人力 · 财务 · 采购 · 电商运营',
    sections: {
      whyTitle: '为什么业务运营每周都在截图',
      whyLead:
        '薪资、ATS、发票与 OMS 是异常最先出现的地方。一张图比转发账号更快让薪酬、经理与供应商对齐。',
      whyPoints: [
        '上报「按钮灰掉」或权限错误时带上准确界面上下文。',
        '展示月末对账在两个浏览器标签间的差异。',
        '与供应商或平台运营同步库存、促销配置界面。',
        '向员工解释福利或假期余额时提供可视依据。',
      ],
      painTitle: '敏感运营沟通中的痛点',
      painLead:
        '这些流程夹杂个人信息与资金动作——全屏乱截或路径泄露会损害信任与审计。',
      painPoints: [
        '全屏图过度暴露无关员工或财务信息。',
        '聊天记录变成「事实来源」却无人整理归档。',
        '纯文字描述多步审批易导致后续误操作。',
        '月末救火时各应用粘贴行为不一致拖慢节奏。',
      ],
      howTitle: '业务运营如何用 VibeCap',
      howSteps: [
        {
          title: '裁到最小必要区域',
          body: '只拖选表格、提示条或表单区，让相邻敏感信息留在画外。',
        },
        {
          title: '按政策用形状处理敏感区',
          body: '可用矩形等标注遮挡或指向，同时保留语境——标注进入导出 PNG。',
        },
        {
          title: '快速粘贴或附件',
          body: '复制到 Slack/Teams/邮件；若政策要求附件，从预览拖出 VC 命名文件。',
        },
        {
          title: '为发薪或关账留痕',
          body: '图库按日分组服务关账周；Keep 确保关键证据不被清理任务删掉。',
        },
      ],
      benefitsTitle: '对运营团队的收益',
      benefitPoints: [
        '减少「你到底指哪一屏」的来回确认。',
        '统一文件名减轻关账文件夹手工重命名。',
        'Keep 与可选清理在卫生与留存间取得平衡。',
        '双格式剪贴板让邮件与 Web 应用表现可预期。',
      ],
    },
  },
  'research-media': {
    slug: 'research-media',
    metaTitle: '用研、媒体编辑与无障碍审计使用 VibeCap',
    metaDescription:
      '会话素材、报道取证与 a11y 问题标注；箭头与编号；图库按研究或稿件整理。',
    title: '用研、媒体与无障碍：带语境的证据',
    subtitle:
      '典型画像：用户研究员、记者编辑与无障碍专员，需要引用「屏幕上曾出现的内容」。',
    personaLabel: '用研 · 媒体 · 无障碍',
    sections: {
      whyTitle: '为什么证据型工作截图方式不同',
      whyLead:
        '这些职业以观察论证：参与者所见、发稿时网页状态、焦点顺序何处断裂——图像本身就是方法的一部分。',
      whyPoints: [
        '在研究综合阶段截取刺激物或竞品流程。',
        '为事实核查保留网页或社交瞬时状态。',
        '用精确界面位置记录 WCAG 问题。',
        '为设计或工程签收对比修复前后。',
      ],
      painTitle: '伦理与实践上的痛点',
      painLead:
        '研究者与记者要在清晰度与隐私间取舍；无障碍审计需要在版本间保持取景一致。',
      painPoints: [
        '未裁剪截图易从相邻 UI 泄露个人信息。',
        '无编号时问题清单与朗读会顺序脱节。',
        '缺乏结构的文件夹难以与会话 ID 或稿件 slug 对应。',
        '粘贴进 CMS 或编辑部工具因平台而异。',
      ],
      howTitle: '用研与媒体工作流中如何用 VibeCap',
      howSteps: [
        {
          title: '框选最小可用语境',
          body: '区域选择排除无关标签或个人数据；仅当叙事需要全页时再双击全屏。',
        },
        {
          title: '为可追溯性编号',
          body: '数字角标对应表格或评论串；删除后自动重排。',
        },
        {
          title: '接入你的笔记管线',
          body: '复制到研究库、Notion 或 AI 摘要；若 IRB 或编辑部要求原件，则保存到磁盘。',
        },
        {
          title: '按日或按研究整理',
          body: '图库时间网格便于找回「周二第 12 场」；按政策对参与者敏感引用使用 Keep。',
        },
      ],
      benefitsTitle: '对证据型工作的收益',
      benefitPoints: [
        '文字发现与像素对齐更清晰。',
        '无障碍评审用统一标注的共享 PNG 更省时。',
        '少在「截屏」文件名里大海捞针。',
        '与产品主链路一致的截取 → 标注 → 粘贴 → 图库体验。',
      ],
    },
  },
  'project-coordination': {
    slug: 'project-coordination',
    metaTitle: '项目经理、业务分析与敏捷教练使用 VibeCap',
    metaDescription:
      '看板、仪表盘与线上现状——截取标注后发到站会频道；图库留存迭代历史。',
    title: '项目经理与交付负责人：一张图对齐全场',
    subtitle:
      '典型画像：项目经理、业务分析、Scrum Master 与工程经理，推动异步进度同步。',
    personaLabel: 'PM · BA · Scrum · 工程经理',
    sections: {
      whyTitle: '为什么协调岗位截图频繁',
      whyLead:
        '路线图、燃尽与事件时间线都在工具里，但干系人常需要「此刻冻结」才能对「我们现在在哪」达成共识。',
      whyPoints: [
        '在站会与管理层汇报中分享 Jira/Linear/Asana 看板状态。',
        '在不开放全权限的情况下高亮依赖或风险列。',
        '截取分析看板描述周环比现实。',
        '为事故复盘配合日志保留生产界面记录。',
      ],
      painTitle: '缺乏视觉锚点时的协调成本',
      painLead:
        '纯文字更新易误读；过多实时链接让领导疲劳；无标注的截图仍会引发「哪一列？」',
      painPoints: [
        '看板截图不标注时读者要找那张被阻塞卡片。',
        '缩放不一致导致周对比失真。',
        '截图留在聊天滚动区里下周无法找回。',
        '多工具并用导致每人截取习惯不一。',
      ],
      howTitle: '交付沟通如何用 VibeCap',
      howSteps: [
        {
          title: '在合适缩放冻结工具',
          body: '调好浏览器缩放与列筛选再截取，使每周画面对齐。',
        },
        {
          title: '标出信号',
          body: '箭头指向阻塞故事、为依赖编号或圈出变化指标——标注随图导出。',
        },
        {
          title: '贴到站会频道',
          body: 'Slack、Teams 或邮件内嵌——PNG/TIFF 在 macOS 上预览稳定。',
        },
        {
          title: '保留迭代轨迹',
          body: '图库提供日期缩略图；Keep 标记要在 QBR 引用的里程碑截取。',
        },
      ],
      benefitsTitle: '对交付组织的收益',
      benefitPoints: [
        '异步站会更快形成共同理解。',
        '少写长段状态说明，一张带标注图往往足够。',
        'VC 文件名与图库分组让历史可排序。',
        '可选顺序粘贴便于把多块看板按序写入文档。',
      ],
    },
  },
};
