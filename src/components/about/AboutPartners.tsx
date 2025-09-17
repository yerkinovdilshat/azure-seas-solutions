import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { Partner } from '@/hooks/useAboutData';

interface AboutPartnersProps {
  data: Partner[];
}

const AboutPartners: React.FC<AboutPartnersProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-foreground">Our Partners</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((partner) => (
          <Card key={partner.id} className="card-modern">
            <CardHeader className="text-center">
              {partner.logo_url && (
                <div className="h-20 flex items-center justify-center mb-4">
                  <img 
                    src={partner.logo_url} 
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
              <CardTitle className="text-xl">{partner.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {partner.description && (
                <p className="text-muted-foreground text-sm">{partner.description}</p>
              )}
              {partner.website_url && (
                <Button variant="outline" className="w-full" asChild>
                  <a 
                    href={partner.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    Visit Website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AboutPartners;