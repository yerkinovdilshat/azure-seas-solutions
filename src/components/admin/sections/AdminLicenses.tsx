import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, FileText, Image, Calendar } from 'lucide-react';
import FileUpload from '@/components/admin/FileUpload';

interface License {
  id: string;
  title_en?: string;
  title_ru?: string;
  title_kk?: string;
  description_en?: string;
  description_ru?: string;
  description_kk?: string;
  issuer_en?: string;
  issuer_ru?: string;
  issuer_kk?: string;
  image_url?: string;
  file_url?: string;
  date?: string;
  order?: number;
  status?: string;
}

interface LicenseFormData extends License {
  image_file?: File;
  pdf_file?: File;
}

interface AdminLicensesProps {
  locale: string;
}

const AdminLicenses = ({ locale }: AdminLicensesProps) => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLicense, setEditingLicense] = useState<License | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updated_at');
  const { toast } = useToast();

  const [formData, setFormData] = useState<LicenseFormData>({
    id: '',
    title_en: '',
    title_ru: '',
    title_kk: '',
    description_en: '',
    description_ru: '',
    description_kk: '',
    issuer_en: '',
    issuer_ru: '',
    issuer_kk: '',
    image_url: '',
    file_url: '',
    date: '',
    order: 0,
    status: 'published'
  });

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('about_licenses')
        .select('*')
        .order('order', { ascending: true })
        .order('date', { ascending: false });

      if (error) throw error;
      setLicenses(data || []);
    } catch (error) {
      console.error('Error fetching licenses:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch licenses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const saveData = { ...formData };
      delete saveData.image_file;
      delete saveData.pdf_file;

      let query;
      if (editingLicense) {
        query = supabase
          .from('about_licenses')
          .update(saveData)
          .eq('id', editingLicense.id);
      } else {
        delete saveData.id;
        delete saveData.id;
        // Add required fields for database
        const finalData = {
          ...saveData,
          locale: 'en',
          title: saveData.title_en || 'Untitled'
        };
        query = supabase
          .from('about_licenses')
          .insert([finalData]);
      }

      const { error } = await query;
      if (error) throw error;

      toast({
        title: 'Success',
        description: `License ${editingLicense ? 'updated' : 'created'} successfully`,
      });

      setDialogOpen(false);
      setEditingLicense(null);
      resetForm();
      fetchLicenses();
    } catch (error) {
      console.error('Error saving license:', error);
      toast({
        title: 'Error',
        description: 'Failed to save license',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this license?')) return;

    try {
      const { error } = await supabase
        .from('about_licenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'License deleted successfully',
      });

      fetchLicenses();
    } catch (error) {
      console.error('Error deleting license:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete license',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      title_en: '',
      title_ru: '',
      title_kk: '',
      description_en: '',
      description_ru: '',
      description_kk: '',
      issuer_en: '',
      issuer_ru: '',
      issuer_kk: '',
      image_url: '',
      file_url: '',
      date: '',
      order: 0,
      status: 'published'
    });
  };

  const openEditDialog = (license: License) => {
    setEditingLicense(license);
    setFormData({ ...license });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingLicense(null);
    resetForm();
    setDialogOpen(true);
  };

  const filteredLicenses = licenses.filter(license =>
    (license.title_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     license.title_ru?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     license.title_kk?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">License Management</h2>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add License
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search licenses..."
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
            <SelectItem value="order">Order</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="title_en">Title</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Licenses List */}
      <div className="grid gap-4">
        {filteredLicenses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No licenses found</p>
            </CardContent>
          </Card>
        ) : (
          filteredLicenses.map((license) => (
            <Card key={license.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    {license.image_url && (
                      <img
                        src={license.image_url}
                        alt={license.title_en || 'License'}
                        className="w-20 h-20 object-cover rounded cursor-pointer"
                        onClick={() => window.open(license.image_url, '_blank')}
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {license.title_en || license.title_ru || license.title_kk}
                      </h3>
                      {(license.issuer_en || license.issuer_ru || license.issuer_kk) && (
                        <p className="text-sm text-muted-foreground">
                          Issuer: {license.issuer_en || license.issuer_ru || license.issuer_kk}
                        </p>
                      )}
                      {license.date && (
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(license.date).toLocaleDateString()}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          license.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {license.status}
                        </span>
                        <span className="text-xs text-muted-foreground">Order: {license.order}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {license.file_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(license.file_url, '_blank')}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(license)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(license.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLicense ? 'Edit License' : 'Create License'}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="en" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ru">Русский</TabsTrigger>
              <TabsTrigger value="kk">Қазақша</TabsTrigger>
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
                <div>
                  <Label htmlFor="issuer_en">Issuer (EN)</Label>
                  <Input
                    id="issuer_en"
                    value={formData.issuer_en || ''}
                    onChange={(e) => setFormData({ ...formData, issuer_en: e.target.value })}
                  />
                </div>
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
                <div>
                  <Label htmlFor="issuer_ru">Issuer (RU)</Label>
                  <Input
                    id="issuer_ru"
                    value={formData.issuer_ru || ''}
                    onChange={(e) => setFormData({ ...formData, issuer_ru: e.target.value })}
                  />
                </div>
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

            <TabsContent value="kk" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title_kk">Title (KK)</Label>
                  <Input
                    id="title_kk"
                    value={formData.title_kk || ''}
                    onChange={(e) => setFormData({ ...formData, title_kk: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="issuer_kk">Issuer (KK)</Label>
                  <Input
                    id="issuer_kk"
                    value={formData.issuer_kk || ''}
                    onChange={(e) => setFormData({ ...formData, issuer_kk: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description_kk">Description (KK)</Label>
                <Textarea
                  id="description_kk"
                  value={formData.description_kk || ''}
                  onChange={(e) => setFormData({ ...formData, description_kk: e.target.value })}
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
                value={formData.order || 0}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>License Image</Label>
              <FileUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url || '' })}
                bucket="images"
                accept="image/*"
                maxSize={5}
              />
            </div>
            <div>
              <Label>License PDF</Label>
              <FileUpload
                value={formData.file_url}
                onChange={(url) => setFormData({ ...formData, file_url: url || '' })}
                bucket="docs"
                accept=".pdf"
                maxSize={20}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.status === 'published'}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, status: checked ? 'published' : 'draft' })
              }
            />
            <Label htmlFor="published">Published</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingLicense ? 'Update' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLicenses;