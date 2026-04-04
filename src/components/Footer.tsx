import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { localizedPath } from '@/lib/site-config';
import { getSiteContent } from '@/lib/site-content';

type FooterProps = {
  locale: Locale;
};

export function Footer({ locale }: FooterProps) {
  const content = getSiteContent(locale);

  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="px-6 md:px-8">
        <div className="mx-auto max-w-6xl py-16">
          <div className="grid gap-12 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
            <div>
              <Link href={localizedPath(locale)} className="inline-flex transition-opacity hover:opacity-75">
                <Image
                  src="/logo.svg"
                  alt="VibeCap logo"
                  width={124}
                  height={32}
                />
              </Link>
              <p className="mt-5 max-w-md text-sm leading-7 text-stone-600">{content.footer.description}</p>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-stone-950">{content.footer.pagesLabel}</h2>
              <div className="mt-5 flex flex-col gap-3">
                <Link href={localizedPath(locale, 'features')} className="text-sm text-stone-600 transition hover:text-stone-950">
                  {content.nav.features}
                </Link>
                <Link href={localizedPath(locale, 'use-cases')} className="text-sm text-stone-600 transition hover:text-stone-950">
                  {content.nav.useCases}
                </Link>
                <Link href={localizedPath(locale, 'pricing')} className="text-sm text-stone-600 transition hover:text-stone-950">
                  {content.nav.pricing}
                </Link>
                <Link href={localizedPath(locale, 'faq')} className="text-sm text-stone-600 transition hover:text-stone-950">
                  {content.nav.faq}
                </Link>
                <Link href={localizedPath(locale, 'changelog')} className="text-sm text-stone-600 transition hover:text-stone-950">
                  {content.footer.changelog}
                </Link>
                <a href="/llms.txt" className="text-sm text-stone-600 transition hover:text-stone-950">
                  {content.footer.llmsTxt}
                </a>
                <a href="/llms-full.txt" className="text-sm text-stone-600 transition hover:text-stone-950">
                  {content.footer.llmsFull}
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-stone-950">{content.footer.legalLabel}</h2>
              <div className="mt-5 flex flex-col gap-3">
                <Link href={localizedPath(locale, 'privacy')} className="text-sm text-stone-600 transition hover:text-stone-950">
                  {content.footer.privacy}
                </Link>
                <Link href={localizedPath(locale, 'terms')} className="text-sm text-stone-600 transition hover:text-stone-950">
                  {content.footer.terms}
                </Link>
                <a
                  href={`mailto:${content.footer.contactEmail}`}
                  className="text-sm text-stone-600 transition hover:text-stone-950"
                >
                  {content.footer.contactEmail}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-stone-200 pt-6 text-sm text-stone-500 md:flex-row md:items-center md:justify-between">
            <p>{content.footer.copyright}</p>
            <p>{content.footer.note}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
