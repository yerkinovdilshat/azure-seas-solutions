import { useQuery } from '@tanstack/react-query';
import { aboutApi } from '@/lib/api';
import { useTranslation } from 'react-i18next';

// Interfaces for type safety
export interface StoryData {
  id: string;
  title: string;
  body_rich: any;
  hero_image?: string;
}

export interface ValueItem {
  id: string;
  title: string;
  description: string;
  icon_key?: string;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  image_url?: string;
  bio?: string;
}

export interface Partner {
  id: string;
  name: string;
  logo_url?: string;
  website_url?: string;
  description?: string;
}

export interface AboutItem {
  id: string;
  title: string;
  description?: string;
  pdf_url?: string;
  image_url?: string;
  kind: 'distribution' | 'certificate' | 'license';
}

// General about data hooks
export const useAboutStory = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['about', 'story', i18n.language],
    queryFn: async (): Promise<StoryData> => {
      try {
        const data = await aboutApi.getGeneral(i18n.language);
        return (data as any)?.story || { id: '', title: '', body_rich: null };
      } catch (error) {
        return { id: '', title: '', body_rich: null };
      }
    },
  });
};

export const useAboutValues = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['about', 'values', i18n.language],
    queryFn: async (): Promise<ValueItem[]> => {
      try {
        const data = await aboutApi.getGeneral(i18n.language);
        return (data as any)?.values || [];
      } catch (error) {
        return [];
      }
    },
  });
};

export const useAboutTimeline = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['about', 'timeline', i18n.language],
    queryFn: async (): Promise<TimelineItem[]> => {
      try {
        const data = await aboutApi.getGeneral(i18n.language);
        return (data as any)?.timeline || [];
      } catch (error) {
        return [];
      }
    },
  });
};

export const useAboutTeam = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['about', 'team', i18n.language],
    queryFn: async (): Promise<TeamMember[]> => {
      try {
        const data = await aboutApi.getGeneral(i18n.language);
        return (data as any)?.team || [];
      } catch (error) {
        return [];
      }
    },
  });
};

export const useAboutPartners = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['about', 'partners', i18n.language],
    queryFn: async (): Promise<Partner[]> => {
      try {
        const data = await aboutApi.getGeneral(i18n.language);
        return (data as any)?.partners || [];
      } catch (error) {
        return [];
      }
    },
  });
};

export const useAboutItems = (kind: 'distribution' | 'certificate' | 'license') => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['about', 'items', kind, i18n.language],
    queryFn: async (): Promise<AboutItem[]> => {
      try {
        const items = await aboutApi.getItems(kind, i18n.language);
        return (items as AboutItem[]) || [];
      } catch (error) {
        return [];
      }
    },
  });
};

export const useAboutCertificates = () => useAboutItems('certificate');
export const useAboutDistribution = () => useAboutItems('distribution');
export const useAboutLicenses = () => useAboutItems('license');

export const useAboutCompliance = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['about', 'compliance', i18n.language],
    queryFn: async () => {
      try {
        const data = await aboutApi.getGeneral(i18n.language);
        return (data as any)?.compliance || [];
      } catch (error) {
        return [];
      }
    },
  });
};