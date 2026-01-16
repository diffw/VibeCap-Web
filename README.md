# VibeCap — Official Website

A minimalist, typography-driven landing page for VibeCap, a macOS screenshot tool designed for vibe coding.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **i18n**: next-intl
- **Deployment**: Vercel / Cloudflare Pages

## Supported Languages

1. English (default)
2. 简体中文
3. 繁體中文
4. 日本語
5. 한국어
6. Español
7. Français
8. Deutsch
9. Português
10. Русский

## Project Structure

```
vibecap-web/
├── messages/           # Translation JSON files
│   ├── en.json
│   ├── zh.json
│   └── ...
├── src/
│   ├── app/
│   │   └── [locale]/   # Locale-aware routing
│   ├── components/     # Reusable UI components
│   ├── sections/       # Page sections
│   └── i18n/          # Internationalization config
├── public/            # Static assets
└── vercel.json        # Deployment config
```

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm run start
```

## Deployment

### Vercel (Recommended)

```bash
vercel
```

### Cloudflare Pages

```bash
npm run build
# Deploy the .next folder
```

## Design System

### Colors

- `--color-ink`: #1a1a1a (primary text)
- `--color-ink-muted`: #4a4a4a (secondary text)
- `--color-ink-subtle`: #7a7a7a (tertiary text)
- `--color-paper`: #fafaf8 (background)
- `--color-paper-warm`: #f5f4f0 (warm sections)
- `--color-accent`: #c4a67c (accent)
- `--color-border`: #e8e6e1 (borders)

### Typography

- Font: SF Pro Display (system fallback)
- Line height: 1.6
- Letter spacing: -0.01em

### Animation

- Duration: 300-700ms
- Easing: cubic-bezier(0.16, 1, 0.3, 1)
- Effects: opacity, translateY (±8px)

## License

MIT
