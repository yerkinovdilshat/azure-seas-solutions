import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Copy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import RichTextEditor from '@/components/admin/RichTextEditor';
import FileUpload from '@/components/admin/FileUpload';

interface Project {
  id: string;
  locale: string;
  title: string;
  slug: string;
  description: string;
  content_rich: any;
  featured_image: string;
  gallery_images: string[];
  video_url: string;
  client_name: string;
  project_date: string;
  project_location: string;
  project_status: string;
  is_featured: boolean;
  order: number;
}

interface AdminProjectsProps {
  locale: string;
}

const AdminProjects = ({ locale }: AdminProjectsProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content_rich: null,
    featured_image: '',
    gallery_images: [] as string[],
    video_url: '',
    client_name: '',
    project_date: '',
    project_location: '',
    project_status: 'completed',
    is_featured: false,
    order: 0
  });

  useEffect(() => {
    fetchProjects();
  }, [locale]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('locale', locale)
        .order('order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
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
      const projectData = {
        ...formData,
        locale
      };

      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Project created successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchProjects();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      
      fetchProjects();
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
      video_url: '',
      client_name: '',
      project_date: '',
      project_location: '',
      project_status: 'completed',
      is_featured: false,
      order: 0
    });
    setEditingProject(null);
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      description: project.description || '',
      content_rich: project.content_rich,
      featured_image: project.featured_image || '',
      gallery_images: project.gallery_images || [],
      video_url: project.video_url || '',
      client_name: project.client_name || '',
      project_date: project.project_date || '',
      project_location: project.project_location || '',
      project_status: project.project_status,
      is_featured: project.is_featured,
      order: project.order
    });
    setIsDialogOpen(true);
  };

  const duplicateToLocale = async (project: Project, targetLocale: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .insert([{
          ...project,
          id: undefined,
          locale: targetLocale
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Project duplicated to ${targetLocale}`,
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
        <h2 className="text-2xl font-bold">Projects Management ({locale.toUpperCase()})</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Edit Project' : 'Add Project'}
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
                  placeholder="Enter project content..."
                />
              </div>

              <div>
                <Label>Featured Image</Label>
                <FileUpload
                  value={formData.featured_image}
                  onChange={(url) => setFormData({ ...formData, featured_image: url || '' })}
                  bucket="images"
                  folder="projects"
                  accept="image/*"
                  allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client_name">Client Name</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="project_date">Project Date</Label>
                  <Input
                    id="project_date"
                    type="date"
                    value={formData.project_date}
                    onChange={(e) => setFormData({ ...formData, project_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project_location">Location</Label>
                  <Input
                    id="project_location"
                    value={formData.project_location}
                    onChange={(e) => setFormData({ ...formData, project_location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="project_status">Status</Label>
                  <Select value={formData.project_status} onValueChange={(value) => setFormData({ ...formData, project_status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">Featured Project</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProject ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {projects.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.is_featured 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.is_featured ? 'Featured' : 'Regular'}
                    </span>
                    <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                      {item.project_status}
                    </span>
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

export default AdminProjects;