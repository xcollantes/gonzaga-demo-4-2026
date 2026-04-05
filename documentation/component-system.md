# Component System Architecture

## Design System Foundation

The application uses shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling. This provides a consistent, accessible, and customizable component library.

## Component Structure

### Base Component Pattern

All UI components follow a consistent pattern with forwardRef and className merging:

```typescript
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
```

### Variant Management with CVA

Components use Class Variance Authority (CVA) for type-safe variant management:

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

## Compound Component Patterns

### Card Component System

Cards implement a compound component pattern for flexibility:

```typescript
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, noBorder, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        noBorder && "border-0",
        className
      )}
      {...props}
    />
  )
);

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);

// Compound component exports
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
```

Usage pattern:

```tsx
<Card>
  <Card.Header>
    <CardTitle>Settings</CardTitle>
    <CardDescription>Manage your account settings</CardDescription>
  </Card.Header>
  <Card.Content>
    <SettingsForm />
  </Card.Content>
  <Card.Footer>
    <Button>Save Changes</Button>
  </Card.Footer>
</Card>
```

## Form Components Integration

### Form Field Pattern

Form components integrate with react-hook-form and Zod validation:

```typescript
interface FormFieldProps {
  control: Control<any>;
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  type?: string;
}

const FormField = ({ control, name, label, description, placeholder, type = "text" }: FormFieldProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-2">
          {label && (
            <Label htmlFor={field.name} className="text-sm font-medium">
              {label}
            </Label>
          )}
          <Input
            {...field}
            id={field.name}
            type={type}
            placeholder={placeholder}
            className={cn(error && "border-destructive")}
          />
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          {error && (
            <p className="text-sm text-destructive">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};
```

### Complete Form Implementation

```tsx
const OnboardingForm = () => {
  const form = useForm<OnboardingFormType>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      termsAccepted: false
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="firstName"
          label="First Name"
          placeholder="Enter your first name"
        />
        
        <FormField
          control={form.control}
          name="lastName"
          label="Last Name"
          placeholder="Enter your last name"
        />
        
        <FormField
          control={form.control}
          name="phoneNumber"
          label="Phone Number"
          type="tel"
          placeholder="(555) 123-4567"
        />
        
        <FormField
          control={form.control}
          name="termsAccepted"
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="terms">I accept the terms and conditions</Label>
            </div>
          )}
        />
        
        <Button type="submit" className="w-full">
          Complete Onboarding
        </Button>
      </form>
    </Form>
  );
};
```

## Layout Components

### Dashboard Layout Structure

The layout system provides consistent structure across authenticated pages:

```typescript
interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {(title || description) && (
          <div className="mb-8">
            {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
```

### Responsive Navigation

Navigation adapts to mobile and desktop viewports:

```typescript
const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Logo />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/dashboard">Dashboard</Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/profile">Profile</Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <UserMenu />
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              <MobileNavLink href="/dashboard">Dashboard</MobileNavLink>
              <MobileNavLink href="/profile">Profile</MobileNavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
```

## Custom Component Patterns

### Loading States

Consistent loading component implementation:

```typescript
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner = ({ size = "md", className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn(
        "animate-spin rounded-full border-2 border-primary border-t-transparent",
        sizeClasses[size]
      )} />
    </div>
  );
};

// Usage in components
const LoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
    <Skeleton className="h-4 w-[150px]" />
  </div>
);
```

### Toast Integration

Toast components integrate with the global toast system:

```typescript
// Toast trigger components
const ToastDemo = () => {
  const toast = useToast();
  
  return (
    <div className="space-x-2">
      <Button onClick={() => toast.success("Success message")}>
        Success Toast
      </Button>
      <Button 
        variant="destructive"
        onClick={() => toast.error("Error message")}
      >
        Error Toast
      </Button>
      <Button 
        variant="outline"
        onClick={() => toast.info("Information message")}
      >
        Info Toast
      </Button>
    </div>
  );
};
```

## Component Testing Patterns

### Component Testing Setup

Testing components with proper context and mock providers:

```typescript
// Test utilities
const renderWithProviders = (component: ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          {component}
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

// Component test example
describe('Button Component', () => {
  it('renders with correct variant classes', () => {
    renderWithProviders(<Button variant="destructive">Delete</Button>);
    
    const button = screen.getByRole('button', { name: /delete/i });
    expect(button).toHaveClass('bg-destructive');
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    renderWithProviders(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

This component system provides a scalable, maintainable foundation with consistent patterns, accessibility features, and comprehensive testing capabilities.