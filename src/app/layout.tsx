import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VibeCap — Screenshot Tool for Vibe Coding on macOS',
  description: 'VibeCap is a macOS screenshot tool for vibe coding. Capture, annotate, and send screenshots with prompts to AI code editors like Cursor in one action.',
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
    <html>
      <body className="antialiased">{children}</body>
    </html>
  );
}
