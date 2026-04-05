/**
 * Toast Utility for Global Usage
 *
 * This utility allows using toast notifications anywhere in the application
 * without needing to access the ToastContext through hooks.
 *
 * Import these functions directly to show toast notifications from any file,
 * including non-React files or outside of the component tree.
 */

import { toastError, toastGeneric, toastInfo, toastSuccess, toastWarning } from '@/lib/toast';
import { ExternalToast as ToastOptions } from 'sonner';

// Export a simple object with all toast functions.
const toast = {
  /**
   * Display a success toast notification.
   */
  success: (message: string, options?: ToastOptions) => toastSuccess(message, options),

  /**
   * Display an error toast notification.
   */
  error: (message: string, options?: ToastOptions) => toastError(message, options),

  /**
   * Display an info toast notification.
   */
  info: (message: string, options?: ToastOptions) => toastInfo(message, options),

  /**
   * Display a warning toast notification.
   */
  warning: (message: string, options?: ToastOptions) => toastWarning(message, options),

  /**
   * Display a generic toast notification.
   */
  show: (message: string, options?: ToastOptions) => toastGeneric(message, options),
};

export default toast;
export type { ToastOptions };
