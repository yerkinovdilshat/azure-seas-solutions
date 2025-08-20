import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CatalogBadge from './CatalogBadge';

interface CatalogItem {
  id: string;
  title: string;
  description?: string;
  slug: string;
  featured_image?: string;
  manufacturer?: string;
  type?: 'production' | 'supply';
  is_featured: boolean;
  is_ctkz?: boolean;
}

interface CatalogCardProps {
  product: CatalogItem;
}

export const CatalogCard: React.FC<CatalogCardProps> = ({ product }) => {
  const { t } = useTranslation();

  return (
    <Link to={`/catalog/${product.slug}`} className="block group">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group-hover:scale-[1.02] transition-transform duration-200">
        <CardHeader className="p-0">
          {product.featured_image ? (
            <picture>
              <img 
                src={product.featured_image} 
                alt={product.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
            </picture>
          ) : (
            <div className="w-full h-48 bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">{t('common.noImage')}</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-semibold line-clamp-2 flex-1 mr-2 group-hover:text-primary transition-colors">{product.title}</h3>
            <CatalogBadge isCtKz={product.is_ctkz} />
          </div>
          {product.manufacturer && (
            <p className="text-sm text-muted-foreground mb-2">
              {t('catalog.manufacturer')}: {product.manufacturer}
            </p>
          )}
          {product.description && (
            <p className="text-muted-foreground mb-4 line-clamp-3">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {product.is_featured && (
                <Badge variant="secondary">
                  {t('common.featured')}
                </Badge>
              )}
              <Badge variant="outline">
                {product.type === 'production' ? t('catalog.production') : t('catalog.supply')}
              </Badge>
            </div>
            <span className="text-primary group-hover:text-primary/80 font-medium transition-colors">
              {t('common.viewDetails')} →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};