import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAboutBlocks } from '@/hooks/useAboutBlocks';
import { useAboutCertificates, useAboutStory, useAboutValues, useAboutTimeline, useAboutTeam, useAboutPartners } from '@/hooks/useAboutData';
import { useAboutLicenses } from '@/hooks/useAboutLicenses';
import { useAboutDistribution } from '@/hooks/useAboutDistribution';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const About = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');
  
  // General Information sections
  const { data: storyData, loading: storyLoading } = useAboutStory();
  const { data: valuesData, loading: valuesLoading } = useAboutValues();
  const { data: timelineData, loading: timelineLoading } = useAboutTimeline();
  const { data: teamData, loading: teamLoading } = useAboutTeam();
  const { data: partnersData, loading: partnersLoading } = useAboutPartners();
  
  // Other tabs
  const { data: distributionData, loading: distributionLoading, getLocalizedField: getDistributionField } = useAboutDistribution();
  const { data: certificates, loading: certsLoading } = useAboutCertificates();
  const { data: licenses, loading: licensesLoading, getLocalizedField } = useAboutLicenses();

  const loading = storyLoading || valuesLoading || timelineLoading || teamLoading || partnersLoading || 
                   distributionLoading || certsLoading || licensesLoading;

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

          <TabsContent value="general" className="space-y-8">
            <div className="max-w-6xl mx-auto space-y-12">
              {/* Story Section */}
              {storyData && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">{t('about.sections.story')}</h2>
                  {storyData.hero_image && (
                    <img src={storyData.hero_image} alt={storyData.title} className="w-full h-64 object-cover rounded-lg" />
                  )}
                  <div className="prose prose-lg max-w-none">
                    <h3 className="text-xl font-medium mb-4">{storyData.title}</h3>
                    {storyData.body_rich && (
                      <div dangerouslySetInnerHTML={{ __html: JSON.stringify(storyData.body_rich) }} />
                    )}
                  </div>
                </section>
              )}

              {/* Values Section */}
              {valuesData && valuesData.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">{t('about.sections.values')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {valuesData.map((value) => (
                      <Card key={value.id} className="p-6">
                        <CardContent className="space-y-3">
                          <h3 className="text-lg font-medium">{value.title}</h3>
                          {value.description && (
                            <p className="text-muted-foreground">{value.description}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Timeline Section */}
              {timelineData && timelineData.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">{t('about.sections.timeline')}</h2>
                  <div className="space-y-6">
                    {timelineData.map((item) => (
                      <Card key={item.id} className="p-6">
                        <CardContent className="flex gap-6">
                          <div className="text-2xl font-bold text-primary min-w-[80px]">{item.year}</div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                            {item.description && (
                              <p className="text-muted-foreground">{item.description}</p>
                            )}
                          </div>
                          {item.image && (
                            <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded" />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Team Section */}
              {teamData && teamData.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">{t('about.sections.team')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamData.map((member) => (
                      <Card key={member.id} className="overflow-hidden">
                        {member.photo && (
                          <img src={member.photo} alt={member.name} className="w-full h-48 object-cover" />
                        )}
                        <CardContent className="p-6 space-y-2">
                          <h3 className="text-lg font-medium">{member.name}</h3>
                          {member.role && (
                            <p className="text-primary font-medium">{member.role}</p>
                          )}
                          {member.bio && (
                            <p className="text-muted-foreground text-sm">{member.bio}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Partners Section */}
              {partnersData && partnersData.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">{t('about.sections.partners')}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {partnersData.map((partner) => (
                      <Card key={partner.id} className="p-6 text-center">
                        <CardContent className="space-y-3">
                          {partner.logo && (
                            <img src={partner.logo} alt={partner.name} className="w-full h-20 object-contain mx-auto" />
                          )}
                          <h3 className="text-sm font-medium">{partner.name}</h3>
                          {partner.website_url && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={partner.website_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Visit
                              </a>
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-center">{t('about.tabs.distribution')}</h2>
              
              {distributionData.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t('common.noData')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {distributionData.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {item.image_url && (
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={item.image_url}
                            alt={getDistributionField(item, 'title')}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => window.open(item.image_url, '_blank')}
                          />
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{getDistributionField(item, 'title')}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-4">
                        {getDistributionField(item, 'description') && (
                          <p className="text-sm text-muted-foreground">
                            {getDistributionField(item, 'description')}
                          </p>
                        )}
                        <div className="flex gap-2">
                          {item.image_url && (
                            <Button variant="outline" size="sm" onClick={() => window.open(item.image_url, '_blank')}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Preview
                            </Button>
                          )}
                          {item.file_url && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                                <FileText className="h-4 w-4 mr-2" />
                                View PDF
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
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