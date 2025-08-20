import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

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
  const [data, setData] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('projects')
          .select('*', { count: 'exact' })
          .eq('locale', i18n.language)
          .order('is_featured', { ascending: false })
          .order('project_date', { ascending: false });

        if (!isPreview) {
          query = query.eq('status', 'published');
        }

        // Apply filters
        if (filters.search) {
          query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,client_name.ilike.%${filters.search}%`);
        }

        if (filters.year) {
          const startDate = `${filters.year}-01-01`;
          const endDate = `${filters.year}-12-31`;
          query = query.gte('project_date', startDate).lte('project_date', endDate);
        }

        if (filters.status) {
          query = query.eq('project_status', filters.status);
        }

        if (filters.location) {
          query = query.ilike('project_location', `%${filters.location}%`);
        }

        const { data: result, error: queryError, count } = await query;

        if (queryError) throw queryError;

        // Fallback to default locale if no results
        if ((!result || result.length === 0) && i18n.language !== 'en') {
          let fallbackQuery = supabase
            .from('projects')
            .select('*', { count: 'exact' })
            .eq('locale', 'en')
            .order('is_featured', { ascending: false })
            .order('project_date', { ascending: false });

          if (!isPreview) {
            fallbackQuery = fallbackQuery.eq('status', 'published');
          }

          // Apply same filters
          if (filters.search) {
            fallbackQuery = fallbackQuery.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,client_name.ilike.%${filters.search}%`);
          }
          if (filters.year) {
            const startDate = `${filters.year}-01-01`;
            const endDate = `${filters.year}-12-31`;
            fallbackQuery = fallbackQuery.gte('project_date', startDate).lte('project_date', endDate);
          }
          if (filters.status) {
            fallbackQuery = fallbackQuery.eq('project_status', filters.status);
          }
          if (filters.location) {
            fallbackQuery = fallbackQuery.ilike('project_location', `%${filters.location}%`);
          }

          const { data: fallbackResult, error: fallbackError, count: fallbackCount } = await fallbackQuery;
          if (fallbackError) throw fallbackError;
          setData(fallbackResult || []);
          setTotalCount(fallbackCount || 0);
        } else {
          setData(result || []);
          setTotalCount(count || 0);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language, isPreview, filters.search, filters.year, filters.status, filters.location]);

  return { data, loading, error, totalCount };
};

export const useProjectYears = () => {
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchYears = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('projects')
          .select('project_date')
          .eq('locale', i18n.language)
          .eq('status', 'published')
          .not('project_date', 'is', null);

        if (error) throw error;

        const uniqueYears = [...new Set(
          data?.map(item => new Date(item.project_date).getFullYear().toString()).filter(Boolean) || []
        )].sort((a, b) => b.localeCompare(a)); // Sort descending

        setYears(uniqueYears);
      } catch (err) {
        console.error('Error fetching project years:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, [i18n.language]);

  return { years, loading };
};