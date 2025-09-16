import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminProjectsSection from '@/components/admin/sections/AdminProjects';

const AdminProjects = () => {
  const [locale, setLocale] = useState('en');

  return (
    <AdminLayout locale={locale} onLocaleChange={setLocale}>
      <AdminProjectsSection locale={locale} />
    </AdminLayout>
  );
};

export default AdminProjects;