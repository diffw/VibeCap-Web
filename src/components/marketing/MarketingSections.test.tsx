import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { getSiteContent } from '@/lib/site-content';
import { HomeSections } from './MarketingSections';

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

vi.mock('./RevealOnView', () => ({
  RevealOnView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('HomeSections', () => {
  it('renders the management section title in Chinese for zh locale', () => {
    const html = renderToStaticMarkup(<HomeSections locale="zh" content={getSiteContent('zh')} />);

    expect(html).toContain('让截图保持有用，而不是越积越乱。');
    expect(html).not.toContain('Keep your screenshots useful,');
    expect(html).not.toContain('not messy.');
  });
});
