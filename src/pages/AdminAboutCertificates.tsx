import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminAboutItems from '@/components/admin/sections/AdminAboutItems';

const AdminAboutCertificates = () => {
  const [locale, setLocale] = useState('en');

  return (
    <AdminLayout locale={locale} onLocaleChange={setLocale}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Certificates Management</h2>
        <AdminAboutItems kind="certificate" />
      </div>
    </AdminLayout>
  );
};

export default AdminAboutCertificates;