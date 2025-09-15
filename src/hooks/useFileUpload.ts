import { useMutation } from '@tanstack/react-query';
import { uploadApi } from '@/lib/api';
import { toast } from 'sonner';

export const useFileUpload = () => {
  return useMutation({
    mutationFn: uploadApi.uploadFile,
    onSuccess: (data) => {
      toast.success('File uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload file');
    },
  });
};

export const useMultiFileUpload = () => {
  return useMutation({
    mutationFn: uploadApi.uploadFiles,
    onSuccess: (data) => {
      toast.success('Files uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload files');
    },
  });
};