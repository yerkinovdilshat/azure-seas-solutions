import { uploadApi } from './api';

export const uploadFile = async (file: File): Promise<{ url: string; filename: string }> => {
  try {
    const result = await uploadApi.uploadFile(file) as { url: string; filename: string };
    return result;
  } catch (error) {
    console.error('File upload error:', error);
    return { url: '', filename: '' };
  }
};

export const uploadFiles = async (files: File[]): Promise<{ url: string; filename: string }[]> => {
  try {
    const result = await uploadApi.uploadFiles(files) as { url: string; filename: string }[];
    return result;
  } catch (error) {
    console.error('Multiple file upload error:', error);
    return [];
  }
};