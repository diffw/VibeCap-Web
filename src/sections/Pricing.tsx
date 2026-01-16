'use client';

import { useTranslations } from 'next-intl';

export function Pricing() {
  const t = useTranslations('pricing');
  const oneTimeFeatures = t.raw('oneTime.features') as string[];
  const subFeatures = t.raw('subscription.features') as string[];

  return (
    <section id="pricing" className="py-16 md:py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-stone-800 mb-3">
            {t('title')}
          </h2>
          <p className="text-base text-stone-500 mb-2">
            {t('subtitle')}
          </p>
          <p className="text-sm text-stone-400">
            {t('description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-xl border-2 border-rose-200 bg-white p-6 relative">
            <div className="absolute -top-2.5 left-4 px-3 py-1 bg-rose-300 text-white text-xs font-medium rounded-full">
              Recommended
            </div>
            <h3 className="text-base font-semibold text-stone-800 mb-2">
              {t('oneTime.title')}
            </h3>
            <div className="mb-5">
              <span className="text-4xl font-bold text-stone-800">{t('oneTime.price')}</span>
              <span className="text-sm text-stone-500 ml-2">{t('oneTime.note')}</span>
            </div>
            <ul className="space-y-3 mb-5">
              {oneTimeFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-stone-500 text-sm">
                  <svg className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-stone-400 mb-5">{t('oneTime.footer')}</p>
            <button className="w-full py-2.5 rounded-full bg-rose-300 text-white text-sm font-medium hover:bg-rose-400 transition-colors duration-300">
              {t('oneTime.cta')}
            </button>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-6">
            <h3 className="text-base font-semibold text-stone-800 mb-2">
              {t('subscription.title')}
            </h3>
            <div className="mb-5">
              <span className="text-4xl font-bold text-stone-800">{t('subscription.price')}</span>
              <span className="text-sm text-stone-500 ml-2">{t('subscription.note')}</span>
            </div>
            <ul className="space-y-3 mb-5">
              {subFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-stone-500 text-sm">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-stone-400 mb-5">{t('subscription.footer')}</p>
            <button className="w-full py-2.5 rounded-full border border-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors duration-300">
              {t('subscription.cta')}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-stone-400 mt-8">
          {t('footnote')}
        </p>
      </div>
    </section>
  );
}
