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

  const handleSave = async (memberData: TeamData) => {
    console.log('💾 Saving team member:', memberData);
    try {
      const payload = {
        locale,
        name: memberData.name,
        role: memberData.role,
        bio: memberData.bio,
        photo: memberData.photo,
        order: memberData.order,
      };

      console.log('📤 Saving payload:', payload);

      if (memberData.id) {
        const { error } = await supabase
          .from('about_team')
          .update(payload)
          .eq('id', memberData.id);

        if (error) throw error;
        console.log('✅ Team member updated successfully');
      } else {
        const { error } = await supabase
          .from('about_team')
          .insert([payload]);

        if (error) throw error;
        console.log('✅ Team member created successfully');
      }

      toast({
        title: "Team member saved",
        description: "Team member has been saved successfully.",
      });

      fetchTeam();
      setDialogOpen(false);
      setEditingMember(null);
    } catch (error: any) {
      console.error('❌ Error saving team member:', error);
      toast({
        title: "Error saving team member",
        description: error.message,
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
    const [formData, setFormData] = useState<TeamData>(
      member || {
        name: '',
        role: '',
        bio: '',
        photo: null,
        order: team.length + 1,
      }
    );

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Alexey Petrov"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              placeholder="General Director"
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
          <FileUpload
            value={formData.photo}
            onChange={(url) => setFormData(prev => ({ ...prev, photo: url }))}
            bucket="images"
            folder="team"
            accept="image/*"
            allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
            maxSize={5}
            placeholder="Upload team member photo"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setDialogOpen(false);
              setEditingMember(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleSave(formData)}
            disabled={!formData.name || !formData.role || !formData.photo}
          >
            Save Team Member
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
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
                  </DialogTitle>
                </DialogHeader>
                <TeamForm member={editingMember} />
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