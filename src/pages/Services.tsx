import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { Skeleton } from '@/components/ui/skeleton';
import { useServices } from '@/hooks/useContent';
import { ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';

const Services = () => {
  const { t, i18n } = useTranslation();
  const { data: services, loading, error } = useServices();

  if (loading) {
    return (
      <Layout>
        <SEO 
          title={t('seo.services.title')}
          description={t('seo.services.description')}
          canonical="/services"
        />
        
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Skeleton className="h-12 w-1/2 mx-auto mb-8" />
              <Skeleton className="h-6 w-3/4 mx-auto mb-12" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card p-6 rounded-xl shadow-lg">
                    <Skeleton className="h-12 w-12 mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <SEO 
          title={t('seo.services.title')}
          description={t('seo.services.description')}
          canonical="/services"
        />
        
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary">
                {t('navigation.services')}
              </h1>
              <p className="text-muted-foreground">{t('common.error')}</p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  const getIcon = (iconKey: string | undefined) => {
    if (!iconKey) return ArrowRight;
    const IconComponent = (Icons as any)[iconKey];
    return IconComponent || ArrowRight;
  };

  return (
    <Layout>
      <SEO 
        title={t('seo.services.title')}
        description={t('seo.services.description')}
        canonical="/services"
      />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary text-center">
              {t('navigation.services')}
            </h1>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
              {t('services.description')}
            </p>
            
            {services && services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => {
                  const IconComponent = getIcon(service.icon_key);
                  
                  return (
                    <Link
                      key={service.id}
                      to={`/services/${service.slug}`}
                      className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow group"
                    >
                      <div className="flex items-center mb-4">
                        <IconComponent className="h-8 w-8 text-primary mr-3" />
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                      </div>
                      {service.description && (
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {service.description}
                        </p>
                      )}
                      <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                        {t('common.learnMore')}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground">{t('common.noData')}</p>
              </div>
            )}
            
            {i18n.language !== 'en' && services && services.length > 0 && (
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

export default Services;