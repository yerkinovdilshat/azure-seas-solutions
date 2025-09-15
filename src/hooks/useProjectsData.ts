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
  return {
    data: [] as ProjectItem[],
    loading: false,
    error: null as string | null,
    totalCount: 0,
  };
};

export const useProjectYears = () => {
  const { i18n } = useTranslation();
  return { years: [] as string[], loading: false };
};