/**
 * Toast Notification Utilities
 *
 * This file provides utility functions for displaying toast notifications.
 * It includes functions for different types of notifications:
 * - Success messages (green)
 * - Error messages (red)
 * - Warning messages (yellow)
 * - Info messages (blue)
 * - Generic messages (customizable)
 *
 * These functions are used by the ToastContext to display notifications.
 */

import { toast, ExternalToast } from 'sonner';

// Success toast.
export const toastSuccess = (message: string, options?: ExternalToast) => {
  toast.success(message, options);
};

// Error toast.
export const toastError = (message: string, options?: ExternalToast) => {
  toast.error(message, options);
};

// Info toast.
export const toastInfo = (message: string, options?: ExternalToast) => {
  toast.info(message, options);
};

// Warning toast.
export const toastWarning = (message: string, options?: ExternalToast) => {
  toast.warning(message, options);
};

// Generic toast.
export const toastGeneric = (message: string, options?: ExternalToast) => {
  toast(message, options);
};