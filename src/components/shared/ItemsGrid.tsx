import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAboutItems } from '@/hooks/useAboutData';

interface ItemsGridProps {
  kind: 'distribution' | 'certificate' | 'license';
}

const ItemsGrid: React.FC<ItemsGridProps> = ({ kind }) => {
  const { data: items, isLoading: loading } = useAboutItems(kind);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="p-6">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No {kind}s available
        </h3>
        <p className="text-muted-foreground">
          {kind === 'distribution' && 'No distribution items have been added yet.'}
          {kind === 'certificate' && 'No certificates have been added yet.'}
          {kind === 'license' && 'No licenses have been added yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item: any) => (
        <Card key={item.id} className="card-modern">
          <CardHeader>
            <CardTitle className="text-lg">{item.title || 'Untitled'}</CardTitle>
          </CardHeader>
          <CardContent>
            {item.description && (
              <p className="text-muted-foreground mb-4 text-sm">
                {item.description}
              </p>
            )}
            {item.pdf_url && (
              <Button variant="outline" className="w-full" asChild>
                <a 
                  href={item.pdf_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  View Document
                  <ExternalLink className="h-4 w-4" />
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