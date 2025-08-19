import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';

const Projects = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <SEO 
        title={t('seo.projects.title')}
        description={t('seo.projects.description')}
        canonical="/projects"
      />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary">
              {t('navigation.projects')}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Explore our successful marine and industrial projects across Kazakhstan and the Caspian region.
            </p>
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                Project showcase coming soon. Contact us to learn more about our completed projects.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;