import type { Locale } from '@/i18n/config';
import { APP_STORE_URL, CONTACT_EMAIL, SITE_URL, localizedPath } from '@/lib/site-config';
import { getAllFaqItems, getSiteContent } from '@/lib/site-content';
import { getUseCasePage } from '@/lib/use-cases-content';

function JsonLdScript({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VibeCap',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    contactPoint: {
      '@type': 'ContactPoint',
      email: CONTACT_EMAIL,
      contactType: 'customer service',
    },
    sameAs: [APP_STORE_URL],
  };
}

function buildBreadcrumbSchema(locale: Locale, segments: Array<{ name: string; path: string }> = []) {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${SITE_URL}${localizedPath(locale)}`,
    },
  ];

  segments.forEach((segment, index) => {
    items.push({
      '@type': 'ListItem',
      position: index + 2,
      name: segment.name,
      item: `${SITE_URL}${segment.path}`,
    });
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

function buildSoftwareApplicationSchema(locale: Locale) {
  const content = getSiteContent(locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'VibeCap',
    description: content.schema.description,
    url: `${SITE_URL}${localizedPath(locale)}`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'macOS 12.0+',
    datePublished: '2025-01-01',
    author: {
      '@type': 'Organization',
      name: 'VibeCap',
      url: SITE_URL,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Start with 128 free screenshots. Pro plans are available in the Mac App Store.',
      url: APP_STORE_URL,
    },
    screenshot: `${SITE_URL}/banner.png`,
    image: `${SITE_URL}/og-image.png`,
    downloadUrl: APP_STORE_URL,
    inLanguage: ['en', 'zh-Hans'],
    featureList: content.schema.featureList,
  };
}

function buildFaqPageSchema(locale: Locale) {
  const faqItems = getAllFaqItems(locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

function buildPricingSchema(locale: Locale) {
  const content = getSiteContent(locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'VibeCap Pro Plans',
    itemListElement: content.pricingPage.plans.map((plan) => ({
      '@type': 'Offer',
      name: `VibeCap ${plan.name}`,
      price: plan.price.replace('$', ''),
      priceCurrency: 'USD',
      description: plan.subtitle,
      url: APP_STORE_URL,
      category: 'Software Subscription',
    })),
  };
}

function buildFeaturesPageSchema(locale: Locale) {
  const content = getSiteContent(locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: content.featuresPage.title,
    description: content.featuresPage.description,
    url: `${SITE_URL}${localizedPath(locale, 'features')}`,
    mainEntity: {
      '@type': 'SoftwareApplication',
      name: 'VibeCap',
      operatingSystem: 'macOS 12.0+',
      applicationCategory: 'DeveloperApplication',
    },
  };
}

function buildUseCasesIndexPageSchema(locale: Locale) {
  const content = getSiteContent(locale);
  const path = localizedPath(locale, 'use-cases');

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: content.useCasesIndex.title,
    description: content.useCasesIndex.description,
    url: `${SITE_URL}${path}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: content.useCasesIndex.cards.map((card, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: card.title,
        url: `${SITE_URL}${path}/${card.slug}`,
      })),
    },
  };
}

function buildUseCaseDetailPageSchema(locale: Locale, slug: string) {
  const page = getUseCasePage(locale, slug);
  if (!page) {
    return null;
  }

  const path = `${localizedPath(locale, 'use-cases')}/${slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.metaDescription,
    url: `${SITE_URL}${path}`,
    about: {
      '@type': 'SoftwareApplication',
      name: 'VibeCap',
      operatingSystem: 'macOS 12.0+',
      applicationCategory: 'DeveloperApplication',
    },
    isPartOf: {
      '@type': 'CollectionPage',
      name: getSiteContent(locale).useCasesIndex.title,
      url: `${SITE_URL}${localizedPath(locale, 'use-cases')}`,
    },
  };
}

function buildChangelogPageSchema(locale: Locale) {
  const content = getSiteContent(locale);
  const path = localizedPath(locale, 'changelog');

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: content.changelogPage.title,
    description: content.changelogPage.description,
    url: `${SITE_URL}${path}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: content.changelogPage.versions.map((version, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: `VibeCap ${version.version}`,
          datePublished: version.dateLabel,
          description:
            version.entries[0]?.kind === 'feature'
              ? version.entries[0].description
              : version.entries[0]?.text ?? '',
        },
      })),
    },
  };
}

