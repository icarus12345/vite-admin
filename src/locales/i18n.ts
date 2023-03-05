import { createI18n } from 'vue-i18n'
import messages from './lang';
import type { LocaleKey } from './lang';

export const i18n = createI18n({
  locale: 'en',
  messages
});

export function t(key: string) {
  return i18n.global.t(key);
}

export function setLocale(locale: LocaleKey) {
  i18n.global.locale = locale;
}