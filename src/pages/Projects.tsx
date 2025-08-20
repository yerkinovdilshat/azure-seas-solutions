import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProjectsData, useProjectYears } from '@/hooks/useProjectsData';
import { Search, Filter, Building, MapPin, Calendar, ExternalLink } from 'lucide-react';

const Projects = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { years } = useProjectYears();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    year: searchParams.get('year') || '',
    status: searchParams.get('status') || '',
    location: searchParams.get('location') || ''
  });

  const { data: projects, loading, error, totalCount } = useProjectsData(filters);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.year) params.set('year', filters.year);
    if (filters.status) params.set('status', filters.status);
    if (filters.location) params.set('location', filters.location);
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', year: '', status: '', location: '' });
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'long'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <SEO 
          title={t('seo.projects.title')}
          description={t('seo.projects.description')}
          canonical="/projects"
        />
        
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Skeleton className="h-12 w-1/2 mx-auto mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card p-6 rounded-xl shadow-sm">
                    <Skeleton className="h-48 w-full mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title={t('seo.projects.title')}
        description={t('seo.projects.description')}
        canonical="/projects"
      />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary text-center">
              {t('navigation.projects')}
            </h1>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
              {t('projects.description')}
            </p>
            
            {/* Filters */}
            <div className="bg-card p-6 rounded-xl shadow-sm mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={t('projects.searchPlaceholder')}
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select
                  value={filters.year}
                  onValueChange={(value) => handleFilterChange('year', value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('projects.allYears')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('projects.allYears')}</SelectItem>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('projects.allStatuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('projects.allStatuses')}</SelectItem>
                    <SelectItem value="completed">{t('projects.completed')}</SelectItem>
                    <SelectItem value="ongoing">{t('projects.ongoing')}</SelectItem>
                    <SelectItem value="planned">{t('projects.planned')}</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={clearFilters}>
                  <Filter className="h-4 w-4 mr-2" />
                  {t('common.clearFilters')}
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {t('projects.showingResults', { count: totalCount })}
              </div>
            </div>

            {error && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t('common.error')}</p>
              </div>
            )}

            {projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.slug}`}
                    className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                  >
                    {project.featured_image ? (
                      <img
                        src={project.featured_image}
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    ) : (
                      <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center mb-4">
                        <Building className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {project.title}
                      </h3>
                      <Badge className={getStatusColor(project.project_status)}>
                        {t(`projects.${project.project_status}`)}
                      </Badge>
                    </div>
                    
                    {project.description && (
                      <p className="text-muted-foreground line-clamp-3 mb-4">
                        {project.description}
                      </p>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      {project.client_name && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Building className="h-4 w-4 mr-2" />
                          {project.client_name}
                        </div>
                      )}
                      {project.project_location && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          {project.project_location}
                        </div>
                      )}
                      {project.project_date && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(project.project_date)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                      {t('common.viewDetails')}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : !loading && (
              <div className="text-center py-12">
                <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('projects.noProjects')}</h3>
                <p className="text-muted-foreground mb-6">{t('projects.noProjectsDescription')}</p>
                <Button onClick={clearFilters} variant="outline">
                  {t('common.clearFilters')}
                </Button>
              </div>
            )}
            
            {i18n.language !== 'en' && projects && projects.length > 0 && (
              <p className="text-xs text-muted-foreground text-center mt-8 italic">
                {t('common.translationNote')}
              </p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;