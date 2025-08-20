import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Upload, X, Image, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  bucket: 'images' | 'docs';
  folder?: string;
  accept?: string;
  allowedTypes?: string[];
  maxSize?: number;
  className?: string;
  placeholder?: string;
  maxImages?: number;
}

const MultiImageUpload = ({
  value = [],
  onChange,
  bucket,
  folder,
  accept = 'image/*',
  allowedTypes,
  maxSize = 10,
  className,
  placeholder = 'Upload images',
  maxImages = 10
}: MultiImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { uploadFile, deleteFile } = useFileUpload();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = maxImages - value.length;
    const filesToUpload = files.slice(0, remainingSlots);

    setUploading(true);
    const newUrls: string[] = [];

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      setProgress(((i + 1) / filesToUpload.length) * 100);

      const url = await uploadFile(file, {
        bucket,
        folder,
        allowedTypes,
        maxSize
      });

      if (url) {
        newUrls.push(url);
      }
    }

    onChange([...value, ...newUrls]);
    setUploading(false);
    setProgress(0);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = async (indexToRemove: number) => {
    const urlToRemove = value[indexToRemove];
    if (urlToRemove) {
      await deleteFile(urlToRemove, bucket);
      const newUrls = value.filter((_, index) => index !== indexToRemove);
      onChange(newUrls);
    }
  };

  const canAddMore = value.length < maxImages;

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading || !canAddMore}
        multiple
      />

      {/* Images Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square border border-border rounded-lg overflow-hidden bg-muted">
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(index)}
                disabled={uploading}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <Image className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {placeholder}
              {value.length > 0 && ` (${value.length}/${maxImages})`}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Plus className="h-4 w-4 mr-2" />
              {value.length > 0 ? 'Add More' : 'Select Images'}
            </Button>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading images...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-muted-foreground">
        You can upload up to {maxImages} images. Maximum file size: {maxSize}MB each.
      </p>
    </div>
  );
};

export default MultiImageUpload;