import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, GripVertical, Copy, Shield, HardHat, ExternalLink } from 'lucide-react';

interface AdminComplianceProps {
  locale: string;
}

interface ComplianceData {
  id?: string;
  title: string;
  badge_icon: string;
  link_url: string | null;
  order: number;
}

const badgeOptions = [
  { key: 'iso-9001', label: 'ISO 9001', icon: Shield },
  { key: 'safety-helmet', label: 'Safety Helmet', icon: HardHat },
  { key: 'shield-check', label: 'Shield Check', icon: Shield },
];

const AdminCompliance = ({ locale }: AdminComplianceProps) => {
  const [compliance, setCompliance] = useState<ComplianceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ComplianceData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompliance();
  }, [locale]);

  const fetchCompliance = async () => {
    try {
      const { data, error } = await supabase
        .from('about_compliance')
        .select('*')
        .eq('locale', locale)
        .order('order', { ascending: true });

      if (error) throw error;
      setCompliance(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading compliance",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (itemData: ComplianceData) => {
    try {
      const payload = {
        locale,
        title: itemData.title,
        badge_icon: itemData.badge_icon,
        link_url: itemData.link_url,
        order: itemData.order,
      };

      if (itemData.id) {
        const { error } = await supabase
          .from('about_compliance')
          .update(payload)
          .eq('id', itemData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('about_compliance')
          .insert([payload]);

        if (error) throw error;
      }

      toast({
        title: "Compliance item saved",
        description: "Compliance item has been saved successfully.",
      });

      fetchCompliance();
      setDialogOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      toast({
        title: "Error saving compliance item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('about_compliance')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Compliance item deleted",
        description: "Compliance item has been deleted successfully.",
      });

      fetchCompliance();
    } catch (error: any) {
      toast({
        title: "Error deleting compliance item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async () => {
    const targetLocales = ['en', 'ru', 'kk'].filter(l => l !== locale);
    
    if (compliance.length === 0) {
      toast({
        title: "No compliance items to duplicate",
        description: "Please add compliance items before duplicating.",
        variant: "destructive",
      });
      return;
    }

    try {
      for (const targetLocale of targetLocales) {
        // Delete existing compliance for target locale
        await supabase
          .from('about_compliance')
          .delete()
          .eq('locale', targetLocale);

        // Insert current compliance
        const duplicateItems = compliance.map(item => ({
          locale: targetLocale,
          title: item.title,
          badge_icon: item.badge_icon,
          link_url: item.link_url,
          order: item.order,
        }));

        const { error } = await supabase
          .from('about_compliance')
          .insert(duplicateItems);

        if (error) throw error;
      }

      toast({
        title: "Compliance duplicated",
        description: `Compliance duplicated to ${targetLocales.join(', ')} locales.`,
      });
    } catch (error: any) {
      toast({
        title: "Error duplicating compliance",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const ComplianceForm = ({ item }: { item: ComplianceData | null }) => {
    const [formData, setFormData] = useState<ComplianceData>(
      item || {
        title: '',
        badge_icon: 'iso-9001',
        link_url: null,
        order: compliance.length + 1,
      }
    );

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="ISO 9001:2015 Certified"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="badge">Badge Icon</Label>
          <Select 
            value={formData.badge_icon} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, badge_icon: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a badge icon" />
            </SelectTrigger>
            <SelectContent>
              {badgeOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <SelectItem key={option.key} value={option.key}>
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-4 w-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="link">Link URL (Optional)</Label>
          <Input
            id="link"
            type="url"
            value={formData.link_url || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value || null }))}
            placeholder="https://iso.org/iso-9001-quality-management.html"
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
            disabled={!formData.title}
          >
            Save Compliance Item
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
          Compliance & Safety ({locale.toUpperCase()})
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
                  Add Compliance Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Edit Compliance Item' : 'Add New Compliance Item'}
                  </DialogTitle>
                </DialogHeader>
                <ComplianceForm item={editingItem} />
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {compliance.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No compliance items added yet. Click "Add Compliance Item" to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {compliance.map((item) => {
              const badgeOption = badgeOptions.find(opt => opt.key === item.badge_icon);
              const IconComponent = badgeOption?.icon || Shield;

              return (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-4 border border-border rounded-lg"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium">{item.title}</h4>
                    {item.link_url && (
                      <div className="flex items-center space-x-1 text-sm text-primary mt-1">
                        <ExternalLink className="h-3 w-3" />
                        <a 
                          href={item.link_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          View Details
                        </a>
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
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminCompliance;