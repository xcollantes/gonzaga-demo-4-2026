import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the mobile breakpoint (devices smaller than this are considered mobile)
const MOBILE_BREAKPOINT = 768;

type MobileContextType = {
  isMobile: boolean;
};

const MobileContext = createContext<MobileContextType | undefined>(undefined);

export function MobileProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is defined (to avoid SSR issues)
    if (typeof window === 'undefined') return;

    // Initial check
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Run initial check
    checkIfMobile();

    // Add resize listener
    window.addEventListener('resize', checkIfMobile);

    // Clean up
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return (
    <MobileContext.Provider value={{ isMobile }}>
      {children}
    </MobileContext.Provider>
  );
}

export function useMobile(): MobileContextType {
  const context = useContext(MobileContext);

  if (context === undefined) {
    throw new Error('useMobile must be used within a MobileProvider');
  }

  return context;
}