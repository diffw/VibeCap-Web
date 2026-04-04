import type { Metadata } from 'next';
import { Footer, Header } from '@/components';
import { UseCasesIndexSchemaOrg } from '@/components/SchemaOrg';
import { UseCasesIndexSections } from '@/components/marketing/UseCaseSections';
import type { Locale } from '@/i18n/config';
import { getSiteContent } from '@/lib/site-content';
import { buildUseCasesIndexMetadata } from '@/lib/site-metadata';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildUseCasesIndexMetadata(locale as Locale);
}

export default async function UseCasesIndexPage({ params }: PageProps) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const content = getSiteContent(typedLocale);

  return (
    <>
      <UseCasesIndexSchemaOrg locale={typedLocale} />
      <Header locale={typedLocale} currentPage="useCases" />
      <main>
        <UseCasesIndexSections locale={typedLocale} content={content} />
      </main>
      <Footer locale={typedLocale} />
    </>
  );
}
