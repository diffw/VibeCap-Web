export type ChangelogEntry =
  | { kind: 'feature'; title: string; description: string }
  | { kind: 'item'; text: string };

export type ChangelogVersion = {
  version: string;
  dateLabel: string;
  entries: ChangelogEntry[];
};

export type ChangelogPageContent = {
  title: string;
  description: string;
  versions: ChangelogVersion[];
};

export const changelogPageEn: ChangelogPageContent = {
  title: 'Version history',
  description: 'Release notes for the VibeCap Mac app — new features, improvements, and fixes.',
  versions: [
    {
      version: '1.1.0',
      dateLabel: 'Mar 25, 2026',
      entries: [
        {
          kind: 'feature',
          title: 'Screenshot library',
          description:
            'Browse, search, and manage all your captures in one place. Mark screenshots as Kept, filter by All or Kept, and preview in fullscreen with swipe gestures.',
        },
        {
          kind: 'feature',
          title: 'Auto cleanup',
          description:
            'Set a cleanup schedule — daily, every 3 days, weekly, or monthly. Kept screenshots are always protected.',
        },
        {
          kind: 'feature',
          title: 'Terminal paste',
          description:
            'Paste into any terminal and VibeCap automatically converts to the local file path. Works with Terminal, iTerm2, Warp, Ghostty, and more.',
        },
        {
          kind: 'feature',
          title: 'Full screen capture',
          description: 'Double-click during capture to grab the entire current screen instantly.',
        },
        {
          kind: 'feature',
          title: 'Multi-image copy',
          description: 'Select multiple screenshots in the Library and copy them all at once with ⌘C.',
        },
        {
          kind: 'feature',
          title: 'UI & stability',
          description:
            'Refined capture modal, improved preview panel, better localization across 10 languages, and numerous stability fixes.',
        },
      ],
    },
    {
      version: '1.0.2',
      dateLabel: 'Feb 15, 2026',
      entries: [
        {
          kind: 'item',
          text: 'Improved onboarding visuals: localized permission screenshots now match your selected app language and render crisply on Retina displays.',
        },
        {
          kind: 'item',
          text: 'Adaptive layout: onboarding and permission windows resize automatically to fit longer translations and updated copy.',
        },
        {
          kind: 'item',
          text: 'Cleaner menu bar: debug and language switcher items are hidden in release builds to keep the menu focused on core actions.',
        },
        {
          kind: 'item',
          text: 'Stability and polish: minor UI spacing refinements, updated assets, and internal diagnostics kept gated to protect end-user experience.',
        },
      ],
    },
    {
      version: '1.0.1',
      dateLabel: 'Feb 12, 2026',
      entries: [
        {
          kind: 'item',
          text: 'Improved screenshot experience: selection now uses a “freeze first, then crop” workflow, enabling reliable capture of hover tooltips and temporary system overlays (such as the volume indicator).',
        },
        {
          kind: 'item',
          text: 'What you see is what you get: enhanced cropping and coordinate conversion accuracy, with better precision on Retina and multi-monitor setups.',
        },
        {
          kind: 'item',
          text: 'Performance improvements: parallel frame freezing across multiple displays reduces startup wait time.',
        },
        {
          kind: 'item',
          text: 'Stability enhancements: fixed several issues and improved overall reliability.',
        },
      ],
    },
  ],
};

export const changelogPageZh: ChangelogPageContent = {
  title: '版本更新日志',
  description: 'VibeCap macOS 应用的发行说明：新功能、改进与修复。',
  versions: [
    {
      version: '1.1.0',
      dateLabel: '2026年3月25日',
      entries: [
        {
          kind: 'feature',
          title: '截图图库',
          description:
            '在同一处浏览、搜索并管理所有截图。可将截图标为「已保留」、按「全部 / 已保留」筛选，并支持全屏预览与滑动手势切换。',
        },
        {
          kind: 'feature',
          title: '自动清理',
          description: '设置清理周期——每天、每 3 天、每周或每月；已标记保留的截图始终受到保护。',
        },
        {
          kind: 'feature',
          title: '终端粘贴',
          description:
            '在任意终端中粘贴时，VibeCap 会自动转换为本地文件路径。支持 Terminal、iTerm2、Warp、Ghostty 等。',
        },
        {
          kind: 'feature',
          title: '全屏截取',
          description: '截取过程中双击即可立即捕获当前显示器的全屏画面。',
        },
        {
          kind: 'feature',
          title: '多图复制',
          description: '在图库中多选截图后，使用 ⌘C 一次性全部复制。',
        },
        {
          kind: 'feature',
          title: '界面与稳定性',
          description: '优化截取模态窗口与预览面板，改进 10 种语言的本地化，并包含多项稳定性修复。',
        },
      ],
    },
    {
      version: '1.0.2',
      dateLabel: '2026年2月15日',
      entries: [
        {
          kind: 'item',
          text: '改进引导视觉：权限说明截图与所选应用语言一致，并在 Retina 屏上清晰显示。',
        },
        {
          kind: 'item',
          text: '自适应布局：引导与权限窗口随较长译文与更新文案自动调整尺寸。',
        },
        {
          kind: 'item',
          text: '更简洁的菜单栏：正式版中隐藏调试与语言切换项，突出核心操作。',
        },
        {
          kind: 'item',
          text: '稳定性与打磨：微调界面间距、更新素材，并将内部诊断能力限制在合适范围以保护用户体验。',
        },
      ],
    },
    {
      version: '1.0.1',
      dateLabel: '2026年2月12日',
      entries: [
        {
          kind: 'item',
          text: '截图体验改进：选区采用「先冻结再裁剪」流程，可稳定截取悬停提示与临时系统浮层（如音量指示）。',
        },
        {
          kind: 'item',
          text: '所见即所得：提升裁剪与坐标换算精度，在 Retina 与多显示器环境下更准确。',
        },
        {
          kind: 'item',
          text: '性能：多块显示器并行冻结画面，缩短开始截取前的等待。',
        },
        {
          kind: 'item',
          text: '稳定性：修复多项问题并提升整体可靠性。',
        },
      ],
    },
  ],
};
