import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useAboutTeam } from '@/hooks/useAboutData';
import { User } from 'lucide-react';

const AboutTeam: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data: team, loading, error } = useAboutTeam();
  const [selectedMember, setSelectedMember] = useState<any>(null);

  if (loading) {
    return (
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-10 w-1/3 mx-auto mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-background p-6 rounded-xl text-center">
                  <Skeleton className="h-32 w-32 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !team || team.length === 0) {
    return (
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-primary">{t('about.team')}</h2>
            <p className="text-muted-foreground">
              {error ? t('common.error') : t('common.noData')}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            {t('about.team')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {team.map((member) => (
              <Dialog key={member.id}>
                <DialogTrigger asChild>
                  <div className="bg-background p-6 rounded-xl text-center cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                          <User className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      {member.name}
                    </h3>
                    {member.role && (
                      <p className="text-muted-foreground text-sm">
                        {member.role}
                      </p>
                    )}
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                          <User className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      {member.name}
                    </h3>
                    {member.role && (
                      <p className="text-primary font-medium mb-4">
                        {member.role}
                      </p>
                    )}
                    {member.bio && (
                      <p className="text-muted-foreground leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
          
          {i18n.language !== 'en' && team.length > 0 && (
            <p className="text-xs text-muted-foreground text-center mt-8 italic">
              {t('common.translationNote')}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutTeam;