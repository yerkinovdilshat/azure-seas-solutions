import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';

export const useAdminAboutItems = (params: { 
  kind?: string; 
  search?: string; 
  page?: number; 
  pageSize?: number;
} = {}) => {
  return useQuery({
    queryKey: ['admin', 'about', 'items', params],
    queryFn: () => adminApi.aboutItems.list(params),
  });
};

export const useCreateAboutItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: adminApi.aboutItems.create,
    onSuccess: () => {
      toast.success('Item created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'about', 'items'] });
      queryClient.invalidateQueries({ queryKey: ['about'] });
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
      adminApi.aboutItems.update(id, data),
    onSuccess: () => {
      toast.success('Item updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'about', 'items'] });
      queryClient.invalidateQueries({ queryKey: ['about'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update item');
    },
  });
};

export const useDeleteAboutItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: adminApi.aboutItems.delete,
    onSuccess: () => {
      toast.success('Item deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'about', 'items'] });
      queryClient.invalidateQueries({ queryKey: ['about'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete item');
    },
  });
};

export const useReorderAboutItems = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: adminApi.aboutItems.reorder,
    onSuccess: () => {
      toast.success('Items reordered successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'about', 'items'] });
      queryClient.invalidateQueries({ queryKey: ['about'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reorder items');
    },
  });
};

export const useAdminSection = (section: string, locale = 'en') => {
  return useQuery({
    queryKey: ['admin', 'about', section, locale],
    queryFn: () => adminApi.getSection(section, locale),
    enabled: !!section,
  });
};