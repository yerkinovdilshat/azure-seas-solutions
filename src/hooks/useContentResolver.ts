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
 * 2. If not found, try any locale to verify slug exists (for proper 404)
 * 3. If found in another locale, try fallback to default locale
 * 4. If still not found, return proper 404
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
        if (process.env.NODE_ENV === 'development') {
          console.log(`[ContentResolver] Fetching from ${tableName} with slug: ${slug}, locale: ${i18n.language}`);
        }

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
          if (process.env.NODE_ENV === 'development') {
            console.log(`[ContentResolver] Found exact match:`, result);
          }
          setData(result as T);
          setLoading(false);
          return;
        }

        // Step 2: Check if slug exists in any locale (for proper 404 detection)
        let anyLocaleQuery = (supabase as any)
          .from(tableName)
          .select('locale')
          .eq('slug', slug);

        if (requirePublished) {
          anyLocaleQuery = anyLocaleQuery.eq('status', 'published');
        }

        const { data: anyLocaleResults, error: anyLocaleError } = await anyLocaleQuery;

        if (anyLocaleError) {
          throw anyLocaleError;
        }

        // If no results in any locale, this is a true 404
        if (!anyLocaleResults || anyLocaleResults.length === 0) {
          setData(null);
          setError('Content not found');
          setLoading(false);
          return;
        }

        // Step 3: Try fallback to default locale if enabled and slug exists
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
            if (process.env.NODE_ENV === 'development') {
              console.log(`[ContentResolver] Using fallback locale (en):`, fallbackResult);
            }
            setData(fallbackResult as T);
            setIsTranslationFallback(true);
            setTranslationNote('Translation coming soon');
            setLoading(false);
            return;
          }
        }

        // Step 4: Content exists but not in current or default locale
        setData(null);
        setError('Content not found in current language');
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