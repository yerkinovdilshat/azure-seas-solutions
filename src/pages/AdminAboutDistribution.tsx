import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDistribution from '@/components/admin/sections/AdminDistribution';

const AdminAboutDistribution = () => {
  const [locale, setLocale] = useState('en');

  return (
    <AdminLayout locale={locale} onLocaleChange={setLocale}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Distribution Management</h2>
        <AdminDistribution locale={locale} />
      </div>
    </AdminLayout>
  );
};

export default AdminAboutDistribution;