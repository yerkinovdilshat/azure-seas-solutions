import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';

interface TeamMember {
  id: string;
  name: string;
  role?: string;
  bio?: string;
  photo?: string;
  order: number;
}

interface AboutTeamProps {
  data: TeamMember[];
}

const AboutTeam = ({ data }: AboutTeamProps) => {
  const { t } = useTranslation();

  if (!data || data.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">{t('about.sections.team')}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {data.map((member) => (
          <Card key={member.id} className="overflow-hidden">
            {member.photo && (
              <img src={member.photo} alt={member.name} className="w-full h-48 object-cover" />
            )}
            <CardContent className="p-6 space-y-2">
              <h3 className="text-lg font-medium">{member.name}</h3>
              {member.role && <p className="text-primary font-medium">{member.role}</p>}
              {member.bio && <p className="text-muted-foreground text-sm">{member.bio}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default AboutTeam;