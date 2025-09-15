import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Package } from 'lucide-react';
import { useFeaturedCatalogProducts } from '@/hooks/useHomeData';

const ProductCategoriesSection: React.FC = () => {
  const { t } = useTranslation();
  const { data: products, isLoading: loading, error } = useFeaturedCatalogProducts();

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !products || products.length === 0) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t('catalog.title')}
          </h2>
          <p className="text-muted-foreground mb-8">
            {t('common.noData')}
          </p>
          <Link to="/catalog">
            <Button className="btn-primary">
              {t('catalog.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t('catalog.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('catalog.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product: any) => (
            <Card 
              key={product.id} 
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                {product.featured_image ? (
                  <img
                    src={product.featured_image}
                    alt={product.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-muted/50 flex items-center justify-center">
                    <Package className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {product.is_featured && (
                    <Badge variant="default" className="bg-primary text-primary-foreground">
                      {t('common.featured')}
                    </Badge>
                  )}
                  {product.is_ctkz && (
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      CT-KZ
                    </Badge>
                  )}
                </div>
              </div>

              <CardHeader className="pb-2">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {product.title}
                </h3>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  {product.manufacturer && (
                    <span className="text-xs text-muted-foreground">
                      {product.manufacturer}
                    </span>
                  )}
                  
                  <Link to={`/catalog/${product.slug}`}>
                    <Button variant="outline" size="sm" className="group/btn">
                      {t('common.viewDetails')}
                      <ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/catalog">
            <Button size="lg" className="btn-primary">
              {t('catalog.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductCategoriesSection;