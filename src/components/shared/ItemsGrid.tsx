import { useAboutItems } from '@/hooks/useAboutData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ItemsGridProps {
  kind: 'distribution' | 'certificate' | 'license';
}

const ItemsGrid = ({ kind }: ItemsGridProps) => {
  const { data: items, isLoading: loading } = useAboutItems(kind);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <Skeleton className="h-10 w-24" />
          </Card>
        ))}
      </div>
    );
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          {kind === 'distribution' && 'No distribution items available'}
          {kind === 'certificate' && 'No certificates available'}
          {kind === 'license' && 'No licenses available'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {(items as any[]).map((item: any) => (
        <Card key={item.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-primary" />
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {item.description && (
              <p className="text-muted-foreground text-sm">{item.description}</p>
            )}
            {item.file_url && (
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="w-full"
              >
                <a 
                  href={item.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Document
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ItemsGrid;