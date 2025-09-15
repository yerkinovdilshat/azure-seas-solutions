import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

// Simple content hook that returns preview mode state - migrated from Supabase
export const useContent = () => {
  return {
    isPreview: false, // No preview mode in new implementation
  };
};

export const usePreviewMode = () => {
  return false; // No preview mode in new implementation
};