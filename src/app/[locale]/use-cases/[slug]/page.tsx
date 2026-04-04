import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Footer, Header } from '@/components';
import { UseCaseDetailSchemaOrg } from '@/components/SchemaOrg';
import { UseCaseDetailSections } from '@/components/marketing/UseCaseSections';
import { locales, type Locale } from '@/i18n/config';
import { getSiteContent } from '@/lib/site-content';
import { buildUseCaseDetailMetadata } from '@/lib/site-metadata';
import { USE_CASE_SLUGS, getUseCasePage } from '@/lib/use-cases-content';

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return locales.flatMap((locale) => USE_CASE_SLUGS.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  return buildUseCaseDetailMetadata(locale as Locale, slug);
}

export default async function UseCaseDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const typedLocale = locale as Locale;
  const page = getUseCasePage(typedLocale, slug);

  if (!page) {
    notFound();
  }

  const content = getSiteContent(typedLocale);

  return (
    <>
      <UseCaseDetailSchemaOrg locale={typedLocale} slug={slug} />
      <Header locale={typedLocale} currentPage="useCases" />
      <main>
        <UseCaseDetailSections
          locale={typedLocale}
          page={page}
          downloadLabel={content.nav.download}
          backLabel={content.nav.useCases}
          footerPrompt={content.useCasesIndex.detailFooterPrompt}
        />
      </main>
      <Footer locale={typedLocale} />
    </>
  );
}
