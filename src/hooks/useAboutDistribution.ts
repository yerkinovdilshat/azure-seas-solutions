// Legacy about items hooks - now redirected to unified AboutItems API
import { useQuery } from '@tanstack/react-query';
import { aboutApi } from '@/lib/api';
import { useTranslation } from 'react-i18next';

export const useAboutDistribution = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['about', 'items', 'distribution', i18n.language],
    queryFn: () => aboutApi.getItems('distribution', i18n.language),
  });
};