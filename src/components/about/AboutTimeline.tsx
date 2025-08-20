import React from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { useAboutTimeline } from '@/hooks/useAboutData';

const AboutTimeline: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data: timeline, loading, error } = useAboutTimeline();

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-10 w-1/3 mx-auto mb-12" />
            <div className="space-y-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start space-x-6">
                  <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-1/4 mb-2" />
                    <Skeleton className="h-5 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !timeline || timeline.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-primary">{t('about.timeline')}</h2>
            <p className="text-muted-foreground">
              {error ? t('common.error') : t('common.noData')}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            {t('about.timeline')}
          </h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={item.id} className="relative flex items-start space-x-6">
                  {/* Year badge */}
                  <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center font-bold z-10">
                    {item.year}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-card p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-semibold mb-3 text-foreground">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {item.description}
                      </p>
                    )}
                    {item.image && (
                      <div className="mt-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {i18n.language !== 'en' && timeline.length > 0 && (
            <p className="text-xs text-muted-foreground text-center mt-8 italic">
              {t('common.translationNote')}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutTimeline;