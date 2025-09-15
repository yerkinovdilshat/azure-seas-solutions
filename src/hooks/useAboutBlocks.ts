import { useQuery } from '@tanstack/react-query';
import { aboutApi } from '@/lib/api';
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
  const { i18n } = useTranslation();
  
  const { data, isLoading: loading, error } = useQuery<AboutBlock[]>({
    queryKey: ['about', 'blocks', i18n.language],
    queryFn: async () => {
      const res: any = await aboutApi.getGeneral(i18n.language);
      // Accept both array or object with blocks
      return Array.isArray(res) ? res as AboutBlock[] : (res?.blocks as AboutBlock[] ?? []);
    },
  });

  const getBlock = (key: string): AboutBlock | null => {
    return data?.find((block: AboutBlock) => block.block_key === key) || null;
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
    data: (data as AboutBlock[]) || [],
    loading,
    error: (error as any)?.message || null,
    getBlock,
    getLocalizedContent
  };
};