/**
 * Toast Context
 *
 * This context provides a notification system throughout the application.
 * It allows components to display toast notifications for:
 * - Success messages
 * - Error messages
 * - Informational alerts
 * - Warnings
 *
 * Wrap your application with ToastProvider to enable toast functionality.
 * Use the useToast() hook to access toast functions in any component.
 */

import { ToastContainer } from '@/components/Toast';
import { toastError, toastGeneric, toastInfo, toastSuccess, toastWarning } from '@/lib/toast';
import React, { createContext, useContext } from 'react';
import { ExternalToast } from 'sonner';

interface ToastContextType {
  success: (message: string, options?: ExternalToast) => void;
  error: (message: string, options?: ExternalToast) => void;
  info: (message: string, options?: ExternalToast) => void;
  warning: (message: string, options?: ExternalToast) => void;
  toast: (message: string, options?: ExternalToast) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  theme?: 'light' | 'dark' | 'system';
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'bottom-right',
  theme = 'light',
}) => {
  const toastFunctions: ToastContextType = {
    success: toastSuccess,
    error: toastError,
    info: toastInfo,
    warning: toastWarning,
    toast: toastGeneric,
  };

  return (
    <ToastContext.Provider value={toastFunctions}>
      {children}
      <ToastContainer position={position} theme={theme} richColors={true} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};