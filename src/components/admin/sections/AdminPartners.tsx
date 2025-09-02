import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import FileUpload from '@/components/admin/FileUpload';
import { Plus, Edit, Trash2, GripVertical, ExternalLink, Building } from 'lucide-react';
import { saveWithUpload } from '@/lib/uploadHelper';

interface PartnerData {
  id?: string;
  name: string;
  logo: string | null;
  website_url: string | null;
  order: number;
}

interface PartnerFormData extends PartnerData {
  logoFile?: File;
}

const AdminPartners = () => {
  const [partners, setPartners] = useState<PartnerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('about_partners')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setPartners(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading partners",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (partnerData: PartnerFormData) => {
    if (!partnerData.name) {
      toast({
        title: "Missing required fields",
        description: "Please fill in partner name.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Don't include blob URLs in payload - let saveWithUpload handle the upload
      const payload = {
        name: partnerData.name,
        logo: partnerData.logo?.startsWith('blob:') ? null : partnerData.logo,
        website_url: partnerData.website_url || '',
        order: partnerData.order,
        ...(partnerData.id && { id: partnerData.id })
      };

      await saveWithUpload({
        table: 'about_partners',
        data: payload,
        file: partnerData.logoFile,
        bucket: 'images',
        folder: 'partners',
        urlField: 'logo'
      });

      toast({
        title: "Partner saved",
        description: "Partner has been saved successfully.",
      });

      fetchPartners();
      setDialogOpen(false);
      setEditingPartner(null);
    } catch (error: any) {
      toast({
        title: "Error saving partner",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('about_partners')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Partner deleted",
        description: "Partner has been deleted successfully.",
      });

      fetchPartners();
    } catch (error: any) {
      toast({
        title: "Error deleting partner",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const PartnerForm = ({ partner }: { partner: PartnerData | null }) => {
    const [formData, setFormData] = useState<PartnerFormData>(() =>
      partner || {
        name: '',
        logo: null,
        website_url: null,
        order: partners.length + 1,
      }
    );

    const handleFileChange = (file: File | null) => {
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setFormData(prev => ({ 
          ...prev, 
          logoFile: file,
          logo: previewUrl // Preview URL, will be replaced with Storage URL
        }));
      }
    };

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Company Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Siemens AG"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website URL (Optional)</Label>
          <Input
            id="website"
            type="url"
            value={formData.website_url || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value || null }))}
            placeholder="https://siemens.com"
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

        <div className="space-y-2">
          <Label>Logo</Label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {formData.logo && (
            <div className="mt-2">
              <img
                src={formData.logo}
                alt="Preview"
                className="w-20 h-20 object-contain rounded border"
              />
            </div>
          )}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }} className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setDialogOpen(false);
              setEditingPartner(null);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!formData.name}
          >
            Save Partner
          </Button>
        </form>
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
          Partners (Global)
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setEditingPartner(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Partner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingPartner ? 'Edit Partner' : 'Add New Partner'}
                </DialogTitle>
              </DialogHeader>
              <PartnerForm partner={editingPartner} />
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {partners.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No partners added yet. Click "Add Partner" to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex items-center space-x-4 p-4 border border-border rounded-lg"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                
                <div className="flex items-center space-x-3">
                  {partner.logo ? (
                    <img 
                      src={partner.logo} 
                      alt={partner.name}
                      className="w-12 h-12 object-contain rounded border bg-white"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded border">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-medium">{partner.name}</h4>
                  {partner.website_url && (
                    <div className="flex items-center space-x-1 text-sm text-primary mt-1">
                      <ExternalLink className="h-3 w-3" />
                      <a 
                        href={partner.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {partner.website_url.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  #{partner.order}
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingPartner(partner);
                      setDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => partner.id && handleDelete(partner.id)}
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

export default AdminPartners;