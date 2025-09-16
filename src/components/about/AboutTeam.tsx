import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Mail } from 'lucide-react';

interface AboutTeamProps {
  data?: any;
}

const AboutTeam = ({ data }: AboutTeamProps) => {
  const { t } = useTranslation();

  const defaultTeam = [
    {
      name: 'Leadership Team',
      role: 'Executive Management',
      description: 'Experienced professionals with deep industry knowledge and commitment to excellence.',
      email: 'management@marines.kz'
    },
    {
      name: 'Engineering Team',
      role: 'Technical Specialists', 
      description: 'Skilled engineers specializing in HVAC systems, commissioning, and industrial solutions.',
      email: 'engineering@marines.kz'
    },
    {
      name: 'Operations Team',
      role: 'Project Management',
      description: 'Dedicated project managers ensuring timely delivery and quality execution.',
      email: 'operations@marines.kz'
    }
  ];

  const team = Array.isArray(data) ? data : defaultTeam;

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">
          {t('about.team.title') || 'Our Team'}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('about.team.subtitle') || 'Meet the professionals who make our success possible.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {team.map((member: any, index: number) => (
          <Card key={index} className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="text-primary font-medium">
                  {member.role}
                </p>
                <p className="text-muted-foreground text-sm">
                  {member.description}
                </p>
              </div>
              {member.email && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${member.email}`} className="hover:text-primary">
                    {member.email}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default AboutTeam;