export function HomeSchemaOrg({ locale }: { locale: Locale }) {
  return (
    <>
      <JsonLdScript data={buildSoftwareApplicationSchema(locale)} />
      <JsonLdScript data={buildOrganizationSchema()} />
      <JsonLdScript data={buildBreadcrumbSchema(locale)} />
    </>
  );
}

export function FeaturesSchemaOrg({ locale }: { locale: Locale }) {
  const content = getSiteContent(locale);

  return (
    <>
      <JsonLdScript data={buildFeaturesPageSchema(locale)} />
      <JsonLdScript data={buildOrganizationSchema()} />
      <JsonLdScript
        data={buildBreadcrumbSchema(locale, [{ name: content.nav.features, path: localizedPath(locale, 'features') }])}
      />
    </>
  );
}

export function PricingSchemaOrg({ locale }: { locale: Locale }) {
  const content = getSiteContent(locale);

  return (
    <>
      <JsonLdScript data={buildSoftwareApplicationSchema(locale)} />
      <JsonLdScript data={buildPricingSchema(locale)} />
      <JsonLdScript data={buildOrganizationSchema()} />
      <JsonLdScript
        data={buildBreadcrumbSchema(locale, [{ name: content.nav.pricing, path: localizedPath(locale, 'pricing') }])}
      />
    </>
  );
}

export function FAQSchemaOrg({ locale }: { locale: Locale }) {
  const content = getSiteContent(locale);

  return (
    <>
      <JsonLdScript data={buildFaqPageSchema(locale)} />
      <JsonLdScript data={buildOrganizationSchema()} />
      <JsonLdScript data={buildBreadcrumbSchema(locale, [{ name: content.nav.faq, path: localizedPath(locale, 'faq') }])} />
    </>
  );
}

export function UseCasesIndexSchemaOrg({ locale }: { locale: Locale }) {
  const content = getSiteContent(locale);

  return (
    <>
      <JsonLdScript data={buildUseCasesIndexPageSchema(locale)} />
      <JsonLdScript data={buildOrganizationSchema()} />
      <JsonLdScript
        data={buildBreadcrumbSchema(locale, [{ name: content.nav.useCases, path: localizedPath(locale, 'use-cases') }])}
      />
    </>
  );
}

export function UseCaseDetailSchemaOrg({ locale, slug }: { locale: Locale; slug: string }) {
  const content = getSiteContent(locale);
  const page = buildUseCaseDetailPageSchema(locale, slug);
  if (!page) {
    return null;
  }

  const useCase = getUseCasePage(locale, slug);
  if (!useCase) {
    return null;
  }

  return (
    <>
      <JsonLdScript data={page} />
      <JsonLdScript data={buildOrganizationSchema()} />
      <JsonLdScript
        data={buildBreadcrumbSchema(locale, [
          { name: content.nav.useCases, path: localizedPath(locale, 'use-cases') },
          { name: useCase.title, path: `${localizedPath(locale, 'use-cases')}/${slug}` },
        ])}
      />
    </>
  );
}

export function ChangelogSchemaOrg({ locale }: { locale: Locale }) {
  const content = getSiteContent(locale);

  return (
    <>
      <JsonLdScript data={buildChangelogPageSchema(locale)} />
      <JsonLdScript data={buildOrganizationSchema()} />
      <JsonLdScript
        data={buildBreadcrumbSchema(locale, [{ name: content.footer.changelog, path: localizedPath(locale, 'changelog') }])}
      />
    </>
  );
}
