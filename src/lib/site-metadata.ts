import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { APP_STORE_URL, SITE_URL, localizedPath } from './site-config';
import { getSiteContent } from './site-content';
import { getUseCasePage } from './use-cases-content';

const ogLocaleMap: Record<Locale, string> = {
  en: 'en_US',
  zh: 'zh_CN',
};

type PageKey = 'home' | 'features' | 'pricing' | 'faq' | 'changelog';

export function buildMarketingMetadata(locale: Locale, page: PageKey): Metadata {
  const content = getSiteContent(locale);
  const meta = content.meta[page];
  const path = page === 'home' ? localizedPath(locale) : localizedPath(locale, page);
  const canonicalUrl = `${SITE_URL}${path}`;
  const ogImageUrl = `${SITE_URL}/og-image.png`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'website',
      url: canonicalUrl,
      locale: ogLocaleMap[locale],
      siteName: 'VibeCap',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'VibeCap — Screenshot workflow for AI on macOS',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [ogImageUrl],
    },
    other: page === 'pricing' ? { 'x-app-store-url': APP_STORE_URL } : undefined,
  };
}

export function buildUseCasesIndexMetadata(locale: Locale): Metadata {
  const content = getSiteContent(locale);
  const meta = content.meta.useCases;
  const path = localizedPath(locale, 'use-cases');
  const canonicalUrl = `${SITE_URL}${path}`;
  const ogImageUrl = `${SITE_URL}/og-image.png`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'website',
      url: canonicalUrl,
      locale: ogLocaleMap[locale],
      siteName: 'VibeCap',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'VibeCap — Screenshot workflow for AI on macOS' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [ogImageUrl],
    },
  };
}

export function buildUseCaseDetailMetadata(locale: Locale, slug: string): Metadata {
  const page = getUseCasePage(locale, slug);
  if (!page) {
    return buildUseCasesIndexMetadata(locale);
  }

  const path = `${localizedPath(locale, 'use-cases')}/${slug}`;
  const canonicalUrl = `${SITE_URL}${path}`;
  const ogImageUrl = `${SITE_URL}/og-image.png`;

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      type: 'article',
      url: canonicalUrl,
      locale: ogLocaleMap[locale],
      siteName: 'VibeCap',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: page.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription,
      images: [ogImageUrl],
    },
  };
}
