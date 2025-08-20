import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Copy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import RichTextEditor from '@/components/admin/RichTextEditor';
import FileUpload from '@/components/admin/FileUpload';
import MultiImageUpload from '@/components/admin/MultiImageUpload';

interface Service {
  id: string;
  locale: string;
  title: string;
  slug: string;
  description: string;
  content_rich: any;
  featured_image: string;
  gallery_images: string[];
  icon_key: string;
  status: 'draft' | 'published';
  is_featured: boolean;
  order: number;
}

interface AdminServicesProps {
  locale: string;
}

const AdminServices = ({ locale }: AdminServicesProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content_rich: null,
    featured_image: '',
    gallery_images: [] as string[],
    icon_key: '',
    status: 'draft' as 'draft' | 'published',
    is_featured: false,
    order: 0
  });

  useEffect(() => {
    fetchServices();
  }, [locale]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('locale', locale)
        .order('order', { ascending: true });

      if (error) throw error;
      setServices((data || []) as Service[]);
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
      const serviceData = {
        ...formData,
        locale
      };

      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Service updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Service created successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchServices();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
      
      fetchServices();
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
      description: '',
      content_rich: null,
      featured_image: '',
      gallery_images: [],
      icon_key: '',
      status: 'draft',
      is_featured: false,
      order: 0
    });
    setEditingService(null);
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      slug: service.slug,
      description: service.description || '',
      content_rich: service.content_rich,
      featured_image: service.featured_image || '',
      gallery_images: service.gallery_images || [],
      icon_key: service.icon_key || '',
      status: service.status,
      is_featured: service.is_featured,
      order: service.order
    });
    setIsDialogOpen(true);
  };

  const duplicateToLocale = async (service: Service, targetLocale: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .insert([{
          ...service,
          id: undefined,
          locale: targetLocale
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Service duplicated to ${targetLocale}`,
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
        <h2 className="text-2xl font-bold">Services Management ({locale.toUpperCase()})</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Edit Service' : 'Add Service'}
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label>Content</Label>
                <RichTextEditor
                  value={formData.content_rich}
                  onChange={(value) => setFormData({ ...formData, content_rich: value })}
                  placeholder="Enter service content..."
                />
              </div>

              <div>
                <Label>Featured Image</Label>
                <FileUpload
                  value={formData.featured_image}
                  onChange={(url) => setFormData({ ...formData, featured_image: url || '' })}
                  bucket="images"
                  folder="services"
                  accept="image/*"
                  allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                />
              </div>

              <div>
                <Label>Gallery Images</Label>
                <MultiImageUpload
                  value={formData.gallery_images}
                  onChange={(urls) => setFormData({ ...formData, gallery_images: urls })}
                  bucket="images"
                  folder="services/gallery"
                  accept="image/*"
                  allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                  maxImages={8}
                  placeholder="Upload service gallery images"
                />
              </div>

              <div>
                <Label htmlFor="icon_key">Icon Key</Label>
                <Input
                  id="icon_key"
                  value={formData.icon_key}
                  onChange={(e) => setFormData({ ...formData, icon_key: e.target.value })}
                  placeholder="e.g., wrench, package, truck"
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
                  {editingService ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {services.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
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
                    {item.icon_key && (
                      <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                        {item.icon_key}
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

export default AdminServices;