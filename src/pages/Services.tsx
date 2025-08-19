import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';

const Services = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <SEO 
        title={t('seo.services.title')}
        description={t('seo.services.description')}
        canonical="/services"
      />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary">
              {t('navigation.services')}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-primary">Equipment Supply</h3>
                <p className="text-muted-foreground">
                  Direct supply of marine and industrial equipment from leading European manufacturers.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-primary">Spare Parts</h3>
                <p className="text-muted-foreground">
                  Comprehensive inventory of genuine spare parts for marine and industrial applications.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-primary">Technical Support</h3>
                <p className="text-muted-foreground">
                  Expert technical consultation and support services for complex projects.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-primary">Logistics</h3>
                <p className="text-muted-foreground">
                  Efficient logistics and delivery solutions throughout Kazakhstan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;