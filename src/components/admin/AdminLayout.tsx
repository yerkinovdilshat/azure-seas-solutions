import { useEffect, useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User, Globe, FileText, Newspaper, FolderOpen, Wrench, Package, Phone, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AdminLayoutProps {
  children: React.ReactNode;
  locale: string;
  onLocaleChange: (locale: string) => void;
}

const AdminLayout = ({ children, locale, onLocaleChange }: AdminLayoutProps) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const sidebarItems = [
    { title: 'About Us', url: '/admin/about', icon: Info },
    { title: 'News', url: '/admin/news', icon: Newspaper },
    { title: 'Projects', url: '/admin/projects', icon: FolderOpen },
    { title: 'Services', url: '/admin/services', icon: Wrench },
    { title: 'Catalog', url: '/admin/catalog', icon: Package },
    { title: 'Contacts', url: '/admin/contacts', icon: Phone },
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth/login');
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user && event !== 'INITIAL_SESSION') {
          navigate('/auth/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/auth/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-light">
        {/* Sidebar */}
        <Sidebar className="w-64">
          <SidebarContent>
            <div className="p-4 border-b border-border">
              <h1 className="text-lg font-bold text-navy">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Marine Support Services</p>
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel>Content Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={item.url} 
                          className={({ isActive }) => 
                            isActive 
                              ? "bg-muted text-primary font-medium flex items-center space-x-2" 
                              : "hover:bg-muted/50 flex items-center space-x-2"
                          }
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-border shadow-sm">
            <div className="flex justify-between items-center h-16 px-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Locale Switcher */}
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Select value={locale} onValueChange={onLocaleChange}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">EN</SelectItem>
                      <SelectItem value="ru">RU</SelectItem>
                      <SelectItem value="kk">KK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                </div>

                {/* Logout Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;