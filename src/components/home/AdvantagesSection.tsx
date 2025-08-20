import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Clock, Users, Award, CheckCircle, Globe, Wrench, Star } from 'lucide-react';
import { useAdvantages } from '@/hooks/useHomeData';

// Icon mapping for dynamic icon rendering
const iconMap = {
  Shield,
  Clock,
  Users,
  Award,
  CheckCircle,
  Globe,
  Wrench,
  Star
};

const AdvantagesSection: React.FC = () => {
  const { t } = useTranslation();
  const { data: advantages, loading } = useAdvantages();

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
         <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t('advantages.title', 'Why Choose Us')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('advantages.subtitle', 'We deliver exceptional value through our proven expertise and commitment to excellence')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => {
            const IconComponent = iconMap[advantage.icon as keyof typeof iconMap] || Shield;
            
            return (
              <div 
                key={advantage.id} 
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors duration-300">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute inset-0 bg-primary/5 rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {advantage.title_key ? t(advantage.title_key, advantage.title) : advantage.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {advantage.description_key ? t(advantage.description_key, advantage.description) : advantage.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;