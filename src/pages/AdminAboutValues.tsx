import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminValues from '@/components/admin/sections/AdminValues';

const AdminAboutValues = () => {
  const [locale, setLocale] = useState('en');

  return (
    <AdminLayout locale={locale} onLocaleChange={setLocale}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Values Management</h2>
        <AdminValues locale={locale} />
      </div>
    </AdminLayout>
  );
};

export default AdminAboutValues;