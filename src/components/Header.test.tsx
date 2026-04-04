import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Header } from './Header';

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { alt, priority, ...rest } = props;
    void priority;
    return <span data-alt={String(alt)} {...rest} />;
  },
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: Record<string, unknown>) => (
    <a href={String(href)} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/en/features',
}));

describe('Header', () => {
  it('renders the primary header navigation with locale switcher and without use cases', () => {
    const html = renderToStaticMarkup(<Header locale="en" currentPage="features" />);

    expect(html).toContain('Features');
    expect(html).toContain('Pricing');
    expect(html).toContain('FAQ');
    expect(html).toContain('Download');
    expect(html).toContain('English');
    expect(html).toContain('简体中文');
    expect(html).toContain('/zh/features');
    expect(html).not.toContain('Use cases');
    expect(html).not.toContain('/en/use-cases');
  });
});
