import { describe, expect, it } from 'vitest';
import { APP_STORE_URL } from './site-config';
import { getAllFaqItems, getSiteContent } from './site-content';
import { buildMarketingMetadata, buildUseCasesIndexMetadata, buildUseCaseDetailMetadata } from './site-metadata';
import { USE_CASE_SLUGS, getUseCasePage, isValidUseCaseSlug } from './use-cases-content';

describe('site content', () => {
  it('uses the Figma pricing preview story on both locales', () => {
    const en = getSiteContent('en');
    const zh = getSiteContent('zh');

    expect(en.home.pricingPreview.description).toContain('128');
    expect(en.home.pricingPreview.description).toContain('unlimited');
    expect(zh.home.pricingPreview.description).toContain('128');
    expect(zh.home.pricingPreview.description).toContain('无限');
    expect(zh.home.pricingPreview.monthly.title).toBe('月付');
    expect(zh.home.pricingPreview.annual.title).toBe('年付');
    expect(zh.home.pricingPreview.lifetime.title).toBe('终身版');
    expect(zh.home.management.description).toBe('');
  });

  it('keeps four core capability cards and twenty FAQ entries per locale', () => {
    const en = getSiteContent('en');
    const zh = getSiteContent('zh');

    expect(en.home.capabilities.items).toHaveLength(4);
    expect(zh.home.capabilities.items).toHaveLength(4);
    expect(en.home.workflowLinks.cta).toBeTruthy();
    expect(zh.home.workflowLinks.cta).toBeTruthy();
    expect(getAllFaqItems('en')).toHaveLength(20);
    expect(getAllFaqItems('zh')).toHaveLength(20);
  });

  it('builds pricing metadata without changing the app store url constant', () => {
    const metadata = buildMarketingMetadata('en', 'pricing');

    expect(metadata.title).toContain('Pricing');
    expect(metadata.other).toEqual({ 'x-app-store-url': APP_STORE_URL });
  });

  it('exposes thirteen localized use-case pages per locale with matching slugs', () => {
    expect(USE_CASE_SLUGS).toHaveLength(13);

    for (const locale of ['en', 'zh'] as const) {
      const site = getSiteContent(locale);
      for (const slug of USE_CASE_SLUGS) {
        expect(site.useCasePages[slug].slug).toBe(slug);
        expect(getUseCasePage(locale, slug)?.title.length).toBeGreaterThan(10);
      }
      expect(site.useCasesIndex.cards).toHaveLength(13);
    }
  });

  it('includes changelog page with three releases in both locales', () => {
    const en = getSiteContent('en');
    const zh = getSiteContent('zh');

    expect(en.changelogPage.versions).toHaveLength(3);
    expect(zh.changelogPage.versions).toHaveLength(3);
    expect(en.footer.changelog).toBeTruthy();
    expect(zh.footer.changelog).toBeTruthy();
    expect(en.footer.llmsTxt).toBe('LLMs.txt');
    expect(zh.footer.llmsFull).toBe('LLMs Full');
    expect(buildMarketingMetadata('en', 'changelog').title).toBeDefined();
  });

  it('validates use-case slugs and builds detail metadata from page copy', () => {
    expect(isValidUseCaseSlug('everyday')).toBe(true);
    expect(isValidUseCaseSlug('nope')).toBe(false);
    expect(getUseCasePage('en', 'invalid')).toBeUndefined();

    const meta = buildUseCaseDetailMetadata('en', 'developer');
    expect(meta.title.toLowerCase()).toContain('developer');

    const indexMeta = buildUseCasesIndexMetadata('zh');
    expect(indexMeta.title).toBeDefined();
  });
});
