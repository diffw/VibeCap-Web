import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { SITE_URL, localizedPath } from '@/lib/site-config';
import { USE_CASE_SLUGS } from '@/lib/use-cases-content';

export const dynamic = 'force-static';

const MARKETING_PAGES = ['features', 'pricing', 'faq', 'use-cases', 'changelog', 'privacy', 'terms'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/llms.txt`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/llms-full.txt`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  for (const locale of locales) {
    entries.push({
      url: `${SITE_URL}${localizedPath(locale)}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    });

    for (const page of MARKETING_PAGES) {
      entries.push({
        url: `${SITE_URL}${localizedPath(locale, page)}`,
        lastModified,
        changeFrequency: page === 'changelog' ? 'weekly' : 'monthly',
        priority: page === 'pricing' || page === 'features' || page === 'use-cases' ? 0.9 : 0.7,
      });
    }

    for (const slug of USE_CASE_SLUGS) {
      entries.push({
        url: `${SITE_URL}${localizedPath(locale, 'use-cases')}/${slug}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  return entries;
}
