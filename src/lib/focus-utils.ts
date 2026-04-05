/**
 * Focus utility functions
 *
 * Provides helper functions and styles for managing focus states
 * in a way that matches the portfolio design system
 */

import { cn } from './utils';

/**
 * Returns class names for accessible focus styles
 *
 * @param additionalClasses - Optional additional classes to merge with focus styles
 * @returns Merged class names string
 */
export function getFocusClasses(additionalClasses?: string): string {
  return cn(
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    additionalClasses
  );
}

/**
 * Returns class names for interactive elements with hover and focus states
 *
 * @param additionalClasses - Optional additional classes to merge
 * @returns Merged class names string
 */
export function getInteractiveClasses(additionalClasses?: string): string {
  return cn(
    'transition-all duration-200',
    'hover:shadow-md hover:-translate-y-0.5',
    getFocusClasses(),
    additionalClasses
  );
}