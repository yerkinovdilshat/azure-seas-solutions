import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Handshake, Globe, ExternalLink } from 'lucide-react';

interface AboutPartnersProps {
  data?: any;
}

const AboutPartners = ({ data }: AboutPartnersProps) => {
  const { t } = useTranslation();

  const defaultPartners = [
    {
      name: 'European Equipment Manufacturers',
      category: 'Equipment Supply',
      description: 'Leading European manufacturers of industrial HVAC equipment and components.',
      region: 'Europe'
    },
    {
      name: 'Oil & Gas Companies',
      category: 'Industrial Clients',
      description: 'Major oil and gas companies operating in Kazakhstan and the Caspian region.',
      region: 'Kazakhstan'
    },
    {
      name: 'Engineering Consultants',
      category: 'Technical Partners',
      description: 'Specialized engineering firms providing design and consulting services.',
      region: 'International'
    },
    {
      name: 'Local Service Providers',
      category: 'Service Network',
      description: 'Trusted local partners for installation, maintenance, and support services.',
      region: 'Kazakhstan'
    }
  ];

  const partners = Array.isArray(data) ? data : defaultPartners;

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
          <Handshake className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">
          {t('about.partners.title') || 'Our Partners'}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('about.partners.subtitle') || 'Strong partnerships that enable us to deliver exceptional value to our clients.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {partners.map((partner: any, index: number) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-semibold text-foreground">
                    {partner.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {partner.category}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Globe className="w-3 h-3" />
                      {partner.region}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                {partner.description}
              </p>
              {partner.website && (
                <a 
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Visit Website
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default AboutPartners;