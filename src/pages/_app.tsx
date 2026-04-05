/**
 * Main Application Component
 *
 * This is the root component of the Next.js application.
 * It wraps all pages with:
 * - AuthProvider: For authentication state management
 * - ToastProvider: For displaying toast notifications
 * - ThemeProvider: For theme management (dark/light mode)
 * - MobileProvider: For detecting mobile devices
 * - NavigationMenu: Global navigation component
 *
 * Global CSS is also imported here to be applied across all pages.
 */

import { SEOHead } from '@/components/SEOHead';
import { AuthProvider } from '@/contexts/AuthContext';
import { MobileProvider } from '@/contexts/MobileContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { useFadeInView } from '@/lib/hooks/useFadeInView';
import { queryClient } from '@/lib/query-client';
import '@/styles/globals.css';
import { QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';

function AppContent({ Component, pageProps }: AppProps) {
  // Initialize the fade-in-view system
  useFadeInView({
    rootMargin: '0px 0px -100px 0px', // Elements come into view when 100px from bottom of viewport
    threshold: 0.15 // Elements start fading in when 15% visible
  });

  // Default SEO applied to all pages - will be overridden by page-specific SEO components
  return (
    <>
      <SEOHead />
      <Component {...pageProps} />
    </>
  );
}

export default function App(props: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" enableSystem={false}>
        <MobileProvider>
          <AuthProvider>
            <OnboardingProvider>
              <ToastProvider>
                <AppContent {...props} />
              </ToastProvider>
            </OnboardingProvider>
          </AuthProvider>
        </MobileProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
