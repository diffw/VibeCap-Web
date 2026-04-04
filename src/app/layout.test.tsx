import { Children, ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import RootLayout from './layout';

describe('RootLayout', () => {
  it('injects the official GA scripts globally', () => {
    const tree = RootLayout({
      children: <main>content</main>,
    }) as ReactElement;

    expect(tree.type).toBe('html');
    expect(tree.props.lang).toBe('en');
    expect(tree.props['data-scroll-behavior']).toBe('smooth');

    const [head, body] = Children.toArray(tree.props.children) as ReactElement[];
    expect(head.type).toBe('head');
    expect(body.type).toBe('body');
    expect(body.props.className).toBe('antialiased');

    const headChildren = Children.toArray(head.props.children) as ReactElement[];
    expect(headChildren).toHaveLength(2);

    const [gaLoader, gaInit, gaPageViewTracker] = headChildren as ReactElement[];

    expect(gaLoader.type).toBe('script');
    expect(gaLoader.props.src).toBe('https://www.googletagmanager.com/gtag/js?id=G-GRCXG09WNL');
    expect(gaLoader.props.async).toBe(true);

    expect(gaInit.type).toBe('script');
    expect(gaInit.props.dangerouslySetInnerHTML.__html).toContain(
      "gtag('config', 'G-GRCXG09WNL');",
    );
    expect(gaPageViewTracker).toBeUndefined();
  });
});
