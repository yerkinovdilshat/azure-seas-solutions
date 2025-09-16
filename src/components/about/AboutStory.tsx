import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

interface AboutStoryProps {
  data?: any;
}

const AboutStory = ({ data }: AboutStoryProps) => {
  const { t } = useTranslation();

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">
          {t('about.story.title') || 'Our Story'}
        </h2>
      </div>
      
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="text-lg leading-relaxed mb-6">
              {data?.content || 
                'Marine Support Services has been a trusted partner in Kazakhstan\'s industrial sector since 2012. We specialize in equipment supply, technical maintenance, and comprehensive engineering solutions for the oil & gas industry.'
              }
            </p>
            <p className="leading-relaxed mb-6">
              {data?.content_additional || 
                'Our company was founded with the mission to provide high-quality European equipment and professional maintenance services to Kazakhstan\'s growing industrial infrastructure. Over the years, we have built strong partnerships with leading European manufacturers and established ourselves as a reliable supplier and service provider.'
              }
            </p>
            <p className="leading-relaxed">
              {data?.vision || 
                'Today, we continue to expand our capabilities and strengthen our position as one of Kazakhstan\'s premier industrial service companies, committed to excellence and innovation in everything we do.'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default AboutStory;