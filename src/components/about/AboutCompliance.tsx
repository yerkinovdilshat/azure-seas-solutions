import React from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useAboutCompliance } from '@/hooks/useAboutData';
import { ExternalLink } from 'lucide-react';
import * as Icons from 'lucide-react';

const AboutCompliance: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data: compliance, loading, error } = useAboutCompliance();

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-10 w-1/3 mx-auto mb-12" />
            <div className="flex flex-wrap gap-4 justify-center">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-32" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !compliance || compliance.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-primary">{t('about.compliance')}</h2>
            <p className="text-muted-foreground">
              {error ? t('common.error') : t('common.noData')}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const getIcon = (iconKey: string | undefined) => {
    if (!iconKey) return null;
    const IconComponent = (Icons as any)[iconKey];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            {t('about.compliance')}
          </h2>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {compliance.map((item) => (
              <div key={item.id}>
                {item.link_url ? (
                  <a
                    href={item.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Badge
                      variant="secondary"
                      className="px-4 py-2 text-sm flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                    >
                      {item.badge_icon && getIcon(item.badge_icon)}
                      {item.title}
                      <ExternalLink className="h-4 w-4" />
                    </Badge>
                  </a>
                ) : (
                  <Badge
                    variant="secondary"
                    className="px-4 py-2 text-sm flex items-center gap-2"
                  >
                    {item.badge_icon && getIcon(item.badge_icon)}
                    {item.title}
                  </Badge>
                )}
              </div>
            ))}
          </div>
          
          {i18n.language !== 'en' && compliance.length > 0 && (
            <p className="text-xs text-muted-foreground text-center mt-8 italic">
              {t('common.translationNote')}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutCompliance;