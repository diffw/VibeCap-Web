import type { Locale } from '@/i18n/config';
import { type ChangelogPageContent, changelogPageEn, changelogPageZh } from '@/lib/changelog-content';
import {
  type UseCasePageContent,
  type UseCasesIndexContent,
  type UseCaseSlug,
  useCasesByLocale,
} from '@/lib/use-cases-content';

export type { ChangelogPageContent } from '@/lib/changelog-content';
export type { UseCasePageContent, UseCaseSlug } from '@/lib/use-cases-content';
export { USE_CASE_SLUGS, isValidUseCaseSlug } from '@/lib/use-cases-content';

export type FAQItem = {
  question: string;
  answer: string;
};

type MetaEntry = {
  title: string;
  description: string;
};

type NavContent = {
  features: string;
  useCases: string;
  pricing: string;
  faq: string;
  download: string;
};

type FooterContent = {
  description: string;
  pagesLabel: string;
  legalLabel: string;
  llmsTxt: string;
  llmsFull: string;
  privacy: string;
  terms: string;
  changelog: string;
  contact: string;
  contactEmail: string;
  copyright: string;
  note: string;
};

type HomeContent = {
  hero: {
    badge: string;
    title: string;
    description: string;
    cta: string;
    note: string;
  };
  capabilities: {
    title: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  management: {
    title: string;
    description: string;
    autoCleanupTitle: string;
    autoCleanupDescription: string;
    libraryTitle: string;
    libraryDescription: string;
  };
  worksWith: {
    eyebrow: string;
    items: string[];
    note: string;
  };
  workflowLinks: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
  };
  pricingPreview: {
    title: string;
    description: string;
    monthly: { title: string; price: string; period: string; description: string };
    annual: { title: string; price: string; period: string; description: string; badge: string };
    lifetime: { title: string; price: string; period: string; description: string };
    cta: string;
    note: string;
    detailLink: string;
  };
  faq: {
    title: string;
    description: string;
    moreLabel: string;
  };
  finalCta: {
    title: string;
    description: string;
    note: string;
    primaryCta: string;
    secondaryCta: string;
    benefits: string[];
    disclaimer: string;
  };
};

type FeaturePageContent = {
  title: string;
  description: string;
  features: Array<{
    title: string;
    description: string;
    details: string[];
  }>;
  ctaTitle: string;
  ctaButton: string;
};

type PricingPageContent = {
  heroTitle: string;
  heroDescription: string;
  freeTitle: string;
  freeSubtitle: string;
  freePrice: string;
  freeNote: string;
  freeFeatures: string[];
  freeCta: string;
  proTitle: string;
  proSubtitle: string;
  proPrice: string;
  proNote: string;
  proFeatures: string[];
  proHint: string;
  choosePlanTitle: string;
  choosePlanDescription: string;
  plans: Array<{
    name: string;
    subtitle: string;
    price: string;
    period?: string;
    perMonth?: string;
    paidOnce?: string;
    popular?: boolean;
  }>;
  getProCta: string;
  reasonsTitle: string;
  reasons: Array<{ title: string; description: string }>;
  purchaseFaqTitle: string;
  purchaseFaqs: FAQItem[];
  finalTitle: string;
  finalDescription: string;
  finalCta: string;
  finalNote: string;
};

type FAQPageContent = {
  title: string;
  description: string;
  categories: Array<{ title: string; items: FAQItem[] }>;
  contactTitle: string;
  contactDescription: string;
  contactCta: string;
  contactEmail: string;
};

export type SiteContent = {
  meta: {
    home: MetaEntry;
    features: MetaEntry;
    useCases: MetaEntry;
    pricing: MetaEntry;
    faq: MetaEntry;
    changelog: MetaEntry;
  };
  nav: NavContent;
  footer: FooterContent;
  home: HomeContent;
  featuresPage: FeaturePageContent;
  pricingPage: PricingPageContent;
  faqPage: FAQPageContent;
  changelogPage: ChangelogPageContent;
  useCasesIndex: UseCasesIndexContent;
  useCasePages: Record<UseCaseSlug, UseCasePageContent>;
  schema: {
    description: string;
    featureList: string[];
  };
};

const faqPreviewEn: FAQItem[] = [
  {
    question: 'What is VibeCap?',
    answer:
      'VibeCap is a native macOS screenshot workflow app built for AI work. It helps you capture a region, annotate it, and paste it directly into ChatGPT, Claude, Cursor, VS Code, Windsurf, Figma, Terminal, and more.',
  },
  {
    question: 'How is VibeCap different from the built-in macOS screenshot tool?',
    answer:
      'VibeCap focuses on what happens after capture: annotation, direct paste into AI tools, and screenshot library management. The built-in tool captures well, but it does not manage the AI handoff or screenshot lifecycle.',
  },
  {
    question: 'Does VibeCap only work on macOS?',
    answer: 'Yes. VibeCap is a native macOS menu bar app and is positioned as a Mac-first product.',
  },
  {
    question: 'Which apps can I paste screenshots into?',
    answer:
      'ChatGPT, Claude, Cursor, VS Code, Windsurf, Figma, Terminal apps, and any app that accepts image paste.',
  },
  {
    question: 'How does terminal paste work?',
    answer:
      'When you paste into Terminal, VibeCap converts the screenshot into a local file path so terminal-based workflows stay fast and natural.',
  },
  {
    question: 'How many free screenshots do I get?',
    answer: 'You get 128 free screenshots total. Every successful screenshot that enters the preview flow consumes 1 free screenshot.',
  },
  {
    question: 'What happens when I use all 128 free screenshots?',
    answer:
      'When your free quota is exhausted, you cannot start new captures. Your existing screenshots remain available and you can still browse and manage your screenshot library.',
  },
  {
    question: 'What does Pro unlock?',
    answer: 'Pro unlocks unlimited screenshots. You get the same workflow and features, just without the 128 screenshot limit.',
  },
  {
    question: 'Do Monthly, Yearly, and Lifetime include the same Pro features?',
    answer: 'Yes. Monthly, Yearly, and Lifetime all unlock the same Pro entitlement: unlimited screenshots.',
  },
  {
    question: 'Are my existing screenshots still available after my free quota runs out?',
    answer:
      'Yes. After quota is exhausted, existing screenshots remain accessible. You can browse, copy, and manage your screenshot library. You just cannot start new captures.',
  },
];

