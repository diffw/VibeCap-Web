import type { Metadata } from 'next';
import { Footer, Header } from '@/components';
import { ChangelogSchemaOrg } from '@/components/SchemaOrg';
import { ChangelogSections } from '@/components/marketing/ChangelogSections';
import type { Locale } from '@/i18n/config';
import { getSiteContent } from '@/lib/site-content';
import { buildMarketingMetadata } from '@/lib/site-metadata';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMarketingMetadata(locale as Locale, 'changelog');
}

export default async function ChangelogPage({ params }: PageProps) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const content = getSiteContent(typedLocale);

  return (
    <>
      <ChangelogSchemaOrg locale={typedLocale} />
      <Header locale={typedLocale} />
      <main>
        <ChangelogSections page={content.changelogPage} />
      </main>
      <Footer locale={typedLocale} />
    </>
  );
}
