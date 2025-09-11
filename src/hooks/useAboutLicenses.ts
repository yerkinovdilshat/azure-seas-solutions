import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export interface AboutLicense {
  id: string;
  title_en?: string;
  title_ru?: string;
  title_kk?: string;
  issuer_en?: string;
  issuer_ru?: string;
  issuer_kk?: string;
  description_en?: string;
  description_ru?: string;
  description_kk?: string;
  image_url?: string;
  file_url?: string;
  date?: string;
  order?: number;
  status?: string;
  published_at?: string;
}

export const useAboutLicenses = () => {
  const [data, setData] = useState<AboutLicense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: licenses, error: queryError } = await supabase
          .from('about_licenses')
          .select('*')
          .eq('status', 'published')
          .order('order', { ascending: true })
          .order('date', { ascending: false });

        if (queryError) {
          throw queryError;
        }

        setData(licenses || []);
      } catch (err) {
        console.error('Error fetching licenses:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch licenses');
      } finally {
        setLoading(false);
      }
    };

    fetchLicenses();
  }, []);

  const getLocalizedField = (license: AboutLicense, field: 'title' | 'issuer' | 'description'): string => {
    const locale = i18n.language;
    const fieldKey = `${field}_${locale}` as keyof AboutLicense;
    
    return (license[fieldKey] as string) || 
           (license[`${field}_en`] as string) || 
           '';
  };

  return {
    data,
    loading,
    error,
    getLocalizedField
  };
};