const additionalFaqEn: FAQItem[] = [
  {
    question: 'Does VibeCap require an account?',
    answer: 'No. VibeCap is a local macOS utility, not an account-based SaaS app.',
  },
  {
    question: 'Are screenshots uploaded anywhere?',
    answer: 'No. VibeCap is local-first. Your screenshots stay on your Mac and are not uploaded to any cloud service.',
  },
  {
    question: 'What permissions does VibeCap need?',
    answer: 'Screen Recording for capture and Accessibility for paste automation.',
  },
  {
    question: 'Can I still browse or manage my screenshots after quota is exhausted?',
    answer:
      'Yes. The screenshot library remains fully accessible. You can browse, preview, copy, and manage existing screenshots. You just cannot create new ones until you upgrade to Pro.',
  },
  {
    question: 'Does a failed or canceled screenshot consume quota?',
    answer:
      'No. Only successful screenshots that enter the preview flow consume your free quota. If a screenshot is canceled or fails, it does not count against your 128 free screenshots.',
  },
  {
    question: 'Is there still a subscription free trial?',
    answer:
      "The main free experience is 128 free screenshots. If intro offer or free trial messaging exists for subscriptions, it's secondary to the 128 screenshot quota.",
  },
  {
    question: 'How do I restore purchases?',
    answer:
      "You can restore purchases through the app's upgrade or settings panel. This will restore any previous Pro purchase tied to your Apple ID.",
  },
  {
    question: 'How do I manage my subscription?',
    answer: 'Subscriptions are managed through your Apple ID settings, just like other App Store subscriptions.',
  },
  {
    question: 'Does Lifetime include the same Pro entitlement as subscription?',
    answer: 'Yes. Lifetime unlocks the same Pro tier as Monthly and Yearly subscriptions: unlimited screenshots.',
  },
  {
    question: 'Who is VibeCap for?',
    answer:
      'Developers, designers, product teams, and anyone who frequently sends screenshots into AI tools or other apps as part of their daily workflow.',
  },
];

const faqPreviewZh: FAQItem[] = [
  {
    question: 'VibeCap 是什么？',
    answer:
      'VibeCap 是一款原生 macOS 截图工作流应用，专门为 AI 工作设计。它让你可以截图、标注，然后直接粘贴到 ChatGPT、Claude、Cursor、VS Code、Windsurf、Figma、Terminal 等应用。',
  },
  {
    question: 'VibeCap 和 macOS 自带截图工具有什么不同？',
    answer:
      'VibeCap 关注的是截图之后的流程：标注、直接粘贴到 AI 工具，以及截图管理。系统截图本身能截图，但不负责 AI handoff 和后续生命周期。',
  },
  {
    question: 'VibeCap 只支持 macOS 吗？',
    answer: '是的。VibeCap 是原生 macOS 菜单栏应用，定位就是 Mac-first 产品。',
  },
  {
    question: '可以把截图粘贴到哪些应用里？',
    answer: 'ChatGPT、Claude、Cursor、VS Code、Windsurf、Figma、各种 Terminal，以及任何支持图片粘贴的应用。',
  },
  {
    question: '粘贴到 Terminal 是怎么工作的？',
    answer: '当你粘贴到 Terminal 时，VibeCap 会把截图转换成本地文件路径，让终端工作流保持自然和高效。',
  },
  {
    question: '免费版有多少张截图？',
    answer: '你总共可以获得 128 张免费截图。每次成功截图并进入预览流后，会消耗 1 张额度。',
  },
  {
    question: '128 张免费截图用完后会怎样？',
    answer: '免费额度用尽后，你不能再开始新的截图。但已有截图仍然可用，你依然可以浏览和管理截图资源库。',
  },
  {
    question: 'Pro 解锁了什么？',
    answer: 'Pro 解锁的是无限截图。工作流和功能不变，只是移除了 128 张的截图上限。',
  },
  {
    question: 'Monthly、Yearly 和 Lifetime 的 Pro 权益一样吗？',
    answer: '是的。Monthly、Yearly 和 Lifetime 解锁的是同一套 Pro 权益：无限截图。',
  },
  {
    question: '免费额度用完后，已有截图还能访问吗？',
    answer: '可以。额度用尽后，已有截图仍可访问。你仍然可以浏览、复制和管理截图资源库，只是不能再开始新的截图。',
  },
];

const additionalFaqZh: FAQItem[] = [
  {
    question: 'VibeCap 需要账号吗？',
    answer: '不需要。VibeCap 是本地 macOS 工具，不是账号型 SaaS。',
  },
  {
    question: '截图会被上传到任何地方吗？',
    answer: '不会。VibeCap 是 local-first 的。你的截图保留在 Mac 上，不会被上传到云服务。',
  },
  {
    question: 'VibeCap 需要哪些权限？',
    answer: '需要屏幕录制权限用于截图，以及辅助功能权限用于粘贴自动化。',
  },
  {
    question: '额度用完后，还能继续浏览或管理截图吗？',
    answer: '可以。截图资源库仍然完全可用。你可以浏览、预览、复制和管理已有截图，只是不能在升级 Pro 前创建新截图。',
  },
  {
    question: '截图失败或取消会消耗额度吗？',
    answer: '不会。只有成功截图并进入预览流时才会消耗免费额度。取消或失败的截图不计入 128 张免费截图。',
  },
  {
    question: '现在还有订阅免费试用吗？',
    answer: '主要的免费体验是 128 张免费截图。如果订阅存在 intro offer 或 free trial，它也是次级信息，不是主入口。',
  },
  {
    question: '如何恢复购买？',
    answer: '你可以通过应用内的升级页或设置页恢复购买。这会恢复与你 Apple ID 关联的 Pro 购买。',
  },
  {
    question: '如何管理订阅？',
    answer: '订阅通过 Apple ID 设置管理，就像其他 App Store 订阅一样。',
  },
  {
    question: 'Lifetime 和订阅解锁的是同一套 Pro 权益吗？',
    answer: '是的。Lifetime 解锁的和 Monthly、Yearly 一样，都是无限截图。',
  },
  {
    question: 'VibeCap 适合哪些人？',
    answer: '开发者、设计师、产品团队，以及任何日常会把截图发送到 AI 工具或其他应用中的人。',
  },
];

