'use client';

import { useTranslations } from 'next-intl';

export function Solution() {
  const t = useTranslations('solution');
  const benefits = t.raw('benefits') as string[];

  return (
    <section className="py-16 md:py-20 px-6 bg-stone-50">
      <div className="mx-auto w-[1024px]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-stone-800 mb-4">
              {t('title')}
            </h2>
            <p className="text-base text-stone-500 mb-8">
              {t('subtitle')}
            </p>

            <div className="space-y-4 mb-8">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#FF8D76]/15 text-[#FF8D76] text-sm font-semibold flex items-center justify-center">
                    {step}
                  </span>
                  <span className="text-base text-stone-700">{t(`flow.step${step}`)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 text-stone-500">
                  <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="rounded-xl bg-white border border-stone-200 p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-1/3 aspect-video rounded-lg bg-stone-100 flex items-center justify-center text-stone-400 text-xs">
                    Screenshot 1
                  </div>
                  <div className="w-1/3 aspect-video rounded-lg bg-stone-100 flex items-center justify-center text-stone-400 text-xs">
                    Screenshot 2
                  </div>
                  <div className="w-1/3 aspect-video rounded-lg bg-stone-50 border border-dashed border-stone-300 flex items-center justify-center text-stone-400 text-xs">
                    + Add
                  </div>
                </div>
                <div className="rounded-lg bg-stone-50 p-4 border border-stone-100">
                  <p className="text-xs text-stone-400 font-mono">// Write your prompt...</p>
                </div>
                <div className="flex justify-end">
                  <div className="px-4 py-2 rounded-full bg-[#FF8D76] text-white text-sm font-medium">
                    Send to Editor →
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
