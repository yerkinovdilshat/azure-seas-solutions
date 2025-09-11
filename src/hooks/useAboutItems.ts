import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export type AboutItemKind = 'distribution' | 'certificate' | 'license';

export interface AboutItem {
  id: string;
  kind: AboutItemKind;
  title_ru?: string;
  title_kz?: string;
  title_en?: string;
  description_ru?: string;
  description_kz?: string;
  description_en?: string;
  issuer_ru?: string;
  issuer_kz?: string;
  issuer_en?: string;
  date?: string;
  image_url?: string;
  pdf_url?: string;
  is_published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export const useAboutItems = (kind: AboutItemKind) => {
  const [data, setData] = useState<AboutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    fetchItems();
  }, [kind]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: items, error: queryError } = await supabase
        .from('about_items')
        .select('*')
        .eq('kind', kind)
        .eq('is_published', true)
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });

      if (queryError) {
        throw queryError;
      }

      setData(items || []);
    } catch (err) {
      console.error(`Error fetching ${kind} items:`, err);
      setError(err instanceof Error ? err.message : `Failed to fetch ${kind} items`);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedField = (item: AboutItem, field: 'title' | 'description' | 'issuer'): string => {
    const locale = i18n.language;
    const fieldKey = `${field}_${locale}` as keyof AboutItem;
    
    return (item[fieldKey] as string) || 
           (item[`${field}_en`] as string) || 
           '';
  };

  const refetch = () => {
    fetchItems();
  };

  return {
    data,
    loading,
    error,
    getLocalizedField,
    refetch
  };
};