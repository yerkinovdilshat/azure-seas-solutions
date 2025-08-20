import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

interface AboutStory {
  id: string;
  title: string;
  body_rich: any;
  hero_image?: string;
}

interface AboutValue {
  id: string;
  title: string;
  description?: string;
  icon_key?: string;
  order: number;
}

interface AboutTimelineItem {
  id: string;
  title: string;
  description?: string;
  year: number;
  image?: string;
  order: number;
}

interface AboutTeamMember {
  id: string;
  name: string;
  role?: string;
  bio?: string;
  photo?: string;
  order: number;
}

interface AboutPartner {
  id: string;
  name: string;
  logo?: string;
  website_url?: string;
  order: number;
}

interface AboutCertificate {
  id: string;
  title: string;
  issuer?: string;
  date?: string;
  file_url?: string;
  image_url?: string;
  order: number;
}

interface AboutCompliance {
  id: string;
  title: string;
  badge_icon?: string;
  link_url?: string;
  order: number;
}

export const useAboutStory = () => {
  const [data, setData] = useState<AboutStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('about_story')
          .select('*')
          .eq('locale', i18n.language);

        if (!isPreview) {
          query = query.eq('status', 'published');
        }

        const { data: result, error: queryError } = await query.maybeSingle();

        if (queryError) throw queryError;

        // Fallback to default locale if not found
        if (!result && i18n.language !== 'en') {
          let fallbackQuery = supabase
            .from('about_story')
            .select('*')
            .eq('locale', 'en');

          if (!isPreview) {
            fallbackQuery = fallbackQuery.eq('status', 'published');
          }

          const { data: fallbackResult, error: fallbackError } = await fallbackQuery.maybeSingle();
          if (fallbackError) throw fallbackError;
          setData(fallbackResult);
        } else {
          setData(result);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language, isPreview]);

  return { data, loading, error };
};

export const useAboutValues = () => {
  const [data, setData] = useState<AboutValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('about_values')
          .select('*')
          .eq('locale', i18n.language)
          .order('order')
          .order('created_at');

        if (!isPreview) {
          query = query.eq('status', 'published');
        }

        const { data: result, error: queryError } = await query;

        if (queryError) throw queryError;

        // Fallback to default locale if no results
        if ((!result || result.length === 0) && i18n.language !== 'en') {
          let fallbackQuery = supabase
            .from('about_values')
            .select('*')
            .eq('locale', 'en')
            .order('order')
            .order('created_at');

          if (!isPreview) {
            fallbackQuery = fallbackQuery.eq('status', 'published');
          }

          const { data: fallbackResult, error: fallbackError } = await fallbackQuery;
          if (fallbackError) throw fallbackError;
          setData(fallbackResult || []);
        } else {
          setData(result || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language, isPreview]);

  return { data, loading, error };
};

export const useAboutTimeline = () => {
  const [data, setData] = useState<AboutTimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('about_timeline')
          .select('*')
          .eq('locale', i18n.language)
          .order('year', { ascending: false });

        if (!isPreview) {
          query = query.eq('status', 'published');
        }

        const { data: result, error: queryError } = await query;

        if (queryError) throw queryError;

        if ((!result || result.length === 0) && i18n.language !== 'en') {
          let fallbackQuery = supabase
            .from('about_timeline')
            .select('*')
            .eq('locale', 'en')
            .order('year', { ascending: false });

          if (!isPreview) {
            fallbackQuery = fallbackQuery.eq('status', 'published');
          }

          const { data: fallbackResult, error: fallbackError } = await fallbackQuery;
          if (fallbackError) throw fallbackError;
          setData(fallbackResult || []);
        } else {
          setData(result || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language, isPreview]);

  return { data, loading, error };
};

export const useAboutTeam = () => {
  const [data, setData] = useState<AboutTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('about_team')
          .select('*')
          .eq('locale', i18n.language)
          .order('order')
          .order('name');

        if (!isPreview) {
          query = query.eq('status', 'published');
        }

        const { data: result, error: queryError } = await query;

        if (queryError) throw queryError;

        if ((!result || result.length === 0) && i18n.language !== 'en') {
          let fallbackQuery = supabase
            .from('about_team')
            .select('*')
            .eq('locale', 'en')
            .order('order')
            .order('name');

          if (!isPreview) {
            fallbackQuery = fallbackQuery.eq('status', 'published');
          }

          const { data: fallbackResult, error: fallbackError } = await fallbackQuery;
          if (fallbackError) throw fallbackError;
          setData(fallbackResult || []);
        } else {
          setData(result || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language, isPreview]);

  return { data, loading, error };
};

export const useAboutPartners = () => {
  const [data, setData] = useState<AboutPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('about_partners')
          .select('*')
          .order('order')
          .order('name');

        if (!isPreview) {
          query = query.eq('status', 'published');
        }

        const { data: result, error: queryError } = await query;

        if (queryError) throw queryError;
        setData(result || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isPreview]);

  return { data, loading, error };
};

export const useAboutCertificates = () => {
  const [data, setData] = useState<AboutCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('about_certificates')
          .select('*')
          .eq('locale', i18n.language)
          .order('order')
          .order('date', { ascending: false });

        if (!isPreview) {
          query = query.eq('status', 'published');
        }

        const { data: result, error: queryError } = await query;

        if (queryError) throw queryError;

        if ((!result || result.length === 0) && i18n.language !== 'en') {
          let fallbackQuery = supabase
            .from('about_certificates')
            .select('*')
            .eq('locale', 'en')
            .order('order')
            .order('date', { ascending: false });

          if (!isPreview) {
            fallbackQuery = fallbackQuery.eq('status', 'published');
          }

          const { data: fallbackResult, error: fallbackError } = await fallbackQuery;
          if (fallbackError) throw fallbackError;
          setData(fallbackResult || []);
        } else {
          setData(result || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language, isPreview]);

  return { data, loading, error };
};

export const useAboutCompliance = () => {
  const [data, setData] = useState<AboutCompliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('about_compliance')
          .select('*')
          .eq('locale', i18n.language)
          .order('order')
          .order('created_at');

        if (!isPreview) {
          query = query.eq('status', 'published');
        }

        const { data: result, error: queryError } = await query;

        if (queryError) throw queryError;

        if ((!result || result.length === 0) && i18n.language !== 'en') {
          let fallbackQuery = supabase
            .from('about_compliance')
            .select('*')
            .eq('locale', 'en')
            .order('order')
            .order('created_at');

          if (!isPreview) {
            fallbackQuery = fallbackQuery.eq('status', 'published');
          }

          const { data: fallbackResult, error: fallbackError } = await fallbackQuery;
          if (fallbackError) throw fallbackError;
          setData(fallbackResult || []);
        } else {
          setData(result || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language, isPreview]);

  return { data, loading, error };
};