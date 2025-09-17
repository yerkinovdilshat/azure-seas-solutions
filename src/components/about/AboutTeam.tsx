import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TeamMember } from '@/hooks/useAboutData';

interface AboutTeamProps {
  data: TeamMember[];
}

const AboutTeam: React.FC<AboutTeamProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-foreground">Our Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((member) => (
          <Card key={member.id} className="card-modern">
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={member.image_url} alt={member.name} />
                <AvatarFallback>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{member.name}</CardTitle>
              <p className="text-primary font-medium">{member.position}</p>
            </CardHeader>
            {member.bio && (
              <CardContent>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AboutTeam;