// Upload helper for file operations with REST API
import { uploadApi } from '@/lib/api';

export const uploadFile = async (file: File): Promise<{ url: string; filename: string }> => {
  // TODO: Implement file upload with REST API
  return { url: '', filename: file.name };
};

export const uploadFiles = async (files: File[]): Promise<{ url: string; filename: string }[]> => {
  // TODO: Implement multiple file upload with REST API
  return files.map(file => ({ url: '', filename: file.name }));
};