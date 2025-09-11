import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  year: number;
  image?: string;
  order: number;
}

interface AboutTimelineProps {
  data: TimelineItem[];
}

const AboutTimeline = ({ data }: AboutTimelineProps) => {
  const { t } = useTranslation();

  if (!data || data.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">{t('about.sections.timeline')}</h2>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {data.map((item) => (
          <Card key={item.id} className="p-6">
            <CardContent className="flex gap-6">
              <div className="text-2xl font-bold text-primary min-w-[80px]">{item.year}</div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                {item.description && (
                  <p className="text-muted-foreground">{item.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default AboutTimeline;