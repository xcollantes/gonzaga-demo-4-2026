import React from 'react';
import { Toaster } from 'sonner';

interface ToastContainerProps {
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  duration?: number;
  closeButton?: boolean;
  theme?: 'light' | 'dark' | 'system';
  richColors?: boolean;
  expand?: boolean;
  visibleToasts?: number;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
  duration = 3000,
  closeButton = true,
  theme = 'light',
  richColors = true,
  expand = false,
  visibleToasts = 3,
}) => {
  return (
    <Toaster
      position={position}
      duration={duration}
      closeButton={closeButton}
      theme={theme}
      richColors={richColors}
      expand={expand}
      visibleToasts={visibleToasts}
    />
  );
};

export default ToastContainer;