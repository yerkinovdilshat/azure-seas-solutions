import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

interface ServiceItem {
  id: string;
  title: string;
  description?: string;
  slug: string;
  featured_image?: string;
  gallery_images?: string[];
  content_rich?: any;
  icon_key?: string;
  is_featured: boolean;
  locale: string;
  status: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

interface ServiceFilters {
  search?: string;
  page?: number;
  perPage?: number;
}

export const useFeaturedServices = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['services', 'featured', i18n.language],
    queryFn: async () => {
      // For now, return empty array until services API is implemented
      return [];
    },
  });
};

export const useServicesData = (filters: ServiceFilters = {}) => {
  const { i18n } = useTranslation();
  const perPage = filters.perPage || 12;
  return {
    services: [] as ServiceItem[],
    loading: false,
    error: null as string | null,
    totalCount: 0,
    currentPage: filters.page || 1,
    totalPages: 0,
    perPage
  };
};