/**
 * Top navigation menu component.
 *
 * This component is used to display the top navigation menu.
 * It is used on all pages.
 *
 * It is a wrapper around the Drawer component.
 */

import { DarkModeToggleSwitch } from '@/components/DarkModeToggleSwitch';
import { Logo } from '@/components/icons';
import UserAvatar from '@/components/icons/UserAvatar';
import { Button } from '@/components/ui/Button';
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/components/ui/Drawer';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { toastWarning } from '@/lib/toast';
import { cn } from '@/lib/utils';
import {
  Home,
  LogOut,
  Menu,
  User as UserIcon,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface TopNavigationMenuProps {
  showLogo?: boolean;
}

export default function TopNavigationMenu({ showLogo = true }: TopNavigationMenuProps) {
  const { currentUser, logout } = useAuth();
  const { isInOnboarding } = useOnboarding();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNavigation = () => {
    setIsMenuOpen(false);
  };

  const handleDisabledClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toastWarning("Complete onboarding first");
  };

  /**
   * NavButton component for consistent navigation item rendering
   * To add a new navigation item:
   * 1. Import any required icon from 'lucide-react' or your custom icons
   * 2. Add a new NavButton in the nav section (line ~100)
   * 3. Provide the following props:
   *    - href: The route to navigate to
   *    - icon: React node (typically a Lucide icon with className="mr-2 h-4 w-4")
   *    - label: Text label to display
   *    - disabled: (Optional) Set to true to disable navigation during onboarding
   * Example:
   * <NavButton
   *   href="/settings"
   *   icon={<Settings className="mr-2 h-4 w-4" />}
   *   label="Settings"
   *   disabled={isInOnboarding}
   * />
   */
  const NavButton = ({
    href,
    icon,
    label,
    disabled = false,
    className = ""
  }: {
    href: string;
    icon: React.ReactNode;
    label: React.ReactNode;
    disabled?: boolean;
    className?: string;
  }) => {
    return (
      <div onClick={disabled ? handleDisabledClick : undefined} className="w-full">
        {disabled ? (
          <Button variant="ghost" className="w-full justify-start" disabled>
            {icon}
            {label}
          </Button>
        ) : (
          <Link href={href} onClick={() => handleNavigation()}>
            <Button
              variant="ghost"
              className={cn("w-full justify-start transition-colors duration-200 hover:bg-[var(--color-secondary)] hover:text-[var(--color-secondary-foreground)]", className)}
            >
              {icon}
              {label}
            </Button>
          </Link>
        )}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="container flex h-14 mx-auto items-center justify-between px-4 sm:px-6 md:px-8">

        {showLogo ? (<Logo className="text-2xl" />) : <div />}

        <Logo className="text-2xl md:hidden" />

        <div className="flex items-center gap-4">
          {currentUser && <UserAvatar size="sm" />}
          <DarkModeToggleSwitch />
          {currentUser && (
            <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen} direction="right">
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disableHover
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="fixed inset-y-0 right-0 h-full w-[300px] max-w-full bg-[var(--color-background)] rounded-none border-l border-l-[var(--color-border)] p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-sm truncate max-w-[220px]" title={currentUser?.displayName || currentUser?.email || ''}>
                      {currentUser?.displayName || currentUser?.email || ''}
                    </span>
                  </div>
                  <DrawerClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-[var(--color-secondary)] transition-colors duration-200"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </DrawerClose>
                </div>
                <div className="py-4">
                  <nav className="flex flex-col space-y-2">

                    {/* Add new NavButton components here. */}
                    <NavButton
                      href="/dashboard"
                      icon={<Home className="mr-2 h-4 w-4" />}
                      label="Dashboard"
                    />

                    {currentUser && (
                      <>
                        <NavButton
                          href="/profile"
                          icon={<UserIcon className="mr-2 h-4 w-4" />}
                          label="Profile"
                          disabled={isInOnboarding}
                        />

                        <hr className="my-4 border-[var(--color-border)]" />

                        <div onClick={handleLogout} className="w-full">
                          <NavButton
                            href="#"
                            icon={<LogOut className="mr-2 h-4 w-4 text-[var(--color-destructive)]" />}
                            label="Sign out"
                            className="w-full justify-start text-[var(--color-destructive)] hover:text-[var(--color-destructive)]"
                          />
                        </div>
                      </>
                    )}
                  </nav>
                </div>
              </DrawerContent>
            </Drawer>
          )}
        </div>
      </div>
    </header >
  );
}