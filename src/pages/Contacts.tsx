import { useTranslationHelper } from '@/hooks/useTranslationHelper';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import ContactForm from '@/components/home/ContactForm';
import { Skeleton } from '@/components/ui/skeleton';
import { useContacts } from '@/hooks/useContent';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';

const Contacts = () => {
  const { tSafe, isUsingFallback } = useTranslationHelper();
  const { data: contacts, loading, error } = useContacts();

  if (loading) {
    return (
      <Layout>
      <SEO 
        title={tSafe('seo.contacts.title', 'Contact Marine Support Services - Aktau Kazakhstan')}
        description={tSafe('seo.contacts.description', 'Get in touch with Marine Support Services for marine and industrial equipment needs in Kazakhstan.')}
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
        title={tSafe('seo.contacts.title', 'Contact Marine Support Services - Aktau Kazakhstan')}
        description={tSafe('seo.contacts.description', 'Get in touch with Marine Support Services for marine and industrial equipment needs in Kazakhstan.')}
        canonical="/contacts"
      />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary text-center">
              {tSafe('navigation.contacts', 'Contacts')}
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Contact Information */}
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-primary">{tSafe('contacts.getInTouch', 'Get in Touch')}</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">{tSafe('contacts.address', 'Address')}</h3>
                      <p className="text-muted-foreground">
                        {contacts?.address || tSafe('footer.address', 'Aktau, Kazakhstan')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">{tSafe('contacts.phone', 'Phone')}</h3>
                      <p className="text-muted-foreground">
                        {contacts?.phone || tSafe('footer.phone', '+7 (7292) xxx-xxx')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">{tSafe('contacts.email', 'Email')}</h3>
                      <p className="text-muted-foreground">
                        {contacts?.email || tSafe('footer.email', 'info@marines.kz')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">{tSafe('contacts.workingHours', 'Working Hours')}</h3>
                      <p className="text-muted-foreground">
                        {contacts?.working_hours || tSafe('footer.workingHours', 'Mon-Fri: 9:00 - 18:00')}
                      </p>
                    </div>
                  </div>
                  
                  {contacts?.map_link && (
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-foreground">{tSafe('contacts.location', 'Location')}</h3>
                        <a
                          href={contacts.map_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center"
                        >
                          {tSafe('contacts.viewOnMap', 'View on Map')}
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
                <p className="text-muted-foreground">{tSafe('common.error', 'Something went wrong. Please try again.')}</p>
              </div>
            )}
            
            {isUsingFallback('contacts.getInTouch') && (
              <p className="text-xs text-muted-foreground text-center mt-8 italic">
                {tSafe('common.translationComingSoon', 'Translation coming soon')}
              </p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contacts;