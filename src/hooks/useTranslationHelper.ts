import { useTranslation } from 'react-i18next';

interface TranslationHelperResult {
  t: (key: string, fallback?: string) => string;
  tSafe: (key: string, fallback: string) => string;
  showFallbackIndicator: boolean;
  isUsingFallback: (key: string) => boolean;
}

export const useTranslationHelper = (): TranslationHelperResult => {
  const { t: originalT, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const isDefaultLanguage = currentLanguage === 'en';

  const t = (key: string, fallback?: string): string => {
    try {
      const translation = originalT(key);
      
      // If translation returns the key itself, it means translation is missing
      if (translation === key) {
        if (fallback) {
          return fallback;
        }
        
        // Try to get English translation if current language is not English
        if (!isDefaultLanguage) {
          const englishTranslation = originalT(key, { lng: 'en' });
          if (englishTranslation !== key) {
            return englishTranslation;
          }
        }
        
        // As last resort, return a human-readable version of the key
        const humanReadable = key.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || 'Missing translation';
        return humanReadable.charAt(0).toUpperCase() + humanReadable.slice(1);
      }
      
      return translation;
    } catch (error) {
      console.warn(`Translation error for key "${key}":`, error);
      const humanReadable = fallback || key.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || 'Missing translation';
      return humanReadable.charAt(0).toUpperCase() + humanReadable.slice(1);
    }
  };

  const tSafe = (key: string, fallback: string): string => {
    return t(key, fallback);
  };

  // Check if current translation exists
  const showFallbackIndicator = (key: string): boolean => {
    if (isDefaultLanguage) return false;
    
    try {
      const currentTranslation = originalT(key);
      const englishTranslation = originalT(key, { lng: 'en' });
      
      // Show indicator if we're using fallback (current returns key but English has translation)
      return currentTranslation === key && englishTranslation !== key;
    } catch {
      return false;
    }
  };

  const isUsingFallback = (key: string): boolean => {
    return showFallbackIndicator(key);
  };

  return { 
    t, 
    tSafe, 
    showFallbackIndicator: !isDefaultLanguage,
    isUsingFallback
  };
};