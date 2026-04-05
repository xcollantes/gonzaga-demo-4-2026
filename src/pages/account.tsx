/**
 * Account Page
 *
 * This page serves as a unified authentication gateway with tab-based navigation
 * between login and signup forms. It provides a seamless user experience for
 * both new and returning users.
 */

import LoadingSpinner from '@/components/LoadingSpinner';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import TopNavigationMenu from '@/components/navigation/TopNavigationMenu';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Account() {
  const router = useRouter();
  const [loginTab, setLoginTab] = useState<boolean>(true);
  const { currentUser, loading } = useAuth();

  // If user is already logged in, redirect to dashboard.
  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  // Set the active tab based on the URL query parameter.
  // `/account?mode=signup` -> set the active tab to signup.
  // `/account?mode=login` -> set the active tab to login.
  useEffect(() => {
    const { mode } = router.query;
    if (mode === 'signup' || mode === 'login') {
      setLoginTab(mode === 'login');
    }
  }, [router.query]);

  // Show loading spinner while checking authentication status.
  if (loading || currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <TopNavigationMenu />
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="w-full max-w-[400px]">
          {loginTab ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </>
  );
}