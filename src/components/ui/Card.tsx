import * as React from 'react';

import { cn } from '@/lib/utils';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  hoverEffect?: 'grow' | 'lift' | 'none';
  noBorder?: boolean;
  fadeIn?: boolean;
  hoverTransitionDuration?: string;
}

const Card = React.forwardRef<
  HTMLDivElement,
  CardProps
>(({
  className,
  hoverEffect = false,
  noBorder = false,
  fadeIn = true,
  hoverTransitionDuration = '0.5s',
  ...props
}, ref) => {
  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );

  return (
    <div
      ref={setRefs}
      className={cn(
        "bg-[var(--color-card)] text-[var(--color-card-foreground)] shadow-md",
        !noBorder && "border border-[var(--color-card-border)]",
        "rounded-[var(--color-card-border-radius)]",
        hoverEffect && "hover:shadow-xl hover:-translate-y-1 animate-hover",
        fadeIn && "fade-in",
        className
      )}
      style={{
        borderWidth: !noBorder ? 'var(--color-card-border-width)' : 0,
        transitionProperty: 'opacity, transform, box-shadow',
        transitionDuration: hoverTransitionDuration,
        transitionTimingFunction: 'ease-out'
      } as React.CSSProperties}
      {...props}
    />
  )
})
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };

