import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, X, ChevronDown } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const navigationLinks = [
    { href: '/', labelKey: 'navigation.home' },
    { href: '/about', labelKey: 'navigation.about' },
    { 
      labelKey: 'navigation.services',
      dropdown: [
        { href: '/services/civil-maintenance', labelKey: 'services.civilMaintenance' },
        { href: '/services/steel-fabrication', labelKey: 'services.steelFabrication' },
        { href: '/services/hydraulic-workshop', labelKey: 'services.hydraulicWorkshop' },
      ]
    },
    { 
      labelKey: 'navigation.catalog',
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
    { code: 'en', name: 'ENG' },
    { code: 'ru', name: 'RUS' },
    { code: 'kk', name: 'KAZ' },
  ];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
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
                const isActiveDropdown = link.dropdown.some(item => isActive(item.href));
                return (
                  <DropdownMenu key={link.labelKey}>
                    <DropdownMenuTrigger className="flex items-center gap-1 font-medium text-sm transition-colors group outline-none">
                      <span className={`transition-colors ${
                        isActiveDropdown ? 'text-primary' : 'text-foreground hover:text-primary'
                      }`}>
                        {t(link.labelKey)}
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform group-data-[state=open]:rotate-180 ${
                        isActiveDropdown ? 'text-primary' : 'text-foreground group-hover:text-primary'
                      }`} />
                      <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${
                        isActiveDropdown ? 'w-full' : ''
                      }`} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-background/95 backdrop-blur-md border border-border/20">
                      {link.dropdown.map((item) => (
                        <DropdownMenuItem key={item.href} asChild>
                          <Link
                            to={item.href}
                            className={`w-full px-3 py-2 text-sm transition-colors ${
                              isActive(item.href) ? 'text-primary font-medium' : 'text-foreground hover:text-primary'
                            }`}
                          >
                            {t(item.labelKey)}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
          <div className="flex items-center space-x-1 text-sm">
            {languages.map((lang, index) => (
              <React.Fragment key={lang.code}>
                <button
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-2 py-1 rounded transition-colors ${
                    i18n.language === lang.code
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {lang.name}
                </button>
                {index < languages.length - 1 && (
                  <span className="text-border">/</span>
                )}
              </React.Fragment>
            ))}
          </div>

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
                            {t(item.labelKey)}
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
              <div className="flex items-center space-x-2 pt-4 border-t border-border/20">
                <div className="flex space-x-1">
                  {languages.map((lang, index) => (
                    <React.Fragment key={lang.code}>
                      <button
                        onClick={() => changeLanguage(lang.code)}
                        className={`text-sm px-2 py-1 rounded ${
                          i18n.language === lang.code 
                            ? 'bg-primary text-primary-foreground' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {lang.name}
                      </button>
                      {index < languages.length - 1 && (
                        <span className="text-border text-sm">/</span>
                      )}
                    </React.Fragment>
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