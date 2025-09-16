import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPartners from '@/components/admin/sections/AdminPartners';

const AdminAboutPartners = () => {
  const [locale, setLocale] = useState('en');

  return (
    <AdminLayout locale={locale} onLocaleChange={setLocale}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Partners Management</h2>
        <AdminPartners />
      </div>
    </AdminLayout>
  );
};

export default AdminAboutPartners;