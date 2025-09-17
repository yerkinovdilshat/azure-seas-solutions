import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/adminApi';

interface ProtectedProps {
  children: React.ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['admin', 'me'],
    queryFn: () => adminApi.me(),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not Authorized</h1>
          <p className="text-muted-foreground mb-4">You need admin access to view this page.</p>
          <a href="/auth/login" className="text-primary hover:underline">
            Login as Admin
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}