import { getLocales } from 'expo-localization';
import * as SecureStore from 'expo-secure-store';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Initialize i18n synchronously with fallback language
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: require('../locales/en.json') },
      de: { translation: require('../locales/de.json') },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Function to update language after loading from SecureStore
export const updateLanguageFromSecureStore = async () => {
  try {
    const savedLanguage = await SecureStore.getItemAsync('selectedLanguage');
    if (savedLanguage && i18n.language !== savedLanguage) {
      await i18n.changeLanguage(savedLanguage);
    } else if (!savedLanguage) {
      // Set device language if no saved language
      const deviceLanguage = getLocales()[0].languageCode || 'en';
      await i18n.changeLanguage(deviceLanguage);
    }
  } catch (error) {
    console.warn('Failed to load language from SecureStore:', error);
  }
};

export default i18n;
