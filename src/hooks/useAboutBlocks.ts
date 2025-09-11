import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export interface AboutBlock {
  id: string;
  block_key: string;
  title_en?: string;
  title_ru?: string;
  title_kk?: string;
  content_en?: string;
  content_ru?: string;
  content_kk?: string;
  gallery_images?: string[];
  published_at?: string;
  updated_at?: string;
  status?: string;
}

export const useAboutBlocks = () => {
  const [data, setData] = useState<AboutBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: blocks, error: queryError } = await supabase
          .from('about_blocks')
          .select('*')
          .eq('status', 'published')
          .order('block_key');

        if (queryError) {
          throw queryError;
        }

        setData(blocks || []);
      } catch (err) {
        console.error('Error fetching about blocks:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch about blocks');
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, []);

  const getBlock = (key: string): AboutBlock | null => {
    return data.find(block => block.block_key === key) || null;
  };

  const getLocalizedContent = (block: AboutBlock | null, field: 'title' | 'content'): string => {
    if (!block) return '';
    
    const locale = i18n.language;
    const fieldKey = `${field}_${locale}` as keyof AboutBlock;
    
    return (block[fieldKey] as string) || 
           (block[`${field}_en`] as string) || 
           '';
  };

  return {
    data,
    loading,
    error,
    getBlock,
    getLocalizedContent
  };
};