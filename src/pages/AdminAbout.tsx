import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminAbout = () => {
  // Redirect to Story section by default
  return <Navigate to="/admin/about/story" replace />;
};

export default AdminAbout;