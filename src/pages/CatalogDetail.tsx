import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { CustomBreadcrumb } from '@/components/ui/custom-breadcrumb';
import { useCatalogProduct } from '@/hooks/useContent';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const CatalogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { data: product, loading, error } = useCatalogProduct(slug!);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>{t('common.loading')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <SEO 
          title="Product Not Found"
          description="The requested product could not be found."
        />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t('common.error')}</h1>
            <p className="text-muted-foreground mb-4">
              {error || 'Product not found'}
            </p>
            <Link to="/catalog">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('common.back')}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title={product.title}
        description={product.description}
        ogImage={product.featured_image}
      />
      
      <main className="pt-14">
        {/* Breadcrumbs */}
        <section className="py-4 bg-muted/30">
          <div className="container mx-auto px-4">
            <CustomBreadcrumb
              items={[
                { label: t('navigation.catalog'), href: '/catalog' },
                { label: product.title }
              ]}
              className="text-sm"
            />
          </div>
        </section>
        
        {/* Hero Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-4xl lg:text-5xl font-bold">
                    {product.title}
                  </h1>
                  {(product as any).is_ctkz && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-lg px-3 py-1">
                      CT-KZ
                    </Badge>
                  )}
                </div>
                
                {product.manufacturer && (
                  <p className="text-lg text-muted-foreground mb-4">
                    {t('catalog.manufacturer')}: {product.manufacturer}
                  </p>
                )}
                
                {product.sku && (
                  <p className="text-sm text-muted-foreground mb-6">
                    {t('catalog.sku')}: {product.sku}
                  </p>
                )}
                
                {product.description && (
                  <p className="text-xl text-muted-foreground mb-8">
                    {product.description}
                  </p>
                )}
                
                <div className="flex gap-4">
                  <Link to="/contacts">
                    <Button size="lg" className="btn-primary">
                      {t('navigation.requestQuote')}
                    </Button>
                  </Link>
                  
                  {product.pdf_files && product.pdf_files.length > 0 && (
                    <Button variant="outline" size="lg" asChild>
                      <a href={product.pdf_files[0]} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        {t('catalog.downloadDatasheet')}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
              
              {product.featured_image && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={product.featured_image} 
                    alt={product.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Specifications */}
        {product.specifications && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-primary">{t('catalog.specifications')}</h2>
                <div className="bg-card p-6 rounded-xl shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-border">
                        <span className="font-medium text-foreground">{key}:</span>
                        <span className="text-muted-foreground">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Rich Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {product.content_rich && (
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.content_rich }}
                />
              )}
            </div>
          </div>
        </section>
        
        {/* Gallery */}
        {product.gallery_images && product.gallery_images.length > 0 && (
          <section className="py-16 bg-card/50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-primary text-center">{t('catalog.gallery')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {product.gallery_images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.title} - Image ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
};

export default CatalogDetail;