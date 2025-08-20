import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

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
  const [data, setData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';

  const page = filters.page || 1;
  const perPage = filters.perPage || 12;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('news')
          .select('*', { count: 'exact' })
          .eq('locale', i18n.language)
          .order('is_featured', { ascending: false })
          .order('published_at', { ascending: false })
          .range(from, to);

        if (!isPreview) {
          query = query.eq('status', 'published');
        }

        // Apply filters
        if (filters.search) {
          query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`);
        }

        if (filters.year) {
          const startDate = `${filters.year}-01-01`;
          const endDate = `${filters.year}-12-31`;
          query = query.gte('published_at', startDate).lte('published_at', endDate);
        }

        const { data: result, error: queryError, count } = await query;

        if (queryError) throw queryError;

        // Fallback to default locale if no results
        if ((!result || result.length === 0) && i18n.language !== 'en') {
          let fallbackQuery = supabase
            .from('news')
            .select('*', { count: 'exact' })
            .eq('locale', 'en')
            .order('is_featured', { ascending: false })
            .order('published_at', { ascending: false })
            .range(from, to);

          if (!isPreview) {
            fallbackQuery = fallbackQuery.eq('status', 'published');
          }

          // Apply same filters
          if (filters.search) {
            fallbackQuery = fallbackQuery.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`);
          }
          if (filters.year) {
            const startDate = `${filters.year}-01-01`;
            const endDate = `${filters.year}-12-31`;
            fallbackQuery = fallbackQuery.gte('published_at', startDate).lte('published_at', endDate);
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
  }, [i18n.language, isPreview, from, to, filters.search, filters.year]);

  const totalPages = Math.ceil(totalCount / perPage);

  return { 
    data, 
    loading, 
    error, 
    totalCount, 
    currentPage: page,
    totalPages,
    perPage
  };
};

export const useNewsYears = () => {
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchYears = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('news')
          .select('published_at')
          .eq('locale', i18n.language)
          .eq('status', 'published')
          .not('published_at', 'is', null);

        if (error) throw error;

        const uniqueYears = [...new Set(
          data?.map(item => new Date(item.published_at).getFullYear().toString()).filter(Boolean) || []
        )].sort((a, b) => b.localeCompare(a)); // Sort descending

        setYears(uniqueYears);
      } catch (err) {
        console.error('Error fetching news years:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, [i18n.language]);

  return { years, loading };
};