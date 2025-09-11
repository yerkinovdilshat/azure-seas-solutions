import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, FileText, Upload, X } from 'lucide-react';

interface DistributionItem {
  id?: string;
  title_en?: string;
  title_ru?: string;
  title_kk?: string;
  description_en?: string;
  description_ru?: string;
  description_kk?: string;
  image_url?: string;
  file_url?: string;
  order_index: number;
  status: string;
}

interface AdminDistributionProps {
  locale: string;
}

const AdminDistribution = ({ locale }: AdminDistributionProps) => {
  const [items, setItems] = useState<DistributionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DistributionItem | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const [formData, setFormData] = useState<DistributionItem>({
    title_en: '',
    title_ru: '',
    title_kk: '',
    description_en: '',
    description_ru: '',
    description_kk: '',
    image_url: '',
    file_url: '',
    order_index: 0,
    status: 'published'
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('about_distribution')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching distribution items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch distribution items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = editingItem
        ? await supabase
            .from('about_distribution')
            .update(formData)
            .eq('id', editingItem.id!)
        : await supabase
            .from('about_distribution')
            .insert([formData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Distribution item ${editingItem ? 'updated' : 'created'} successfully`
      });

      setDialogOpen(false);
      setEditingItem(null);
      resetForm();
      fetchItems();
    } catch (error) {
      console.error('Error saving distribution item:', error);
      toast({
        title: "Error",
        description: "Failed to save distribution item",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase
        .from('about_distribution')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Distribution item deleted successfully"
      });

      fetchItems();
    } catch (error) {
      console.error('Error deleting distribution item:', error);
      toast({
        title: "Error",
        description: "Failed to delete distribution item",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title_en: '',
      title_ru: '',
      title_kk: '',
      description_en: '',
      description_ru: '',
      description_kk: '',
      image_url: '',
      file_url: '',
      order_index: 0,
      status: 'published'
    });
  };

  const openEditDialog = (item?: DistributionItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      resetForm();
    }
    setDialogOpen(true);
  };

  const getLocalizedTitle = (item: DistributionItem) => {
    return item[`title_${locale}` as keyof DistributionItem] as string || 
           item.title_en || 
           'Untitled';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Distribution Management</CardTitle>
          <Button onClick={() => openEditDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{getLocalizedTitle(item)}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.order_index}</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {item.image_url && (
                      <Button variant="outline" size="sm" onClick={() => setPreviewImage(item.image_url!)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {item.file_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id!)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Distribution Item' : 'Add Distribution Item'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="title_en">Title (EN)</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="title_ru">Title (RU)</Label>
                  <Input
                    id="title_ru"
                    value={formData.title_ru}
                    onChange={(e) => setFormData({ ...formData, title_ru: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="title_kk">Title (KK)</Label>
                  <Input
                    id="title_kk"
                    value={formData.title_kk}
                    onChange={(e) => setFormData({ ...formData, title_kk: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="desc_en">Description (EN)</Label>
                  <Textarea
                    id="desc_en"
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="desc_ru">Description (RU)</Label>
                  <Textarea
                    id="desc_ru"
                    value={formData.description_ru}
                    onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="desc_kk">Description (KK)</Label>
                  <Textarea
                    id="desc_kk"
                    value={formData.description_kk}
                    onChange={(e) => setFormData({ ...formData, description_kk: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="file_url">PDF URL</Label>
                  <Input
                    id="file_url"
                    type="url"
                    value={formData.file_url}
                    onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {previewImage && (
          <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  Image Preview
                  <Button variant="ghost" size="sm" onClick={() => setPreviewImage(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </DialogTitle>
              </DialogHeader>
              <img src={previewImage} alt="Preview" className="w-full h-auto rounded-lg" />
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDistribution;