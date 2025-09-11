import React from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { useAboutPartners } from '@/hooks/useAboutData';
import { ExternalLink } from 'lucide-react';

const AboutPartners: React.FC = () => {
  const { t } = useTranslation();
  const { data: partners, loading, error } = useAboutPartners();

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-10 w-1/3 mx-auto mb-12" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-card p-6 rounded-xl">
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !partners || partners.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-primary">{t('about.partners')}</h2>
            <p className="text-muted-foreground">
              {error ? t('common.error') : t('common.noData')}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            {t('about.partners')}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="group relative bg-card p-6 rounded-xl hover:shadow-elegant transition-all duration-300 hover:scale-105 cursor-pointer border border-border hover:border-primary/20"
              >
                {partner.website_url ? (
                  <a
                    href={partner.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    <div className="relative h-20 w-full flex items-center justify-center">
                      {partner.logo ? (
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 filter group-hover:brightness-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 rounded flex items-center justify-center group-hover:from-primary/10 group-hover:to-primary/5 transition-all duration-300">
                          <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                            {partner.name}
                          </span>
                        </div>
                      )}
                      <div className="absolute -top-2 -right-2 bg-primary/10 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                        <ExternalLink className="h-3 w-3 text-primary" />
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {partner.name}
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="h-full">
                    <div className="relative h-20 w-full flex items-center justify-center">
                      {partner.logo ? (
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 rounded flex items-center justify-center">
                          <span className="text-sm font-medium text-muted-foreground">
                            {partner.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-xs font-medium text-muted-foreground line-clamp-1">
                        {partner.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPartners;