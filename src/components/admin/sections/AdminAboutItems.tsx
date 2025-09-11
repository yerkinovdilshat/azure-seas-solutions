import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, FileText, Upload, X, Search, Calendar } from 'lucide-react';
import { AboutItem, AboutItemKind } from '@/hooks/useAboutItems';
import { useFileUpload } from '@/hooks/useFileUpload';

interface AdminAboutItemsProps {
  kind: AboutItemKind;
}

const AdminAboutItems = ({ kind }: AdminAboutItemsProps) => {
  const [items, setItems] = useState<AboutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AboutItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updated_at');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [pdfViewerUrl, setPdfViewerUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { uploadFile, uploading } = useFileUpload();

  const [formData, setFormData] = useState<Partial<AboutItem>>({
    kind,
    title_en: '',
    title_ru: '',
    title_kz: '',
    description_en: '',
    description_ru: '',
    description_kz: '',
    issuer_en: '',
    issuer_ru: '',
    issuer_kz: '',
    image_url: '',
    pdf_url: '',
    date: '',
    order_index: 0,
    is_published: true
  });

  useEffect(() => {
    fetchItems();
  }, [kind]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('about_items')
        .select('*')
        .eq('kind', kind)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast({
        title: "Error",
        description: `Failed to fetch ${kind} items`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const saveData = {
        kind,
        title_ru: formData.title_ru || null,
        title_kz: formData.title_kz || null,
        title_en: formData.title_en || null,
        description_ru: formData.description_ru || null,
        description_kz: formData.description_kz || null,
        description_en: formData.description_en || null,
        issuer_ru: formData.issuer_ru || null,
        issuer_kz: formData.issuer_kz || null,
        issuer_en: formData.issuer_en || null,
        date: formData.date || null,
        image_url: formData.image_url || null,
        pdf_url: formData.pdf_url || null,
        is_published: formData.is_published ?? true,
        order_index: formData.order_index || 0
      };
      
      const { error } = editingItem
        ? await supabase
            .from('about_items')
            .update(saveData)
            .eq('id', editingItem.id!)
        : await supabase
            .from('about_items')
            .insert([saveData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${kind} item ${editingItem ? 'updated' : 'created'} successfully`
      });

      setDialogOpen(false);
      setEditingItem(null);
      resetForm();
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        title: "Error",
        description: `Failed to save ${kind} item`,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase
        .from('about_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${kind} item deleted successfully`
      });

      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: `Failed to delete ${kind} item`,
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    const url = await uploadFile(file, {
      bucket: 'images',
      folder: kind,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxSize: 5 * 1024 * 1024 // 5MB
    });
    
    if (url) {
      setFormData({ ...formData, image_url: url });
    }
  };

  const handlePdfUpload = async (file: File) => {
    const url = await uploadFile(file, {
      bucket: 'docs',
      folder: kind,
      allowedTypes: ['application/pdf'],
      maxSize: 20 * 1024 * 1024 // 20MB
    });
    
    if (url) {
      setFormData({ ...formData, pdf_url: url });
    }
  };

  const resetForm = () => {
    setFormData({
      kind,
      title_en: '',
      title_ru: '',
      title_kz: '',
      description_en: '',
      description_ru: '',
      description_kz: '',
      issuer_en: '',
      issuer_ru: '',
      issuer_kz: '',
      image_url: '',
      pdf_url: '',
      date: '',
      order_index: 0,
      is_published: true
    });
  };

  const openEditDialog = (item?: AboutItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      resetForm();
    }
    setDialogOpen(true);
  };

  const getLocalizedTitle = (item: AboutItem) => {
    return item.title_en || item.title_ru || item.title_kz || 'Untitled';
  };

  const filteredItems = items.filter(item =>
    getLocalizedTitle(item).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openPdfViewer = (pdfUrl: string) => {
    const viewerUrl = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(pdfUrl)}`;
    setPdfViewerUrl(viewerUrl);
  };

  const kindLabels = {
    distribution: 'Distribution',
    certificate: 'Certificate',
    license: 'License'
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{kindLabels[kind]} Management</CardTitle>
          <Button onClick={() => openEditDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add {kindLabels[kind]}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${kind}s...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated_at">Last Updated</SelectItem>
              <SelectItem value="order_index">Order</SelectItem>
              <SelectItem value="date">Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                {kind !== 'distribution' && <TableHead>Issuer</TableHead>}
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{getLocalizedTitle(item)}</TableCell>
                  {kind !== 'distribution' && (
                    <TableCell>{item.issuer_en || item.issuer_ru || item.issuer_kz || '-'}</TableCell>
                  )}
                  <TableCell>
                    {item.date ? new Date(item.date).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.is_published ? 'default' : 'secondary'}>
                      {item.is_published ? 'Published' : 'Draft'}
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
                    {item.pdf_url && (
                      <Button variant="outline" size="sm" onClick={() => openPdfViewer(item.pdf_url!)}>
                        <FileText className="h-4 w-4" />
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

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? `Edit ${kindLabels[kind]}` : `Add ${kindLabels[kind]}`}
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="en" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ru">Русский</TabsTrigger>
                <TabsTrigger value="kz">Қазақша</TabsTrigger>
              </TabsList>

              <TabsContent value="en" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title_en">Title (EN)</Label>
                    <Input
                      id="title_en"
                      value={formData.title_en || ''}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    />
                  </div>
                  {kind !== 'distribution' && (
                    <div>
                      <Label htmlFor="issuer_en">Issuer (EN)</Label>
                      <Input
                        id="issuer_en"
                        value={formData.issuer_en || ''}
                        onChange={(e) => setFormData({ ...formData, issuer_en: e.target.value })}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="description_en">Description (EN)</Label>
                  <Textarea
                    id="description_en"
                    value={formData.description_en || ''}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="ru" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title_ru">Title (RU)</Label>
                    <Input
                      id="title_ru"
                      value={formData.title_ru || ''}
                      onChange={(e) => setFormData({ ...formData, title_ru: e.target.value })}
                    />
                  </div>
                  {kind !== 'distribution' && (
                    <div>
                      <Label htmlFor="issuer_ru">Issuer (RU)</Label>
                      <Input
                        id="issuer_ru"
                        value={formData.issuer_ru || ''}
                        onChange={(e) => setFormData({ ...formData, issuer_ru: e.target.value })}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="description_ru">Description (RU)</Label>
                  <Textarea
                    id="description_ru"
                    value={formData.description_ru || ''}
                    onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })}
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="kz" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title_kz">Title (KZ)</Label>
                    <Input
                      id="title_kz"
                      value={formData.title_kz || ''}
                      onChange={(e) => setFormData({ ...formData, title_kz: e.target.value })}
                    />
                  </div>
                  {kind !== 'distribution' && (
                    <div>
                      <Label htmlFor="issuer_kz">Issuer (KZ)</Label>
                      <Input
                        id="issuer_kz"
                        value={formData.issuer_kz || ''}
                        onChange={(e) => setFormData({ ...formData, issuer_kz: e.target.value })}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="description_kz">Description (KZ)</Label>
                  <Textarea
                    id="description_kz"
                    value={formData.description_kz || ''}
                    onChange={(e) => setFormData({ ...formData, description_kz: e.target.value })}
                    rows={3}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order_index || 0}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Image</Label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button variant="outline" asChild>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </label>
                  </Button>
                  {formData.image_url && (
                    <img src={formData.image_url} alt="Preview" className="w-16 h-16 object-cover rounded" />
                  )}
                </div>
              </div>

              <div>
                <Label>PDF File</Label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePdfUpload(file);
                    }}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <Button variant="outline" asChild>
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload PDF
                    </label>
                  </Button>
                  {formData.pdf_url && (
                    <span className="text-sm text-green-600">PDF uploaded</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
              />
              <Label htmlFor="published">Published</Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={uploading}>
                {uploading ? 'Uploading...' : (editingItem ? 'Update' : 'Create')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Image Preview Modal */}
        {previewImage && (
          <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
            <DialogContent className="max-w-4xl">
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

        {/* PDF Viewer Modal */}
        {pdfViewerUrl && (
          <Dialog open={!!pdfViewerUrl} onOpenChange={() => setPdfViewerUrl(null)}>
            <DialogContent className="max-w-6xl h-[80vh]">
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  PDF Viewer
                  <Button variant="ghost" size="sm" onClick={() => setPdfViewerUrl(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </DialogTitle>
              </DialogHeader>
              <iframe
                src={pdfViewerUrl}
                className="w-full h-full border-0"
                title="PDF Viewer"
                onError={() => {
                  // Fallback to opening in new tab
                  setPdfViewerUrl(null);
                  window.open(pdfViewerUrl.split('&url=')[1], '_blank');
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminAboutItems;