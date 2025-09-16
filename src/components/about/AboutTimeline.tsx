import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface AboutTimelineProps {
  data?: any;
}

const AboutTimeline = ({ data }: AboutTimelineProps) => {
  const { t } = useTranslation();

  const defaultTimeline = [
    {
      year: '2012',
      title: 'Company Founded',
      description: 'Marine Support Services was established in Aktau, Kazakhstan.'
    },
    {
      year: '2015',
      title: 'European Partnerships',
      description: 'Established partnerships with leading European equipment manufacturers.'
    },
    {
      year: '2018',
      title: 'Service Expansion',
      description: 'Expanded technical maintenance and commissioning services.'
    },
    {
      year: '2021',
      title: 'Digital Transformation',
      description: 'Implemented modern digital solutions for project management and client service.'
    },
    {
      year: '2024',
      title: 'Continued Growth',
      description: 'Celebrating over 200 successful projects and 50+ European partners.'
    }
  ];

  const timeline = Array.isArray(data) ? data : defaultTimeline;

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">
          {t('about.timeline.title') || 'Our Journey'}
        </h2>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
          
          <div className="space-y-8">
            {timeline.map((item: any, index: number) => (
              <div key={index} className="relative flex items-start gap-6">
                <div className="relative z-10 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {item.year}
                </div>
                
                <Card className="flex-1">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTimeline;