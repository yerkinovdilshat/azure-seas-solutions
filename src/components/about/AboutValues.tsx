import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ValueItem } from '@/hooks/useAboutData';

interface AboutValuesProps {
  data: ValueItem[];
}

const AboutValues: React.FC<AboutValuesProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-foreground">Our Values</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((value) => (
          <Card key={value.id} className="card-modern">
            <CardHeader>
              <CardTitle className="text-xl">{value.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{value.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AboutValues;