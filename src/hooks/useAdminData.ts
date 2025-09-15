import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const useAdminAboutItems = (params?: { 
  kind?: string; 
  search?: string; 
  page?: number; 
  pageSize?: number; 
}) => {
  return useQuery({
    queryKey: ['admin', 'about', 'items', params],
    queryFn: () => adminApi.getAboutItems(params),
  });
};

export const useCreateAboutItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: adminApi.createAboutItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'about', 'items'] });
      queryClient.invalidateQueries({ queryKey: ['about'] });
      toast.success('Item created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create item');
    },
  });
};

export const useUpdateAboutItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      adminApi.updateAboutItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'about', 'items'] });
      queryClient.invalidateQueries({ queryKey: ['about'] });
      toast.success('Item updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update item');
    },
  });
};

export const useDeleteAboutItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: adminApi.deleteAboutItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'about', 'items'] });
      queryClient.invalidateQueries({ queryKey: ['about'] });
      toast.success('Item deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete item');
    },
  });
};

export const useReorderAboutItems = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: adminApi.reorderAboutItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'about', 'items'] });
      queryClient.invalidateQueries({ queryKey: ['about'] });
      toast.success('Items reordered successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reorder items');
    },
  });
};

export const useAdminSection = (section: string, locale?: string) => {
  return useQuery({
    queryKey: ['admin', 'section', section, locale],
    queryFn: () => adminApi.getAdminSection(section, locale),
    enabled: !!section,
  });
};