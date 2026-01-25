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
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="VibeCap"
              className="h-5 w-auto opacity-50"
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

        <div className="mt-6 pt-4 border-t border-stone-100 text-center">
          <p className="text-[10px] text-stone-400">
            {t('copyright', { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  );
}
