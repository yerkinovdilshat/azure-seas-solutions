import React from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { useAboutStory } from '@/hooks/useAboutData';

const AboutStory: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data: story, loading, error } = useAboutStory();

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-muted-foreground">{t('common.error')}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!story) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-muted-foreground">{t('common.noData')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {story.hero_image && (
            <div className="mb-12">
              <img
                src={story.hero_image}
                alt={story.title}
                className="w-full h-64 md:h-80 object-cover rounded-xl"
              />
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary">
            {story.title}
          </h1>
          
          {story.body_rich && (
            <div 
              className="prose prose-lg max-w-none text-foreground"
              dangerouslySetInnerHTML={{ __html: story.body_rich }}
            />
          )}
          
          {i18n.language !== 'en' && (
            <p className="text-xs text-muted-foreground mt-8 italic">
              {t('common.translationNote')}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutStory;