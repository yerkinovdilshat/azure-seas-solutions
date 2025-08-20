import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import AboutStory from '@/components/about/AboutStory';
import AboutValues from '@/components/about/AboutValues';
import AboutTimeline from '@/components/about/AboutTimeline';
import AboutTeam from '@/components/about/AboutTeam';
import AboutPartners from '@/components/about/AboutPartners';
import AboutCertificates from '@/components/about/AboutCertificates';
import AboutCompliance from '@/components/about/AboutCompliance';

const About = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <SEO 
        title={t('seo.about.title')}
        description={t('seo.about.description')}
        canonical="/about"
      />
      
      <AboutStory />
      <AboutValues />
      <AboutTimeline />
      <AboutTeam />
      <AboutPartners />
      <AboutCertificates />
      <AboutCompliance />
    </Layout>
  );
};

export default About;