import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SiteSettings {
  id?: string;
  hero_bg_url?: string;
  hero_overlay_opacity?: number;
  hero_min_height_vh?: number;
  hero_top_padding_px?: number;
  content_max_width_px?: number;
  hero_title_ru?: string;
  hero_subtitle_ru?: string;
  cta1_text_ru?: string;
  cta1_link?: string;
  cta2_text_ru?: string;
  cta2_link?: string;
  hero_title_en?: string;
  hero_subtitle_en?: string;
  cta1_text_en?: string;
  cta2_text_en?: string;
  hero_title_kk?: string;
  hero_subtitle_kk?: string;
  cta1_text_kk?: string;
  cta2_text_kk?: string;
  locale_default?: string;
  created_at?: string;
  updated_at?: string;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching site settings:', error);
        setError(error.message);
        return;
      }

      setSettings(data);
    } catch (err) {
      console.error('Error fetching site settings:', err);
      setError('Failed to fetch site settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      if (!settings?.id) {
        throw new Error('No settings found to update');
      }

      const { error } = await supabase
        .from('site_settings')
        .update(newSettings)
        .eq('id', settings.id);

      if (error) {
        throw error;
      }

      setSettings(prev => prev ? { ...prev, ...newSettings } : null);
      toast({
        title: "Settings updated",
        description: "Site settings have been successfully updated.",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error updating site settings:', error);
      toast({
        variant: "destructive",
        title: "Error updating settings",
        description: error.message || "Failed to update site settings",
      });
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    updateSettings,
    refetch: fetchSettings
  };
};