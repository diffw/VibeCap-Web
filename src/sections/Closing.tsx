'use client';

import { useTranslations } from 'next-intl';

export function Closing() {
  const t = useTranslations('closing');

  return (
    <section className="py-16 md:py-20 px-6 bg-stone-50">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-stone-800 mb-4">
          {t('title')}
        </h2>
        <p className="text-base text-stone-500 mb-5">
          {t('description')}
        </p>
        <p className="text-base font-medium text-stone-700 mb-3">
          {t('highlight')}
        </p>
        <p className="text-sm text-stone-400">
          {t('note')}
        </p>
      </div>
    </section>
  );
}
