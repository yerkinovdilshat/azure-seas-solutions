import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export interface Service {
  id: string;
  locale: string;
  title: string;
  slug: string;
  description: string;
  content_rich: any;
  featured_image: string;
  gallery_images: string[];
  icon_key: string;
  status: 'draft' | 'published';
  is_featured: boolean;
  order: number;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export const useServicesData = (isPreview: boolean = false) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    fetchServices();
  }, [i18n.language, isPreview]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('services')
        .select('*')
        .eq('locale', i18n.language);

      // Only show published services in non-preview mode
      if (!isPreview) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query.order('order', { ascending: true });

      if (error) throw error;

      // If no services found in current language, try English as fallback
      if (!data || data.length === 0 && i18n.language !== 'en') {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('services')
          .select('*')
          .eq('locale', 'en')
          .eq('status', 'published')
          .order('order', { ascending: true });

        if (fallbackError) throw fallbackError;
        setServices((fallbackData || []).map(service => ({
          ...service,
          status: service.status as 'draft' | 'published'
        })));
      } else {
        setServices((data || []).map(service => ({
          ...service,
          status: service.status as 'draft' | 'published'
        })));
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    services,
    loading,
    error,
    refetch: fetchServices
  };
};

export const useFeaturedServices = (limit: number = 3) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    fetchFeaturedServices();
  }, [i18n.language, limit]);

  const fetchFeaturedServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('locale', i18n.language)
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('order', { ascending: true })
        .limit(limit);

      if (error) throw error;

      // If no featured services found in current language, try English as fallback
      if (!data || data.length === 0 && i18n.language !== 'en') {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('services')
          .select('*')
          .eq('locale', 'en')
          .eq('status', 'published')
          .eq('is_featured', true)
          .order('order', { ascending: true })
          .limit(limit);

        if (fallbackError) throw fallbackError;
        setServices((fallbackData || []).map(service => ({
          ...service,
          status: service.status as 'draft' | 'published'
        })));
      } else {
        setServices((data || []).map(service => ({
          ...service,
          status: service.status as 'draft' | 'published'
        })));
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching featured services:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    services,
    loading,
    error,
    refetch: fetchFeaturedServices
  };
};