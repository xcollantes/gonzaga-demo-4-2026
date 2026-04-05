/** Toast component using Sonner. */

import { Toaster } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';

interface ToastProps {
  autoHideDuration?: number;
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  variant?: 'filled' | 'outlined' | 'standard';
}

type SonnerPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export const Toast = ({
  autoHideDuration = 5000,
  anchorOrigin = { vertical: 'bottom', horizontal: 'right' },
  variant = 'filled',
}: ToastProps) => {
  // Get the current theme
  const { resolvedTheme } = useTheme();

  // Map MUI-style position to Sonner position
  const mapPositionToSonner = (): SonnerPosition => {
    const { vertical, horizontal } = anchorOrigin;
    return `${vertical}-${horizontal}` as SonnerPosition;
  };

  return (
    <Toaster
      position={mapPositionToSonner()}
      richColors={variant === 'filled'}
      closeButton={true}
      theme={(resolvedTheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark'}
      duration={autoHideDuration}
    />
  );
};