import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminLicenses from '@/components/admin/sections/AdminLicenses';

const AdminAboutLicenses = () => {
  const [locale, setLocale] = useState('en');

  return (
    <AdminLayout locale={locale} onLocaleChange={setLocale}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Licenses Management</h2>
        <AdminLicenses locale={locale} />
      </div>
    </AdminLayout>
  );
};

export default AdminAboutLicenses;