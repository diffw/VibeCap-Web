'use client';

import { useTranslations } from 'next-intl';

type ProblemItem = {
  title: string;
  description: string;
};

export function Problems() {
  const t = useTranslations('problems');
  const items = t.raw('items') as ProblemItem[];

  const icons = [
    <svg key="1" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>,
    <svg key="2" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>,
    <svg key="3" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>,
    <svg key="4" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>,
  ];

  return (
    <section className="py-16 md:py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-stone-800 mb-3">
            {t('title')}
          </h2>
          <p className="text-base md:text-lg text-stone-500">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-stone-50 border border-stone-100 hover:border-stone-200 transition-colors duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-rose-50 text-rose-400 flex items-center justify-center">
                  {icons[i]}
                </div>
                <div>
                  <h3 className="text-base font-medium text-stone-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
