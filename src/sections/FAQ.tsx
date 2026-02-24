'use client';

import { useTranslations } from 'next-intl';

type FAQItem = {
  question: string;
  answer: string;
};

export function FAQ() {
  const t = useTranslations('faq');
  const items = t.raw('items') as FAQItem[];

  return (
    <section id="faq" className="py-16 md:py-20 px-6 bg-stone-50">
      <div className="mx-auto w-[1024px]">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-stone-800">
            {t('title')}
          </h2>
        </div>

        <div className="mx-auto max-w-3xl space-y-6">
          {items.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-stone-100 p-6">
              <h3 className="text-base font-medium text-stone-800 mb-3">
                {item.question}
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
