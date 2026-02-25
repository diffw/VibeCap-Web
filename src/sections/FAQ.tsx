'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

type FAQItem = {
  question: string;
  answer: string;
};

export function FAQ() {
  const t = useTranslations('faq');
  const items = t.raw('items') as FAQItem[];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 md:py-20 px-6 bg-stone-50">
      <div className="mx-auto w-[1024px]">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-stone-800">
            {t('title')}
          </h2>
        </div>

        <div className="mx-auto max-w-3xl divide-y divide-stone-100">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="py-5">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left"
                >
                  <h3 className="text-base font-medium text-stone-800">
                    {item.question}
                  </h3>
                  <svg
                    className={`w-5 h-5 text-stone-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-sm text-stone-500 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
