import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';

interface Partner {
  id: string;
  name: string;
  logo?: string;
  website_url?: string;
  order: number;
}

interface AboutPartnersProps {
  data: Partner[];
}

const AboutPartners = ({ data }: AboutPartnersProps) => {
  const { t } = useTranslation();

  if (!data || data.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">{t('about.sections.partners')}</h2>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {data.map((partner) => (
            <Card 
              key={partner.id} 
              className={`group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                partner.website_url ? 'cursor-pointer' : ''
              }`}
              onClick={() => {
                if (partner.website_url) {
                  window.open(partner.website_url, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              <CardContent className="p-6 h-32 flex flex-col items-center justify-center space-y-3">
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-16 object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                    <span className="text-primary/50 font-medium text-xs text-center">
                      {partner.name}
                    </span>
                  </div>
                )}
                
                <h3 className="text-xs font-medium text-center text-muted-foreground group-hover:text-primary transition-colors">
                  {partner.name}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutPartners;