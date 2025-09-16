// Upload helper for file operations with REST API
import { uploadApi } from '@/lib/api';

export const uploadFile = async (file: File): Promise<{ url: string; filename: string }> => {
  return uploadApi.uploadFile(file);
};

export const uploadFiles = async (files: File[]): Promise<{ url: string; filename: string }[]> => {
  return uploadApi.uploadFiles(files);
};