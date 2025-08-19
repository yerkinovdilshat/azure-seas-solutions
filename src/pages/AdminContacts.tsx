import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminContactsSection from '@/components/admin/sections/AdminContacts';

const AdminContacts = () => {
  const [locale, setLocale] = useState('en');

  return (
    <AdminLayout locale={locale} onLocaleChange={setLocale}>
      <AdminContactsSection locale={locale} />
    </AdminLayout>
  );
};

export default AdminContacts;