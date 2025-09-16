import React from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAboutCertificates } from '@/hooks/useAboutData';
import { Download, FileText, Calendar } from 'lucide-react';

const AboutCertificates: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data: certificates, loading, error } = useAboutCertificates();

  if (loading) {
    return (
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-10 w-1/3 mx-auto mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-background p-6 rounded-xl">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !certificates || certificates.length === 0) {
    return (
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-primary">{t('about.certificates')}</h2>
            <p className="text-muted-foreground">
              {error ? t('common.error') : t('common.noData')}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const formatDate = (date: string | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-16 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            {t('about.certificates')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <div key={certificate.id} className="bg-background p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                {certificate.image_url && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer mb-4">
                        <img
                          src={certificate.image_url}
                          alt={certificate.title}
                          className="w-full h-48 object-cover rounded-lg hover:opacity-90 transition-opacity"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                      <img
                        src={certificate.image_url}
                        alt={certificate.title}
                        className="w-full h-auto max-h-[80vh] object-contain"
                      />
                    </DialogContent>
                  </Dialog>
                )}
                
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {certificate.title}
                </h3>
                
                {certificate.issuer && (
                  <p className="text-muted-foreground mb-2">
                    <span className="font-medium">{t('about.issuer')}:</span> {certificate.issuer}
                  </p>
                )}
                
                {certificate.date && (
                  <p className="text-muted-foreground mb-4 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(certificate.date)}
                  </p>
                )}
                
                {certificate.file_url && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <a
                      href={certificate.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {t('common.download')}
                    </a>
                  </Button>
                )}
                
                {!certificate.image_url && !certificate.file_url && (
                  <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {i18n.language !== 'en' && certificates.length > 0 && (
            <p className="text-xs text-muted-foreground text-center mt-8 italic">
              {t('common.translationNote')}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutCertificates;