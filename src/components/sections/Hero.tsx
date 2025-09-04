import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Quote } from 'lucide-react';
import heroImage from '@/assets/hero-caspian-offshore.jpg';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <picture>
        <source srcSet={heroImage} type="image/jpeg" />
        <img 
          src={heroImage} 
          alt="Offshore oil platforms in the Caspian Sea representing Kazakhstan's energy industry"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </picture>
      {/* Dark blue overlay for text readability */}
      <div className="absolute inset-0 bg-primary/40" />
      {/* Subtle bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
      
      {/* Content with enhanced background for readability */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <div className="max-w-6xl mx-auto space-y-12 backdrop-blur-sm bg-primary/20 rounded-2xl p-8 lg:p-12">
          
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            {t('hero.title')}
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl font-light max-w-5xl mx-auto leading-relaxed text-white/95">
            {t('hero.subtitle')}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Link to="/services">
              <Button 
                size="lg" 
                className="btn-primary w-full sm:w-auto group"
              >
                {t('hero.exploreServices')}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            
            <Link to="/contacts">
              <Button 
                size="lg" 
                className="btn-outline w-full sm:w-auto group"
              >
                <Quote className="mr-2 h-5 w-5" />
                {t('hero.requestQuote')}
              </Button>
            </Link>
          </div>
          
          {/* Optional lighter stats row */}
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
  );
};

export default Hero;