'use client';

import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';

const basePath = process.env.NODE_ENV === 'production' ? '/VibeCap-Web' : '';

export function Header() {
  const t = useTranslations('nav');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f5f3ee]/90 backdrop-blur-md border-b border-stone-200/50">
      <nav className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
        <a 
          href="#" 
          className="hover:opacity-70 transition-opacity duration-300"
        >
          <img
            src={`${basePath}/logo.svg`}
            alt="VibeCap"
            className="h-6 w-auto"
          />
        </a>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-5">
            <a
              href="#features"
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors duration-300"
            >
              {t('features')}
            </a>
            <a
              href="#pricing"
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors duration-300"
            >
              {t('pricing')}
            </a>
          </div>
          
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <a
              href="#pricing"
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-stone-800 text-white hover:bg-stone-700 transition-colors duration-300"
            >
              {t('download')}
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
