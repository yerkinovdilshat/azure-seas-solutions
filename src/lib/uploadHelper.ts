import { supabase } from '@/integrations/supabase/client';

export interface SaveWithUploadOptions {
  table: 'about_team' | 'about_partners' | 'about_certificates' | 'about_timeline' | 'about_values';
  data: any;
  file?: File;
  bucket?: 'images' | 'docs';
  folder?: string;
  urlField: 'photo' | 'logo' | 'image_url' | 'file_url' | 'image';
}

/**
 * Unified helper function to upload a file and save data atomically
 * @param options Configuration for upload and save operation
 * @returns Promise that resolves to the saved data
 */
export const saveWithUpload = async (options: SaveWithUploadOptions) => {
  const { table, data, file, bucket = 'images', folder = '', urlField } = options;
  
  console.log('🚀 saveWithUpload called with:', {
    table,
    hasFile: !!file,
    bucket,
    folder,
    urlField,
    currentData: data
  });

  try {
    // Step 1: Upload file if provided and URL not already set
    if (file && !data[urlField]) {
      console.log('📤 Starting file upload...');
      
      // Generate unique file path
      const fileExt = file.name.split('.').pop() || '';
      const fileName = `${crypto.randomUUID()}_${file.name}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;
      
      console.log('📂 Upload path:', filePath);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('✅ File uploaded successfully:', uploadData);

      // Get public URL - use the returned path from upload
      const actualPath = uploadData?.path || filePath;
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(actualPath);

      if (!urlData.publicUrl) {
        console.error('❌ Failed to get public URL for path:', actualPath);
        throw new Error('Failed to get public URL after upload');
      }

      console.log('🔗 Public URL generated:', urlData.publicUrl);

      // Update data with the public URL
      data[urlField] = urlData.publicUrl;
    }

    // Step 2: Upsert data to database
    console.log('💾 Saving to database with payload:', data);

    const { data: savedData, error: dbError } = await supabase
      .from(table)
      .upsert(data, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database error:', dbError);
      throw new Error(`Database save failed: ${dbError.message}`);
    }

    console.log('✅ Data saved successfully:', savedData);
    return savedData;

  } catch (error) {
    console.error('❌ saveWithUpload failed:', error);
    throw error;
  }
};