import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminTimeline from '@/components/admin/sections/AdminTimeline';

const AdminAboutTimeline = () => {
  const [locale, setLocale] = useState('en');

  return (
    <AdminLayout locale={locale} onLocaleChange={setLocale}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Timeline Management</h2>
        <AdminTimeline locale={locale} />
      </div>
    </AdminLayout>
  );
};

export default AdminAboutTimeline;