import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, GripVertical, Copy, Shield, Wrench, Truck, MapPin, Award, Users } from 'lucide-react';

interface AdminValuesProps {
  locale: string;
}

interface ValueData {
  id?: string;
  title: string;
  description: string;
  icon_key: string;
  order: number;
}

const iconOptions = [
  { key: 'shield-check', label: 'Shield Check', icon: Shield },
  { key: 'wrench', label: 'Wrench', icon: Wrench },
  { key: 'truck', label: 'Truck', icon: Truck },
  { key: 'map-pin', label: 'Map Pin', icon: MapPin },
  { key: 'award', label: 'Award', icon: Award },
  { key: 'users', label: 'Users', icon: Users },
];

const AdminValues = ({ locale }: AdminValuesProps) => {
  const [values, setValues] = useState<ValueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingValue, setEditingValue] = useState<ValueData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchValues();
  }, [locale]);

  const fetchValues = async () => {
    try {
      const { data, error } = await supabase
        .from('about_values')
        .select('*')
        .eq('locale', locale)
        .order('order', { ascending: true });

      if (error) throw error;
      setValues(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading values",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (valueData: ValueData) => {
    try {
      const payload = {
        locale,
        title: valueData.title,
        description: valueData.description,
        icon_key: valueData.icon_key,
        order: valueData.order,
      };

      if (valueData.id) {
        const { error } = await supabase
          .from('about_values')
          .update(payload)
          .eq('id', valueData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('about_values')
          .insert([payload]);

        if (error) throw error;
      }

      toast({
        title: "Value saved",
        description: "Value has been saved successfully.",
      });

      fetchValues();
      setDialogOpen(false);
      setEditingValue(null);
    } catch (error: any) {
      toast({
        title: "Error saving value",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('about_values')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Value deleted",
        description: "Value has been deleted successfully.",
      });

      fetchValues();
    } catch (error: any) {
      toast({
        title: "Error deleting value",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async () => {
    const targetLocales = ['en', 'ru', 'kk'].filter(l => l !== locale);
    
    if (values.length === 0) {
      toast({
        title: "No values to duplicate",
        description: "Please add values before duplicating.",
        variant: "destructive",
      });
      return;
    }

    try {
      for (const targetLocale of targetLocales) {
        // Delete existing values for target locale
        await supabase
          .from('about_values')
          .delete()
          .eq('locale', targetLocale);

        // Insert current values
        const duplicateValues = values.map(value => ({
          locale: targetLocale,
          title: value.title,
          description: value.description,
          icon_key: value.icon_key,
          order: value.order,
        }));

        const { error } = await supabase
          .from('about_values')
          .insert(duplicateValues);

        if (error) throw error;
      }

      toast({
        title: "Values duplicated",
        description: `Values duplicated to ${targetLocales.join(', ')} locales.`,
      });
    } catch (error: any) {
      toast({
        title: "Error duplicating values",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const ValueForm = ({ value }: { value: ValueData | null }) => {
    const [formData, setFormData] = useState<ValueData>(
      value || {
        title: '',
        description: '',
        icon_key: 'shield-check',
        order: values.length + 1,
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
            placeholder="Quality Assurance"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="We partner only with certified European manufacturers..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon">Icon</Label>
          <Select 
            value={formData.icon_key} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, icon_key: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an icon" />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map((option) => {
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
              setEditingValue(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleSave(formData)}
            disabled={!formData.title || !formData.description}
          >
            Save Value
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
          Values ({locale.toUpperCase()})
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
                <Button size="sm" onClick={() => setEditingValue(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Value
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingValue ? 'Edit Value' : 'Add New Value'}
                  </DialogTitle>
                </DialogHeader>
                <ValueForm value={editingValue} />
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {values.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No values added yet. Click "Add Value" to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {values.map((value) => {
              const iconOption = iconOptions.find(opt => opt.key === value.icon_key);
              const IconComponent = iconOption?.icon || Shield;

              return (
                <div
                  key={value.id}
                  className="flex items-center space-x-4 p-4 border border-border rounded-lg"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  
                  <div className="flex items-center space-x-3 flex-1">
                    <IconComponent className="h-6 w-6 text-primary" />
                    <div>
                      <h4 className="font-medium">{value.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {value.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    #{value.order}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingValue(value);
                        setDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => value.id && handleDelete(value.id)}
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

export default AdminValues;