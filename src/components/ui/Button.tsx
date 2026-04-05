import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import LoadingSpinner from '@/components/LoadingSpinner'
import { useMobile } from '@/contexts/MobileContext'
import { cn } from '@/lib/utils'

const buttonBaseClass = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'

// Background color hover effects that should always apply
const buttonColorHoverEffects = {
  default: 'hover:bg-[var(--color-primary)]/90',
  destructive: 'hover:bg-[var(--color-destructive)]/90',
  outline: 'hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]',
  secondary: 'hover:bg-[var(--color-secondary)]/90',
  ghost: 'hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]',
  link: 'hover:text-[var(--color-primary)]/80 hover:underline',
}

// Transform and shadow hover effects that can be disabled
const buttonTransformHoverEffects = {
  default: 'hover:shadow-lg hover:-translate-y-0.5',
  destructive: 'hover:shadow-lg hover:-translate-y-0.5',
  outline: 'hover:shadow-md hover:-translate-y-0.5',
  secondary: 'hover:shadow-lg hover:-translate-y-0.5',
  ghost: 'hover:-translate-y-0.5',
  link: '',
}

const buttonVariants = cva(
  buttonBaseClass,
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-md',
        destructive:
          'bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)] shadow-md',
        outline:
          'border border-[var(--color-input)] bg-[var(--color-background)]',
        secondary:
          'bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] shadow-md',
        ghost: '',
        link: 'text-[var(--color-primary)] underline-offset-4',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  fullWidthOnMobile?: boolean
  loading?: boolean
  disableHover?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      asChild = false,
      fullWidthOnMobile = false,
      loading = false,
      disableHover = false,
      children,
      disabled,
      ...props },
    ref) => {
    const Comp = asChild ? Slot : 'button'
    const { isMobile } = useMobile();

    // Always apply color hover effects
    const colorHoverClasses = variant ? buttonColorHoverEffects[variant] : ''

    // Only apply transform/shadow effects if disableHover is false
    const transformHoverClasses = !disableHover && variant ? buttonTransformHoverEffects[variant] : ''

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          colorHoverClasses,
          transformHoverClasses,
          isMobile && fullWidthOnMobile ? 'w-full' : '',
          loading && 'relative'
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner
              size="sm"
              fullPage={false}
              className="!static"
            />
          </span>
        )}
        <span className={cn("inline-flex items-center", loading ? 'invisible' : '')}>
          {children}
        </span>
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
