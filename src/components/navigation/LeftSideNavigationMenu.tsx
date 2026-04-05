import { DarkModeToggleSwitch } from '@/components/DarkModeToggleSwitch';
import { Logo } from '@/components/icons';
import UserAvatar from '@/components/icons/UserAvatar';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { toastError } from '@/lib/toast';
import {
  CreditCard,
  Home,
  LogOut,
  MessageSquare,
  User as UserIcon,
  ChevronDown
} from 'lucide-react';
import { useRouter } from 'next/router';
interface SideNavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

/**
 * Edit the menu navigation items here.
 */
const navigation: SideNavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Profile', href: '/profile', icon: UserIcon },
  { name: 'Chatbot', href: '/chatbot', icon: MessageSquare },
  { name: 'Accordion Example', href: '/accordion-example', icon: ChevronDown },
  { name: 'Subscription', href: '/subscription', icon: CreditCard },
];

interface LeftSideNavigationProps {
  onLogout?: () => Promise<void>;
}

export default function LeftSideNavigationMenu({ onLogout }: LeftSideNavigationProps) {
  const router = useRouter();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/account');
      if (onLogout) {
        await onLogout();
      }
    } catch (error) {
      console.error('Failed to log out', error);
      toastError("Failed to log out");
    }
  };

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const signOutButton = (
    <Button
      key="sign-out"
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-secondary-foreground)] group flex items-center py-2 text-sm font-medium rounded-md transition-colors duration-200 p-0 justify-start"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Sign out
    </Button>
  )

  return (
    <>
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-[var(--color-border)] bg-[var(--color-background)]">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Logo />
              </div>

              {/* Left-hand navigation menu */}
              <nav className="mt-5 flex-1 px-2 bg-[var(--color-background)] space-y-1">
                {navigation.map((item: SideNavigationItem) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full justify-start px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
                  >
                    <item.icon
                      className="text-[var(--color-foreground)] mr-3 flex-shrink-0 h-6 w-6 transition-colors duration-200"
                      aria-hidden="true"
                    />
                    {item.name}
                  </Button>
                ))}
              </nav>
            </div>

            {/* Bottom navigation menu */}
            <div className="flex-shrink-0 flex border-t border-[var(--color-border)] p-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  <UserAvatar />
                  <div>
                    <p
                      className="text-sm font-medium truncate max-w-[100px] text-[var(--color-foreground)]"
                      title={currentUser?.displayName || currentUser?.email || ''}
                    >
                      {currentUser?.displayName || currentUser?.email || ''}
                    </p>
                    {signOutButton}
                  </div>
                </div>
                <DarkModeToggleSwitch />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}