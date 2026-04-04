import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/config';
import { APP_STORE_URL, localizedPath } from '@/lib/site-config';
import type { SiteContent, UseCasePageContent } from '@/lib/site-content';

const bodyLargeClass = 'marketing-body-lg text-stone-600';
const bodyBaseClass = 'marketing-body-base text-stone-600';
const bodySmallClass = 'marketing-body-sm text-stone-600';

function Section({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <section className={`px-6 py-16 md:px-8 md:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function UseCasesIndexSections({ locale, content }: { locale: Locale; content: SiteContent }) {
  const u = content.useCasesIndex;

  return (
    <>
      <Section className="pt-28 md:pt-36">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">{u.eyebrow}</p>
          <h1 className="text-4xl font-semibold tracking-tight text-stone-950 md:text-6xl">{u.title}</h1>
          <p className={`mt-5 ${bodyLargeClass}`}>{u.description}</p>
        </div>
      </Section>

      <Section className="pt-0">
        <ul className="grid gap-6 md:grid-cols-2">
          {u.cards.map((card) => (
            <li key={card.slug}>
              <Link
                href={`${localizedPath(locale, 'use-cases')}/${card.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-stone-200/90 bg-white p-8 shadow-[0_8px_30px_-22px_rgba(24,24,27,0.2)] transition hover:border-stone-300 hover:shadow-[0_18px_45px_-28px_rgba(24,24,27,0.25)]"
              >
                <h2 className="text-xl font-semibold text-stone-950 group-hover:text-stone-800">{card.title}</h2>
                <p className={`mt-3 flex-1 ${bodyBaseClass}`}>{card.description}</p>
                <span className="mt-6 text-sm font-medium text-stone-900 underline-offset-4 group-hover:underline">
                  {u.readMore}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="pt-4 pb-20 md:pb-24">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/80 px-8 py-10 text-center md:px-12">
          <p className="text-lg font-medium text-stone-950">{u.indexClosingTitle}</p>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-stone-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            {u.ctaLabel}
          </a>
        </div>
      </Section>
    </>
  );
}

export function UseCaseDetailSections({
  locale,
  page,
  downloadLabel,
  backLabel,
  footerPrompt,
}: {
  locale: Locale;
  page: UseCasePageContent;
  downloadLabel: string;
  backLabel: string;
  footerPrompt: string;
}) {
  const { sections } = page;
  const indexHref = localizedPath(locale, 'use-cases');

  return (
    <>
      <Section className="pt-28 md:pt-36">
        <nav className="mb-8">
          <Link href={indexHref} className={`text-sm font-medium text-stone-500 transition hover:text-stone-900`}>
            ← {backLabel}
          </Link>
        </nav>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">{page.personaLabel}</p>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">{page.title}</h1>
        <p className={`mt-5 max-w-3xl ${bodyLargeClass}`}>{page.subtitle}</p>
      </Section>

      <Section className="border-t border-stone-200/80 pt-12">
        <h2 className="text-2xl font-semibold text-stone-950 md:text-3xl">{sections.whyTitle}</h2>
        <p className={`mt-4 max-w-3xl ${bodyBaseClass}`}>{sections.whyLead}</p>
        <ul className="mt-6 space-y-3">
          {sections.whyPoints.map((item) => (
            <li key={item} className={`flex items-start gap-3 ${bodySmallClass}`}>
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-400" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="border-t border-stone-200/80 pt-12">
        <h2 className="text-2xl font-semibold text-stone-950 md:text-3xl">{sections.painTitle}</h2>
        <p className={`mt-4 max-w-3xl ${bodyBaseClass}`}>{sections.painLead}</p>
        <ul className="mt-6 space-y-3">
          {sections.painPoints.map((item) => (
            <li key={item} className={`flex items-start gap-3 ${bodySmallClass}`}>
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/90" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="border-t border-stone-200/80 pt-12">
        <h2 className="text-2xl font-semibold text-stone-950 md:text-3xl">{sections.howTitle}</h2>
        <ol className="mt-8 space-y-10">
          {sections.howSteps.map((step, i) => (
            <li key={step.title} className="flex gap-6">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-950 text-sm font-semibold text-white"
                aria-hidden
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-stone-950">{step.title}</h3>
                <p className={`mt-2 ${bodyBaseClass}`}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="border-t border-stone-200/80 pt-12">
        <h2 className="text-2xl font-semibold text-stone-950 md:text-3xl">{sections.benefitsTitle}</h2>
        <ul className="mt-6 space-y-3">
          {sections.benefitPoints.map((item) => (
            <li key={item} className={`flex items-start gap-3 ${bodySmallClass}`}>
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/90" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="pt-4 pb-20 md:pb-24">
        <div className="flex flex-col items-start gap-4 rounded-3xl border border-stone-200 bg-stone-50/80 px-8 py-10 md:flex-row md:items-center md:justify-between md:px-12">
          <p className="text-lg font-medium text-stone-950">{footerPrompt}</p>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-stone-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            {downloadLabel}
          </a>
        </div>
      </Section>
    </>
  );
}
