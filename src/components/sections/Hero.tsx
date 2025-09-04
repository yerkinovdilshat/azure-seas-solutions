import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Quote, Settings, Wrench, HardHat } from 'lucide-react';
import heroImage from '@/assets/hero-caspian-offshore.jpg';

const Hero = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Settings,
      title: t('hero.features.equipmentSupply.title'),
      description: t('hero.features.equipmentSupply.description')
    },
    {
      icon: Wrench,
      title: t('hero.features.technicalMaintenance.title'),
      description: t('hero.features.technicalMaintenance.description')
    },
    {
      icon: HardHat,
      title: t('hero.features.industrialSolutions.title'),
      description: t('hero.features.industrialSolutions.description')
    }
  ];

  return (
    <>
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden pt-[140px]">
        <picture>
          <source srcSet={heroImage} type="image/jpeg" />
          <img 
            src={heroImage} 
            alt="Offshore oil platforms in the Caspian Sea representing Kazakhstan's energy industry"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </picture>
        
        {/* Dark blue transparent gradient overlay from bottom to top */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/40 to-primary/20" />
        
        {/* Content with breathing space */}
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <div className="max-w-6xl mx-auto space-y-16">
            
            {/* Main Heading - 20% smaller */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              {t('hero.title')}
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl lg:text-2xl font-light max-w-4xl mx-auto leading-relaxed text-white/95">
              {t('hero.subtitle')}
            </p>
            
            {/* CTA Buttons - rounded, dark blue with white text, gold hover */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link to="/services">
                <Button 
                  size="lg" 
                  className="bg-primary text-white hover:bg-accent hover:text-primary rounded-full px-8 py-4 text-lg font-semibold transition-all duration-300 w-full sm:w-auto group"
                >
                  {t('hero.exploreServices')}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Link to="/contacts">
                <Button 
                  size="lg" 
                  className="bg-primary text-white hover:bg-accent hover:text-primary rounded-full px-8 py-4 text-lg font-semibold transition-all duration-300 w-full sm:w-auto group"
                >
                  <Quote className="mr-2 h-5 w-5" />
                  {t('hero.requestQuote')}
                </Button>
              </Link>
            </div>
            
            {/* Stats row */}
            <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center opacity-90">
              <div className="space-y-2">
                <div className="text-2xl md:text-3xl font-semibold text-white">15+</div>
                <div className="text-white/80 text-sm">Years of Experience</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl md:text-3xl font-semibold text-white">200+</div>
                <div className="text-white/80 text-sm">Successful Projects</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl md:text-3xl font-semibold text-white">50+</div>
                <div className="text-white/80 text-sm">European Partners</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/30 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Feature Columns Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center space-y-6 p-8 rounded-xl hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;