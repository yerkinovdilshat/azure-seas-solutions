import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAboutBlocks } from '@/hooks/useAboutBlocks';
import { useAboutCertificates } from '@/hooks/useAboutData';
import { useAboutLicenses } from '@/hooks/useAboutLicenses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const About = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');
  
  const { getBlock, getLocalizedContent, loading: blocksLoading } = useAboutBlocks();
  const { data: certificates, loading: certsLoading } = useAboutCertificates();
  const { data: licenses, loading: licensesLoading, getLocalizedField } = useAboutLicenses();

  const generalBlock = getBlock('general');
  const safetyBlock = getBlock('safety_quality');

  const loading = blocksLoading || certsLoading || licensesLoading;

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
                value="safety" 
                className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                {t('about.tabs.safetyQuality')}
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

          <TabsContent value="general" className="space-y-6">
            <div className="prose prose-lg max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4">{getLocalizedContent(generalBlock, 'title')}</h2>
              <div 
                className="text-muted-foreground"
                dangerouslySetInnerHTML={{ 
                  __html: getLocalizedContent(generalBlock, 'content') || t('about.general.content')
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="safety" className="space-y-6">
            <div className="prose prose-lg max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4">{getLocalizedContent(safetyBlock, 'title')}</h2>
              <div 
                className="text-muted-foreground mb-6"
                dangerouslySetInnerHTML={{ 
                  __html: getLocalizedContent(safetyBlock, 'content') || t('about.safetyQuality.content')
                }}
              />
              
              {safetyBlock?.gallery_images && safetyBlock.gallery_images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {safetyBlock.gallery_images.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Safety & Quality ${index + 1}`}
                      className="rounded-lg shadow-md w-full h-48 object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-center">{t('about.certificates.title')}</h2>
              
              {certificates.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t('common.noData')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificates.map((cert) => (
                    <Card key={cert.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {cert.image_url && (
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={cert.image_url}
                            alt={cert.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{cert.title}</CardTitle>
                        {cert.issuer && (
                          <p className="text-sm text-muted-foreground">
                            {t('about.certificates.issuedBy')}: {cert.issuer}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0">
                        {cert.date && (
                          <p className="text-sm text-muted-foreground mb-4">
                            Date: {new Date(cert.date).toLocaleDateString()}
                          </p>
                        )}
                        {cert.file_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={cert.file_url} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4 mr-2" />
                              {t('about.certificates.viewPdf')}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="licenses" className="space-y-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-center">{t('about.licenses.title')}</h2>
              
              {licenses.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t('common.noData')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {licenses.map((license) => (
                    <Card key={license.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {license.image_url && (
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={license.image_url}
                            alt={getLocalizedField(license, 'title')}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{getLocalizedField(license, 'title')}</CardTitle>
                        {getLocalizedField(license, 'issuer') && (
                          <p className="text-sm text-muted-foreground">
                            {t('about.licenses.issuedBy')}: {getLocalizedField(license, 'issuer')}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0">
                        {getLocalizedField(license, 'description') && (
                          <p className="text-sm text-muted-foreground mb-4">
                            {getLocalizedField(license, 'description')}
                          </p>
                        )}
                        {license.file_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={license.file_url} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4 mr-2" />
                              {t('about.licenses.viewPdf')}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default About;