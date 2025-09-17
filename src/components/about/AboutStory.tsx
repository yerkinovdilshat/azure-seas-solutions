import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StoryData } from '@/hooks/useAboutData';

interface AboutStoryProps {
  data: StoryData;
}

const AboutStory: React.FC<AboutStoryProps> = ({ data }) => {
  if (!data?.title && !data?.body_rich) {
    return null;
  }

  return (
    <Card className="card-modern">
      <CardContent className="p-8">
        {data.title && (
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            {data.title}
          </h2>
        )}
        {data.body_rich && (
          <div 
            className="prose prose-lg max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: data.body_rich }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AboutStory;