const faqPageCategoriesEn = [
  {
    title: 'Getting Started',
    items: [
      faqPreviewEn[0],
      {
        question: 'How do I install VibeCap?',
        answer:
          'Download the app from our website, open the .dmg file, and drag VibeCap to your Applications folder. Launch it, and it will appear in your menu bar.',
      },
      {
        question: 'What permissions does VibeCap need?',
        answer:
          'VibeCap requires Screen Recording permission for capturing screenshots and Accessibility permission for paste automation. macOS will prompt you for these when you first use the app.',
      },
      faqPreviewEn[2],
    ],
  },
  {
    title: 'Features & Usage',
    items: [
      {
        question: 'How do I take a screenshot?',
        answer:
          'Use the global keyboard shortcut (customizable in settings) to activate capture mode. Click and drag to select a region, or double-click to capture the full screen.',
      },
      {
        question: 'What annotation tools are available?',
        answer:
          'VibeCap includes arrows, circles, rectangles, and numbered annotations. You can customize colors and add multiple annotations to each screenshot.',
      },
      {
        question: 'Which apps can I paste screenshots into?',
        answer:
          'VibeCap works with any app that accepts image paste: ChatGPT, Claude, Cursor, VS Code, Windsurf, Figma, Slack, Email, Terminal apps, and more.',
      },
      faqPreviewEn[4],
      {
        question: 'Can I capture across multiple displays?',
        answer: 'Yes. VibeCap fully supports multi-display setups. You can capture regions that span multiple screens or capture a specific display.',
      },
    ],
  },
  {
    title: 'Library & Management',
    items: [
      {
        question: 'What is the screenshot library?',
        answer:
          'The library is a centralized place to view, search, and manage all your screenshots. Access it from the menu bar to browse, preview, filter, and copy screenshots.',
      },
      {
        question: 'Can I bulk copy multiple screenshots?',
        answer: 'Yes. Select multiple screenshots in the library using Command+Click or Shift+Click, then use the bulk copy action.',
      },
      additionalFaqEn[3],
    ],
  },
  {
    title: 'Privacy & Security',
    items: [
      additionalFaqEn[1],
      additionalFaqEn[0],
      {
        question: 'What data does VibeCap collect?',
        answer: 'VibeCap does not collect any usage data, analytics, or telemetry. Your screenshots and usage remain completely private.',
      },
    ],
  },
  {
    title: 'Pricing & Plans',
    items: [
      ...faqPreviewEn.slice(5, 10),
      additionalFaqEn[4],
      additionalFaqEn[5],
      {
        question: 'What happens if I cancel Pro?',
        answer:
          "You'll keep access to Pro (unlimited screenshots) until the end of your billing period, then revert to the Free plan with a new 128 screenshot quota. All your screenshots remain accessible.",
      },
      additionalFaqEn[6],
      additionalFaqEn[7],
      additionalFaqEn[8],
    ],
  },
  {
    title: 'Compatibility',
    items: [
      {
        question: 'Which macOS versions are supported?',
        answer: 'VibeCap requires macOS 12 (Monterey) or later.',
      },
      {
        question: 'Does VibeCap work with ChatGPT and Claude?',
        answer:
          'Yes. Both ChatGPT and Claude are primary use cases for VibeCap. Just capture, annotate, and paste directly into their web or desktop interfaces.',
      },
      {
        question: 'Which terminal apps are supported?',
        answer: 'VibeCap works with all major terminal apps including Terminal.app, iTerm2, Warp, Hyper, and Alacritty.',
      },
      {
        question: 'Can I use VibeCap with design tools like Figma?',
        answer:
          'Absolutely. VibeCap is perfect for sharing design feedback, mockups, and visual references in Figma and other design tools.',
      },
      additionalFaqEn[9],
    ],
  },
];

const faqPageCategoriesZh = [
  {
    title: '快速开始',
    items: [
      faqPreviewZh[0],
      {
        question: '如何安装 VibeCap？',
        answer:
          '从我们的网站下载应用，打开 .dmg 文件，然后把 VibeCap 拖到 Applications 文件夹。启动后，它会出现在菜单栏中。',
      },
      {
        question: 'VibeCap 需要哪些权限？',
        answer:
          'VibeCap 需要屏幕录制权限用于截图，以及辅助功能权限用于粘贴自动化。首次使用时，macOS 会提示你授权。',
      },
      faqPreviewZh[2],
    ],
  },
  {
    title: '功能与使用',
    items: [
      {
        question: '如何截图？',
        answer: '使用全局快捷键（可在设置中自定义）进入截图模式。点击拖拽可选取区域，双击则可截图整个屏幕。',
      },
      {
        question: '支持哪些标注工具？',
        answer: 'VibeCap 提供箭头、圆形、矩形和数字标注。你可以自定义颜色，并在一张截图上添加多个标注。',
      },
      {
        question: '截图可以粘贴到哪些应用里？',
        answer:
          'VibeCap 支持所有接受图片粘贴的应用：ChatGPT、Claude、Cursor、VS Code、Windsurf、Figma、Slack、邮件、Terminal 等。',
      },
      faqPreviewZh[4],
      {
        question: '支持多显示器截图吗？',
        answer: '支持。VibeCap 完整支持多显示器环境，你可以截取跨屏区域，也可以截取某一个显示器。',
      },
    ],
  },
  {
    title: '资源库与管理',
    items: [
      {
        question: '什么是截图资源库？',
        answer:
          '资源库是统一查看、搜索和管理所有截图的地方。你可以从菜单栏进入，浏览、预览、筛选并复制截图。',
      },
      {
        question: '支持批量复制多张截图吗？',
        answer: '支持。你可以在资源库中通过 Command+Click 或 Shift+Click 选择多张截图，然后执行批量复制。',
      },
      additionalFaqZh[3],
    ],
  },
  {
    title: '隐私与安全',
    items: [
      additionalFaqZh[1],
      additionalFaqZh[0],
      {
        question: 'VibeCap 会收集什么数据？',
        answer: 'VibeCap 不收集任何使用数据、分析信息或遥测。你的截图和使用行为都保持私密。',
      },
    ],
  },
  {
    title: '定价与方案',
    items: [
      ...faqPreviewZh.slice(5, 10),
      additionalFaqZh[4],
      additionalFaqZh[5],
      {
        question: '如果我取消 Pro 会怎样？',
        answer:
          '你会一直保留 Pro（无限截图）到当前账单周期结束。之后会回到 Free，并重新获得新的 128 张截图额度。已有截图仍然可访问。',
      },
      additionalFaqZh[6],
      additionalFaqZh[7],
      additionalFaqZh[8],
    ],
  },
  {
    title: '兼容性',
    items: [
      {
        question: '支持哪些 macOS 版本？',
        answer: 'VibeCap 需要 macOS 12（Monterey）或更高版本。',
      },
      {
        question: 'VibeCap 支持 ChatGPT 和 Claude 吗？',
        answer: '支持。ChatGPT 和 Claude 都是 VibeCap 的核心使用场景。截图、标注，然后直接粘贴到它们的网页或桌面界面即可。',
      },
      {
        question: '支持哪些终端应用？',
        answer: 'VibeCap 支持主流终端应用，包括 Terminal.app、iTerm2、Warp、Hyper 和 Alacritty。',
      },
      {
        question: '可以和 Figma 这样的设计工具一起用吗？',
        answer: '当然可以。VibeCap 很适合在 Figma 或其他设计工具中分享设计反馈、mockup 和视觉参考。',
      },
      additionalFaqZh[9],
    ],
  },
];

