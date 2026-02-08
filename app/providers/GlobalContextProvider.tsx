import i18n from '@/lib/i18n';
import * as SecureStore from 'expo-secure-store';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';

export type Language = 'en' | 'de'

interface GlobalContextType {
  selectedLanguage: Language;
  setSelectedLanguage: (lang: Language) => void;
  isLanguageLoaded: boolean;
}

interface GlobalProviderProps {
  children: ReactNode;
}
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const GlobalContextProvider = ({ children }: GlobalProviderProps) => {
  const [selectedLanguage, setSelectedLanguageState] = useState<Language>('en');
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);

  // Load language from SecureStore on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await SecureStore.getItemAsync('selectedLanguage');
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'de')) {
          setSelectedLanguageState(savedLanguage as Language);
          // Update i18n to match the saved language
          await i18n.changeLanguage(savedLanguage);
        } else {
          // If no saved language, use current i18n language or default to 'en'
          const currentLanguage = (i18n.language as Language) || 'en';
          setSelectedLanguageState(currentLanguage);
          // Save the current language to SecureStore
          await SecureStore.setItemAsync('selectedLanguage', currentLanguage);
        }
      } catch (error) {
        console.error('Error loading language from SecureStore:', error);
        // Fallback to current i18n language
        const currentLanguage = (i18n.language as Language) || 'en';
        setSelectedLanguageState(currentLanguage);
      } finally {
        setIsLanguageLoaded(true);
      }
    };

    loadLanguage();
  }, []);

  const setSelectedLanguage = async (lang: Language) => {
    try {
      // Update state
      setSelectedLanguageState(lang);

      // Save to SecureStore
      await SecureStore.setItemAsync('selectedLanguage', lang);

      // Update i18n
      await i18n.changeLanguage(lang);
    } catch (error) {
      console.error('Error saving language to SecureStore:', error);
      // Still update state and i18n even if SecureStore fails
      setSelectedLanguageState(lang);
      await i18n.changeLanguage(lang);
    }
  };

  const values = {
    selectedLanguage,
    setSelectedLanguage,
    isLanguageLoaded,
  };

  return (
    <GlobalContext.Provider value={values}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  return context;
};

export default GlobalContextProvider;
