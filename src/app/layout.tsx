import type { Metadata } from 'next';
import './globals.css';

const basePath = process.env.NODE_ENV === 'production' ? '/VibeCap-Web' : '';

export const metadata: Metadata = {
  title: 'VibeCap — Boost Your Vibe Coding',
  description: 'A screenshot tool built specifically for vibe coding.',
  icons: {
    icon: `${basePath}/favicon.png`,
    apple: `${basePath}/favicon.png`,
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
