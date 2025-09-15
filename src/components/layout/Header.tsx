import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTranslationHelper } from '@/hooks/useTranslationHelper';
import { useServicesData } from '@/hooks/useServicesData';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { tSafe } = useTranslationHelper();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: servicesData } = useServicesData();
  const services = servicesData?.data || [];

  // Create navigation links with dynamic services
  const navigationLinks = [
    { href: '/', labelKey: 'navigation.home' },
    { href: '/about', labelKey: 'navigation.about' },
    { 
      labelKey: 'navigation.services',
      href: '/services',
      dropdown: services.map(service => ({
        href: `/services/${service.slug}`,
        label: service.title
      }))
    },
    { 
      labelKey: 'navigation.catalog',
      href: '/catalog',
      dropdown: [
        { href: '/catalog/production', labelKey: 'catalog.production' },
        { href: '/catalog/supply', labelKey: 'catalog.supply' },
      ]
    },
    { href: '/projects', labelKey: 'navigation.projects' },
    { href: '/news', labelKey: 'navigation.news' },
    { href: '/contacts', labelKey: 'navigation.contacts' },
  ];

  const languages = [
    { code: 'en', name: 'ENG', flag: '🇺🇸' },
    { code: 'ru', name: 'RUS', flag: '🇷🇺' },
    { code: 'kk', name: 'KAZ', flag: '🇰🇿' },
  ];

  // Persist language preference and update URL if needed
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const changeLanguage = (languageCode: string) => {
    // Save preference
    localStorage.setItem('preferred-language', languageCode);
    
    // Change language
    i18n.changeLanguage(languageCode);
    
    // Update meta tags for SEO
    updateSEOMetaTags(languageCode);
    
    // Update URL if needed for better SEO
    const currentPath = location.pathname;
    if (currentPath !== '/') {
      // Could implement locale-specific URLs here if needed
      // For now, we'll just refresh the page content
      window.location.reload();
    }
  };

  const updateSEOMetaTags = (languageCode: string) => {
    // Update HTML lang attribute
    document.documentElement.lang = languageCode;
    
    // Update hreflang links
    const existingHreflangLinks = document.querySelectorAll('link[hreflang]');
    existingHreflangLinks.forEach(link => link.remove());
    
    languages.forEach(lang => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang.code;
      link.href = `${window.location.origin}${location.pathname}`;
      document.head.appendChild(link);
    });
    
    // Add x-default hreflang
    const defaultLink = document.createElement('link');
    defaultLink.rel = 'alternate';
    defaultLink.hreflang = 'x-default';
    defaultLink.href = `${window.location.origin}${location.pathname}`;
    document.head.appendChild(defaultLink);
  };

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 header-glass">
      <nav className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo - Left */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <img src="/logo.png" alt="Marine Support Services" className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation - Center */}
        <div className="hidden lg:flex items-center justify-center flex-1">
          <div className="flex items-center space-x-8">
            {navigationLinks.map((link) => {
              if (link.dropdown) {
                const isActiveDropdown = isActive(link.href!) || link.dropdown.some(item => isActive(item.href));
                return (
                  <div key={link.labelKey} className="relative group">
                    {/* Parent link - clickable to navigate */}
                    <Link
                      to={link.href!}
                      className={`flex items-center gap-1 font-medium text-sm transition-colors relative ${
                        isActiveDropdown ? 'text-primary' : 'text-foreground hover:text-primary'
                      }`}
                    >
                      <span>{t(link.labelKey)}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform group-hover:rotate-180 ${
                        isActiveDropdown ? 'text-primary' : 'text-foreground group-hover:text-primary'
                      }`} />
                      <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${
                        isActiveDropdown ? 'w-full' : ''
                      }`} />
                    </Link>
                    
                    {/* Dropdown menu - appears on hover */}
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="bg-background/95 backdrop-blur-md border border-border/20 shadow-lg rounded-md min-w-48 py-2">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            className={`block w-full px-4 py-2 text-sm transition-colors hover:bg-accent/50 ${
                              isActive(item.href) ? 'text-primary font-medium bg-accent/30' : 'text-foreground hover:text-primary'
                            }`}
                          >
                            {item.label || tSafe(item.labelKey, item.labelKey?.split('.').pop()?.replace(/([A-Z])/g, ' $1') || 'Service')}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`font-medium text-sm transition-colors relative group ${
                    isActive(link.href)
                      ? 'text-primary'
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  {t(link.labelKey)}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${
                    isActive(link.href) ? 'w-full' : ''
                  }`} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Desktop Right Section */}
        <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent group outline-none">
              <Globe className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
              <span className="text-foreground group-hover:text-primary">
                {languages.find(lang => lang.code === i18n.language)?.name || 'ENG'}
              </span>
              <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground group-data-[state=open]:rotate-180 transition-transform" />
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="bg-background/95 backdrop-blur-md border border-border/20 shadow-lg"
              sideOffset={8}
              align="end"
            >
              {languages.map((lang) => (
                <DropdownMenuItem key={lang.code} asChild>
                  <button
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                      i18n.language === lang.code
                        ? 'text-primary font-medium bg-accent/50'
                        : 'text-foreground hover:text-primary hover:bg-accent/30'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                    {i18n.language === lang.code && (
                      <span className="ml-auto text-xs text-primary">✓</span>
                    )}
                  </button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-6 bg-border/40" />

          {/* Request Quote CTA */}
          <Link
            to="/contacts"
            className="btn-primary text-sm px-6 py-2"
          >
            {t('navigation.requestQuote')}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {navigationLinks.map((link) => {
                if (link.dropdown) {
                  return (
                    <div key={link.labelKey} className="space-y-2">
                      <span className="text-sm font-medium text-muted-foreground">{t(link.labelKey)}</span>
                      <div className="pl-4 space-y-2">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            className={`block text-sm font-medium transition-colors ${
                              isActive(item.href) ? 'text-primary' : 'text-foreground hover:text-primary'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.label || tSafe(item.labelKey, item.labelKey?.split('.').pop()?.replace(/([A-Z])/g, ' $1') || 'Service')}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`text-sm font-medium transition-colors ${
                      isActive(link.href) ? 'text-primary' : 'text-foreground hover:text-primary'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t(link.labelKey)}
                  </Link>
                );
              })}
              
              {/* Mobile Language Switcher */}
              <div className="pt-4 border-t border-border/20">
                <span className="text-sm font-medium text-muted-foreground mb-3 block">Language / Язык / Тіл</span>
                <div className="grid grid-cols-3 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors ${
                        i18n.language === lang.code 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-accent/30 text-foreground hover:bg-accent/50'
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Request Quote CTA */}
              <Link to="/contacts" onClick={() => setIsMenuOpen(false)}>
                <Button className="btn-primary w-full mt-4">
                  {t('navigation.requestQuote')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;