import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import Protected from '@/components/admin/Protected';

const adminTabs = [
  { value: 'site', label: 'Site Settings', path: '/admin/site' },
  { value: 'about', label: 'About Items', path: '/admin/about' },
  { value: 'news', label: 'News', path: '/admin/news' },
  { value: 'projects', label: 'Projects', path: '/admin/projects' },
  { value: 'services', label: 'Services', path: '/admin/services' },
];

export default function Admin() {
  const location = useLocation();
  const currentTab = adminTabs.find(tab => tab.path === location.pathname)?.value || 'site';

  return (
    <Protected>
      <Layout>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your site content and settings</p>
            </div>

            <Tabs value={currentTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8">
                {adminTabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} asChild>
                    <NavLink
                      to={tab.path}
                      className={({ isActive }) =>
                        `inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                          isActive
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`
                      }
                    >
                      {tab.label}
                    </NavLink>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="mt-6">
                <Outlet />
              </div>
            </Tabs>
          </div>
        </div>
      </Layout>
    </Protected>
  );
}