import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Wrench, Settings, Hammer } from 'lucide-react';
import { useFeaturedServices } from '@/hooks/useServicesData';

const ServicesSection: React.FC = () => {
  const { t } = useTranslation();
  const { data: services, isLoading: loading, error } = useFeaturedServices();

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-muted rounded-full mb-4"></div>
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

  if (error || !services || services.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t('services.title')}
          </h2>
          <p className="text-muted-foreground mb-8">
            {t('common.noData')}
          </p>
          <Link to="/services">
            <Button className="btn-primary">
              {t('services.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  // Icon mapping for services
  const getServiceIcon = (iconKey: string) => {
    const iconMap = {
      wrench: Wrench,
      settings: Settings,
      hammer: Hammer,
      tool: Hammer // fallback to Hammer
    };
    return iconMap[iconKey as keyof typeof iconMap] || Settings;
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t('services.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {services.map((service) => {
            const IconComponent = getServiceIcon(service.icon_key);
            
            return (
              <Card 
                key={service.id} 
                className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/20"
              >
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    {service.is_featured && (
                      <Badge 
                        variant="default" 
                        className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs"
                      >
                        {t('common.featured')}
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-muted-foreground mb-6 line-clamp-4">
                    {service.description}
                  </p>

                  <Link to={`/services/${service.slug}`}>
                    <Button variant="outline" className="group/btn w-full">
                      {t('common.readMore')}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Link to="/services">
            <Button size="lg" className="btn-primary">
              {t('services.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;