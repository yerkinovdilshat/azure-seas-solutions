import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import Hero from '@/components/sections/Hero';

const Home = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <SEO 
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        canonical="/"
      />
      <Hero />
      
      {/* Additional sections can be added here */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-primary">
            Welcome to Marine Support Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Leading provider of marine and industrial services in Kazakhstan, delivering European quality equipment and expertise to the Caspian region.
          </p>
          <a 
            href="/admin" 
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Admin Dashboard
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Home;