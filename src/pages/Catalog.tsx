import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';

const Catalog = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <SEO 
        title={t('seo.catalog.title')}
        description={t('seo.catalog.description')}
        canonical="/catalog"
      />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary">
              {t('navigation.catalog')}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Browse our comprehensive catalog of marine and industrial equipment from leading European manufacturers.
            </p>
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                Catalog content coming soon. Please contact us for specific equipment inquiries.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Catalog;