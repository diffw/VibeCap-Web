'use client';

import { useTranslations } from 'next-intl';

export function Workflow() {
  const t = useTranslations('workflow');

  return (
    <section className="py-16 md:py-20 px-6 bg-white">
      <div className="mx-auto w-[1024px] text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-stone-800 mb-5">
          {t('title')}
        </h2>
        <p className="text-base md:text-lg text-stone-500 mb-10 max-w-xl mx-auto">
          {t('description')}
        </p>

        <div className="inline-block px-8 py-5 rounded-xl bg-[#FF8D76]/10 border border-[#FF8D76]/20">
          <p className="text-xl md:text-2xl font-mono font-medium text-stone-700">
            {t('highlight')}
          </p>
          <p className="text-sm text-stone-500 mt-3">
            {t('note')}
          </p>
        </div>
      </div>
    </section>
  );
}
