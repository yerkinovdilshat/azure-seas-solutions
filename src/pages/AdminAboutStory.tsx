import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminStory from '@/components/admin/sections/AdminStory';

const AdminAboutStory = () => {
  const [locale, setLocale] = useState('en');

  return (
    <AdminLayout locale={locale} onLocaleChange={setLocale}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Story Management</h2>
        <AdminStory locale={locale} />
      </div>
    </AdminLayout>
  );
};

export default AdminAboutStory;