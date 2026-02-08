import { getLocales } from 'expo-localization';
import * as SecureStore from 'expo-secure-store';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const initI18n = async () => {
  // Try to get saved language from SecureStore first
  const savedLanguage = await SecureStore.getItemAsync('selectedLanguage');

  // Use saved language or fallback to device language
  const initialLanguage = savedLanguage || getLocales()[0].languageCode || 'en';

  await i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: require('../locales/en.json') },
        de: { translation: require('../locales/de.json') },
      },
      lng: initialLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });

  return i18n;
};

// Initialize i18n synchronously for now, but we'll update it later
const i18nInstance = i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: require('../locales/en.json') },
      de: { translation: require('../locales/de.json') },
    },
    lng: 'en', // Temporary, will be updated
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Export function to update language after loading from SecureStore
export const updateLanguageFromSecureStore = async () => {
  const savedLanguage = await SecureStore.getItemAsync('selectedLanguage');
  if (savedLanguage && i18n.language !== savedLanguage) {
    await i18n.changeLanguage(savedLanguage);
  }
};

export default i18n;
