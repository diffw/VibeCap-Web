import type { Metadata } from 'next';
import { Footer, Header } from '@/components';
import { PricingSchemaOrg } from '@/components/SchemaOrg';
import { PricingPageSections } from '@/components/marketing/MarketingSections';
import type { Locale } from '@/i18n/config';
import { getSiteContent } from '@/lib/site-content';
import { buildMarketingMetadata } from '@/lib/site-metadata';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMarketingMetadata(locale as Locale, 'pricing');
}

export default async function PricingPage({ params }: PageProps) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const content = getSiteContent(typedLocale);

  return (
    <>
      <PricingSchemaOrg locale={typedLocale} />
      <Header locale={typedLocale} currentPage="pricing" />
      <main>
        <PricingPageSections content={content} />
      </main>
      <Footer locale={typedLocale} />
    </>
  );
}
