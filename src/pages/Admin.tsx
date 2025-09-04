import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogOut, Save, Eye, Settings } from 'lucide-react';
import { useState } from 'react';
import { SiteSettings } from '@/hooks/useSiteSettings';

const Admin = () => {
  const { user, loading: authLoading, isAdmin, signOut } = useAuth();
  const { settings, loading: settingsLoading, updateSettings } = useSiteSettings();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<SiteSettings>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/login');
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!authLoading && user && !isAdmin) {
      navigate('/');
    }
  }, [authLoading, user, isAdmin, navigate]);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  if (authLoading || settingsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const handleInputChange = (field: keyof SiteSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(formData);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    window.open('/', '_blank');
  };

  return (
    <Layout>
      <SEO 
        title="Admin Panel - CT-KZ"
        description="Admin panel for managing website content"
        canonical="/admin"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">
              Manage your website content and settings
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handlePreview} variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button onClick={signOut} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {user.email && (
          <Alert className="mb-6">
            <Settings className="h-4 w-4" />
            <AlertDescription>
              Logged in as: <strong>{user.email}</strong> (Admin)
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="layout">Layout Settings</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="localization">Localization</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Background & Styling</CardTitle>
                <CardDescription>
                  Configure the hero section appearance and background
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="hero_bg_url">Background Image URL</Label>
                  <Input
                    id="hero_bg_url"
                    value={formData.hero_bg_url || ''}
                    onChange={(e) => handleInputChange('hero_bg_url', e.target.value)}
                    placeholder="/hero-image.jpg"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Overlay Opacity: {formData.hero_overlay_opacity || 0.45}</Label>
                    <Slider
                      value={[formData.hero_overlay_opacity || 0.45]}
                      onValueChange={(value) => handleInputChange('hero_overlay_opacity', value[0])}
                      max={1}
                      min={0}
                      step={0.05}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Min Height (vh): {formData.hero_min_height_vh || 88}</Label>
                    <Slider
                      value={[formData.hero_min_height_vh || 88]}
                      onValueChange={(value) => handleInputChange('hero_min_height_vh', value[0])}
                      max={100}
                      min={50}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Top Padding (px): {formData.hero_top_padding_px || 140}</Label>
                    <Slider
                      value={[formData.hero_top_padding_px || 140]}
                      onValueChange={(value) => handleInputChange('hero_top_padding_px', value[0])}
                      max={300}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Content Max Width (px): {formData.content_max_width_px || 1100}</Label>
                    <Slider
                      value={[formData.content_max_width_px || 1100]}
                      onValueChange={(value) => handleInputChange('content_max_width_px', value[0])}
                      max={1400}
                      min={800}
                      step={50}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>CTA Buttons</CardTitle>
                <CardDescription>
                  Configure call-to-action button links
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cta1_link">Primary CTA Link</Label>
                  <Input
                    id="cta1_link"
                    value={formData.cta1_link || ''}
                    onChange={(e) => handleInputChange('cta1_link', e.target.value)}
                    placeholder="/services"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cta2_link">Secondary CTA Link</Label>
                  <Input
                    id="cta2_link"
                    value={formData.cta2_link || ''}
                    onChange={(e) => handleInputChange('cta2_link', e.target.value)}
                    placeholder="/contacts"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Tabs defaultValue="en" className="space-y-4">
              <TabsList>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ru">Russian</TabsTrigger>
                <TabsTrigger value="kk">Kazakh</TabsTrigger>
              </TabsList>

              <TabsContent value="en">
                <Card>
                  <CardHeader>
                    <CardTitle>English Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hero_title_en">Hero Title</Label>
                      <Textarea
                        id="hero_title_en"
                        value={formData.hero_title_en || ''}
                        onChange={(e) => handleInputChange('hero_title_en', e.target.value)}
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hero_subtitle_en">Hero Subtitle</Label>
                      <Textarea
                        id="hero_subtitle_en"
                        value={formData.hero_subtitle_en || ''}
                        onChange={(e) => handleInputChange('hero_subtitle_en', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cta1_text_en">Primary CTA Text</Label>
                        <Input
                          id="cta1_text_en"
                          value={formData.cta1_text_en || ''}
                          onChange={(e) => handleInputChange('cta1_text_en', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cta2_text_en">Secondary CTA Text</Label>
                        <Input
                          id="cta2_text_en"
                          value={formData.cta2_text_en || ''}
                          onChange={(e) => handleInputChange('cta2_text_en', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ru">
                <Card>
                  <CardHeader>
                    <CardTitle>Russian Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hero_title_ru">Hero Title</Label>
                      <Textarea
                        id="hero_title_ru"
                        value={formData.hero_title_ru || ''}
                        onChange={(e) => handleInputChange('hero_title_ru', e.target.value)}
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hero_subtitle_ru">Hero Subtitle</Label>
                      <Textarea
                        id="hero_subtitle_ru"
                        value={formData.hero_subtitle_ru || ''}
                        onChange={(e) => handleInputChange('hero_subtitle_ru', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cta1_text_ru">Primary CTA Text</Label>
                        <Input
                          id="cta1_text_ru"
                          value={formData.cta1_text_ru || ''}
                          onChange={(e) => handleInputChange('cta1_text_ru', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cta2_text_ru">Secondary CTA Text</Label>
                        <Input
                          id="cta2_text_ru"
                          value={formData.cta2_text_ru || ''}
                          onChange={(e) => handleInputChange('cta2_text_ru', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="kk">
                <Card>
                  <CardHeader>
                    <CardTitle>Kazakh Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hero_title_kk">Hero Title</Label>
                      <Textarea
                        id="hero_title_kk"
                        value={formData.hero_title_kk || ''}
                        onChange={(e) => handleInputChange('hero_title_kk', e.target.value)}
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hero_subtitle_kk">Hero Subtitle</Label>
                      <Textarea
                        id="hero_subtitle_kk"
                        value={formData.hero_subtitle_kk || ''}
                        onChange={(e) => handleInputChange('hero_subtitle_kk', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cta1_text_kk">Primary CTA Text</Label>
                        <Input
                          id="cta1_text_kk"
                          value={formData.cta1_text_kk || ''}
                          onChange={(e) => handleInputChange('cta1_text_kk', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cta2_text_kk">Secondary CTA Text</Label>
                        <Input
                          id="cta2_text_kk"
                          value={formData.cta2_text_kk || ''}
                          onChange={(e) => handleInputChange('cta2_text_kk', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="localization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Localization Settings</CardTitle>
                <CardDescription>
                  Configure default language and regional settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="locale_default">Default Language</Label>
                  <select
                    id="locale_default"
                    value={formData.locale_default || 'en'}
                    onChange={(e) => handleInputChange('locale_default', e.target.value)}
                    className="w-full p-2 border border-input rounded-md bg-background"
                  >
                    <option value="en">English</option>
                    <option value="ru">Russian</option>
                    <option value="kk">Kazakh</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4 mt-8">
          <Button onClick={handlePreview} variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview Changes
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;