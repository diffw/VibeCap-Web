import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import '../globals.css';

const SITE_URL = 'https://vibecap.dev';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const ogLocaleMap: Record<string, string> = {
  en: 'en_US',
  zh: 'zh_CN',
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const meta = (messages as Record<string, Record<string, string>>).meta;

  const title = meta?.title || 'VibeCap';
  const description = meta?.description || '';
  const canonicalUrl = `${SITE_URL}/${locale}/`;
  const ogImageUrl = `${SITE_URL}/og-image.png`;

  const alternates: Record<string, string> = {};
  for (const loc of locales) {
    alternates[loc] = `${SITE_URL}/${loc}/`;
  }
  alternates['x-default'] = `${SITE_URL}/en/`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      locale: ogLocaleMap[locale] || 'en_US',
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
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as string as typeof locales[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
