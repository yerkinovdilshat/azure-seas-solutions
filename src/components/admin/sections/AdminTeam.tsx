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
import { Plus, Edit, Trash2, GripVertical, Copy, User } from 'lucide-react';
import { saveWithUpload } from '@/lib/uploadHelper';

interface AdminTeamProps {
  locale: string;
}

interface TeamData {
  id?: string;
  name: string;
  role: string;
  bio: string;
  photo: string | null;
  order: number;
}

interface TeamFormData extends TeamData {
  photoFile?: File;
}

const AdminTeam = ({ locale }: AdminTeamProps) => {
  const [team, setTeam] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeam();
  }, [locale]);

  const fetchTeam = async () => {
    console.log('🏃 Fetching team data for locale:', locale);
    try {
      const { data, error } = await supabase
        .from('about_team')
        .select('*')
        .eq('locale', locale)
        .order('order', { ascending: true });

      console.log('👥 Team fetch result:', { data, error });

      if (error) throw error;
      setTeam(data || []);
      console.log('✅ Team data set successfully:', data?.length || 0, 'members');
    } catch (error: any) {
      console.error('❌ Error loading team:', error);
      toast({
        title: "Error loading team",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (memberData: TeamFormData) => {
    if (!memberData.name || !memberData.role) {
      toast({
        title: "Missing required fields",
        description: "Please fill in name and role.",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        locale,
        name: memberData.name,
        role: memberData.role,
        bio: memberData.bio || '',
        photo: memberData.photo,
        order: memberData.order,
        ...(memberData.id && { id: memberData.id })
      };

      await saveWithUpload({
        table: 'about_team',
        data: payload,
        file: memberData.photoFile,
        bucket: 'images',
        folder: 'team',
        urlField: 'photo'
      });

      toast({
        title: "Team member saved",
        description: "Team member has been saved successfully.",
      });

      await fetchTeam();
      setDialogOpen(false);
      setEditingMember(null);
    } catch (error: any) {
      console.error('❌ Error saving team member:', error);
      toast({
        title: "Error saving team member",
        description: error.message || "Failed to save team member",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('about_team')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Team member deleted",
        description: "Team member has been deleted successfully.",
      });

      fetchTeam();
    } catch (error: any) {
      toast({
        title: "Error deleting team member",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async () => {
    const targetLocales = ['en', 'ru', 'kk'].filter(l => l !== locale);
    
    if (team.length === 0) {
      toast({
        title: "No team members to duplicate",
        description: "Please add team members before duplicating.",
        variant: "destructive",
      });
      return;
    }

    try {
      for (const targetLocale of targetLocales) {
        // Delete existing team for target locale
        await supabase
          .from('about_team')
          .delete()
          .eq('locale', targetLocale);

        // Insert current team
        const duplicateMembers = team.map(member => ({
          locale: targetLocale,
          name: member.name,
          role: member.role,
          bio: member.bio,
          photo: member.photo,
          order: member.order,
        }));

        const { error } = await supabase
          .from('about_team')
          .insert(duplicateMembers);

        if (error) throw error;
      }

      toast({
        title: "Team duplicated",
        description: `Team duplicated to ${targetLocales.join(', ')} locales.`,
      });
    } catch (error: any) {
      toast({
        title: "Error duplicating team",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const TeamForm = ({ member }: { member: TeamData | null }) => {
    const [formData, setFormData] = useState<TeamFormData>(() => 
      member || {
        name: '',
        role: '',
        bio: '',
        photo: null,
        order: team.length + 1,
      }
    );

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      await handleSave(formData);
    };

    const handleFileChange = (file: File | null) => {
      if (file) {
        // Store file for upload and create preview
        setFormData(prev => ({ 
          ...prev, 
          photoFile: file,
          photo: URL.createObjectURL(file) // Preview URL
        }));
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Alexey Petrov"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              placeholder="General Director"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Professional background and experience..."
            rows={3}
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
          <Label>Photo</Label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {formData.photo && (
            <div className="mt-2">
              <img
                src={formData.photo}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-full border"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              setDialogOpen(false);
              setEditingMember(null);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!formData.name || !formData.role}
          >
            Save Team Member
          </Button>
        </div>
      </form>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Team ({locale.toUpperCase()})
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
                <Button size="sm" onClick={() => setEditingMember(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                  <DialogTitle>
                    {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
                  </DialogTitle>
                </DialogHeader>
                <div onClick={(e) => e.stopPropagation()}>
                  <TeamForm member={editingMember} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {team.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No team members added yet. Click "Add Team Member" to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {team.map((member) => (
              <div
                key={member.id}
                className="flex items-start space-x-4 p-4 border border-border rounded-lg"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move mt-1" />
                
                <div className="flex items-center space-x-3">
                  {member.photo ? (
                    <img 
                      src={member.photo} 
                      alt={member.name}
                      className="w-12 h-12 object-cover rounded-full border"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-medium">{member.name}</h4>
                  <p className="text-sm text-primary font-medium">{member.role}</p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {member.bio}
                  </p>
                </div>

                <div className="text-sm text-muted-foreground">
                  #{member.order}
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingMember(member);
                      setDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => member.id && handleDelete(member.id)}
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

export default AdminTeam;