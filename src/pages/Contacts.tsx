import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import ContactForm from '@/components/home/ContactForm';
import { Skeleton } from '@/components/ui/skeleton';
import { useContacts } from '@/hooks/useContent';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';

const Contacts = () => {
  const { t, i18n } = useTranslation();
  const { data: contacts, loading, error } = useContacts();

  if (loading) {
    return (
      <Layout>
        <SEO 
          title={t('seo.contacts.title')}
          description={t('seo.contacts.description')}
          canonical="/contacts"
        />
        
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Skeleton className="h-12 w-1/2 mx-auto mb-8" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <Skeleton className="h-8 w-1/3" />
                  <div className="space-y-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-start space-x-4">
                        <Skeleton className="h-6 w-6 flex-shrink-0" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-1/4 mb-2" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-card p-8 rounded-xl">
                  <Skeleton className="h-8 w-1/2 mb-6" />
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-1/4 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title={t('seo.contacts.title')}
        description={t('seo.contacts.description')}
        canonical="/contacts"
      />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary text-center">
              {t('navigation.contacts')}
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Contact Information */}
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-primary">{t('contacts.getInTouch')}</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">{t('contacts.address')}</h3>
                      <p className="text-muted-foreground">
                        {contacts?.address || t('footer.address')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">{t('contacts.phone')}</h3>
                      <p className="text-muted-foreground">
                        {contacts?.phone || t('footer.phone')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">{t('contacts.email')}</h3>
                      <p className="text-muted-foreground">
                        {contacts?.email || t('footer.email')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">{t('contacts.workingHours')}</h3>
                      <p className="text-muted-foreground">
                        {contacts?.working_hours || t('footer.workingHours')}
                      </p>
                    </div>
                  </div>
                  
                  {contacts?.map_link && (
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-foreground">{t('contacts.location')}</h3>
                        <a
                          href={contacts.map_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center"
                        >
                          {t('contacts.viewOnMap')}
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Contact Form */}
              <ContactForm />
            </div>
            
            {error && (
              <div className="mt-8 text-center">
                <p className="text-muted-foreground">{t('common.error')}</p>
              </div>
            )}
            
            {i18n.language !== 'en' && contacts && (
              <p className="text-xs text-muted-foreground text-center mt-8 italic">
                {t('common.translationNote')}
              </p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contacts;