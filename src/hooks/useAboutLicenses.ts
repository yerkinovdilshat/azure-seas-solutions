// Legacy about items hooks - now redirected to unified AboutItems API
import { useQuery } from '@tanstack/react-query';
import { aboutApi } from '@/lib/api';
import { useTranslation } from 'react-i18next';

export const useAboutLicenses = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['about', 'items', 'license', i18n.language],
    queryFn: () => aboutApi.getItems('license', i18n.language),
  });
};