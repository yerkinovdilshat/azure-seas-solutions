import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

interface ContentResolverResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  isTranslationFallback: boolean;
  translationNote?: string;
}

/**
 * Universal content resolver with proper slug+locale handling and fallbacks
 * 1. Try exact match: slug + current locale + published status
 * 2. If not found, try default locale (en) + published status  
 * 3. If still not found, return proper 404
 */
export const useContentResolver = <T>(
  tableName: string,
  slug: string,
  options: {
    fallbackToDefaultLocale?: boolean;
    requirePublished?: boolean;
  } = {}
): ContentResolverResult<T> => {
  const { i18n } = useTranslation();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTranslationFallback, setIsTranslationFallback] = useState(false);
  const [translationNote, setTranslationNote] = useState<string | undefined>();

  const {
    fallbackToDefaultLocale = true,
    requirePublished = true
  } = options;

  useEffect(() => {
    const fetchContent = async () => {
      if (!slug) {
        setError('No slug provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setIsTranslationFallback(false);
      setTranslationNote(undefined);

      try {
        // Step 1: Try exact match with current locale
        let query = (supabase as any)
          .from(tableName)
          .select('*')
          .eq('slug', slug)
          .eq('locale', i18n.language);

        if (requirePublished) {
          query = query.eq('status', 'published');
        }

        const { data: result, error: queryError } = await query.maybeSingle();

        if (queryError) {
          throw queryError;
        }

        if (result) {
          setData(result as T);
          setLoading(false);
          return;
        }

        // Step 2: Try fallback to default locale if enabled and not already using it
        if (fallbackToDefaultLocale && i18n.language !== 'en') {
          let fallbackQuery = (supabase as any)
            .from(tableName)
            .select('*')
            .eq('slug', slug)
            .eq('locale', 'en');

          if (requirePublished) {
            fallbackQuery = fallbackQuery.eq('status', 'published');
          }

          const { data: fallbackResult, error: fallbackError } = await fallbackQuery.maybeSingle();

          if (fallbackError) {
            throw fallbackError;
          }

          if (fallbackResult) {
            setData(fallbackResult as T);
            setIsTranslationFallback(true);
            setTranslationNote('Translation coming soon');
            setLoading(false);
            return;
          }
        }

        // Step 3: Content not found in any locale
        setData(null);
        setError('Content not found');
      } catch (err: any) {
        console.error(`Error fetching ${tableName} with slug "${slug}":`, err);
        setError(err.message || 'Failed to fetch content');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [tableName, slug, i18n.language, fallbackToDefaultLocale, requirePublished]);

  return { 
    data, 
    loading, 
    error, 
    isTranslationFallback, 
    translationNote 
  };
};