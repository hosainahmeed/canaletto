import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const initI18n = i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: require('../locales/en.json') },
      de: { translation: require('../locales/de.json') },
    },
    lng: getLocales()[0].languageCode ?? 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
