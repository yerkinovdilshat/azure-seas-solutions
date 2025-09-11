import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminCertificates from '@/components/admin/sections/AdminCertificates';

const AdminAboutCertificates = () => {
  const [locale, setLocale] = useState('en');

  return (
    <AdminLayout locale={locale} onLocaleChange={setLocale}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Certificates Management</h2>
        <AdminCertificates locale={locale} />
      </div>
    </AdminLayout>
  );
};

export default AdminAboutCertificates;