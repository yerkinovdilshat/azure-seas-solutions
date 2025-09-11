import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCatalogData } from '@/hooks/useCatalogData';
import { CatalogCard } from '@/components/catalog/CatalogCard';
import { Package, Search } from 'lucide-react';

const Catalog = () => {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 8;

  // Get all products without filtering
  const { data: allProducts, loading, error } = useCatalogData({});

  // Filter products locally for search
  const filteredProducts = allProducts.filter(product => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      product.title?.toLowerCase().includes(search) ||
      product.description?.toLowerCase().includes(search) ||
      product.manufacturer?.toLowerCase().includes(search)
    );
  });

  // Calculate pagination
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading) {
    return (
      <Layout>
        <SEO 
          title={t('seo.catalog.title')}
          description={t('seo.catalog.description')}
          canonical="/catalog"
        />
        
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Skeleton className="h-12 w-1/2 mx-auto mb-8" />
              <div className="mb-8">
                <Skeleton className="h-12 w-full max-w-md mx-auto" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
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
        title={t('seo.catalog.title')}
        description={t('seo.catalog.description')}
        canonical="/catalog"
      />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary text-center">
              {t('navigation.catalog')}
            </h1>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
              {t('catalog.subtitle')}
            </p>
            
            {/* Simple Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder={t('catalog.searchPlaceholder')}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                )}
              </div>
            </div>

            {error ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">{t('common.error')}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-muted-foreground">
                    {t('catalog.showingResults', { count: totalProducts })}
                  </p>
                  {totalPages > 1 && (
                    <p className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </p>
                  )}
                </div>

                {currentProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{t('catalog.noProducts')}</h3>
                    {searchTerm ? (
                      <>
                        <p className="text-muted-foreground mb-6">
                          No products found for "{searchTerm}"
                        </p>
                        <Button onClick={clearSearch} variant="outline">
                          Clear Search
                        </Button>
                      </>
                    ) : (
                      <p className="text-muted-foreground">{t('catalog.noProductsDescription')}</p>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                      {currentProducts.map((product) => (
                        <CatalogCard key={product.id} product={product} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        
                        <div className="flex space-x-1">
                          {[...Array(totalPages)].map((_, index) => {
                            const page = index + 1;
                            const isCurrentPage = page === currentPage;
                            
                            // Show first, last, current, and adjacent pages
                            if (
                              page === 1 || 
                              page === totalPages || 
                              Math.abs(page - currentPage) <= 1
                            ) {
                              return (
                                <Button
                                  key={page}
                                  variant={isCurrentPage ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setCurrentPage(page)}
                                  className="w-10 h-10"
                                >
                                  {page}
                                </Button>
                              );
                            }
                            
                            // Show ellipsis for gaps
                            if (page === currentPage - 2 || page === currentPage + 2) {
                              return <span key={page} className="px-2">...</span>;
                            }
                            
                            return null;
                          })}
                        </div>
                        
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            
            {i18n.language !== 'en' && currentProducts.length > 0 && (
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