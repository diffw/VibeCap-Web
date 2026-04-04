import { describe, expect, it } from 'vitest';
import robots from './robots';

describe('robots', () => {
  it('points crawlers to the dynamic sitemap', () => {
    const config = robots();

    expect(config.host).toBe('https://vibecap.dev');
    expect(config.sitemap).toBe('https://vibecap.dev/sitemap.xml');
    expect(config.rules).toEqual({ userAgent: '*', allow: '/' });
  });
});
