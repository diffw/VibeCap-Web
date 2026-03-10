import { createElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const getMessagesMock = vi.fn();
const setRequestLocaleMock = vi.fn();
const notFoundMock = vi.fn(() => {
  throw new Error('NOT_FOUND');
});

vi.mock('next-intl/server', () => ({
  getMessages: getMessagesMock,
  setRequestLocale: setRequestLocaleMock,
}));

vi.mock('next/navigation', () => ({
  notFound: notFoundMock,
}));

vi.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children, messages }: { children: unknown; messages: unknown }) =>
    createElement('intl-provider', { messages }, children),
}));

describe('LocaleLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns intl provider when locale is valid', async () => {
    getMessagesMock.mockResolvedValue({ title: 'ok' });
    const { default: LocaleLayout } = await import('./layout');

    const result = await LocaleLayout({
      children: createElement('div', null, 'child'),
      params: Promise.resolve({ locale: 'en' }),
    });

    expect(setRequestLocaleMock).toHaveBeenCalledWith('en');
    expect(getMessagesMock).toHaveBeenCalledWith({ locale: 'en' });
    expect(typeof result.type).toBe('function');
    expect(result.props.messages).toEqual({ title: 'ok' });
  });

  it('throws not found when locale is invalid', async () => {
    const { default: LocaleLayout } = await import('./layout');

    await expect(
      LocaleLayout({
        children: createElement('div', null, 'child'),
        params: Promise.resolve({ locale: 'fr' }),
      }),
    ).rejects.toThrow('NOT_FOUND');

    expect(notFoundMock).toHaveBeenCalled();
    expect(setRequestLocaleMock).not.toHaveBeenCalled();
  });
});
