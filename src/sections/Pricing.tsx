'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

export function Pricing() {
  const t = useTranslations('pricing');
  const appStoreUrl = 'https://apps.apple.com/us/app/vibecap/id6758246419?mt=12';

  type PlanId = 'monthly' | 'yearly' | 'lifetime';

  const plans = useMemo(() => {
    return [
      {
        id: 'monthly' as const,
        title: t('plans.monthly.title'),
        subtitle: t('plans.monthly.subtitle'),
        price: t('plans.monthly.price'),
        period: t('plans.monthly.period'),
        badge: null as string | null,
        secondaryPrice: null as string | null,
      },
      {
        id: 'yearly' as const,
        title: t('plans.yearly.title'),
        subtitle: t('plans.yearly.subtitle'),
        price: t('plans.yearly.price'),
        period: t('plans.yearly.period'),
        badge: t('badgeMostPopular'),
        secondaryPrice: t('plans.yearly.effectiveMonthly'),
      },
      {
        id: 'lifetime' as const,
        title: t('plans.lifetime.title'),
        subtitle: t('plans.lifetime.subtitle'),
        price: t('plans.lifetime.price'),
        period: t('plans.lifetime.period'),
        badge: null as string | null,
        secondaryPrice: null as string | null,
      },
    ];
  }, [t]);

  const [selected, setSelected] = useState<PlanId>('yearly');

  return (
    <section id="pricing" className="py-16 md:py-20 px-6 bg-white">
      <div className="mx-auto w-[1024px]">
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

        <div className="mx-auto w-full md:w-1/2">
          <div className="space-y-4">
            {plans.map((plan) => {
              const isSelected = plan.id === selected;

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelected(plan.id)}
                  className={`relative w-full text-left rounded-2xl border bg-white p-5 md:p-6 transition-colors duration-200 ${
                    isSelected
                      ? 'border-[#FF8D76] ring-2 ring-[#FF8D76]/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <span
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'border-[#FF8D76] bg-[#FF8D76]' : 'border-stone-300 bg-white'
                        }`}
                        aria-hidden
                      >
                        {isSelected ? (
                          <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M16.704 5.29a1 1 0 010 1.414l-7.07 7.07a1 1 0 01-1.414 0l-3.535-3.535a1 1 0 111.414-1.414l2.828 2.828 6.363-6.363a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : null}
                      </span>

                      <div>
                        <div className="flex items-center gap-3">
                          <div className="text-xl font-semibold text-stone-800">{plan.title}</div>
                          {plan.badge ? (
                            <span className="px-3 py-1 rounded-full bg-[#FF8D76]/15 text-[#FF8D76] text-xs font-semibold tracking-wide">
                              {plan.badge}
                            </span>
                          ) : null}
                        </div>
                        <div className="text-base text-stone-500">{plan.subtitle}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-semibold text-stone-800">
                        {plan.price}
                        {plan.period.startsWith('/') ? (
                          <span className="text-stone-800">{plan.period}</span>
                        ) : null}
                      </div>
                      <div className="text-base text-stone-500">
                        {plan.secondaryPrice ?? (plan.period.startsWith('/') ? '' : plan.period)}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <a
            href={appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 block w-full py-3 text-center rounded-2xl bg-[#FF8D76] text-white text-base font-semibold hover:bg-[#FF7A60] transition-colors duration-200"
          >
            {t('actions.cta')}
          </a>
        </div>

        <p className="text-center text-sm text-stone-400 mt-8">
          {t('footnote')}
        </p>
      </div>
    </section>
  );
}
