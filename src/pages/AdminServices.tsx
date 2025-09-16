import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminServicesSection from '@/components/admin/sections/AdminServices';

const AdminServices = () => {
  const [locale, setLocale] = useState('en');

  return (
    <AdminLayout locale={locale} onLocaleChange={setLocale}>
      <AdminServicesSection locale={locale} />
    </AdminLayout>
  );
};

export default AdminServices;