import React from 'react';
import { useTranslationHelper } from '@/hooks/useTranslationHelper';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useAboutCompliance } from '@/hooks/useAboutData';
import { ExternalLink, Shield, Award, CheckCircle, FileCheck } from 'lucide-react';
import * as Icons from 'lucide-react';

const AboutCompliance: React.FC = () => {
  const { t, showFallbackIndicator } = useTranslationHelper();
  const { data: compliance, loading, error } = useAboutCompliance();

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-10 w-1/3 mx-auto mb-12" />
            <div className="flex flex-wrap gap-4 justify-center">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-32" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !compliance || compliance.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-primary">
              {t('about.compliance', 'Compliance & Standards')}
            </h2>
            {showFallbackIndicator && (
              <p className="text-xs text-muted-foreground/70 italic mb-4">
                {t('common.translationComingSoon', 'Translation coming soon')}
              </p>
            )}
            <div className="bg-muted/30 rounded-lg p-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">
                {error ? t('common.error', 'Something went wrong') : t('about.complianceComingSoon', 'Content will be published soon')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('about.complianceNote', 'Our compliance certifications and standards information will be available here shortly.')}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const getIcon = (iconKey: string | undefined) => {
    if (!iconKey) return <Shield className="h-4 w-4" />; // Default icon
    
    try {
      // Handle specific known icons
      const iconMap: { [key: string]: React.ComponentType<any> } = {
        'iso-9001': Award,
        'safety-helmet': Shield,
        'check-circle': CheckCircle,
        'file-check': FileCheck,
        'shield': Shield
      };

      if (iconMap[iconKey]) {
        const IconComponent = iconMap[iconKey];
        return <IconComponent className="h-4 w-4" />;
      }

      // Try to get from lucide-react dynamically
      const IconComponent = (Icons as any)[iconKey];
      if (IconComponent) {
        return <IconComponent className="h-4 w-4" />;
      }
      
      // Fallback to default icon
      return <Shield className="h-4 w-4" />;
    } catch (error) {
      console.warn(`Failed to load icon: ${iconKey}`, error);
      return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            {t('about.compliance', 'Compliance & Standards')}
          </h2>
          {showFallbackIndicator && (
            <p className="text-xs text-muted-foreground/70 italic text-center mb-8">
              {t('common.translationComingSoon', 'Translation coming soon')}
            </p>
          )}
          
          <div className="flex flex-wrap gap-4 justify-center">
            {compliance.map((item) => (
              <div key={item.id}>
                {item.link_url ? (
                  <a
                    href={item.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Badge
                      variant="secondary"
                      className="px-4 py-2 text-sm flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                    >
                      {getIcon(item.badge_icon)}
                      {item.title}
                      <ExternalLink className="h-4 w-4" />
                    </Badge>
                  </a>
                ) : (
                  <Badge
                    variant="secondary"
                    className="px-4 py-2 text-sm flex items-center gap-2"
                  >
                    {getIcon(item.badge_icon)}
                    {item.title}
                  </Badge>
                )}
              </div>
            ))}
          </div>
          
          {showFallbackIndicator && compliance.length > 0 && (
            <p className="text-xs text-muted-foreground text-center mt-8 italic">
              {t('common.translationNote', 'Translation coming soon')}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutCompliance;