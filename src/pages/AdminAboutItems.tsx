import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/adminApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminAboutItems() {
  const queryClient = useQueryClient();
  const [selectedKind, setSelectedKind] = useState<string>('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: itemsData, isLoading } = useQuery({
    queryKey: ['admin', 'about-items', selectedKind],
    queryFn: () => adminApi.listAbout({ kind: selectedKind, pageSize: 50 }),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => adminApi.createAbout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'about-items'] });
      toast.success('Item created successfully');
      setIsDialogOpen(false);
      setEditingItem(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create item');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updateAbout(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'about-items'] });
      toast.success('Item updated successfully');
      setIsDialogOpen(false);
      setEditingItem(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update item');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteAbout(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'about-items'] });
      toast.success('Item deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete item');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      kind: formData.get('kind'),
      title_ru: formData.get('title_ru'),
      title_en: formData.get('title_en'),
      title_kk: formData.get('title_kk'),
      description_ru: formData.get('description_ru'),
      description_en: formData.get('description_en'),
      description_kk: formData.get('description_kk'),
      issuer_ru: formData.get('issuer_ru'),
      issuer_en: formData.get('issuer_en'),
      issuer_kk: formData.get('issuer_kk'),
      date: formData.get('date') || null,
      image_url: formData.get('image_url'),
      pdf_url: formData.get('pdf_url'),
      is_published: formData.get('is_published') === 'on',
      order_index: parseInt(formData.get('order_index') as string) || 0,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const items = itemsData?.items || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">About Items</h2>
          <p className="text-muted-foreground">Manage certificates, licenses, and distribution items</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Item' : 'Create New Item'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update the item details' : 'Add a new certificate, license, or distribution item'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="kind">Type</Label>
                  <Select name="kind" defaultValue={editingItem?.kind || ''} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="license">License</SelectItem>
                      <SelectItem value="distribution">Distribution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="order_index">Order</Label>
                  <Input
                    id="order_index"
                    name="order_index"
                    type="number"
                    defaultValue={editingItem?.order_index || 0}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="title_ru">Title (Russian)</Label>
                  <Input
                    id="title_ru"
                    name="title_ru"
                    defaultValue={editingItem?.title_ru || ''}
                    placeholder="Title in Russian"
                  />
                </div>
                <div>
                  <Label htmlFor="title_en">Title (English)</Label>
                  <Input
                    id="title_en"
                    name="title_en"
                    defaultValue={editingItem?.title_en || ''}
                    placeholder="Title in English"
                  />
                </div>
                <div>
                  <Label htmlFor="title_kk">Title (Kazakh)</Label>
                  <Input
                    id="title_kk"
                    name="title_kk"
                    defaultValue={editingItem?.title_kk || ''}
                    placeholder="Title in Kazakh"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="description_ru">Description (Russian)</Label>
                  <Textarea
                    id="description_ru"
                    name="description_ru"
                    defaultValue={editingItem?.description_ru || ''}
                    placeholder="Description in Russian"
                  />
                </div>
                <div>
                  <Label htmlFor="description_en">Description (English)</Label>
                  <Textarea
                    id="description_en"
                    name="description_en"
                    defaultValue={editingItem?.description_en || ''}
                    placeholder="Description in English"
                  />
                </div>
                <div>
                  <Label htmlFor="description_kk">Description (Kazakh)</Label>
                  <Textarea
                    id="description_kk"
                    name="description_kk"
                    defaultValue={editingItem?.description_kk || ''}
                    placeholder="Description in Kazakh"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="issuer_ru">Issuer (Russian)</Label>
                  <Input
                    id="issuer_ru"
                    name="issuer_ru"
                    defaultValue={editingItem?.issuer_ru || ''}
                    placeholder="Issuer in Russian"
                  />
                </div>
                <div>
                  <Label htmlFor="issuer_en">Issuer (English)</Label>
                  <Input
                    id="issuer_en"
                    name="issuer_en"
                    defaultValue={editingItem?.issuer_en || ''}
                    placeholder="Issuer in English"
                  />
                </div>
                <div>
                  <Label htmlFor="issuer_kk">Issuer (Kazakh)</Label>
                  <Input
                    id="issuer_kk"
                    name="issuer_kk"
                    defaultValue={editingItem?.issuer_kk || ''}
                    placeholder="Issuer in Kazakh"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    defaultValue={editingItem?.date ? new Date(editingItem.date).toISOString().split('T')[0] : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    defaultValue={editingItem?.image_url || ''}
                    placeholder="/uploads/certificate.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="pdf_url">PDF URL</Label>
                  <Input
                    id="pdf_url"
                    name="pdf_url"
                    defaultValue={editingItem?.pdf_url || ''}
                    placeholder="/uploads/certificate.pdf"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  name="is_published"
                  defaultChecked={editingItem?.is_published !== false}
                />
                <Label htmlFor="is_published">Published</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingItem ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Items List</CardTitle>
              <CardDescription>Filter and manage your about items</CardDescription>
            </div>
            <Select value={selectedKind} onValueChange={setSelectedKind}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="certificate">Certificates</SelectItem>
                <SelectItem value="license">Licenses</SelectItem>
                <SelectItem value="distribution">Distribution</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Issuer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant="outline">{item.kind}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.title_en || item.title_ru || item.title_kk || 'Untitled'}
                    </TableCell>
                    <TableCell>
                      {item.issuer_en || item.issuer_ru || item.issuer_kk || '-'}
                    </TableCell>
                    <TableCell>
                      {item.date ? new Date(item.date).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.is_published ? 'default' : 'secondary'}>
                        {item.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.order_index}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingItem(item);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this item?')) {
                              deleteMutation.mutate(item.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}