import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminNewsSection from '@/components/admin/sections/AdminNews';

const AdminNews = () => {
  const [locale, setLocale] = useState('en');

  return (
    <AdminLayout locale={locale} onLocaleChange={setLocale}>
      <AdminNewsSection locale={locale} />
    </AdminLayout>
  );
};

export default AdminNews;