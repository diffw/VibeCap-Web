import { describe, expect, it } from 'vitest';
import sitemap from './sitemap';

describe('sitemap', () => {
  it('includes all localized marketing pages and use-case detail pages', () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain('https://vibecap.dev/llms.txt');
    expect(urls).toContain('https://vibecap.dev/llms-full.txt');
    expect(urls).toContain('https://vibecap.dev/en/features');
    expect(urls).toContain('https://vibecap.dev/zh/pricing');
    expect(urls).toContain('https://vibecap.dev/en/faq');
    expect(urls).toContain('https://vibecap.dev/zh/use-cases');
    expect(urls).toContain('https://vibecap.dev/en/changelog');
    expect(urls).toContain('https://vibecap.dev/en/use-cases/developer');
    expect(urls).toContain('https://vibecap.dev/zh/use-cases/research-media');
  });
});
