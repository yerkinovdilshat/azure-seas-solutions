import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/lib/api';
import { useTranslation } from 'react-i18next';

export const useCatalogProducts = (params: { page?: number; pageSize?: number } = {}) => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['catalog', 'products', { ...params, locale: i18n.language }],
    queryFn: () => catalogApi.getProducts({ ...params, locale: i18n.language }),
  });
};

export const useCatalogProduct = (slug: string) => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['catalog', 'product', slug, i18n.language],
    queryFn: () => catalogApi.getProduct(slug, i18n.language),
    enabled: !!slug,
  });
};