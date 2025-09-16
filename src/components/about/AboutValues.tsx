import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';

interface ValueItem {
  id: string;
  title: string;
  description?: string;
  icon_key?: string;
  order: number;
}

interface AboutValuesProps {
  data: ValueItem[];
}

const AboutValues = ({ data }: AboutValuesProps) => {
  const { t } = useTranslation();

  if (!data || data.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">{t('about.sections.values')}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {data.map((value) => (
          <Card key={value.id} className="group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center space-y-4">
              <h3 className="text-lg font-semibold">{value.title}</h3>
              {value.description && (
                <p className="text-sm text-muted-foreground">{value.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default AboutValues;