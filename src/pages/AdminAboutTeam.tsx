import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminTeam from '@/components/admin/sections/AdminTeam';

const AdminAboutTeam = () => {
  const [locale, setLocale] = useState('en');

  return (
    <AdminLayout locale={locale} onLocaleChange={setLocale}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Team Management</h2>
        <AdminTeam locale={locale} />
      </div>
    </AdminLayout>
  );
};

export default AdminAboutTeam;