export function getAllFaqItems(locale: Locale) {
  return locale === 'zh' ? [...faqPreviewZh, ...additionalFaqZh] : [...faqPreviewEn, ...additionalFaqEn];
}

const content: Record<Locale, SiteContent> = {
  en: {
    meta: {
      home: {
        title: 'VibeCap — The Screenshot Tool for AI on macOS',
        description: 'Capture, annotate, and paste directly into ChatGPT, Claude, Cursor, VS Code, Windsurf, Figma, and Terminal.',
      },
      features: {
        title: 'VibeCap Features — Every Feature Designed for AI Workflows',
        description: 'Explore capture, annotation, paste, terminal-friendly workflows, screenshot library, and auto cleanup in VibeCap.',
      },
      pricing: {
        title: 'VibeCap Pricing — Start with 128 Free Screenshots',
        description: 'Start with 128 free screenshots, then upgrade to Pro for unlimited capture.',
      },
      faq: {
        title: 'VibeCap FAQ — Compatibility, Privacy, Pricing, and Workflow',
        description: 'Answers about compatibility, privacy, pricing, permissions, screenshot quota, and how the VibeCap workflow works.',
      },
      useCases: {
        title: 'VibeCap Use Cases — Designers, Developers, QA, and Everyday AI Workflows',
        description:
          'See how VibeCap fits everyday AI chats, UX/UI design, engineering, brand design, and QA evidence — capture, annotate, paste, and library.',
      },
      changelog: {
        title: 'VibeCap Changelog — Release notes for macOS',
        description:
          'Version history for the VibeCap app: screenshot library, auto cleanup, terminal paste, full-screen capture, multi-image copy, and stability updates.',
      },
    },
    nav: {
      features: 'Features',
      useCases: 'Use cases',
      pricing: 'Pricing',
      faq: 'FAQ',
      download: 'Download',
    },
    footer: {
      description: 'The screenshot workflow tool for macOS. Capture, annotate, and share with AI tools instantly.',
      pagesLabel: 'Pages',
      legalLabel: 'Legal',
      llmsTxt: 'LLMs.txt',
      llmsFull: 'LLMs Full',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      changelog: 'Changelog',
      contact: 'Contact',
      contactEmail: 'hello@vibecap.app',
      copyright: '© 2026 VibeCap. All rights reserved.',
      note: 'Made for Mac users who work with AI',
    },
    home: {
      hero: {
        badge: 'Built for AI workflows',
        title: 'The screenshot tool for AI on macOS',
        description: 'Capture, annotate, and paste directly into ChatGPT, Claude, Cursor, or any app.',
        cta: 'Download Free',
        note: 'Free on Mac App Store · Upgrade to Pro anytime',
      },
      capabilities: {
        title: 'The core workflow, broken down.',
        items: [
          {
            title: 'Capture',
            description: 'Instantly capture any region — or double-tap for the full screen — across all your displays.',
          },
          {
            title: 'Annotate',
            description: 'Add arrows, circles, rectangles, and numbered markers to give AI the visual context it needs.',
          },
          {
            title: 'Paste Anywhere',
            description:
              'Copy and paste directly into ChatGPT, Claude, Cursor, VS Code, Windsurf, Figma, or any app that accepts images.',
          },
          {
            title: 'Terminal Friendly',
            description:
              'Paste into Terminal, iTerm2, or Warp. VibeCap automatically converts to a local file path, no export needed.',
          },
        ],
      },
      management: {
        title: 'Keep your screenshots useful, not messy.',
        description: '',
        autoCleanupTitle: 'Auto Cleanup',
        autoCleanupDescription:
          'Set a daily-to-monthly cleanup schedule and let old screenshots expire automatically. Kept ones are always protected.',
        libraryTitle: 'Library',
        libraryDescription:
          'Browse, preview, filter, and bulk-copy all your captures in one place. Mark the important ones to keep them forever.',
      },
      worksWith: {
        eyebrow: 'Works with the tools you already use',
        items: [
          'ChatGPT',
          'Claude',
          'Cursor',
          'VS Code',
          'Windsurf',
          'Figma',
          'Terminal',
          'iTerm2',
          'Ghostty',
          'Apple Messages',
          'WeChat',
          'Telegram',
          'WhatsApp',
          'Signal',
          'LINE',
          'Discord',
          'Slack',
          'Apple Notes',
          'Notion',
          'Obsidian',
          'Vibe',
          'Craft',
          'Linear',
          'Jira',
          'GitHub',
        ],
        note: 'Any app that accepts images. Copy once, paste anywhere.',
      },
      workflowLinks: {
        eyebrow: 'Browse by workflow',
        title: 'Find the screenshot workflow that matches your job',
        description: 'Jump straight to the role or industry that matches how you use VibeCap.',
        cta: 'View all use cases',
      },
      pricingPreview: {
        title: 'Simple, transparent pricing',
        description: 'Start free with 128 screenshots, upgrade anytime for unlimited',
        monthly: { title: 'Monthly', price: '$2.99', period: '/month', description: 'Flexible billing' },
        annual: { title: 'Annual', price: '$17.99', period: '/year', description: 'Best value', badge: 'Save 50%' },
        lifetime: { title: 'Lifetime', price: '$24.99', period: '', description: 'Pay once, own forever' },
        cta: 'Download on the App Store',
        note: 'Free to start · Upgrade to Pro anytime in-app',
        detailLink: 'See detailed pricing comparison',
      },
      faq: {
        title: 'VibeCap FAQ',
        description: 'Compatibility, privacy, pricing, and how this macOS screenshot workflow works.',
        moreLabel: 'View all FAQ →',
      },
      finalCta: {
        title: 'Download VibeCap for macOS',
        description: 'Start with 128 free screenshots. Capture, annotate, and paste into AI tools instantly.',
        note: 'Upgrade to Pro anytime for unlimited capture. All through the App Store.',
        primaryCta: 'Download on the App Store',
        secondaryCta: 'View Pricing',
        benefits: ['Free to start', 'macOS 12.0+', 'Native & local-first'],
        disclaimer: 'All in-app purchases are processed securely through Apple.',
      },
    },
    featuresPage: {
      title: 'Every feature designed for AI workflows',
      description: 'VibeCap brings together capture, annotation, paste, library management, and auto-cleanup into one seamless workflow.',
      features: [
        {
          title: 'Capture',
          description: 'Grab screenshots with a global shortcut. Select any region, or double-click to capture the full screen. Multi-display support built in.',
          details: [
            'Launch instantly with your custom keyboard shortcut',
            'Drag to select any region on your screen',
            'Double-tap to capture your entire display',
            'Works seamlessly across multiple monitors',
            'Get instant visual feedback on every capture',
          ],
        },
        {
          title: 'Annotate',
          description: 'Add visual context before sharing. Use arrows, circles, rectangles, and numbered markers to highlight what matters.',
          details: [
            'Draw arrows to point out important details',
            'Circle areas that need attention',
            'Add rectangles to frame key sections',
            'Number your annotations to show sequence',
            'Customize colors to match your workflow',
          ],
        },
        {
          title: 'Paste Anywhere',
          description: 'Copy once, paste into any application. Works seamlessly with ChatGPT, Claude, Cursor, VS Code, Windsurf, Figma, and more.',
          details: [
            'Paste directly into ChatGPT conversations',
            "Works perfectly with Claude's interface",
            'Drop into code editors like Cursor, VS Code, and Windsurf',
            'Instantly share in design tools like Figma',
            'Compatible with any application that accepts images',
          ],
        },
        {
          title: 'Terminal Friendly',
          description:
            'Paste screenshots directly into terminal apps. VibeCap auto-converts to local file paths for seamless terminal workflows.',
          details: [
            'Paste converts automatically to a file path',
            'Tested and optimized for iTerm2',
            'Works great with Warp terminal',
            'No need to manually save and reference files',
            'Integrates naturally with your command line workflow',
          ],
        },
        {
          title: 'Screenshot Library',
          description: 'One place to browse, search, and manage all your screenshots. Filter by kept items, multi-select, and bulk copy.',
          details: [
            'See all your captures in one organized view',
            'Hover to preview screenshots instantly',
            'Filter to show all captures or just kept ones',
            'Select multiple screenshots at once',
            'Copy several screenshots in a single action',
          ],
        },
        {
          title: 'Auto Cleanup',
          description: 'Set a cleanup schedule and let VibeCap manage your screenshot library. Kept items are always protected.',
          details: [
            'Clean up old screenshots automatically every day',
            'Choose 3-day intervals for moderate cleanup',
            'Set weekly cleanup for a lighter touch',
            'Monthly cleanup for long-term storage',
            'Screenshots you keep are never deleted',
          ],
        },
        {
          title: 'Menu Bar App',
          description:
            'Always available from your menu bar. Quick preview recent captures, access your library, and adjust settings instantly.',
          details: [
            'Access VibeCap from your macOS menu bar',
            'Preview your most recent captures quickly',
            'Jump to your library with one click',
            'Adjust settings without opening a window',
            'Stay focused with minimal workspace clutter',
          ],
        },
        {
          title: 'Local-First Privacy',
          description: 'Your screenshots never leave your Mac. No cloud uploads, no accounts, no tracking. Complete privacy by design.',
          details: [
            'All screenshots stay on your local machine',
            'No data uploaded to any cloud service',
            'Use the app without creating an account',
            'Zero tracking or analytics collected',
            'You have full control over your data',
          ],
        },
      ],
      ctaTitle: 'Ready to streamline your workflow?',
      ctaButton: 'Download for macOS',
    },
    pricingPage: {
      heroTitle: 'Start with 128 free screenshots',
      heroDescription: 'Upgrade to Pro for unlimited capture. No feature locking. Just remove the screenshot limit.',
      freeTitle: 'Free',
      freeSubtitle: '128 screenshots total',
      freePrice: '$0',
      freeNote: 'Full current workflow while quota remains',
      freeFeatures: [
        'Capture any screen region',
        'Annotate screenshots',
        'Paste into AI tools and other apps',
        'Save locally',
        'Browse existing screenshots and library',
      ],
      freeCta: 'Download Free on App Store',
      proTitle: 'Pro',
      proSubtitle: 'Unlimited screenshots',
      proPrice: 'Starting at $17.99/year',
      proNote: 'Monthly, Yearly, and Lifetime options available',
      proFeatures: [
        'No screenshot quota barrier',
        'Same workflow, without usage limits',
        'Keep capturing whenever work is happening',
        'Better for heavy daily AI workflows',
      ],
      proHint: 'Choose your billing option below ↓',
      choosePlanTitle: 'Choose Your Plan',
      choosePlanDescription: 'All Pro plans unlock unlimited screenshots',
      plans: [
        { name: 'Monthly', subtitle: 'Pay as you go', price: '$2.99', period: '/month' },
        { name: 'Yearly', subtitle: 'Best value', price: '$17.99', period: '/year', perMonth: '$1.50/month', popular: true },
        { name: 'Lifetime', subtitle: 'No subscription', price: '$24.99', paidOnce: 'paid once' },
      ],
      getProCta: 'Get Pro',
      reasonsTitle: 'Why upgrade to Pro?',
      reasons: [
        {
          title: 'Never worry about running out',
          description: 'No more counting screenshots or managing quota. Capture as much as you need, whenever you need it.',
        },
        {
          title: 'Better for heavy workflows',
          description: "If you're sending screenshots to AI tools multiple times per day, unlimited capture removes all friction.",
        },
        {
          title: 'Pick your preferred plan',
          description: 'Choose Monthly for flexibility, Yearly for best value, or Lifetime for a one-time investment.',
        },
        {
          title: 'Same great workflow',
          description: "Pro doesn't lock features behind paywalls. It just removes the screenshot limit so you can work freely.",
        },
      ],
      purchaseFaqTitle: 'Purchase FAQ',
      purchaseFaqs: [
        {
          question: 'Can I upgrade from Free to Pro later?',
          answer: 'Yes. You can upgrade to Pro at any time from within the app. Your existing screenshots and settings will be preserved.',
        },
        {
          question: "What's included in all Pro plans?",
          answer: 'Monthly, Yearly, and Lifetime all unlock the same Pro entitlement: unlimited screenshots. Pick the billing option that fits your usage style.',
        },
        faqPreviewEn[6],
        {
          question: 'Does Pro unlock advanced features?',
          answer: 'No. Pro removes the screenshot limit, but all current workflow features are available to Free users while they have quota remaining.',
        },
        {
          question: 'What happens if I cancel Pro?',
          answer: "You'll have access to Pro (unlimited screenshots) until the end of your billing period. After that, you'll revert to the Free plan with a new 128 screenshot quota.",
        },
        additionalFaqEn[6],
        {
          question: 'Is there a refund policy?',
          answer: "Yes. We offer a 14-day money-back guarantee for all Pro purchases. Contact support@vibecap.app if you're not satisfied.",
        },
        additionalFaqEn[7],
      ],
      finalTitle: 'Ready to get started?',
      finalDescription: 'Download VibeCap for free and upgrade to Pro when you are ready',
      finalCta: 'Download on the App Store',
      finalNote: 'macOS 12.0+ · Free to start · Upgrade anytime via in-app purchase',
    },
    faqPage: {
      title: 'VibeCap FAQ',
      description: 'Compatibility, privacy, pricing, and how this macOS screenshot workflow works.',
      categories: faqPageCategoriesEn,
      contactTitle: 'Still have questions?',
      contactDescription: "We're here to help. Reach out to our support team.",
      contactCta: 'Contact Support',
      contactEmail: 'support@vibecap.app',
    },
    changelogPage: changelogPageEn,
    useCasesIndex: useCasesByLocale.en.index,
    useCasePages: useCasesByLocale.en.pages,
    schema: {
      description: 'VibeCap is a native macOS screenshot workflow app built for AI work. Capture, annotate, paste, and manage screenshots locally.',
      featureList: [
        'Global shortcut screenshot capture',
        'Arrows, circles, rectangles, and numbered annotations',
        'Paste into ChatGPT, Claude, Cursor, VS Code, Windsurf, Figma, and Terminal',
        'Screenshot library with preview and bulk copy',
        'Auto cleanup with kept screenshot protection',
        '128 free screenshots',
        'Pro unlocks unlimited screenshots',
      ],
    },
  },
  zh: {
    meta: {
      home: {
        title: 'VibeCap — 面向 macOS AI 工作流的截图工具',
        description: '截图、标注，并直接粘贴到 ChatGPT、Claude、Cursor、VS Code、Windsurf、Figma 和 Terminal。',
      },
      features: {
        title: 'VibeCap 功能 — 每个功能都为 AI 工作流而设计',
        description: '查看 VibeCap 的截图、标注、粘贴、终端工作流、截图资源库和自动清理能力。',
      },
      pricing: {
        title: 'VibeCap 定价 — 从 128 张免费截图开始',
        description: '先用 128 张免费截图，然后在需要时升级到 Pro 获得无限截图。',
      },
      faq: {
        title: 'VibeCap FAQ — 兼容性、隐私、定价与工作流',
        description: '关于兼容性、隐私、定价、权限、截图额度和 VibeCap 工作流的详细说明。',
      },
      useCases: {
        title: 'VibeCap 使用场景 — 设计师、开发者、QA 与日常 AI 工作流',
        description:
          '了解 VibeCap 如何服务日常 AI 对话、UX/UI 设计、工程、品牌设计与测试证据：截取、标注、粘贴与图库管理。',
      },
      changelog: {
        title: 'VibeCap 更新日志 — macOS 版本说明',
        description:
          'VibeCap 应用版本历史：截图图库、自动清理、终端粘贴、全屏截取、多图复制与稳定性更新等。',
      },
    },
    nav: {
      features: '功能',
      useCases: '使用场景',
      pricing: '定价',
      faq: 'FAQ',
      download: '下载',
    },
    footer: {
      description: '面向 macOS 的截图工作流工具。快速截图、标注，并即时分享给 AI 工具。',
      pagesLabel: '页面',
      legalLabel: '法律',
      llmsTxt: 'LLMs.txt',
      llmsFull: 'LLMs Full',
      privacy: '隐私政策',
      terms: '服务条款',
      changelog: '更新日志',
      contact: '联系',
      contactEmail: 'hello@vibecap.app',
      copyright: '© 2026 VibeCap. 保留所有权利。',
      note: '为与 AI 一起工作的 Mac 用户而做',
    },
    home: {
      hero: {
        badge: '专为 AI 工作流打造',
        title: '面向 macOS AI 工作流的截图工具',
        description: '截图、标注，然后直接粘贴到 ChatGPT、Claude、Cursor，或任何应用。',
        cta: '免费下载',
        note: 'Mac App Store 免费下载 · 随时可升级到 Pro',
      },
      capabilities: {
        title: '把核心工作流拆开讲清楚。',
        items: [
          {
            title: '截图',
            description: '通过快捷键快速截图，选取任意区域；或者双击直接截图整个屏幕，支持所有显示器。',
          },
          {
            title: '标注',
            description: '用箭头、圆形、矩形和数字标记补充视觉上下文，让 AI 更快理解重点。',
          },
          {
            title: '粘贴到任意地方',
            description: '直接复制并粘贴到 ChatGPT、Claude、Cursor、VS Code、Windsurf、Figma，或任何支持图片的应用。',
          },
          {
            title: 'Terminal 友好',
            description: '粘贴到 Terminal、iTerm2 或 Warp 时，VibeCap 会自动转换成本地文件路径，无需导出。',
          },
        ],
      },
      management: {
        title: '让截图保持有用，而不是越积越乱。',
        description: '',
        autoCleanupTitle: '自动清理',
        autoCleanupDescription: '从每天到每月设定清理周期，让旧截图自动过期。被 Keep 的截图始终受到保护。',
        libraryTitle: '资源库',
        libraryDescription: '在一个地方浏览、预览、筛选并批量复制所有截图。把重要的截图标记出来，长期保留。',
      },
      worksWith: {
        eyebrow: '适配你已经在用的工具',
        items: [
          'ChatGPT',
          'Claude',
          'Cursor',
          'VS Code',
          'Windsurf',
          'Figma',
          'Terminal',
          'iTerm2',
          'Ghostty',
          'Apple Messages',
          'WeChat',
          'Telegram',
          'WhatsApp',
          'Signal',
          'LINE',
          'Discord',
          'Slack',
          'Apple Notes',
          'Notion',
          'Obsidian',
          'Vibe',
          'Craft',
          'Linear',
          'Jira',
          'GitHub',
        ],
        note: '任何支持图片的应用都可以。复制一次，到处粘贴。',
      },
      workflowLinks: {
        eyebrow: '按工作流浏览',
        title: '找到最符合你工作的截图工作流',
        description: '直接进入最符合你使用 VibeCap 方式的角色或行业。',
        cta: '查看全部使用场景',
      },
      pricingPreview: {
        title: '简单、透明的定价',
        description: '先从 128 张免费截图开始，需要无限截图时再升级',
        monthly: { title: '月付', price: '$2.99', period: '/月', description: '灵活计费' },
        annual: { title: '年付', price: '$17.99', period: '/年', description: '最划算', badge: '省 50%' },
        lifetime: { title: '终身版', price: '$24.99', period: '', description: '买一次，永久拥有' },
        cta: '前往 App Store',
        note: '免费开始 · 随时可在应用内升级到 Pro',
        detailLink: '查看完整定价对比',
      },
      faq: {
        title: 'VibeCap FAQ',
        description: '兼容性、隐私、定价，以及这套 macOS 截图工作流是怎么工作的。',
        moreLabel: '查看全部 FAQ →',
      },
      finalCta: {
        title: '下载 macOS 版 VibeCap',
        description: '先用 128 张免费截图。快速截图、标注，并即时粘贴到 AI 工具。',
        note: '需要无限截图时，可随时升级到 Pro。全部通过 App Store 完成。',
        primaryCta: '前往 App Store',
        secondaryCta: '查看定价',
        benefits: ['免费开始', 'macOS 12.0+', '原生且 local-first'],
        disclaimer: '所有应用内购买都通过 Apple 安全处理。Pro 方案提供 14 天退款保证。',
      },
    },
    featuresPage: {
      title: '每个功能都为 AI 工作流而设计',
      description: 'VibeCap 把截图、标注、粘贴、资源库管理和自动清理整合成一个顺滑的工作流。',
      features: [
        {
          title: '截图',
          description: '通过全局快捷键截图。选取任意区域，或双击直接截取整个屏幕。内建多显示器支持。',
          details: [
            '用自定义快捷键快速启动',
            '拖拽选取屏幕任意区域',
            '双击截取整个显示器',
            '无缝支持多显示器环境',
            '每次截图都能获得即时视觉反馈',
          ],
        },
        {
          title: '标注',
          description: '在分享前加上视觉上下文。使用箭头、圆形、矩形和编号标记突出重点。',
          details: [
            '用箭头指出关键细节',
            '用圆形圈出需要关注的区域',
            '用矩形框定重点模块',
            '用数字标记表示顺序',
            '可自定义颜色以匹配你的工作流',
          ],
        },
        {
          title: '粘贴到任意地方',
          description: '复制一次，粘贴到任何应用。适配 ChatGPT、Claude、Cursor、VS Code、Windsurf、Figma 等。',
          details: [
            '直接粘贴到 ChatGPT 对话',
            '与 Claude 界面配合顺畅',
            '可以放进 Cursor、VS Code 和 Windsurf 等编辑器',
            '也能直接分享到 Figma 这类设计工具',
            '兼容所有接受图片的应用',
          ],
        },
        {
          title: 'Terminal 友好',
          description: '可直接粘贴到终端应用。VibeCap 会自动转换为本地文件路径，让终端工作流更顺畅。',
          details: [
            '自动粘贴为文件路径',
            '已针对 iTerm2 优化',
            '与 Warp 配合良好',
            '不需要手动保存再引用文件',
            '自然融入你的命令行工作流',
          ],
        },
        {
          title: '截图资源库',
          description: '在一个地方浏览、搜索并管理所有截图。支持按 Keep 过滤、多选和批量复制。',
          details: [
            '所有截图统一收纳',
            '悬停即可快速预览',
            '可筛选全部或仅保留项',
            '一次选择多张截图',
            '支持一键批量复制多张截图',
          ],
        },
        {
          title: '自动清理',
          description: '设定清理周期，让 VibeCap 自动维护截图资源库。被 Keep 的项目始终受到保护。',
          details: [
            '每天自动清理旧截图',
            '可选择每 3 天清理一次',
            '也可按周清理，更轻量',
            '每月清理适合长期保存',
            '你 Keep 的截图永远不会被删除',
          ],
        },
        {
          title: '菜单栏应用',
          description: '始终在菜单栏中待命。快速预览最近截图、进入资源库，或立即调整设置。',
          details: [
            '从 macOS 菜单栏进入 VibeCap',
            '快速预览最近的截图',
            '一键打开资源库',
            '不必打开大窗口也能调设置',
            '保持专注，减少工作区占用',
          ],
        },
        {
          title: 'Local-First 隐私',
          description: '你的截图不会离开 Mac。没有云上传、没有账号、没有追踪，从设计上保证隐私。',
          details: [
            '所有截图都保留在本地',
            '不会上传到任何云服务',
            '使用时不需要创建账号',
            '不做任何追踪或分析',
            '你始终对数据拥有完全控制权',
          ],
        },
      ],
      ctaTitle: '准备好让工作流更顺了吗？',
      ctaButton: '下载 macOS 版',
    },
    pricingPage: {
      heroTitle: '先从 128 张免费截图开始',
      heroDescription: '升级到 Pro 即可获得无限截图。不是锁功能，只是移除截图上限。',
      freeTitle: 'Free',
      freeSubtitle: '总共 128 张截图',
      freePrice: '$0',
      freeNote: '在额度内即可使用完整当前工作流',
      freeFeatures: ['截图任意区域', '标注截图', '粘贴到 AI 工具和其他应用', '本地保存', '浏览已有截图和资源库'],
      freeCta: '在 App Store 免费下载',
      proTitle: 'Pro',
      proSubtitle: '无限截图',
      proPrice: '$17.99/year 起',
      proNote: '提供月付、年付和终身版方案',
      proFeatures: ['没有截图额度限制', '同样的工作流，但没有使用上限', '工作流进行时可以持续截图', '更适合高频日常 AI 工作流'],
      proHint: '在下面选择你的计费方案 ↓',
      choosePlanTitle: '选择你的方案',
      choosePlanDescription: '所有 Pro 方案都解锁无限截图',
      plans: [
        { name: '月付', subtitle: '按需付费', price: '$2.99', period: '/月' },
        { name: '年付', subtitle: '最划算', price: '$17.99', period: '/年', perMonth: '$1.50/月', popular: true },
        { name: '终身版', subtitle: '无需订阅', price: '$24.99', paidOnce: '一次付费' },
      ],
      getProCta: '获取 Pro',
      reasonsTitle: '为什么升级到 Pro？',
      reasons: [
        {
          title: '不用担心额度用完',
          description: '不必再数截图或管理额度。想截多少就截多少。',
        },
        {
          title: '更适合重度工作流',
          description: '如果你每天都会多次把截图发给 AI 工具，无限截图可以移除很多摩擦。',
        },
        {
          title: '选择适合你的方案',
          description: '月付更灵活，年付最划算，终身版则是一次性投入。',
        },
        {
          title: '同样优秀的工作流',
          description: 'Pro 不是给功能上锁，而只是移除截图上限，让你可以更自由地工作。',
        },
      ],
      purchaseFaqTitle: '购买 FAQ',
      purchaseFaqs: [
        {
          question: '以后还能从 Free 升级到 Pro 吗？',
          answer: '可以。你可以随时在应用内升级到 Pro，已有截图和设置都会保留。',
        },
        {
          question: '所有 Pro 方案都包含什么？',
          answer: 'Monthly、Yearly 和 Lifetime 都解锁同一套 Pro 权益：无限截图。只需选择最适合你的付费方式。',
        },
        faqPreviewZh[6],
        {
          question: 'Pro 会解锁高级功能吗？',
          answer: '不会。Pro 只是移除截图上限。只要还有额度，Free 用户就能使用当前完整工作流。',
        },
        {
          question: '如果我取消 Pro 会怎样？',
          answer: '你会一直拥有 Pro（无限截图）到当前账单周期结束。之后会回到 Free，并重新获得新的 128 张截图额度。',
        },
        additionalFaqZh[6],
        {
          question: '支持退款吗？',
          answer: '支持。所有 Pro 购买都提供 14 天退款保证。如果你不满意，可以联系 support@vibecap.app。',
        },
        additionalFaqZh[7],
      ],
      finalTitle: '准备开始了吗？',
      finalDescription: '免费下载 VibeCap，等你准备好时再升级到 Pro',
      finalCta: '前往 App Store',
      finalNote: 'macOS 12.0+ · 免费开始 · 可随时通过应用内购买升级',
    },
    faqPage: {
      title: 'VibeCap FAQ',
      description: '兼容性、隐私、定价，以及这套 macOS 截图工作流是怎么工作的。',
      categories: faqPageCategoriesZh,
      contactTitle: '还有问题？',
      contactDescription: '我们很乐意帮忙。可以直接联系支持团队。',
      contactCta: '联系支持',
      contactEmail: 'support@vibecap.app',
    },
    changelogPage: changelogPageZh,
    useCasesIndex: useCasesByLocale.zh.index,
    useCasePages: useCasesByLocale.zh.pages,
    schema: {
      description: 'VibeCap 是一款原生 macOS 截图工作流应用，专为 AI 工作打造。可本地截图、标注、粘贴并管理截图。',
      featureList: [
        '全局快捷键截图',
        '箭头、圆形、矩形和数字标注',
        '粘贴到 ChatGPT、Claude、Cursor、VS Code、Windsurf、Figma 和 Terminal',
        '截图资源库与快速预览',
        '自动清理和 Keep 保护',
        '128 张免费截图',
        'Pro 解锁无限截图',
      ],
    },
  },
};

export function getSiteContent(locale: Locale) {
  return content[locale];
}
