import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import Hero from '@/components/sections/Hero';
import AdvantagesSection from '@/components/home/AdvantagesSection';
import ProductCategoriesSection from '@/components/home/ProductCategoriesSection';
import ServicesSection from '@/components/home/ServicesSection';
import ProjectsSection from '@/components/home/ProjectsSection';
import NewsSection from '@/components/home/NewsSection';
import ContactForm from '@/components/home/ContactForm';

const Home = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <SEO 
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        canonical="/"
      />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Advantages Section */}
      <AdvantagesSection />
      
      {/* Product Categories Preview */}
      <ProductCategoriesSection />
      
      {/* Services Preview */}
      <ServicesSection />
      
      {/* Completed Projects Preview */}
      <ProjectsSection />
      
      {/* Latest News */}
      <NewsSection />
      
      {/* Contact Form Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;