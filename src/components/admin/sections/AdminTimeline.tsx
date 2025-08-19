import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import FileUpload from '@/components/admin/FileUpload';
import { Plus, Edit, Trash2, GripVertical, Copy, Calendar } from 'lucide-react';

interface AdminTimelineProps {
  locale: string;
}

interface TimelineData {
  id?: string;
  year: number;
  title: string;
  description: string;
  image: string | null;
  order: number;
}

const AdminTimeline = ({ locale }: AdminTimelineProps) => {
  const [timeline, setTimeline] = useState<TimelineData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTimeline();
  }, [locale]);

  const fetchTimeline = async () => {
    try {
      const { data, error } = await supabase
        .from('about_timeline')
        .select('*')
        .eq('locale', locale)
        .order('order', { ascending: true });

      if (error) throw error;
      setTimeline(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading timeline",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (itemData: TimelineData) => {
    try {
      const payload = {
        year: itemData.year,
        locale,
        title: itemData.title,
        description: itemData.description,
        image: itemData.image,
        order: itemData.order,
      };

      if (itemData.id) {
        const { error } = await supabase
          .from('about_timeline')
          .update(payload)
          .eq('id', itemData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('about_timeline')
          .insert([payload]);

        if (error) throw error;
      }

      toast({
        title: "Timeline item saved",
        description: "Timeline item has been saved successfully.",
      });

      fetchTimeline();
      setDialogOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      toast({
        title: "Error saving timeline item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('about_timeline')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Timeline item deleted",
        description: "Timeline item has been deleted successfully.",
      });

      fetchTimeline();
    } catch (error: any) {
      toast({
        title: "Error deleting timeline item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async () => {
    const targetLocales = ['en', 'ru', 'kk'].filter(l => l !== locale);
    
    if (timeline.length === 0) {
      toast({
        title: "No timeline items to duplicate",
        description: "Please add timeline items before duplicating.",
        variant: "destructive",
      });
      return;
    }

    try {
      for (const targetLocale of targetLocales) {
        // Delete existing timeline for target locale
        await supabase
          .from('about_timeline')
          .delete()
          .eq('locale', targetLocale);

        // Insert current timeline
        const duplicateItems = timeline.map(item => ({
          year: item.year,
          locale: targetLocale,
          title: item.title,
          description: item.description,
          image: item.image,
          order: item.order,
        }));

        const { error } = await supabase
          .from('about_timeline')
          .insert(duplicateItems);

        if (error) throw error;
      }

      toast({
        title: "Timeline duplicated",
        description: `Timeline duplicated to ${targetLocales.join(', ')} locales.`,
      });
    } catch (error: any) {
      toast({
        title: "Error duplicating timeline",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const TimelineForm = ({ item }: { item: TimelineData | null }) => {
    const [formData, setFormData] = useState<TimelineData>(
      item || {
        year: new Date().getFullYear(),
        title: '',
        description: '',
        image: null,
        order: timeline.length + 1,
      }
    );

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
              min="1900"
              max={new Date().getFullYear() + 10}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
              min="1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Company Foundation"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description of this milestone..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Image (Optional)</Label>
          <FileUpload
            value={formData.image}
            onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
            bucket="images"
            folder="timeline"
            accept="image/*"
            allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
            placeholder="Upload timeline image (optional)"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setDialogOpen(false);
              setEditingItem(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleSave(formData)}
            disabled={!formData.title || !formData.description}
          >
            Save Timeline Item
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Timeline ({locale.toUpperCase()})
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDuplicate}
            >
              <Copy className="h-4 w-4 mr-2" />
              Duplicate to Other Locales
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => setEditingItem(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Timeline Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Edit Timeline Item' : 'Add New Timeline Item'}
                  </DialogTitle>
                </DialogHeader>
                <TimelineForm item={editingItem} />
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {timeline.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No timeline items added yet. Click "Add Timeline Item" to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {timeline.map((item) => (
              <div
                key={item.id}
                className="flex items-start space-x-4 p-4 border border-border rounded-lg"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move mt-1" />
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-lg font-bold text-primary">{item.year}</div>
                </div>

                <div className="flex-1">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                  {item.image && (
                    <div className="mt-2">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  #{item.order}
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingItem(item);
                      setDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => item.id && handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminTimeline;