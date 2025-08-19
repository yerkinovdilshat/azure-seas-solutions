import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

interface Contact {
  id: string;
  locale: string;
  company_name: string;
  address: string;
  phone: string;
  email: string;
  working_hours: string;
  map_link: string;
  additional_info: any;
}

interface AdminContactsProps {
  locale: string;
}

const AdminContacts = ({ locale }: AdminContactsProps) => {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    company_name: '',
    address: '',
    phone: '',
    email: '',
    working_hours: '',
    map_link: '',
    fax: '',
    emergency_phone: ''
  });

  useEffect(() => {
    fetchContact();
  }, [locale]);

  const fetchContact = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('locale', locale)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setContact(data);
        setFormData({
          company_name: data.company_name,
          address: data.address,
          phone: data.phone,
          email: data.email,
          working_hours: data.working_hours,
          map_link: data.map_link || '',
          fax: data.additional_info?.fax || '',
          emergency_phone: data.additional_info?.emergency_phone || ''
        });
      }
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
    setSaving(true);
    
    try {
      const contactData = {
        locale,
        company_name: formData.company_name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        working_hours: formData.working_hours,
        map_link: formData.map_link,
        additional_info: {
          fax: formData.fax,
          emergency_phone: formData.emergency_phone
        }
      };

      if (contact) {
        const { error } = await supabase
          .from('contacts')
          .update(contactData)
          .eq('id', contact.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('contacts')
          .insert([contactData]);
        
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Contact information updated successfully",
      });
      
      fetchContact();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contact Information ({locale.toUpperCase()})</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Contact Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="emergency_phone">Emergency Phone</Label>
                <Input
                  id="emergency_phone"
                  value={formData.emergency_phone}
                  onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fax">Fax</Label>
                <Input
                  id="fax"
                  value={formData.fax}
                  onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="working_hours">Working Hours</Label>
                <Input
                  id="working_hours"
                  value={formData.working_hours}
                  onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="map_link">Map Link</Label>
              <Input
                id="map_link"
                value={formData.map_link}
                onChange={(e) => setFormData({ ...formData, map_link: e.target.value })}
                placeholder="https://maps.google.com/..."
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContacts;