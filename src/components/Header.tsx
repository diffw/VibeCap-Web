'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f5f3ee]/90 backdrop-blur-md border-b border-stone-200/50">
      <nav className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="hover:opacity-70 transition-opacity duration-300"
        >
          <img
            src="/logo.svg"
            alt="VibeCap"
            className="h-6 w-auto"
          />
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-5">
            <Link
              href={`/${locale}#features`}
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors duration-300"
            >
              {t('features')}
            </Link>
            <Link
              href={`/${locale}#pricing`}
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors duration-300"
            >
              {t('pricing')}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href={`/${locale}#pricing`}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-stone-800 text-white hover:bg-stone-700 transition-colors duration-300"
            >
              {t('download')}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
