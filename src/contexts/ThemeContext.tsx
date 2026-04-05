/**
 * Theme Context
 *
 * This context provides theme management throughout the application using next-themes.
 * It allows components to toggle between light, dark, and vibrant modes.
 *
 * This is a re-export of next-themes functionality for consistent API across the application.
 */

import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';
import React from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  enableSystem?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
  enableSystem = true,
}) => {
  return (
    <NextThemesProvider
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      attribute="class"
      themes={['light', 'dark', 'vibrant']}
    >
      {children}
    </NextThemesProvider>
  );
};

// Re-export the hook with the same interface as our custom one
export const useTheme = useNextTheme;
