import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/adminApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AdminSiteSettings() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<any>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin', 'site-settings'],
    queryFn: () => adminApi.getSiteSettings(),
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) => adminApi.saveSiteSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-settings'] });
      toast.success('Site settings saved successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save settings');
    },
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hero Section Settings</CardTitle>
          <CardDescription>Configure the main hero section of your website</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hero Titles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="hero_title_ru">Hero Title (Russian)</Label>
                <Textarea
                  id="hero_title_ru"
                  value={formData.hero_title_ru || ''}
                  onChange={(e) => handleChange('hero_title_ru', e.target.value)}
                  placeholder="Hero title in Russian"
                />
              </div>
              <div>
                <Label htmlFor="hero_title_en">Hero Title (English)</Label>
                <Textarea
                  id="hero_title_en"
                  value={formData.hero_title_en || ''}
                  onChange={(e) => handleChange('hero_title_en', e.target.value)}
                  placeholder="Hero title in English"
                />
              </div>
              <div>
                <Label htmlFor="hero_title_kk">Hero Title (Kazakh)</Label>
                <Textarea
                  id="hero_title_kk"
                  value={formData.hero_title_kk || ''}
                  onChange={(e) => handleChange('hero_title_kk', e.target.value)}
                  placeholder="Hero title in Kazakh"
                />
              </div>
            </div>

            {/* Hero Subtitles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="hero_subtitle_ru">Hero Subtitle (Russian)</Label>
                <Textarea
                  id="hero_subtitle_ru"
                  value={formData.hero_subtitle_ru || ''}
                  onChange={(e) => handleChange('hero_subtitle_ru', e.target.value)}
                  placeholder="Hero subtitle in Russian"
                />
              </div>
              <div>
                <Label htmlFor="hero_subtitle_en">Hero Subtitle (English)</Label>
                <Textarea
                  id="hero_subtitle_en"
                  value={formData.hero_subtitle_en || ''}
                  onChange={(e) => handleChange('hero_subtitle_en', e.target.value)}
                  placeholder="Hero subtitle in English"
                />
              </div>
              <div>
                <Label htmlFor="hero_subtitle_kk">Hero Subtitle (Kazakh)</Label>
                <Textarea
                  id="hero_subtitle_kk"
                  value={formData.hero_subtitle_kk || ''}
                  onChange={(e) => handleChange('hero_subtitle_kk', e.target.value)}
                  placeholder="Hero subtitle in Kazakh"
                />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Primary CTA Button</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="cta1_text_ru">Text (RU)</Label>
                    <Input
                      id="cta1_text_ru"
                      value={formData.cta1_text_ru || ''}
                      onChange={(e) => handleChange('cta1_text_ru', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cta1_text_en">Text (EN)</Label>
                    <Input
                      id="cta1_text_en"
                      value={formData.cta1_text_en || ''}
                      onChange={(e) => handleChange('cta1_text_en', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cta1_text_kk">Text (KK)</Label>
                    <Input
                      id="cta1_text_kk"
                      value={formData.cta1_text_kk || ''}
                      onChange={(e) => handleChange('cta1_text_kk', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cta1_link">Link URL</Label>
                  <Input
                    id="cta1_link"
                    value={formData.cta1_link || ''}
                    onChange={(e) => handleChange('cta1_link', e.target.value)}
                    placeholder="/catalog"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Secondary CTA Button</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="cta2_text_ru">Text (RU)</Label>
                    <Input
                      id="cta2_text_ru"
                      value={formData.cta2_text_ru || ''}
                      onChange={(e) => handleChange('cta2_text_ru', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cta2_text_en">Text (EN)</Label>
                    <Input
                      id="cta2_text_en"
                      value={formData.cta2_text_en || ''}
                      onChange={(e) => handleChange('cta2_text_en', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cta2_text_kk">Text (KK)</Label>
                    <Input
                      id="cta2_text_kk"
                      value={formData.cta2_text_kk || ''}
                      onChange={(e) => handleChange('cta2_text_kk', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cta2_link">Link URL</Label>
                  <Input
                    id="cta2_link"
                    value={formData.cta2_link || ''}
                    onChange={(e) => handleChange('cta2_link', e.target.value)}
                    placeholder="/about"
                  />
                </div>
              </div>
            </div>

            {/* Hero Background */}
            <div>
              <Label htmlFor="hero_bg_url">Hero Background Image URL</Label>
              <Input
                id="hero_bg_url"
                value={formData.hero_bg_url || ''}
                onChange={(e) => handleChange('hero_bg_url', e.target.value)}
                placeholder="/uploads/hero-bg.jpg"
              />
            </div>

            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}