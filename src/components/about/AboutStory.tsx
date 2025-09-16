import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';

interface AboutStoryProps {
  data: {
    id: string;
    title: string;
    body_rich: any;
    hero_image?: string;
  } | null;
}

const AboutStory = ({ data }: AboutStoryProps) => {
  const { t } = useTranslation();

  if (!data) return null;

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">{t('about.sections.story')}</h2>
        <h3 className="text-xl text-muted-foreground mb-6">{data.title}</h3>
      </div>

      {data.hero_image && (
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
          <img
            src={data.hero_image}
            alt={data.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {data.body_rich && (
        <Card>
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: data.body_rich }} />
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default AboutStory;