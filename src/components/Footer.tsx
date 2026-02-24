'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-stone-100 py-8 px-6">
      <div className="mx-auto w-[1024px]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="VibeCap — macOS screenshot tool for vibe coding"
              className="h-8 w-auto opacity-50"
            />
            <span className="text-xs text-stone-400">
              {t('description')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link href={`/${locale}/privacy`} className="text-xs text-stone-400 hover:text-stone-600 transition-colors duration-300">
              {t('legal.privacy')}
            </Link>
            <Link href={`/${locale}/terms`} className="text-xs text-stone-400 hover:text-stone-600 transition-colors duration-300">
              {t('legal.terms')}
            </Link>
            <LanguageSwitcher direction="up" />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-stone-400">
            {t('copyright', { year: currentYear })}
          </p>
          <div className="flex items-center gap-4">
            <a href="mailto:vibecap.dev@gmail.com" className="text-[10px] text-stone-400 hover:text-stone-600 transition-colors">
              vibecap.dev@gmail.com
            </a>
            <time dateTime="2026-01-24" className="text-[10px] text-stone-300">
              Updated Jan 2026
            </time>
          </div>
        </div>
      </div>
    </footer>
  );
}
