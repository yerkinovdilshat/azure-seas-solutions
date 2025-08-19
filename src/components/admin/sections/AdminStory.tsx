import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import FileUpload from '@/components/admin/FileUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { Copy, Save, Loader2 } from 'lucide-react';

interface AdminStoryProps {
  locale: string;
}

interface StoryData {
  id?: string;
  title: string;
  body_rich: any;
  hero_image: string | null;
}

const AdminStory = ({ locale }: AdminStoryProps) => {
  const [data, setData] = useState<StoryData>({
    title: '',
    body_rich: null,
    hero_image: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStory();
  }, [locale]);

  const fetchStory = async () => {
    try {
      const { data: story, error } = await supabase
        .from('about_story')
        .select('*')
        .eq('locale', locale)
        .maybeSingle();

      if (error) throw error;

      if (story) {
        setData({
          id: story.id,
          title: story.title || '',
          body_rich: story.body_rich,
          hero_image: story.hero_image,
        });
      } else {
        setData({
          title: '',
          body_rich: null,
          hero_image: null,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error loading story",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        locale,
        title: data.title,
        body_rich: data.body_rich,
        hero_image: data.hero_image,
        updated_at: new Date().toISOString(),
      };

      if (data.id) {
        const { error } = await supabase
          .from('about_story')
          .update(payload)
          .eq('id', data.id);

        if (error) throw error;
      } else {
        const { data: newStory, error } = await supabase
          .from('about_story')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        setData(prev => ({ ...prev, id: newStory.id }));
      }

      toast({
        title: "Story saved",
        description: "Story content has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving story",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async () => {
    const targetLocales = ['en', 'ru', 'kk'].filter(l => l !== locale);
    
    if (!data.title || !data.body_rich) {
      toast({
        title: "No content to duplicate",
        description: "Please add content before duplicating.",
        variant: "destructive",
      });
      return;
    }

    try {
      for (const targetLocale of targetLocales) {
        const { error } = await supabase
          .from('about_story')
          .upsert({
            locale: targetLocale,
            title: data.title,
            body_rich: data.body_rich,
            hero_image: data.hero_image,
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      toast({
        title: "Content duplicated",
        description: `Story duplicated to ${targetLocales.join(', ')} locales.`,
      });
    } catch (error: any) {
      toast({
        title: "Error duplicating content",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Story Content ({locale.toUpperCase()})
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDuplicate}
              disabled={saving}
            >
              <Copy className="h-4 w-4 mr-2" />
              Duplicate to Other Locales
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !data.title}
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={data.title}
            onChange={(e) => setData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="About Marine Support Services"
          />
        </div>

        {/* Rich Text Content */}
        <div className="space-y-2">
          <Label>Content</Label>
          <RichTextEditor
            value={data.body_rich}
            onChange={(value) => setData(prev => ({ ...prev, body_rich: value }))}
            placeholder="Enter the company story and mission..."
          />
        </div>

        {/* Hero Image */}
        <div className="space-y-2">
          <Label>Hero Image</Label>
          <FileUpload
            value={data.hero_image}
            onChange={(url) => setData(prev => ({ ...prev, hero_image: url }))}
            bucket="images"
            folder="story"
            accept="image/*"
            allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
            placeholder="Upload hero image (optional)"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminStory;