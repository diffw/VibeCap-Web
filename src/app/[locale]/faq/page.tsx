import type { Metadata } from 'next';
import { Footer, Header } from '@/components';
import { FAQSchemaOrg } from '@/components/SchemaOrg';
import { FAQPageSections } from '@/components/marketing/MarketingSections';
import type { Locale } from '@/i18n/config';
import { getSiteContent } from '@/lib/site-content';
import { buildMarketingMetadata } from '@/lib/site-metadata';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMarketingMetadata(locale as Locale, 'faq');
}

export default async function FAQPage({ params }: PageProps) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const content = getSiteContent(typedLocale);

  return (
    <>
      <FAQSchemaOrg locale={typedLocale} />
      <Header locale={typedLocale} currentPage="faq" />
      <main>
        <FAQPageSections content={content} />
      </main>
      <Footer locale={typedLocale} />
    </>
  );
}
