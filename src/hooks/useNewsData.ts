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
  const perPage = filters.perPage || 12;
  return {
    data: [] as NewsItem[],
    totalCount: 0,
    currentPage: filters.page || 1,
    totalPages: 0,
    perPage,
    loading: false,
    error: null as string | null,
  };
};

export const useNewsYears = () => {
  const { i18n } = useTranslation();
  return { years: [] as string[], loading: false };
};