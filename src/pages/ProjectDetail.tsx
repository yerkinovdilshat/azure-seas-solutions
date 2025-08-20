import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { CustomBreadcrumb } from '@/components/ui/custom-breadcrumb';
import { useProject } from '@/hooks/useContent';
import { useTranslationHelper } from '@/hooks/useTranslationHelper';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, User, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, showFallbackIndicator } = useTranslationHelper();
  const { data: project, loading, error, isTranslationFallback, translationNote } = useProject(slug || '');

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>{t('common.loading')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <SEO 
          title="Project Not Found"
          description="The requested project could not be found."
        />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The requested project could not be found or may have been removed.
            </p>
            <Link to="/projects">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const breadcrumbItems = [
    { label: t('navigation.projects'), href: '/projects' },
    { label: project.title }
  ];

  return (
    <Layout>
      <SEO 
        title={project.title}
        description={project.description}
        ogImage={project.featured_image}
      />
      
      <main className="pt-14">
        {/* Hero Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <CustomBreadcrumb items={breadcrumbItems} className="mb-6" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                  {project.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  {project.description}
                </p>
                
                {/* Project Details */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {project.client_name && (
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t('projects.client')}</p>
                        <p className="font-medium">{project.client_name}</p>
                      </div>
                    </div>
                  )}
                  
                  {project.project_location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t('projects.location')}</p>
                        <p className="font-medium">{project.project_location}</p>
                      </div>
                    </div>
                  )}
                  
                  {project.project_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t('projects.date')}</p>
                        <p className="font-medium">{new Date(project.project_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                  
                  {project.project_status && (
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t('projects.status')}</p>
                        <p className="font-medium capitalize">{project.project_status}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {project.featured_image && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={project.featured_image} 
                    alt={project.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {project.content_rich && (
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: project.content_rich }}
                />
              )}

              {/* Gallery */}
              {project.gallery_images && project.gallery_images.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-6">Project Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {project.gallery_images.map((image, index) => (
                      <div key={index} className="rounded-lg overflow-hidden">
                        <img 
                          src={image} 
                          alt={`${project.title} ${index + 1}`}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video */}
              {project.video_url && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-6">Project Video</h3>
                  <div className="aspect-video">
                    <iframe
                      src={project.video_url}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                      title={`${project.title} Video`}
                    />
                  </div>
                </div>
              )}
              
              {/* Translation Notice */}
              {isTranslationFallback && translationNote && (
                <div className="mt-12 p-4 bg-muted/50 rounded-lg border border-border/50">
                  <p className="text-sm text-muted-foreground text-center">
                    {translationNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default ProjectDetail;