import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimelineItem } from '@/hooks/useAboutData';

interface AboutTimelineProps {
  data: TimelineItem[];
}

const AboutTimeline: React.FC<AboutTimelineProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-foreground">Our Timeline</h2>
      <div className="space-y-4">
        {data.map((item) => (
          <Card key={item.id} className="card-modern">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-4">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-lg">
                  {item.year}
                </span>
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AboutTimeline;