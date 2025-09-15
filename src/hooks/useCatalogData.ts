import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

interface CatalogItem {
  id: string;
  title: string;
  description?: string;
  slug: string;
  featured_image?: string;
  manufacturer?: string;
  sku?: string;
  category_id?: string;
  specifications?: any;
  pdf_files?: string[];
  gallery_images?: string[];
  content_rich?: any;
  is_featured: boolean;
  is_ctkz?: boolean;
  locale: string;
  status: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

interface CatalogFilters {
  search?: string;
  category?: string;
  manufacturer?: string;
  type?: 'production' | 'supply';
  is_ctkz?: boolean;
}

export const useCatalogData = (filters: CatalogFilters = {}) => {
  const [data, setData] = useState<CatalogItem[]>([]);
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

        // Build query conditions object to avoid complex type chaining
        const conditions: any = {
          locale: i18n.language
        };

        if (!isPreview) {
          conditions.status = 'published';
        }

        if (filters.manufacturer) {
          conditions.manufacturer = filters.manufacturer;
        }

        // Handle type filters
        if (filters.type === 'production') {
          conditions.is_ctkz = true;
        } else if (filters.type === 'supply') {
          conditions.is_ctkz = false;
        }

        if (filters.is_ctkz !== undefined) {
          conditions.is_ctkz = filters.is_ctkz;
        }

        // Build the query
        let query = supabase
          .from('catalog_products')
          .select('*', { count: 'exact' })
          .match(conditions)
          .order('is_featured', { ascending: false })
          .order('published_at', { ascending: false });

        // Apply search filter separately to avoid type issues
        if (filters.search) {
          query = query.ilike('title', `%${filters.search}%`);
        }

        const { data: result, error: queryError, count } = await query;

        if (queryError) throw queryError;

        // Fallback to default locale if no results
        if ((!result || result.length === 0) && i18n.language !== 'en') {
          const fallbackConditions: any = {
            locale: 'en'
          };

          if (!isPreview) {
            fallbackConditions.status = 'published';
          }

          if (filters.manufacturer) {
            fallbackConditions.manufacturer = filters.manufacturer;
          }

          if (filters.type === 'production') {
            fallbackConditions.is_ctkz = true;
          } else if (filters.type === 'supply') {
            fallbackConditions.is_ctkz = false;
          }

          if (filters.is_ctkz !== undefined) {
            fallbackConditions.is_ctkz = filters.is_ctkz;
          }

          let fallbackQuery = supabase
            .from('catalog_products')
            .select('*', { count: 'exact' })
            .match(fallbackConditions)
            .order('is_featured', { ascending: false })
            .order('published_at', { ascending: false });

          if (filters.search) {
            fallbackQuery = fallbackQuery.ilike('title', `%${filters.search}%`);
          }

          const { data: fallbackData, error: fallbackError, count: fallbackCount } = await fallbackQuery;
          if (fallbackError) throw fallbackError;
          setData(fallbackData || []);
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
  }, [i18n.language, isPreview, filters.search, filters.manufacturer, filters.type, filters.is_ctkz]);

  return { data, loading, error, totalCount };
};

export const useCatalogManufacturers = () => {
  const [manufacturers, setManufacturers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('catalog_products')
          .select('manufacturer')
          .eq('locale', i18n.language)
          .eq('status', 'published')
          .not('manufacturer', 'is', null);

        if (error) throw error;

        const uniqueManufacturers = [...new Set(
          data?.map(item => item.manufacturer).filter(Boolean) || []
        )].sort();

        setManufacturers(uniqueManufacturers as string[]);
      } catch (err) {
        console.error('Error fetching manufacturers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchManufacturers();
  }, [i18n.language]);

  return { manufacturers, loading };
};