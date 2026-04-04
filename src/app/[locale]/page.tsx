import type { Metadata } from 'next';
import { Footer, Header } from '@/components';
import { HomeSchemaOrg } from '@/components/SchemaOrg';
import { HomeSections } from '@/components/marketing/MarketingSections';
import type { Locale } from '@/i18n/config';
import { getSiteContent } from '@/lib/site-content';
import { buildMarketingMetadata } from '@/lib/site-metadata';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMarketingMetadata(locale as Locale, 'home');
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const content = getSiteContent(typedLocale);

  return (
    <>
      <HomeSchemaOrg locale={typedLocale} />
      <Header locale={typedLocale} currentPage="home" />
      <main>
        <HomeSections locale={typedLocale} content={content} />
      </main>
      <Footer locale={typedLocale} />
    </>
  );
}
