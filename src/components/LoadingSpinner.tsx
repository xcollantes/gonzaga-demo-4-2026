import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

export default function LoadingSpinner({
  className,
  size = 'md',
  fullPage = true,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 border-4',
    md: 'w-12 h-12 border-[6px]',
    lg: 'w-16 h-16 border-8',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center',
        fullPage && 'fixed inset-0 bg-background/80 backdrop-blur-lg dark:bg-background/60 dark:backdrop-blur-md z-50',
        className
      )}
    >
      <div
        className={cn(
          'rounded-full animate-spin border-solid',
          'border-primary border-t-transparent',
          sizeClasses[size]
        )}
        style={{ animationDuration: '0.8s' }}
      />
    </div>
  );
}