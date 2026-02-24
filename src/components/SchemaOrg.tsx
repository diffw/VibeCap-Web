'use client';

import { useTranslations, useLocale } from 'next-intl';

const SITE_URL = 'https://vibecap.dev';
const APP_STORE_URL = 'https://apps.apple.com/us/app/vibecap/id6758246419?mt=12';

type FAQItem = {
  question: string;
  answer: string;
};

export function SchemaOrg() {
  const locale = useLocale();
  const tMeta = useTranslations('meta');
  const tFaq = useTranslations('faq');

  const faqItems = tFaq.raw('items') as FAQItem[];

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'VibeCap',
    description: tMeta('description'),
    url: `${SITE_URL}/${locale}/`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'macOS 13.0+',
    datePublished: '2025-01-01',
    author: {
      '@type': 'Organization',
      name: 'VibeCap',
      url: SITE_URL,
    },
    offers: [
      {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free tier with area capture, saving, and arrow annotations',
      },
      {
        '@type': 'Offer',
        price: '1.99',
        priceCurrency: 'USD',
        description: 'Pro Monthly',
        priceValidUntil: '2027-12-31',
      },
      {
        '@type': 'Offer',
        price: '17.99',
        priceCurrency: 'USD',
        description: 'Pro Yearly',
        priceValidUntil: '2027-12-31',
      },
      {
        '@type': 'Offer',
        price: '24.99',
        priceCurrency: 'USD',
        description: 'Lifetime Purchase',
        priceValidUntil: '2027-12-31',
      },
    ],
    screenshot: `${SITE_URL}/banner.png`,
    image: `${SITE_URL}/og-image.png`,
    downloadUrl: APP_STORE_URL,
    inLanguage: ['en', 'zh-Hans', 'zh-Hant', 'ja', 'ko', 'de', 'fr', 'es', 'it', 'sv'],
    featureList: [
      'Global keyboard shortcut capture',
      'Multiple screenshots per session',
      'Arrow, rectangle, circle, and numbered annotations',
      'Prompt text attachment',
      'Auto-paste to AI code editors',
      'Works with Cursor, Windsurf, GitHub Copilot',
      'No account required',
      'No cloud dependency',
      'Fully offline operation',
    ],
  };

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VibeCap',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'vibecap.dev@gmail.com',
      contactType: 'customer service',
    },
    sameAs: [APP_STORE_URL],
  };

  const faqPage = {
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

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}/${locale}/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
