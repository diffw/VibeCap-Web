'use client';

import { useTranslations } from 'next-intl';

export function Hero() {
  const t = useTranslations('hero');

  return (
    <section 
      className="flex flex-col items-center justify-center text-center px-6 pt-28 pb-14"
      style={{ background: 'linear-gradient(180deg, #f5f3ee 0%, #fafaf8 100%)' }}
    >
      <div className="w-full max-w-2xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-stone-200 text-stone-500 text-sm mb-6">
          <svg className="w-4 h-4 text-rose-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          {t('badge')}
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl font-semibold text-stone-800 leading-tight mb-3 tracking-tight">
          {t('headline')}
        </h1>
        <p className="text-xl md:text-2xl font-light text-stone-500 mb-8">
          {t('subheadline')}
        </p>

        {/* CTA Button */}
        <div>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-800 text-white font-medium text-base hover:bg-stone-700 transition-colors duration-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
            </svg>
            {t('cta')}
          </a>
          <p className="text-sm text-stone-400 mt-3">{t('ctaNote')}</p>
        </div>
      </div>

      {/* Product Screenshot Preview */}
      <div className="w-full max-w-3xl mx-auto mt-10 px-6">
        <div className="rounded-xl bg-white border border-stone-200 p-4 shadow-sm">
          <div className="bg-stone-100 rounded-lg aspect-video flex items-center justify-center">
            <div className="text-center text-stone-400">
              <svg className="w-8 h-8 mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Product Screenshot</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
