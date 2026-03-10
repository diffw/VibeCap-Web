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
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <head>
        {gaMeasurementId ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaMeasurementId}',{send_page_view:false});`,
              }}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.__vibecapTrackPageView=(function(){function sendPageView(){if(typeof window.gtag!=='function'){return;}window.gtag('event','page_view',{page_location:window.location.href,page_path:window.location.pathname+window.location.search,page_title:document.title});}var pushState=history.pushState;var replaceState=history.replaceState;history.pushState=function(){pushState.apply(history,arguments);sendPageView();};history.replaceState=function(){replaceState.apply(history,arguments);sendPageView();};window.addEventListener('popstate',sendPageView);window.addEventListener('hashchange',sendPageView);sendPageView();return true;})();`,
              }}
            />
          </>
        ) : null}
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
