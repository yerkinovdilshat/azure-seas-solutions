import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

interface ProjectItem {
  id: string;
  title: string;
  description?: string;
  slug: string;
  featured_image?: string;
  gallery_images?: string[];
  video_url?: string;
  content_rich?: any;
  client_name?: string;
  project_location?: string;
  project_status: string;
  project_date?: string;
  is_featured: boolean;
  locale: string;
  status: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

interface ProjectFilters {
  search?: string;
  year?: string;
  status?: string;
  location?: string;
}

export const useProjectsData = (filters: ProjectFilters = {}) => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['projects', 'list', { ...filters, locale: i18n.language }],
    queryFn: async (): Promise<{
      data: ProjectItem[];
      loading: boolean;
      error: string | null;
      totalCount: number;
    }> => {
      // For now, return empty data until projects API is implemented
      return {
        data: [],
        loading: false,
        error: null,
        totalCount: 0
      };
    },
  });
};

export const useProjectYears = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['projects', 'years', i18n.language],
    queryFn: async (): Promise<{ years: string[]; loading: boolean }> => {
      // For now, return empty years until projects API is implemented
      return {
        years: [],
        loading: false
      };
    },
  });
};