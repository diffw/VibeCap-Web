import type { Locale } from '@/i18n/config';

export const SITE_URL = 'https://vibecap.dev';
export const APP_STORE_URL = 'https://apps.apple.com/us/app/vibecap/id6758246419?mt=12';
export const CONTACT_EMAIL = 'vibecap.dev@gmail.com';

export function localizedPath(locale: Locale, slug?: string) {
  if (!slug) {
    return `/${locale}`;
  }

  return `/${locale}/${slug}`;
}
