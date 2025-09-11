import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export interface AboutDistribution {
  id: string;
  title_en?: string;
  title_ru?: string;
  title_kk?: string;
  description_en?: string;
  description_ru?: string;
  description_kk?: string;
  image_url?: string;
  file_url?: string;
  order_index?: number;
  status?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export const useAboutDistribution = () => {
  const [data, setData] = useState<AboutDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchDistribution = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: distribution, error: queryError } = await supabase
          .from('about_distribution')
          .select('*')
          .eq('status', 'published')
          .order('order_index', { ascending: true })
          .order('created_at', { ascending: false });

        if (queryError) {
          throw queryError;
        }

        setData(distribution || []);
      } catch (err) {
        console.error('Error fetching distribution:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch distribution');
      } finally {
        setLoading(false);
      }
    };

    fetchDistribution();
  }, []);

  const getLocalizedField = (item: AboutDistribution, field: 'title' | 'description'): string => {
    const locale = i18n.language;
    const fieldKey = `${field}_${locale}` as keyof AboutDistribution;
    
    return (item[fieldKey] as string) || 
           (item[`${field}_en`] as string) || 
           '';
  };

  return {
    data,
    loading,
    error,
    getLocalizedField
  };
};