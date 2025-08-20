import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, Copy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import RichTextEditor from '@/components/admin/RichTextEditor';
import FileUpload from '@/components/admin/FileUpload';

interface NewsItem {
  id: string;
  locale: string;
  title: string;
  slug: string;
  excerpt: string;
  content_rich: any;
  featured_image: string;
  gallery_images: string[];
  video_url: string;
  published_at: string;
  status: 'draft' | 'published';
  is_featured: boolean;
  order: number;
}

interface AdminNewsProps {
  locale: string;
}

const AdminNews = ({ locale }: AdminNewsProps) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content_rich: null,
    featured_image: '',
    gallery_images: [] as string[],
    video_url: '',
    status: 'draft' as 'draft' | 'published',
    is_featured: false,
    order: 0
  });

  useEffect(() => {
    fetchNews();
  }, [locale]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('locale', locale)
        .order('order', { ascending: true });

      if (error) throw error;
      setNews((data || []) as NewsItem[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newsData = {
        ...formData,
        locale,
        published_at: formData.status === 'published' ? new Date().toISOString() : null
      };

      if (editingNews) {
        const { error } = await supabase
          .from('news')
          .update(newsData)
          .eq('id', editingNews.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "News article updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('news')
          .insert([newsData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "News article created successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchNews();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news article?')) return;

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "News article deleted successfully",
      });
      
      fetchNews();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content_rich: null,
      featured_image: '',
      gallery_images: [],
      video_url: '',
      status: 'draft',
      is_featured: false,
      order: 0
    });
    setEditingNews(null);
  };

  const openEditDialog = (newsItem: NewsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      slug: newsItem.slug,
      excerpt: newsItem.excerpt || '',
      content_rich: newsItem.content_rich,
      featured_image: newsItem.featured_image || '',
      gallery_images: newsItem.gallery_images || [],
      video_url: newsItem.video_url || '',
      status: newsItem.status,
      is_featured: newsItem.is_featured,
      order: newsItem.order
    });
    setIsDialogOpen(true);
  };

  const duplicateToLocale = async (newsItem: NewsItem, targetLocale: string) => {
    try {
      const { error } = await supabase
        .from('news')
        .insert([{
          ...newsItem,
          id: undefined,
          locale: targetLocale,
          status: 'draft'
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `News article duplicated to ${targetLocale}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">News Management ({locale.toUpperCase()})</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add News Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingNews ? 'Edit News Article' : 'Add News Article'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label>Content</Label>
                <RichTextEditor
                  value={formData.content_rich}
                  onChange={(value) => setFormData({ ...formData, content_rich: value })}
                  placeholder="Enter article content..."
                />
              </div>

              <div>
                <Label>Featured Image</Label>
                <FileUpload
                  value={formData.featured_image}
                  onChange={(url) => setFormData({ ...formData, featured_image: url || '' })}
                  bucket="images"
                  folder="news"
                  accept="image/*"
                  allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                />
              </div>

              <div>
                <Label htmlFor="video_url">Video URL</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={formData.status === 'published'}
                    onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'published' : 'draft' })}
                  />
                  <Label htmlFor="status">Published</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingNews ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {news.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.status === 'published'
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    {item.is_featured && (
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => duplicateToLocale(item, locale === 'en' ? 'ru' : 'en')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminNews;