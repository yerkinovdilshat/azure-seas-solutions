import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Quote, Settings, Wrench, HardHat } from 'lucide-react';
import heroImage from '@/assets/hero-caspian-offshore.jpg';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useEffect, useState } from 'react';

const Hero = () => {
  const { t, i18n } = useTranslation();
  const { settings, loading } = useSiteSettings();
  const [currentLocale, setCurrentLocale] = useState('en');

  useEffect(() => {
    setCurrentLocale(i18n.language || 'en');
  }, [i18n.language]);

  // Get content based on current locale and settings
  const getLocalizedContent = () => {
    if (!settings) return null;
    
    const locale = currentLocale === 'kk' ? 'kk' : currentLocale === 'ru' ? 'ru' : 'en';
    
    return {
      title: settings[`hero_title_${locale}` as keyof typeof settings] || settings.hero_title_en,
      subtitle: settings[`hero_subtitle_${locale}` as keyof typeof settings] || settings.hero_subtitle_en,
      cta1Text: settings[`cta1_text_${locale}` as keyof typeof settings] || settings.cta1_text_en,
      cta2Text: settings[`cta2_text_${locale}` as keyof typeof settings] || settings.cta2_text_en,
    };
  };

  const content = getLocalizedContent();
  
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

  const heroStyle = {
    minHeight: `${settings?.hero_min_height_vh || 88}vh`,
    paddingTop: `${settings?.hero_top_padding_px || 140}px`,
  };

  const contentStyle = {
    maxWidth: `${settings?.content_max_width_px || 1100}px`,
  };

  const overlayStyle = {
    opacity: settings?.hero_overlay_opacity || 0.45,
  };

  const backgroundImage = settings?.hero_bg_url || heroImage;

  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-muted">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section 
        className="hero relative flex items-center justify-center overflow-hidden"
        style={{
          ...heroStyle,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark blue transparent gradient overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/30"
          style={overlayStyle}
        />
        
        {/* Content with breathing space */}
        <div className="hero__content relative z-10 container mx-auto px-6 text-center text-white" style={contentStyle}>
          <div className="space-y-8 md:space-y-12">
            
            {/* Main Heading with responsive font scaling */}
            <h1 
              className="font-bold leading-tight tracking-tight text-balance"
              style={{ 
                fontSize: 'clamp(28px, 4.2vw, 56px)', 
                lineHeight: '1.1',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {content?.title || t('hero.title')}
            </h1>
            
            {/* Subtitle with responsive font scaling */}
            <p 
              className="font-light max-w-4xl mx-auto leading-relaxed"
              style={{ 
                fontSize: 'clamp(16px, 1.6vw, 22px)',
                opacity: 0.92,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              {content?.subtitle || t('hero.subtitle')}
            </p>
            
            {/* CTA Buttons - rounded, dark blue with white text, gold hover */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center pt-4 md:pt-8">
              <Link to={settings?.cta1_link || "/services"}>
                <Button 
                  size="lg" 
                  className="bg-primary text-white hover:bg-accent hover:text-primary rounded-full px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold transition-all duration-300 w-full sm:w-auto group min-w-[200px]"
                >
                  {content?.cta1Text || t('hero.exploreServices')}
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Link to={settings?.cta2_link || "/contacts"}>
                <Button 
                  size="lg" 
                  className="bg-primary text-white hover:bg-accent hover:text-primary rounded-full px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold transition-all duration-300 w-full sm:w-auto group min-w-[200px]"
                >
                  <Quote className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  {content?.cta2Text || t('hero.requestQuote')}
                </Button>
              </Link>
            </div>
            
            {/* Stats row */}
            <div className="pt-8 md:pt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center opacity-90">
              <div className="space-y-2">
                <div 
                  className="font-semibold text-white"
                  style={{ 
                    fontSize: 'clamp(20px, 3vw, 32px)',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  15+
                </div>
                <div className="text-white/80 text-xs md:text-sm">Years of Experience</div>
              </div>
              <div className="space-y-2">
                <div 
                  className="font-semibold text-white"
                  style={{ 
                    fontSize: 'clamp(20px, 3vw, 32px)',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  200+
                </div>
                <div className="text-white/80 text-xs md:text-sm">Successful Projects</div>
              </div>
              <div className="space-y-2">
                <div 
                  className="font-semibold text-white"
                  style={{ 
                    fontSize: 'clamp(20px, 3vw, 32px)',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  50+
                </div>
                <div className="text-white/80 text-xs md:text-sm">European Partners</div>
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