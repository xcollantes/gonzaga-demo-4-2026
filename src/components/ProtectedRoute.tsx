/**
 * ProtectedRoute Component
 *
 * This component serves as a route guard that restricts access to authenticated users only.
 * It redirects unauthenticated users to the login page.
 *
 * NOTE: This component is now mostly a fallback, as route protection is primarily handled by middleware.
 * It exists for client-side protection when the middleware check doesn't happen (e.g., during development).
 */

import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/account');
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return currentUser ? <>{children}</> : null;
}