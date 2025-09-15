// Simple placeholder for now - Admin functionality migrated to MariaDB/MySQL
export default function Admin() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">About Management</h2>
          <p className="text-muted-foreground">Manage about sections, distribution, certificates, and licenses.</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Catalog Management</h2>
          <p className="text-muted-foreground">Manage product catalog and categories.</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Content Management</h2>
          <p className="text-muted-foreground">Manage news, projects, and services.</p>
        </div>
      </div>
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          <strong>Migration Notice:</strong> Admin functionality has been migrated from Supabase to MariaDB/MySQL with REST API.
        </p>
      </div>
    </div>
  );
}