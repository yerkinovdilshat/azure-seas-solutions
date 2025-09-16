import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Shield, Users, Award } from 'lucide-react';

interface AboutValuesProps {
  data?: any;
}

const AboutValues = ({ data }: AboutValuesProps) => {
  const { t } = useTranslation();

  const defaultValues = [
    {
      icon: Shield,
      title: 'Reliability',
      description: 'We deliver consistent, dependable solutions that our clients can trust.'
    },
    {
      icon: Award,
      title: 'Quality',
      description: 'We maintain the highest standards in all our products and services.'
    },
    {
      icon: Users,
      title: 'Partnership',
      description: 'We build long-term relationships based on mutual trust and success.'
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'We embrace new technologies and innovative approaches to solve challenges.'
    }
  ];

  const values = Array.isArray(data) ? data : defaultValues;

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          {t('about.values.title') || 'Our Values'}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('about.values.subtitle') || 'The principles that guide our work and define our company culture.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((value: any, index: number) => {
          const IconComponent = value.icon || Target;
          return (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 mx-auto bg-primary rounded-full flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default AboutValues;