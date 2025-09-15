// Simple placeholder for now - Auth migrated to MariaDB/MySQL  
export default function AuthLogin() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        <div className="p-6 border rounded-lg">
          <p className="text-muted-foreground text-center">
            Authentication system has been migrated to work with MariaDB/MySQL via REST API.
          </p>
        </div>
      </div>
    </div>
  );
}