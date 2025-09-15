import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsApi } from '@/lib/api';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const useContactInfo = () => {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['contacts', 'info', i18n.language],
    queryFn: () => contactsApi.getContactInfo(i18n.language),
  });
};

export const useSubmitContactForm = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: contactsApi.submitForm,
    onSuccess: () => {
      toast.success('Your message has been sent successfully!');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send message. Please try again.');
    },
  });
};