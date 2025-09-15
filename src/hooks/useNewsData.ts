import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

interface NewsItem {
  id: string;
  title: string;
  excerpt?: string;
  slug: string;
  featured_image?: string;
  gallery_images?: string[];
  video_url?: string;
  content_rich?: any;
  is_featured: boolean;
  locale: string;
  status: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

interface NewsFilters {
  search?: string;
  year?: string;
  page?: number;
  perPage?: number;
}

export const useNewsData = (filters: NewsFilters = {}) => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['news', 'list', { ...filters, locale: i18n.language }],
    queryFn: async (): Promise<{
      data: NewsItem[];
      totalCount: number;
      currentPage: number;
      totalPages: number;
      perPage: number;
      loading: boolean;
      error: string | null;
    }> => {
      // For now, return empty data until news API is implemented
      const perPage = filters.perPage || 12;
      return {
        data: [],
        totalCount: 0,
        currentPage: filters.page || 1,
        totalPages: 0,
        perPage,
        loading: false,
        error: null
      };
    },
  });
};

export const useNewsYears = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['news', 'years', i18n.language],
    queryFn: async (): Promise<{ years: string[]; loading: boolean }> => {
      // For now, return empty years until news API is implemented
      return {
        years: [],
        loading: false
      };
    },
  });
};