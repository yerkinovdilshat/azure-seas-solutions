import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useContentResolver } from './useContentResolver';

// Types for content items
export type ServiceItem = {
  id: string;
  locale: string;
  title: string;
  slug: string;
  description: string;
  content_rich: any;
  featured_image: string;
  gallery_images: string[];
  icon_key: string;
  status: string;
  is_featured: boolean;
  order: number;
};

export type ProjectItem = {
  id: string;
  locale: string;
  title: string;
  slug: string;
  description: string;
  content_rich: any;
  featured_image: string;
  gallery_images: string[];
  video_url: string;
  client_name: string;
  project_location: string;
  project_date: string;
  project_status: string;
  status: string;
  is_featured: boolean;
  order: number;
};

export type NewsItem = {
  id: string;
  locale: string;
  title: string;
  slug: string;
  excerpt: string;
  content_rich: any;
  featured_image: string;
  gallery_images: string[];
  video_url: string;
  published_at: string;
  status: string;
  is_featured: boolean;
  order: number;
};

export type CatalogItem = {
  id: string;
  locale: string;
  title: string;
  slug: string;
  description: string;
  content_rich: any;
  featured_image: string;
  gallery_images: string[];
  specifications: any;
  pdf_files: string[];
  sku: string;
  manufacturer: string;
  category_id: string;
  status: string;
  is_featured: boolean;
  order: number;
};

// Check if we're in preview mode
export const usePreviewMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('preview') === '1';
};

// Generic content fetcher for single items
const useContentItem = <T>(
  tableName: string,
  slug: string
) => {
  const { i18n } = useTranslation();
  const preview = usePreviewMode();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = (supabase as any)
          .from(tableName)
          .select('*')
          .eq('locale', i18n.language)
          .eq('slug', slug);

        // Add status filter unless preview mode
        if (!preview) {
          query = query.eq('status', 'published');
        }

        const { data: result, error } = await query.maybeSingle();

        if (error) throw error;

        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, slug, i18n.language, preview]);

  return { data, loading, error };
};

// Generic content fetcher for lists
const useContentList = <T>(
  tableName: string,
  filters: Record<string, any> = {}
) => {
  const { i18n } = useTranslation();
  const preview = usePreviewMode();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = (supabase as any)
          .from(tableName)
          .select('*')
          .eq('locale', i18n.language);

        // Add additional filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });

        // Add status filter unless preview mode
        if (!preview) {
          query = query.eq('status', 'published');
        }

        // Order by order field, then by created_at
        query = query.order('order', { ascending: true })
                    .order('created_at', { ascending: false });

        const { data: result, error } = await query;

        if (error) throw error;

        setData(result || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, i18n.language, preview, JSON.stringify(filters)]);

  return { data, loading, error };
};

// Specific hooks for each content type - single items
export const useService = (slug: string) => {
  return useContentResolver<ServiceItem>('services', slug);
};

export const useProject = (slug: string) => {
  return useContentResolver<ProjectItem>('projects', slug);
};

export const useNewsArticle = (slug: string) => {
  return useContentResolver<NewsItem>('news', slug);
};

export const useCatalogProduct = (slug: string) => {
  return useContentResolver<CatalogItem>('catalog_products', slug);
};

// Specific hooks for content lists
export const useServices = () => {
  return useContentList<ServiceItem>('services');
};

export const useProjects = () => {
  return useContentList<ProjectItem>('projects');
};

export const useNews = () => {
  return useContentList<NewsItem>('news');
};

export const useCatalogProducts = (categoryFilter?: string) => {
  const filters = categoryFilter ? { category_type: categoryFilter } : {};
  return useContentList<CatalogItem>('catalog_products', filters);
};

// Hook for about content
export const useAboutContent = (section: string) => {
  return useContentList<any>(`about_${section}`);
};

// Hook for contacts
export const useContacts = () => {
  return useContentItem<any>('contacts', 'default');
};