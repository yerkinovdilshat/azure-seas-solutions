import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, ExternalLink, X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { AboutItem, useAboutItems, AboutItemKind } from '@/hooks/useAboutItems';

interface ItemsGridProps {
  kind: AboutItemKind;
}

const ItemsGrid = ({ kind }: ItemsGridProps) => {
  const { data: items, loading, getLocalizedField } = useAboutItems(kind);
  const [imagePreview, setImagePreview] = useState<{ url: string; index: number } | null>(null);
  const [pdfViewer, setPdfViewer] = useState<string | null>(null);
  const [imageZoom, setImageZoom] = useState(1);
  const { t } = useTranslation();

  const openImagePreview = (url: string, index: number) => {
    setImagePreview({ url, index });
    setImageZoom(1);
  };

  const openPdfViewer = (pdfUrl: string) => {
    const viewerUrl = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(pdfUrl)}`;
    setPdfViewer(viewerUrl);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!imagePreview) return;
    
    const newIndex = direction === 'prev' 
      ? (imagePreview.index - 1 + items.length) % items.length
      : (imagePreview.index + 1) % items.length;
    
    const newItem = items[newIndex];
    if (newItem?.image_url) {
      setImagePreview({ url: newItem.image_url, index: newIndex });
      setImageZoom(1);
    }
  };

  const handleZoom = (factor: number) => {
    setImageZoom(prev => Math.max(0.5, Math.min(3, prev * factor)));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-[4/3] bg-muted" />
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded w-full mb-2" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>{t('common.noData')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {item.image_url && (
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={item.image_url}
                  alt={getLocalizedField(item, 'title')}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => openImagePreview(item.image_url!, index)}
                />
              </div>
            )}
            <CardHeader className="pb-3">
              <CardTitle className="text-lg line-clamp-2">
                {getLocalizedField(item, 'title')}
              </CardTitle>
              {kind !== 'distribution' && getLocalizedField(item, 'issuer') && (
                <p className="text-sm text-muted-foreground">
                  {t(`about.${kind}s.issuedBy`)}: {getLocalizedField(item, 'issuer')}
                </p>
              )}
              {item.date && (
                <p className="text-sm text-muted-foreground">
                  {new Date(item.date).toLocaleDateString()}
                </p>
              )}
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              {getLocalizedField(item, 'description') && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {getLocalizedField(item, 'description')}
                </p>
              )}
              <div className="flex gap-2">
                {item.image_url && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openImagePreview(item.image_url!, index)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                )}
                {item.pdf_url && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openPdfViewer(item.pdf_url!)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View PDF
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Image Preview Modal */}
      {imagePreview && (
        <Dialog open={!!imagePreview} onOpenChange={() => setImagePreview(null)}>
          <DialogContent className="max-w-6xl h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>Image Preview</span>
                <div className="flex items-center gap-2">
                  {items.length > 1 && (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => navigateImage('prev')}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        {imagePreview.index + 1} / {items.length}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => navigateImage('next')}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleZoom(1.2)}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleZoom(0.8)}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setImagePreview(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto flex items-center justify-center">
              <img
                src={imagePreview.url}
                alt="Preview"
                className="max-w-none transition-transform"
                style={{ transform: `scale(${imageZoom})` }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* PDF Viewer Modal */}
      {pdfViewer && (
        <Dialog open={!!pdfViewer} onOpenChange={() => setPdfViewer(null)}>
          <DialogContent className="max-w-6xl h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                PDF Viewer
                <Button variant="ghost" size="sm" onClick={() => setPdfViewer(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            <iframe
              src={pdfViewer}
              className="w-full flex-1 border-0"
              title="PDF Viewer"
              onError={() => {
                // Fallback to opening in new tab
                setPdfViewer(null);
                const originalUrl = decodeURIComponent(pdfViewer.split('&url=')[1]);
                window.open(originalUrl, '_blank');
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ItemsGrid;