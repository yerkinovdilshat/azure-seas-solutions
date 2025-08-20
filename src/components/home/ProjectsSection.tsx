import React from 'react';
import { useTranslationHelper } from '@/hooks/useTranslationHelper';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, MapPin, User, Image } from 'lucide-react';
import { useLatestProjects } from '@/hooks/useHomeData';

const ProjectsSection: React.FC = () => {
  const { t, showFallbackIndicator } = useTranslationHelper();
  const { data: projects, loading, error } = useLatestProjects();

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || projects.length === 0) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t('projects.title', 'Completed Projects')}
          </h2>
          {showFallbackIndicator && (
            <p className="text-xs text-muted-foreground/70 italic mb-2">
              {t('common.translationComingSoon', 'Translation coming soon')}
            </p>
          )}
          <p className="text-muted-foreground mb-8">
            {t('common.noData', 'No data available')}
          </p>
          <Link to="/projects">
            <Button className="btn-primary">
              {t('projects.viewAll', 'View All Projects')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t('projects.title', 'Completed Projects')}
          </h2>
          {showFallbackIndicator && (
            <p className="text-xs text-muted-foreground/70 italic mb-2">
              {t('common.translationComingSoon', 'Translation coming soon')}
            </p>
          )}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('projects.subtitle', 'Successful project implementations across Kazakhstan and the Caspian region')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {projects.map((project: any) => (
            <Card 
              key={project.id} 
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                {project.featured_image ? (
                  <img
                    src={project.featured_image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-muted/50 flex items-center justify-center">
                    <Image className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                
                {/* Status badge */}
                <div className="absolute top-4 left-4">
                  <Badge 
                    variant={project.project_status === 'completed' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {project.project_status || 'completed'}
                  </Badge>
                </div>

                {project.is_featured && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="default" className="bg-primary text-primary-foreground">
                      {t('common.featured')}
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Project metadata */}
                <div className="space-y-2 mb-4 text-xs text-muted-foreground">
                  {project.client_name && (
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span>{project.client_name}</span>
                    </div>
                  )}
                  
                  {project.project_location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>{project.project_location}</span>
                    </div>
                  )}
                  
                  {project.project_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(project.project_date).getFullYear()}</span>
                    </div>
                  )}
                </div>

                <Link to={`/projects/${project.slug}`}>
                  <Button variant="outline" size="sm" className="w-full group/btn">
                    {t('projects.viewProject')}
                    <ArrowRight className="ml-2 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/projects">
            <Button size="lg" className="btn-primary">
              {t('projects.viewAll', 'View All Projects')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;