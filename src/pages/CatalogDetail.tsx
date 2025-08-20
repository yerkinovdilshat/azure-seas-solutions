import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { useCatalogProduct } from '@/hooks/useContent';
import { Button } from '@/components/ui/button';
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
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                  {product.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  {product.description}
                </p>
                <Link to="/contacts">
                  <Button size="lg" className="btn-primary">
                    {t('navigation.requestQuote')}
                  </Button>
                </Link>
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
      </main>
    </Layout>
  );
};

export default CatalogDetail;