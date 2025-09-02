import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import FileUpload from '@/components/admin/FileUpload';
import { Plus, Edit, Trash2, GripVertical, Copy, Award, Download, Eye } from 'lucide-react';
import { saveWithUpload } from '@/lib/uploadHelper';

interface AdminCertificatesProps {
  locale: string;
}

interface CertificateData {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  file_url: string | null;
  image_url: string | null;
  order: number;
}

interface CertificateFormData extends CertificateData {
  imageFile?: File;
  pdfFile?: File;
}

const AdminCertificates = ({ locale }: AdminCertificatesProps) => {
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificateData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCertificates();
  }, [locale]);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('about_certificates')
        .select('*')
        .eq('locale', locale)
        .order('order', { ascending: true });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading certificates",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (certData: CertificateFormData) => {
    if (!certData.title) {
      toast({
        title: "Missing required fields",
        description: "Please fill in certificate title.",
        variant: "destructive",
      });
      return;
    }

    try {
      // First handle image upload if needed
      let imageUrl = certData.image_url;
      if (certData.imageFile) {
        const payload = {
          locale,
          title: certData.title,
          issuer: certData.issuer || '',
          date: certData.date,
          image_url: imageUrl,
          file_url: certData.file_url,
          order: certData.order,
          ...(certData.id && { id: certData.id })
        };

        const result = await saveWithUpload({
          table: 'about_certificates',
          data: payload,
          file: certData.imageFile,
          bucket: 'images',
          folder: 'certificates',
          urlField: 'image_url'
        });
        
        imageUrl = (result as any).image_url;
      }

      // Then handle PDF upload if needed
      if (certData.pdfFile) {
        const payload = {
          locale,
          title: certData.title,
          issuer: certData.issuer || '',
          date: certData.date,
          image_url: imageUrl,
          file_url: certData.file_url,
          order: certData.order,
          ...(certData.id && { id: certData.id })
        };

        await saveWithUpload({
          table: 'about_certificates',
          data: payload,
          file: certData.pdfFile,
          bucket: 'docs',
          folder: 'certificates',
          urlField: 'file_url'
        });
      } else if (!certData.pdfFile && !certData.imageFile) {
        // No files to upload, just save data
        const payload = {
          locale,
          title: certData.title,
          issuer: certData.issuer || '',
          date: certData.date,
          image_url: imageUrl,
          file_url: certData.file_url,
          order: certData.order,
          ...(certData.id && { id: certData.id })
        };

        const { error } = await supabase
          .from('about_certificates')
          .upsert(payload, { onConflict: 'id' });

        if (error) throw error;
      }

      toast({
        title: "Certificate saved",
        description: "Certificate has been saved successfully.",
      });

      fetchCertificates();
      setDialogOpen(false);
      setEditingCert(null);
    } catch (error: any) {
      toast({
        title: "Error saving certificate",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('about_certificates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Certificate deleted",
        description: "Certificate has been deleted successfully.",
      });

      fetchCertificates();
    } catch (error: any) {
      toast({
        title: "Error deleting certificate",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async () => {
    const targetLocales = ['en', 'ru', 'kk'].filter(l => l !== locale);
    
    if (certificates.length === 0) {
      toast({
        title: "No certificates to duplicate",
        description: "Please add certificates before duplicating.",
        variant: "destructive",
      });
      return;
    }

    try {
      for (const targetLocale of targetLocales) {
        // Delete existing certificates for target locale
        await supabase
          .from('about_certificates')
          .delete()
          .eq('locale', targetLocale);

        // Insert current certificates
        const duplicateCerts = certificates.map(cert => ({
          locale: targetLocale,
          title: cert.title,
          issuer: cert.issuer,
          date: cert.date,
          file_url: cert.file_url,
          image_url: cert.image_url,
          order: cert.order,
        }));

        const { error } = await supabase
          .from('about_certificates')
          .insert(duplicateCerts);

        if (error) throw error;
      }

      toast({
        title: "Certificates duplicated",
        description: `Certificates duplicated to ${targetLocales.join(', ')} locales.`,
      });
    } catch (error: any) {
      toast({
        title: "Error duplicating certificates",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const CertificateForm = ({ cert }: { cert: CertificateData | null }) => {
    const [formData, setFormData] = useState<CertificateFormData>(() => 
      cert || {
        title: '',
        issuer: '',
        date: '',
        file_url: null,
        image_url: null,
        order: certificates.length + 1,
      }
    );

    const handleImageChange = (file: File | null) => {
      if (file) {
        setFormData(prev => ({ 
          ...prev, 
          imageFile: file,
          image_url: URL.createObjectURL(file)
        }));
      }
    };

    const handlePdfChange = (file: File | null) => {
      if (file) {
        setFormData(prev => ({ 
          ...prev, 
          pdfFile: file,
          file_url: URL.createObjectURL(file)
        }));
      }
    };

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Certificate Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="ISO 9001:2015 Quality Management"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="issuer">Issuer</Label>
            <Input
              id="issuer"
              value={formData.issuer}
              onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
              placeholder="International Organization for Standardization"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
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
          <Label>Certificate Image</Label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {formData.image_url && (
            <div className="mt-2">
              <img
                src={formData.image_url}
                alt="Preview"
                className="w-20 h-20 object-cover rounded border"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Certificate File (PDF)</Label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handlePdfChange(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {formData.file_url && (
            <div className="mt-2">
              <p className="text-sm text-green-600">PDF file selected</p>
            </div>
          )}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }} className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setDialogOpen(false);
              setEditingCert(null);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!formData.title}
          >
            Save Certificate
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
          Certificates ({locale.toUpperCase()})
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
                <Button size="sm" onClick={() => setEditingCert(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certificate
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingCert ? 'Edit Certificate' : 'Add New Certificate'}
                  </DialogTitle>
                </DialogHeader>
                <CertificateForm cert={editingCert} />
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {certificates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No certificates added yet. Click "Add Certificate" to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="flex items-start space-x-4 p-4 border border-border rounded-lg"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move mt-1" />
                
                <div className="flex items-center space-x-3">
                  {cert.image_url ? (
                    <img 
                      src={cert.image_url} 
                      alt={cert.title}
                      className="w-12 h-12 object-cover rounded border"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded border">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-medium">{cert.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Issued by {cert.issuer}
                  </p>
                  {cert.date && (
                    <p className="text-sm text-muted-foreground">
                      Date: {new Date(cert.date).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex space-x-2 mt-2">
                    {cert.image_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(cert.image_url!, '_blank')}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    )}
                    {cert.file_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(cert.file_url!, '_blank')}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        PDF
                      </Button>
                    )}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  #{cert.order}
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingCert(cert);
                      setDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => cert.id && handleDelete(cert.id)}
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

export default AdminCertificates;