import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { CustomBreadcrumb } from '@/components/ui/custom-breadcrumb';
import { useContentResolver } from '@/hooks/useContentResolver';
import { ServiceItem } from '@/hooks/useContent';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { data: service, loading, error, isTranslationFallback, translationNote } = useContentResolver<ServiceItem>('services', slug!);

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

  if (error || !service) {
    return (
      <Layout>
        <SEO 
          title="Service Not Found"
          description="The requested service could not be found."
        />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl font-bold text-primary mb-4">404</div>
            <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The service you are looking for might have been removed or is temporarily unavailable.
            </p>
            <Link to="/services">
              <Button className="btn-primary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Services
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const breadcrumbItems = [
    { label: t('navigation.services'), href: '/services' },
    { label: service.title }
  ];

  return (
    <Layout>
      <SEO 
        title={service.title}
        description={service.description}
        ogImage={service.featured_image}
      />
      
      <main className="pt-14">
        {/* Hero Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <CustomBreadcrumb items={breadcrumbItems} className="mb-6" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                {isTranslationFallback && translationNote && (
                  <p className="text-xs text-muted-foreground/70 italic mb-4">
                    {translationNote}
                  </p>
                )}
                <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                  {service.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  {service.description}
                </p>
                <Link to="/contacts">
                  <Button size="lg" className="btn-primary">
                    {t('navigation.requestQuote')}
                  </Button>
                </Link>
              </div>
              
              {service.featured_image && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={service.featured_image} 
                    alt={service.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {service.content_rich && (
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: service.content_rich }}
                />
              )}

              {/* Special content for Hydraulic Workshop */}
              {slug === 'hydraulic-workshop' && (
                <div className="mt-12 p-8 bg-card rounded-lg">
                  <h3 className="text-2xl font-bold mb-6">Our Hydraulic Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 border rounded-lg">
                      <div className="text-primary text-4xl mb-4">🔧</div>
                      <h4 className="font-semibold mb-2">Repair</h4>
                      <p className="text-sm text-muted-foreground">
                        Complete hydraulic system repair and maintenance
                      </p>
                    </div>
                    <div className="text-center p-6 border rounded-lg">
                      <div className="text-primary text-4xl mb-4">📊</div>
                      <h4 className="font-semibold mb-2">Testing</h4>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive testing and performance analysis
                      </p>
                    </div>
                    <div className="text-center p-6 border rounded-lg">
                      <div className="text-primary text-4xl mb-4">🔍</div>
                      <h4 className="font-semibold mb-2">Inspection</h4>
                      <p className="text-sm text-muted-foreground">
                        Detailed inspection and quality assurance
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Gallery */}
              {service.gallery_images && service.gallery_images.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-6">Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {service.gallery_images.map((image, index) => (
                      <div key={index} className="rounded-lg overflow-hidden">
                        <img 
                          src={image} 
                          alt={`${service.title} ${index + 1}`}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default ServiceDetail;