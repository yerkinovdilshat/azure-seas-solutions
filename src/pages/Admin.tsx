import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';

const Admin = () => {
  const [locale, setLocale] = useState('en');

  // Redirect to About Us by default
  return <Navigate to="/admin/about" replace />;
};

export default Admin;