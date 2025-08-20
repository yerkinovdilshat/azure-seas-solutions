import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCatalogData, useCatalogManufacturers } from '@/hooks/useCatalogData';
import { Search, Filter, Package, ExternalLink } from 'lucide-react';

const Catalog = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { manufacturers } = useCatalogManufacturers();

  // Get filter type from URL path
  const getTypeFromPath = () => {
    if (location.pathname.includes('/production')) return 'production';
    if (location.pathname.includes('/supply')) return 'supply';
    return undefined;
  };

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    manufacturer: searchParams.get('manufacturer') || '',
    type: getTypeFromPath() as 'production' | 'supply' | undefined,
    is_ctkz: searchParams.get('is_ctkz') === 'true' ? true : undefined
  });

  const { data: products, loading, error, totalCount } = useCatalogData(filters);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.manufacturer) params.set('manufacturer', filters.manufacturer);
    if (filters.is_ctkz !== undefined) params.set('is_ctkz', filters.is_ctkz.toString());
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      manufacturer: '',
      type: getTypeFromPath() as 'production' | 'supply' | undefined,
      is_ctkz: undefined
    });
  };

  const getPageTitle = () => {
    if (location.pathname.includes('/production')) return t('catalog.production');
    if (location.pathname.includes('/supply')) return t('catalog.supply');
    return t('navigation.catalog');
  };

  const getPageDescription = () => {
    if (location.pathname.includes('/production')) return t('catalog.productionDescription');
    if (location.pathname.includes('/supply')) return t('catalog.supplyDescription');
    return t('seo.catalog.description');
  };

  if (loading) {
    return (
      <Layout>
        <SEO 
          title={t('seo.catalog.title')}
          description={getPageDescription()}
          canonical={location.pathname}
        />
        
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Skeleton className="h-12 w-1/2 mx-auto mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-card p-6 rounded-xl shadow-sm">
                    <Skeleton className="h-48 w-full mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title={getPageTitle()}
        description={getPageDescription()}
        canonical={location.pathname}
      />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary text-center">
              {getPageTitle()}
            </h1>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
              {getPageDescription()}
            </p>
            
            {/* Filters */}
            <div className="bg-card p-6 rounded-xl shadow-sm mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={t('catalog.searchPlaceholder')}
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select
                  value={filters.manufacturer}
                  onValueChange={(value) => handleFilterChange('manufacturer', value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('catalog.allManufacturers')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('catalog.allManufacturers')}</SelectItem>
                    {manufacturers.map(manufacturer => (
                      <SelectItem key={manufacturer} value={manufacturer}>
                        {manufacturer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.is_ctkz === undefined ? 'all' : filters.is_ctkz.toString()}
                  onValueChange={(value) => handleFilterChange('is_ctkz', value === 'all' ? undefined : value === 'true')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('catalog.allTypes')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('catalog.allTypes')}</SelectItem>
                    <SelectItem value="true">{t('catalog.production')}</SelectItem>
                    <SelectItem value="false">{t('catalog.supply')}</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={clearFilters}>
                  <Filter className="h-4 w-4 mr-2" />
                  {t('common.clearFilters')}
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {t('catalog.showingResults', { count: totalCount })}
              </div>
            </div>

            {error && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t('common.error')}</p>
              </div>
            )}

            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/catalog/${product.slug}`}
                    className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                  >
                    {product.featured_image ? (
                      <img
                        src={product.featured_image}
                        alt={product.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    ) : (
                      <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center mb-4">
                        <Package className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {product.title}
                      </h3>
                      {product.is_ctkz && (
                        <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
                          CT-KZ
                        </Badge>
                      )}
                    </div>
                    
                    {product.manufacturer && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {product.manufacturer}
                      </p>
                    )}
                    
                    {product.description && (
                      <p className="text-muted-foreground line-clamp-3 mb-4">
                        {product.description}
                      </p>
                    )}
                    
                    <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                      {t('common.viewDetails')}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : !loading && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('catalog.noProducts')}</h3>
                <p className="text-muted-foreground mb-6">{t('catalog.noProductsDescription')}</p>
                <Button onClick={clearFilters} variant="outline">
                  {t('common.clearFilters')}
                </Button>
              </div>
            )}
            
            {i18n.language !== 'en' && products && products.length > 0 && (
              <p className="text-xs text-muted-foreground text-center mt-8 italic">
                {t('common.translationNote')}
              </p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Catalog;