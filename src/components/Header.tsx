'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { localeNames, locales, type Locale } from '@/i18n/config';
import { APP_STORE_URL, localizedPath } from '@/lib/site-config';
import { getSiteContent } from '@/lib/site-content';

type HeaderProps = {
  locale: Locale;
  currentPage?: 'home' | 'features' | 'useCases' | 'pricing' | 'faq';
};

export function Header({ locale, currentPage = 'home' }: HeaderProps) {
  const content = getSiteContent(locale);
  const isHome = currentPage === 'home';
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isHome) {
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const homePath = localizedPath(locale);
  const navItems = useMemo(
    () => [
      {
        key: 'features',
        href: isHome ? `${homePath}#features` : localizedPath(locale, 'features'),
        label: content.nav.features,
      },
      {
        key: 'pricing',
        href: isHome ? `${homePath}#pricing` : localizedPath(locale, 'pricing'),
        label: content.nav.pricing,
      },
      {
        key: 'faq',
        href: isHome ? `${homePath}#faq` : localizedPath(locale, 'faq'),
        label: content.nav.faq,
      },
    ],
    [content.nav.faq, content.nav.features, content.nav.pricing, homePath, isHome, locale],
  );

  const shellClassName = !isHome || scrolled
    ? 'border-stone-200/80 bg-white/90 shadow-[0_8px_30px_-22px_rgba(24,24,27,0.35)] backdrop-blur-xl'
    : 'border-transparent bg-transparent';

  const localeLinks = useMemo(
    () =>
      locales.map((targetLocale) => {
        const targetPath = pathname
          ? pathname.replace(/^\/(en|zh)(?=\/|$)/, `/${targetLocale}`)
          : localizedPath(targetLocale);

        return {
          locale: targetLocale,
          label: localeNames[targetLocale],
          href: targetPath,
          active: targetLocale === locale,
        };
      }),
    [locale, pathname],
  );

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${shellClassName}`}>
      <div className="px-6 md:px-8">
        <nav className="mx-auto flex max-w-6xl items-center justify-between py-4">
          <Link href={homePath} className="transition-opacity hover:opacity-75" aria-label="VibeCap home">
            <Image
              src="/logo.svg"
              alt="VibeCap logo"
              width={124}
              height={32}
              priority
            />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => {
              const active =
                (currentPage === 'features' && item.key === 'features') ||
                (currentPage === 'useCases' && item.key === 'useCases') ||
                (currentPage === 'pricing' && item.key === 'pricing') ||
                (currentPage === 'faq' && item.key === 'faq');

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    active ? 'text-stone-950' : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <details className="group relative">
              <summary className="flex list-none items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-950 [&::-webkit-details-marker]:hidden">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18" />
                  <path d="M12 3c2.8 2.5 4.5 5.6 4.5 9S14.8 18.5 12 21c-2.8-2.5-4.5-5.6-4.5-9S9.2 5.5 12 3Z" />
                </svg>
                <span>{localeNames[locale]}</span>
                <svg viewBox="0 0 20 20" className="h-4 w-4 transition group-open:rotate-180" fill="currentColor" aria-hidden="true">
                  <path d="M5.2 7.7a.75.75 0 0 1 1.06 0L10 11.44l3.74-3.75a.75.75 0 1 1 1.06 1.06l-4.27 4.28a.75.75 0 0 1-1.06 0L5.2 8.76a.75.75 0 0 1 0-1.06Z" />
                </svg>
              </summary>
              <div className="absolute right-0 top-full mt-3 min-w-40 rounded-2xl border border-stone-200 bg-white p-2 shadow-[0_18px_45px_-28px_rgba(24,24,27,0.35)]">
                {localeLinks.map((item) => (
                  <Link
                    key={item.locale}
                    href={item.href}
                    className={`block rounded-xl px-3 py-2 text-sm transition ${
                      item.active ? 'bg-stone-100 font-medium text-stone-950' : 'text-stone-700 hover:bg-stone-50 hover:text-stone-950'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-stone-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              {content.nav.download}
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white/90 text-stone-900 md:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-4 bg-current" />
              <span className="block h-0.5 w-4 bg-current" />
            </span>
          </button>
        </nav>
      </div>

      {menuOpen ? (
        <div className="border-t border-stone-200/80 bg-white/95 px-6 py-4 shadow-[0_18px_45px_-28px_rgba(24,24,27,0.35)] backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-3 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 rounded-2xl border border-stone-200 p-2">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                {localeNames[locale]}
              </div>
              {localeLinks.map((item) => (
                <Link
                  key={item.locale}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-xl px-3 py-3 text-sm transition ${
                    item.active ? 'bg-stone-100 font-medium text-stone-950' : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-stone-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              {content.nav.download}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
