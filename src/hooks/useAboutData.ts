// Updated useAboutData with REST API instead of direct Supabase calls
import { useQuery } from '@tanstack/react-query';
import { aboutApi } from '@/lib/api';
import { useTranslation } from 'react-i18next';

// General about data for story, values, timeline, team, partners
export const useAboutStory = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['about', 'story', i18n.language],
    queryFn: () => aboutApi.getGeneral(i18n.language),
  });
};

export const useAboutValues = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['about', 'values', i18n.language],
    queryFn: () => aboutApi.getGeneral(i18n.language),
  });
};

export const useAboutTimeline = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['about', 'timeline', i18n.language],
    queryFn: () => aboutApi.getGeneral(i18n.language),
  });
};

export const useAboutTeam = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['about', 'team', i18n.language],
    queryFn: () => aboutApi.getGeneral(i18n.language),
  });
};

export const useAboutPartners = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['about', 'partners', i18n.language],
    queryFn: () => aboutApi.getGeneral(i18n.language),
  });
};

export const useAboutCertificates = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['about', 'items', 'certificate', i18n.language],
    queryFn: () => aboutApi.getItems('certificate', i18n.language),
  });
};

export const useAboutCompliance = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['about', 'compliance', i18n.language],
    queryFn: () => aboutApi.getGeneral(i18n.language),
  });
};