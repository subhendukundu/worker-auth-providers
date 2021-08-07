import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './locales'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  SUPPORTED_LANGUAGES,
  extractLocaleFromPath,
} from './locales'

// This is a dynamic import so not all languages are bundled in frontend.
// For YAML format, install `@rollup/plugin-yaml`.
const messageImports = import.meta.glob('./translations/*.json')

function importLocale(locale: string) {
  const [, importLocale] =
    Object.entries(messageImports).find(([key]) =>
      key.includes(`/${locale}.`)
    ) || []

  return importLocale && importLocale()
}

export async function loadAsyncLanguage(i18n: any, locale = DEFAULT_LOCALE) {
  try {
    const result = await importLocale(locale)
    if (result) {
      i18n.addResourceBundle(locale, 'translation', result.default || result)
      i18n.changeLanguage(locale)
    }
  } catch (error) {
    console.error(error)
  }
}

export async function installI18n(locale = '') {
  locale = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE
  const messages = await importLocale(locale)

  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      // debug: true,
      resources: {
        // @ts-ignore
        [locale]: { translation: messages.default || messages },
      },
      lng: locale,
      fallbackLng: DEFAULT_LOCALE,
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    })
}

export default i18n
