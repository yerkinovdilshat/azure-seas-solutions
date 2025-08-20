import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { usePreviewMode } from '@/hooks/useContent';

// Hook for fetching featured/latest content with fallback logic
const useFeaturedContent = <T>(
  table: string,
  limit: number,
  filters: Record<string, any> = {}
) => {
  const { i18n } = useTranslation();
  const preview = usePreviewMode();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);

      try {
        // First get featured items
        let featuredQuery = (supabase as any)
          .from(table)
          .select('*')
          .eq('locale', i18n.language)
          .eq('is_featured', true);

        // Add additional filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            featuredQuery = featuredQuery.eq(key, value);
          }
        });

        // Add status filter unless preview mode
        if (!preview) {
          featuredQuery = featuredQuery.eq('status', 'published');
        }

        featuredQuery = featuredQuery.order('order', { ascending: true })
                                   .order('created_at', { ascending: false });

        const { data: featuredData, error: featuredError } = await featuredQuery;

        if (featuredError) throw featuredError;

        let finalData = featuredData || [];

        // If we need more items, get latest non-featured ones
        if (finalData.length < limit) {
          const remainingCount = limit - finalData.length;
          const featuredIds = finalData.map((item: any) => item.id);

          let latestQuery = (supabase as any)
            .from(table)
            .select('*')
            .eq('locale', i18n.language);

          // Exclude already featured items
          if (featuredIds.length > 0) {
            latestQuery = latestQuery.not('id', 'in', `(${featuredIds.join(',')})`);
          }

          // Add additional filters
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              latestQuery = latestQuery.eq(key, value);
            }
          });

          // Add status filter unless preview mode
          if (!preview) {
            latestQuery = latestQuery.eq('status', 'published');
          }

          latestQuery = latestQuery.order('published_at', { ascending: false })
                                  .order('created_at', { ascending: false })
                                  .limit(remainingCount);

          const { data: latestData, error: latestError } = await latestQuery;

          if (latestError) throw latestError;

          finalData = [...finalData, ...(latestData || [])];
        }

        // Ensure we don't exceed the limit
        finalData = finalData.slice(0, limit);

        setData(finalData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [table, limit, i18n.language, preview, JSON.stringify(filters)]);

  return { data, loading, error };
};

// Specific hooks for home page sections
export const useFeaturedCatalogProducts = () => {
  return useFeaturedContent('catalog_products', 6);
};

export const useFeaturedServices = () => {
  return useFeaturedContent('services', 3);
};

export const useLatestProjects = () => {
  return useFeaturedContent('projects', 3);
};

export const useLatestNews = () => {
  return useFeaturedContent('news', 3);
};

// Hook for advantages (could be from settings or a dedicated table)
export const useAdvantages = () => {
  const { i18n } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvantages = async () => {
      setLoading(true);
      setError(null);

      try {
        // Try to fetch from a hypothetical advantages table first
        // If it doesn't exist, we'll use fallback data
        const { data: advantagesData, error: advantagesError } = await (supabase as any)
          .from('site_advantages')
          .select('*')
          .eq('locale', i18n.language)
          .order('order', { ascending: true });

        if (advantagesError && !advantagesError.message.includes('does not exist')) {
          throw advantagesError;
        }

        if (advantagesData && advantagesData.length > 0) {
          setData(advantagesData);
        } else {
          // Fallback to hardcoded advantages with i18n keys
          const fallbackAdvantages = [
            {
              id: '1',
              icon: 'Shield',
              title_key: 'advantages.reliability.title',
              description_key: 'advantages.reliability.description'
            },
            {
              id: '2',
              icon: 'Clock',
              title_key: 'advantages.efficiency.title',
              description_key: 'advantages.efficiency.description'
            },
            {
              id: '3',
              icon: 'Users',
              title_key: 'advantages.expertise.title',
              description_key: 'advantages.expertise.description'
            },
            {
              id: '4',
              icon: 'Award',
              title_key: 'advantages.quality.title',
              description_key: 'advantages.quality.description'
            }
          ];
          setData(fallbackAdvantages);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch advantages');
        // Set fallback data even on error
        const fallbackAdvantages = [
          {
            id: '1',
            icon: 'Shield',
            title_key: 'advantages.reliability.title',
            description_key: 'advantages.reliability.description'
          },
          {
            id: '2',
            icon: 'Clock',
            title_key: 'advantages.efficiency.title',
            description_key: 'advantages.efficiency.description'
          },
          {
            id: '3',
            icon: 'Users',
            title_key: 'advantages.expertise.title',
            description_key: 'advantages.expertise.description'
          },
          {
            id: '4',
            icon: 'Award',
            title_key: 'advantages.quality.title',
            description_key: 'advantages.quality.description'
          }
        ];
        setData(fallbackAdvantages);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvantages();
  }, [i18n.language]);

  return { data, loading, error };
};