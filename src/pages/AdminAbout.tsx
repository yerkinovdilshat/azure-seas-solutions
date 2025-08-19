import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { TabsContent } from '@/components/ui/tabs';
import AdminStory from '@/components/admin/sections/AdminStory';
import AdminValues from '@/components/admin/sections/AdminValues';
import AdminTimeline from '@/components/admin/sections/AdminTimeline';
import AdminTeam from '@/components/admin/sections/AdminTeam';
import AdminPartners from '@/components/admin/sections/AdminPartners';
import AdminCertificates from '@/components/admin/sections/AdminCertificates';
import AdminCompliance from '@/components/admin/sections/AdminCompliance';

const AdminAbout = () => {
  const [currentTab, setCurrentTab] = useState('story');
  const [locale, setLocale] = useState('en');

  return (
    <AdminLayout locale={locale} onLocaleChange={setLocale}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">About Us Management</h2>
        
        <TabsContent value="story" className="space-y-6">
          <AdminStory locale={locale} />
        </TabsContent>
        
        <TabsContent value="values" className="space-y-6">
          <AdminValues locale={locale} />
        </TabsContent>
        
        <TabsContent value="timeline" className="space-y-6">
          <AdminTimeline locale={locale} />
        </TabsContent>
        
        <TabsContent value="team" className="space-y-6">
          <AdminTeam locale={locale} />
        </TabsContent>
        
        <TabsContent value="partners" className="space-y-6">
          <AdminPartners />
        </TabsContent>
        
        <TabsContent value="certificates" className="space-y-6">
          <AdminCertificates locale={locale} />
        </TabsContent>
        
        <TabsContent value="compliance" className="space-y-6">
          <AdminCompliance locale={locale} />
        </TabsContent>
      </div>
    </AdminLayout>
  );
};

export default AdminAbout;