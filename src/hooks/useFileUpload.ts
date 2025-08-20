import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UploadOptions {
  bucket: 'images' | 'docs';
  folder?: string;
  allowedTypes?: string[];
  maxSize?: number; // in MB
}

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const uploadFile = async (
    file: File,
    options: UploadOptions
  ): Promise<string | null> => {
    const { bucket, folder = '', allowedTypes, maxSize = 10 } = options;
    
    console.log('🔍 Upload attempt started:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      bucket,
      folder,
      allowedTypes,
      maxSize
    });
    
    // Validate file type
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      console.error('❌ File type validation failed:', file.type, 'not in', allowedTypes);
      toast({
        title: "Invalid file type",
        description: `Please upload files of type: ${allowedTypes.join(', ')}`,
        variant: "destructive",
      });
      return null;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      console.error('❌ File size validation failed:', file.size, 'exceeds', maxSize * 1024 * 1024);
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive",
      });
      return null;
    }

    console.log('✅ Validations passed, starting upload...');
    setUploading(true);
    setProgress(0);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;
      
      console.log('📂 Upload path:', filePath);

      // Upload file
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      console.log('📤 Upload result:', { error: uploadError, data: uploadData });

      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      console.log('🔗 Public URL generated:', data.publicUrl);

      setProgress(100);
      
      toast({
        title: "Upload successful",
        description: "File uploaded successfully",
      });

      return data.publicUrl;
    } catch (error: any) {
      console.error('❌ Upload failed with error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const deleteFile = async (url: string, bucket: 'images' | 'docs'): Promise<boolean> => {
    try {
      // Extract file path from URL
      const urlParts = url.split('/');
      const bucketIndex = urlParts.findIndex(part => part === bucket);
      if (bucketIndex === -1) return false;
      
      const filePath = urlParts.slice(bucketIndex + 1).join('/');

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Delete file error:', error);
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploading,
    progress
  };
};