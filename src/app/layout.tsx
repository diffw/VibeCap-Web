import type { Metadata } from 'next';
import './globals.css';

const GA_MEASUREMENT_ID = 'G-GRCXG09WNL';

export const metadata: Metadata = {
  title: 'VibeCap — Screenshot Workflow Tool for AI on macOS',
  description: 'Capture, annotate, and paste screenshots into AI tools on macOS with VibeCap.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_MEASUREMENT_ID}');`,
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
