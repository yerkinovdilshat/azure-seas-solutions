import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Upload, X, Image, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
  bucket: 'images' | 'docs';
  folder?: string;
  accept?: string;
  allowedTypes?: string[];
  maxSize?: number;
  className?: string;
  placeholder?: string;
}

const FileUpload = ({
  value,
  onChange,
  bucket,
  folder,
  accept,
  allowedTypes,
  maxSize = 10,
  className,
  placeholder = 'Upload file'
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { uploadFile, deleteFile, uploading, progress } = useFileUpload();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('📸 FileUpload: File selected:', file.name, file.type, file.size);

    // Show preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        console.log('📸 FileUpload: Preview set');
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    console.log('📤 FileUpload: Starting upload...');
    const url = await uploadFile(file, {
      bucket,
      folder,
      allowedTypes,
      maxSize
    });

    console.log('📸 FileUpload: Upload result:', url);
    if (url) {
      console.log('✅ FileUpload: Calling onChange with URL:', url);
      onChange(url);
      setPreview(null); // Clear preview since we now have the actual URL
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    if (value) {
      await deleteFile(value, bucket);
      onChange(null);
      setPreview(null);
    }
  };

  const isImage = value && (value.includes('.jpg') || value.includes('.jpeg') || value.includes('.png') || value.includes('.gif') || value.includes('.webp'));
  const isPDF = value && value.includes('.pdf');

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {(value || preview) ? (
        <div className="space-y-2">
          {/* Preview */}
          <div className="border border-border rounded-lg p-4">
            {(isImage || preview) ? (
              <div className="flex flex-col items-center space-y-2">
                <img 
                  src={preview || value} 
                  alt="Preview" 
                  className="max-w-full max-h-48 object-contain rounded"
                  onError={(e) => {
                    console.error('❌ FileUpload: Image failed to load:', preview || value);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <p className="text-sm text-muted-foreground">
                  {preview ? 'Uploading...' : 'Image file'}
                </p>
              </div>
            ) : isPDF ? (
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">PDF Document</p>
                  <p className="text-xs text-muted-foreground">Click to view</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">File uploaded</p>
                  <p className="text-xs text-muted-foreground">{value.split('/').pop()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Replace
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              disabled={uploading}
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
            {(isImage || isPDF) && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(value, '_blank')}
              >
                View
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            {bucket === 'images' ? (
              <Image className="h-8 w-8 text-muted-foreground" />
            ) : (
              <FileText className="h-8 w-8 text-muted-foreground" />
            )}
            <p className="text-sm text-muted-foreground">{placeholder}</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Select File
            </Button>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}
    </div>
  );
};

export default FileUpload;