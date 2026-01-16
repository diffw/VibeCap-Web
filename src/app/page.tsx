'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language || (navigator as any).userLanguage;
    const locale = browserLang.startsWith('zh') ? 'zh' : 'en';
    
    // Redirect to the appropriate locale
    router.replace(`/${locale}/`);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f3ee]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-stone-500">Loading...</p>
      </div>
    </div>
  );
}
