import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/lib/api';
import { useTranslation } from 'react-i18next';

// Specific hooks for home page sections
export const useFeaturedCatalogProducts = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['catalog', 'featured', i18n.language],
    queryFn: async () => {
      try {
        const result = await catalogApi.getProducts({ 
          page: 1, 
          pageSize: 6, 
          locale: i18n.language
        });
        return result.products || [];
      } catch (error) {
        return [];
      }
    },
  });
};

export const useFeaturedServices = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['services', 'featured', i18n.language],
    queryFn: async () => {
      // For now, return empty array until services API is implemented
      return [];
    },
  });
};

export const useLatestProjects = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['projects', 'latest', i18n.language],
    queryFn: async () => {
      // For now, return empty array until projects API is implemented
      return [];
    },
  });
};

export const useLatestNews = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['news', 'latest', i18n.language],
    queryFn: async () => {
      // For now, return empty array until news API is implemented
      return [];
    },
  });
};

// Hook for advantages (hardcoded for now)
export const useAdvantages = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['advantages', i18n.language],
    queryFn: async () => {
      const fallbackAdvantages = [
        {
          id: '1',
          icon: 'Shield',
          title_key: 'advantages.reliability.title',
          description_key: 'advantages.reliability.description'
        },
        {
          id: '2',
          icon: 'Clock',
          title_key: 'advantages.efficiency.title',
          description_key: 'advantages.efficiency.description'
        },
        {
          id: '3',
          icon: 'Users',
          title_key: 'advantages.expertise.title',
          description_key: 'advantages.expertise.description'
        },
        {
          id: '4',
          icon: 'Award',
          title_key: 'advantages.quality.title',
          description_key: 'advantages.quality.description'
        }
      ];
      return fallbackAdvantages;
    },
  });
};