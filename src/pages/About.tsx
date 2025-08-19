import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';

const About = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <SEO 
        title={t('seo.about.title')}
        description={t('seo.about.description')}
        canonical="/about"
      />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary">
              {t('navigation.about')}
            </h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Marine Support Services has been a trusted partner in Kazakhstan's marine and industrial sector for over 15 years. 
                We specialize in providing high-quality equipment, spare parts, and technical support from leading European manufacturers.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Our mission is to deliver reliable, efficient solutions that meet the demanding requirements of marine and industrial 
                projects across Kazakhstan and the Caspian Sea region.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                With our headquarters in Aktau and strong partnerships with European suppliers, we ensure timely delivery and 
                exceptional service quality for all our clients.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;