import { useQuery } from '@tanstack/react-query';
import { aboutApi } from '@/lib/api';
import { useTranslation } from 'react-i18next';

export const useAboutGeneral = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['about', 'general', i18n.language],
    queryFn: () => aboutApi.getGeneral(i18n.language),
  });
};

export const useAboutItems = (kind: 'distribution' | 'certificate' | 'license') => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['about', 'items', kind, i18n.language],
    queryFn: () => aboutApi.getItems(kind, i18n.language),
  });
};