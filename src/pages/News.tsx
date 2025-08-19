import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';

const News = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <SEO 
        title={t('seo.news.title')}
        description={t('seo.news.description')}
        canonical="/news"
      />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary">
              {t('navigation.news')}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Stay updated with the latest news and industry developments from Marine Support Services.
            </p>
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                News section coming soon. Follow us on social media for the latest updates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default News;