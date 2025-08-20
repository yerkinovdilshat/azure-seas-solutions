import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useCatalogData, useCatalogManufacturers } from '@/hooks/useCatalogData';
import { CatalogCard } from '@/components/catalog/CatalogCard';
import { CatalogFilters } from '@/components/catalog/CatalogFilters';
import { Package } from 'lucide-react';

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
            <CatalogFilters
              filters={filters}
              manufacturers={manufacturers}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />

            {error && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t('common.error')}</p>
              </div>
            )}

            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <CatalogCard key={product.id} product={product} />
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