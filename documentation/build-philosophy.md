# Build Philosophy and Architecture

## Core Architectural Principles

### Context-Driven State Management

The application leverages React Context for cross-cutting concerns rather than external state management libraries. This approach reduces complexity while maintaining clear data flow.

```typescript
// Authentication state management
const AuthContext = createContext<AuthContextType | null>(null);

// Onboarding flow management
const OnboardingContext = createContext<OnboardingContextType | null>(null);

// Toast notifications
const ToastContext = createContext<ToastContextType | null>(null);
```

**Benefits:**
- No external dependencies for state management
- Type-safe context consumption
- Clear separation of concerns
- Simplified testing and debugging

### Server-State vs Client-State Separation

The architecture distinguishes between server state and client state using React Query for server state management:

```typescript
// Server state: User profile from API
const { data: profile } = useProfileQuery();

// Client state: UI interactions, form state
const [isModalOpen, setIsModalOpen] = useState(false);
```

**Server State (React Query):**
- API data fetching and caching
- Background synchronization
- Optimistic updates
- Error handling and retries

**Client State (React Context/useState):**
- Authentication status
- UI state (modals, loading states)
- Form interactions
- User preferences

## Component Architecture

### Composition Over Inheritance

Components are built using composition patterns with clear interfaces:

```typescript
// Base component with flexible composition
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noBorder?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, noBorder, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-lg border bg-card text-card-foreground shadow-sm",
        noBorder && "border-0", className)}
      {...props}
    />
  )
);

// Compound component pattern
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
```

### Single Responsibility Components

Each component has a focused responsibility:

```typescript
// Authentication wrapper
<ProtectedRoute>
  <DashboardLayout>
    <DashboardContent />
  </DashboardLayout>
</ProtectedRoute>

// Onboarding flow
<OnboardingWizard
  onComplete={handleOnboardingComplete}
  existingProfile={profile}
/>
```

## Data Flow Architecture

### Unidirectional Data Flow

Data flows consistently from parent to child components with clear callback patterns:

```typescript
// Parent component manages state
const [onboardingData, setOnboardingData] = useState<OnboardingFormType>();

// Child receives data and callbacks
<OnboardingWizard
  initialData={onboardingData}
  onUpdate={setOnboardingData}
  onComplete={handleComplete}
/>
```

### API Integration Pattern

Centralized API communication through React Query hooks:

```typescript
// Centralized API request function
export async function apiRequest<T>(
  method: string,
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...options.headers
  };

  const res = await fetch(url, {
    ...options,
    method,
    headers
  });

  if (!res.ok) {
    throw new Error(`${res.status}: ${await res.text()}`);
  }

  return res.json();
}

// Query hooks for specific endpoints
export const useProfileQuery = () => {
  return useQuery({
    queryKey: [profileApiUrl],
    queryFn: () => apiRequest<ProfileResponse>('GET', profileApiUrl)
  });
};
```

## Error Handling Strategy

### Layered Error Handling

Errors are handled at multiple levels with appropriate fallbacks:

```typescript
// API level: Formatted error messages
const formatFirebaseError = (error: FirebaseError): string => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    default:
      return error.message;
  }
};

// Component level: User feedback
try {
  await loginWithEmailPassword(email, password);
  toast.success('Login successful');
} catch (error) {
  toast.error(formatFirebaseError(error));
}

// Query level: Automatic retries and caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
      refetchOnWindowFocus: false
    }
  }
});
```

## Form Management Philosophy

### Schema-First Form Validation

Forms use Zod schemas for type-safe validation:

```typescript
// Schema definition
const onboardingFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val, "You must accept the terms")
});

// Type inference
type OnboardingFormType = z.infer<typeof onboardingFormSchema>;

// Form implementation
const form = useForm<OnboardingFormType>({
  resolver: zodResolver(onboardingFormSchema),
  defaultValues: {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    termsAccepted: false
  }
});
```

## Performance Optimization Strategy

### Code Splitting and Lazy Loading

Strategic component lazy loading for optimal bundle sizes:

```typescript
// Route-level code splitting
const Dashboard = lazy(() => import('@/pages/dashboard'));
const Profile = lazy(() => import('@/pages/profile'));

// Component-level splitting for heavy components
const OnboardingWizard = lazy(() => import('@/components/OnboardingWizard'));
```

### Memoization Patterns

Selective memoization for expensive operations:

```typescript
// Expensive computations
const expensiveCalculation = useMemo(() => {
  return computeHeavyOperation(data);
}, [data]);

// Callback stability
const handleSubmit = useCallback((formData: FormData) => {
  onSubmit(formData);
}, [onSubmit]);
```

## Security Architecture

### Authentication Token Management

Secure token handling with automatic refresh:

```typescript
// Centralized token retrieval
const getCurrentUserToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is currently signed in.");
  }
  return await getIdToken(user);
};

// Automatic token inclusion in API requests
const queryFn = async ({ queryKey }) => {
  const token = await getCurrentUserToken();

  const res = await fetch(queryKey[0] as string, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return res.json();
};
```

### Route Protection

Layered route protection with authentication checks:

```typescript
// High-order component for route protection
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return <Navigate to="/account" replace />;
  }

  return <>{children}</>;
}
```

## Development Experience Philosophy

### Type Safety First

Comprehensive TypeScript integration for development confidence:

```typescript
// Strict type definitions for API responses
interface ProfileResponse {
  result: {
    profile: {
      firstName: string;
      lastName: string;
      email: string;
      onboardingComplete: boolean;
    };
  };
}

// Type-safe context consumption
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### Developer Tooling Integration

Built-in development aids and debugging support:

```typescript
// Environment-aware logging
const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
  console.info('Authentication state:', { currentUser, loading });
}

// React Query development tools
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Development-friendly defaults
      retry: isDevelopment ? false : 3,
      refetchOnWindowFocus: !isDevelopment
    }
  }
});
```

This architecture prioritizes maintainability, type safety, and developer experience while ensuring scalable patterns for future growth.