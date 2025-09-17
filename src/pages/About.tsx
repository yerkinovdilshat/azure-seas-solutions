import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAboutCertificates, useAboutStory, useAboutValues, useAboutTimeline, useAboutTeam, useAboutPartners } from '@/hooks/useAboutData';
import ItemsGrid from '@/components/shared/ItemsGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import AboutStory from '@/components/about/AboutStory';
import AboutValues from '@/components/about/AboutValues';
import AboutTimeline from '@/components/about/AboutTimeline';
import AboutTeam from '@/components/about/AboutTeam';
import AboutPartners from '@/components/about/AboutPartners';

const About = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');
  
  // General Information sections
  const { data: storyData, isLoading: storyLoading } = useAboutStory();
  const { data: valuesData, isLoading: valuesLoading } = useAboutValues();
  const { data: timelineData, isLoading: timelineLoading } = useAboutTimeline();
  const { data: teamData, isLoading: teamLoading } = useAboutTeam();
  const { data: partnersData, isLoading: partnersLoading } = useAboutPartners();
  
  // Other tabs
  const { data: certificates, isLoading: certsLoading } = useAboutCertificates();

  const loading = storyLoading || valuesLoading || timelineLoading || teamLoading || partnersLoading || certsLoading;

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mx-auto mb-8" />
          <div className="flex justify-center mb-8">
            <Skeleton className="h-10 w-96" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title={t('seo.about.title')}
        description={t('seo.about.description')}
        canonical="/about"
      />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
          {t('about.title')}
        </h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="sticky top-4 z-10 bg-background/80 backdrop-blur-sm pb-4 mb-8">
            <TabsList className="grid w-full grid-cols-4 max-w-4xl mx-auto bg-muted/50 p-1 rounded-lg shadow-md">
              <TabsTrigger 
                value="general" 
                className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                {t('about.tabs.general')}
              </TabsTrigger>
              <TabsTrigger 
                value="distribution" 
                className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                {t('about.tabs.distribution')}
              </TabsTrigger>
              <TabsTrigger 
                value="certificates" 
                className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                {t('about.tabs.certificates')}
              </TabsTrigger>
              <TabsTrigger 
                value="licenses" 
                className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                {t('about.tabs.licenses')}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="general" className="space-y-12">
            <div className="max-w-6xl mx-auto space-y-16">
              <AboutStory data={storyData || { id: '', title: '', body_rich: null }} />
              <AboutValues data={valuesData || []} />
              <AboutTimeline data={timelineData || []} />
              <AboutTeam data={teamData || []} />
              <AboutPartners data={partnersData || []} />
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-center">{t('about.tabs.distribution')}</h2>
              <ItemsGrid kind="distribution" />
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-center">{t('about.certificates.title')}</h2>
              <ItemsGrid kind="certificate" />
            </div>
          </TabsContent>

          <TabsContent value="licenses" className="space-y-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-center">{t('about.licenses.title')}</h2>
              <ItemsGrid kind="license" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default About;