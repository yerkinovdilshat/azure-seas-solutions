import React from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useAboutValues } from '@/hooks/useAboutData';
import { useTranslationHelper } from '@/hooks/useTranslationHelper';
import * as Icons from 'lucide-react';

const AboutValues: React.FC = () => {
  const { t, showFallbackIndicator } = useTranslationHelper();
  const { data: values, loading, error } = useAboutValues();

  if (loading) {
    return (
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-10 w-1/3 mx-auto mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-background p-6 rounded-xl shadow-sm">
                  <Skeleton className="h-12 w-12 mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !values || values.length === 0) {
    return (
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-primary">{t('about.values.title')}</h2>
            <div className="bg-background p-8 rounded-xl shadow-sm">
              <p className="text-muted-foreground mb-4">
                Content will be published soon.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Our values and principles information will be available here shortly.
              </p>
              <Link to="/contacts" className="text-primary hover:text-primary/80 text-sm font-medium">
                Contact us for more information →
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const getIcon = (iconKey: string | undefined) => {
    if (!iconKey) return null;
    const IconComponent = (Icons as any)[iconKey];
    return IconComponent ? <IconComponent className="h-12 w-12 text-primary" /> : null;
  };

  return (
    <section className="py-16 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            {t('about.values.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.id} className="bg-background p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                {value.icon_key && (
                  <div className="mb-4">
                    {getIcon(value.icon_key)}
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {value.title}
                </h3>
                {value.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                )}
              </div>
            ))}
          </div>
          
          {showFallbackIndicator && values.length > 0 && (
            <p className="text-xs text-muted-foreground text-center mt-8 italic">
              {t('common.translationComingSoon')}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutValues;