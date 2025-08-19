import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  schema?: any;
}

const SEO = ({ title, description, canonical, ogImage, schema }: SEOProps) => {
  const { t, i18n } = useTranslation();
  
  const defaultTitle = t('seo.home.title');
  const defaultDescription = t('seo.home.description');
  const baseUrl = 'https://marines.kz';
  
  const fullTitle = title || defaultTitle;
  const fullDescription = description || defaultDescription;
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl;
  const fullOgImage = ogImage || `${baseUrl}/og-image.jpg`;

  // Generate hreflang links
  const hreflangs = [
    { lang: 'en', url: `${baseUrl}${canonical || ''}` },
    { lang: 'ru', url: `${baseUrl}/ru${canonical || ''}` },
    { lang: 'kk', url: `${baseUrl}/kk${canonical || ''}` },
    { lang: 'x-default', url: `${baseUrl}${canonical || ''}` },
  ];

  // Default JSON-LD schema
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Marine Support Services',
    alternateName: 'marines.kz',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Marine and industrial services provider in Kazakhstan',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Aktau',
      addressLocality: 'Aktau',
      addressCountry: 'KZ'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+7-7292-xxx-xxx',
      contactType: 'Customer Service',
      email: 'info@marines.kz'
    },
    sameAs: [
      'https://facebook.com/marinesupport',
      'https://linkedin.com/company/marine-support-services',
      'https://youtube.com/@marinesupport'
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <link rel="canonical" href={fullCanonical} />
      
      {/* Language Tags */}
      <html lang={i18n.language} />
      {hreflangs.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:site_name" content="Marine Support Services" />
      <meta property="og:locale" content={i18n.language === 'en' ? 'en_US' : i18n.language === 'ru' ? 'ru_RU' : 'kk_KZ'} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullOgImage} />
      
      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify(schema || defaultSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;