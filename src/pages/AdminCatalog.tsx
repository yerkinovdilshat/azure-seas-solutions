import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminCatalogSection from '@/components/admin/sections/AdminCatalog';

const AdminCatalog = () => {
  const [locale, setLocale] = useState('en');

  return (
    <AdminLayout locale={locale} onLocaleChange={setLocale}>
      <AdminCatalogSection locale={locale} />
    </AdminLayout>
  );
};

export default AdminCatalog;