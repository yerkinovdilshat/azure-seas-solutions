import { useTranslation } from 'react-i18next';

// Simple content resolver for localized content - migrated from Supabase
export const useContentResolver = () => {
  const { i18n } = useTranslation();
  
  const resolveContent = (content: any, field: string) => {
    if (!content) return '';
    
    const locale = i18n.language;
    const localizedField = `${field}_${locale}`;
    
    return content[localizedField] || content[`${field}_en`] || content[field] || '';
  };
  
  return { resolveContent };
};