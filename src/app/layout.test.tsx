import { Children, Fragment, ReactElement } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import RootLayout from './layout';

const ORIGINAL_GA_ID = process.env.NEXT_PUBLIC_GA_ID;

afterEach(() => {
  process.env.NEXT_PUBLIC_GA_ID = ORIGINAL_GA_ID;
});

describe('RootLayout', () => {
  it('injects GA scripts globally when id is configured', () => {
    process.env.NEXT_PUBLIC_GA_ID = 'G-TEST123456';

    const tree = RootLayout({
      children: <main>content</main>,
    }) as ReactElement;

    expect(tree.type).toBe('html');
    expect(tree.props.lang).toBe('en');

    const [head, body] = Children.toArray(tree.props.children) as ReactElement[];
    expect(head.type).toBe('head');
    expect(body.type).toBe('body');
    expect(body.props.className).toBe('antialiased');

    const headChildren = Children.toArray(head.props.children) as ReactElement[];
    expect(headChildren).toHaveLength(1);
    expect(headChildren[0].type).toBe(Fragment);

    const [gaLoader, gaInit, gaPageViewTracker] = Children.toArray(
      headChildren[0].props.children,
    ) as ReactElement[];

    expect(gaLoader.type).toBe('script');
    expect(gaLoader.props.src).toBe('https://www.googletagmanager.com/gtag/js?id=G-TEST123456');
    expect(gaLoader.props.async).toBe(true);

    expect(gaInit.type).toBe('script');
    expect(gaInit.props.dangerouslySetInnerHTML.__html).toContain(
      "gtag('config','G-TEST123456',{send_page_view:false})",
    );

    expect(gaPageViewTracker.type).toBe('script');
    expect(gaPageViewTracker.props.dangerouslySetInnerHTML.__html).toContain("window.gtag('event','page_view'");
    expect(gaPageViewTracker.props.dangerouslySetInnerHTML.__html).toContain('history.pushState=function()');
  });

  it('does not inject GA scripts when id is missing', () => {
    delete process.env.NEXT_PUBLIC_GA_ID;

    const tree = RootLayout({
      children: <main>content</main>,
    }) as ReactElement;

    const [head] = Children.toArray(tree.props.children) as ReactElement[];
    expect(head.type).toBe('head');
    expect(Children.count(head.props.children)).toBe(0);
  });
});
