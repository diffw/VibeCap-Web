import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ChangelogSchemaOrg, HomeSchemaOrg, UseCaseDetailSchemaOrg, UseCasesIndexSchemaOrg } from './SchemaOrg';

describe('SchemaOrg', () => {
  it('limits software application language claims to supported locales', () => {
    const html = renderToStaticMarkup(<HomeSchemaOrg locale="en" />);

    expect(html).toContain('"inLanguage":["en","zh-Hans"]');
    expect(html).not.toContain('"ja"');
    expect(html).toContain('"operatingSystem":"macOS 12.0+"');
  });

  it('renders use-cases index and detail schema with crawlable URLs', () => {
    const indexHtml = renderToStaticMarkup(<UseCasesIndexSchemaOrg locale="en" />);
    const detailHtml = renderToStaticMarkup(<UseCaseDetailSchemaOrg locale="en" slug="developer" />);

    expect(indexHtml).toContain('https://vibecap.dev/en/use-cases');
    expect(indexHtml).toContain('https://vibecap.dev/en/use-cases/developer');
    expect(detailHtml).toContain('https://vibecap.dev/en/use-cases/developer');
    expect(detailHtml).toContain('"BreadcrumbList"');
  });

  it('renders changelog schema with release entries', () => {
    const html = renderToStaticMarkup(<ChangelogSchemaOrg locale="en" />);

    expect(html).toContain('https://vibecap.dev/en/changelog');
    expect(html).toContain('VibeCap 1.1.0');
    expect(html).toContain('"CollectionPage"');
  });
});
