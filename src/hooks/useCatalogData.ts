import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/lib/api';
import { useTranslation } from 'react-i18next';

interface CatalogItem {
  id: string;
  title: string;
  description?: string;
  slug: string;
  featured_image?: string;
  manufacturer?: string;
  sku?: string;
  category_id?: string;
  specifications?: any;
  pdf_files?: string[];
  gallery_images?: string[];
  content_rich?: any;
  is_featured: boolean;
  is_ctkz?: boolean;
  locale: string;
  status: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

interface CatalogFilters {
  search?: string;
  category?: string;
  manufacturer?: string;
  type?: 'production' | 'supply';
  is_ctkz?: boolean;
  page?: number;
  pageSize?: number;
}

export const useCatalogData = (filters: CatalogFilters = {}) => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['catalog', 'products', { ...filters, locale: i18n.language }],
    queryFn: async () => {
      const result: any = await catalogApi.getProducts({ 
        ...filters, 
        locale: i18n.language 
      });
      return {
        data: result?.products || [],
        totalCount: result?.pagination?.total || 0,
        loading: false,
        error: null
      };
    },
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

export const useCatalogManufacturers = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['catalog', 'manufacturers', i18n.language],
    queryFn: async () => {
      // For now, return empty array until manufacturers API is implemented
      return {
        manufacturers: [] as string[],
        loading: false
      };
    },
  });
};