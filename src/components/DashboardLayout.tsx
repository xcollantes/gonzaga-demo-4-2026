/**
 * DashboardLayout Component
 *
 * This component provides the main layout structure for dashboard pages.
 * It includes:
 * - Navigation sidebar with links to different sections
 * - Header with user profile information and logout functionality
 * - Content area for page-specific components
 *
 * Use this layout for any page that should have the standard dashboard UI.
 */

import LeftSideNavigationMenu from '@/components/navigation/LeftSideNavigationMenu';
import TopNavigationMenu from '@/components/navigation/TopNavigationMenu';
import { useAuth } from '@/contexts/AuthContext';
import { toastError, toastSuccess } from '@/lib/toast';
import { useRouter } from 'next/router';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/account');
      toastSuccess("Logged out");
    } catch (error) {
      console.error('Failed to log out', error);
      toastError("Failed to log out");
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[var(--color-background)]">
      <LeftSideNavigationMenu onLogout={handleLogout} />

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <TopNavigationMenu showLogo={false} />

        {/* Page content */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}