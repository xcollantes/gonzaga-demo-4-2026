# Data Fetching and State Management

## React Query Architecture

The application uses React Query (TanStack Query) for server state management, providing caching, background updates, and optimistic updates for API interactions.

## Query Client Configuration

### Global Query Client Setup

```typescript
import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getCurrentUserToken } from "./firebase-init";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: 'throw' }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
```

### Authenticated Query Function

Centralized query function with automatic token injection:

```typescript
type UnauthorizedBehavior = 'returnNull' | 'throw';

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> = ({ on401: unauthorizedBehavior }) => 
  async ({ queryKey }) => {
    const token = await getCurrentUserToken();

    const res = await fetch(queryKey[0] as string, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (unauthorizedBehavior === 'returnNull' && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };
```

## API Request Abstraction

### Generic API Request Function

Type-safe API request handling with error management:

```typescript
export async function apiRequest<T>(
  method: string,
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...options.headers as Record<string, string>,
  };

  // Only add Content-Type for non-FormData requests
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    ...options,
    method: method,
    credentials: 'include',
    headers: headers
  });

  await throwIfResNotOk(res);
  return res.json();
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}
```

## Query Hook Patterns

### Profile Data Management

User profile data with caching and background updates:

```typescript
// API URL definitions
export const profileApiUrl = `${process.env.NEXT_PUBLIC_API_BACKEND_URL}profile`;

// Query hook implementation
export const useProfileQuery = () => {
  return useQuery({
    queryKey: [profileApiUrl],
    queryFn: () => apiRequest<ProfileResponse>('GET', profileApiUrl),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Type definitions
interface ProfileResponse {
  result: {
    profile: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber?: string;
      onboardingComplete: boolean;
    };
  };
}

// Usage in components
const ProfilePage = () => {
  const { data: profileData, isLoading, error } = useProfileQuery();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  const profile = profileData?.result.profile;

  return (
    <Card>
      <Card.Header>
        <CardTitle>Profile Information</CardTitle>
      </Card.Header>
      <Card.Content>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <p>{profile?.firstName} {profile?.lastName}</p>
          </div>
          <div>
            <Label>Email</Label>
            <p>{profile?.email}</p>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};
```

### Subscription Data Management

Complex subscription data with multiple related queries:

```typescript
// Subscription usage query
export const useUsageQuery = () => {
  return useQuery({
    queryKey: [subscriptionUsageApiUrl],
    queryFn: () => apiRequest<UsageResponse>('GET', subscriptionUsageApiUrl),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

// Available plans query
export const useAvailablePlansQuery = () => {
  return useQuery({
    queryKey: [subscriptionsAvailableApiUrl],
    queryFn: () => apiRequest<PlansResponse>('GET', subscriptionsAvailableApiUrl),
    staleTime: 60 * 60 * 1000, // 1 hour (plans change infrequently)
  });
};

// Purchase links query with conditional fetching
export const usePurchaseLinksQuery = (planId?: string) => {
  return useQuery({
    queryKey: [subscriptionsPurchaseLinksApiUrl, planId],
    queryFn: () => apiRequest<PurchaseLinksResponse>('GET', 
      `${subscriptionsPurchaseLinksApiUrl}?plan_id=${planId}`),
    enabled: !!planId, // Only fetch when planId is provided
  });
};
```

## Mutation Patterns

### Profile Creation Mutation

Profile creation with optimistic updates and error handling:

```typescript
export const useCreateProfileMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: OnboardingFormType) => {
      const token = await getCurrentUserToken();
      
      return apiRequest<ProfileResponse>('POST', profileApiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
    },
    onSuccess: (data) => {
      // Update the profile cache with new data
      queryClient.setQueryData([profileApiUrl], data);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['user-status'] });
      
      toast.success('Profile created successfully');
    },
    onError: (error) => {
      console.error('Profile creation failed:', error);
      toast.error('Failed to create profile. Please try again.');
    },
  });
};

// Usage in onboarding component
const OnboardingWizard = ({ onComplete }: OnboardingWizardProps) => {
  const createProfileMutation = useCreateProfileMutation();

  const handleSubmit = async (formData: OnboardingFormType) => {
    try {
      await createProfileMutation.mutateAsync(formData);
      onComplete();
    } catch (error) {
      // Error is handled in mutation onError
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <Button 
        type="submit" 
        disabled={createProfileMutation.isPending}
      >
        {createProfileMutation.isPending ? 'Creating...' : 'Complete'}
      </Button>
    </form>
  );
};
```

### Optimistic Updates Pattern

Immediate UI updates with rollback on failure:

```typescript
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      const token = await getCurrentUserToken();
      
      return apiRequest<ProfileResponse>('PATCH', profileApiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
    },
    onMutate: async (newProfile) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: [profileApiUrl] });

      // Snapshot previous value
      const previousProfile = queryClient.getQueryData([profileApiUrl]);

      // Optimistically update
      queryClient.setQueryData([profileApiUrl], (old: ProfileResponse) => ({
        ...old,
        result: {
          ...old.result,
          profile: {
            ...old.result.profile,
            ...newProfile,
          },
        },
      }));

      return { previousProfile };
    },
    onError: (err, newProfile, context) => {
      // Rollback on error
      queryClient.setQueryData([profileApiUrl], context.previousProfile);
      toast.error('Failed to update profile');
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: [profileApiUrl] });
    },
  });
};
```

## Error Handling Strategies

### Global Error Boundary

Application-level error handling for query failures:

```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class QueryErrorBoundary extends Component<
  PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Query error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <Card className="w-full max-w-md">
            <Card.Header>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>
                An unexpected error occurred. Please try refreshing the page.
              </CardDescription>
            </Card.Header>
            <Card.Content>
              <Button 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Refresh Page
              </Button>
            </Card.Content>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Query Error Handling

Per-query error handling with user feedback:

```typescript
const useQueryWithErrorHandling = <T>(
  queryKey: QueryKey,
  queryFn: QueryFunction<T>,
  options?: UseQueryOptions<T>
) => {
  return useQuery({
    queryKey,
    queryFn,
    onError: (error) => {
      console.error('Query error:', error);
      
      if (error.message.includes('401')) {
        // Handle unauthorized errors
        toast.error('Session expired. Please log in again.');
        // Redirect to login
      } else if (error.message.includes('403')) {
        // Handle forbidden errors
        toast.error('You do not have permission to access this resource.');
      } else {
        // Generic error handling
        toast.error('Failed to load data. Please try again.');
      }
    },
    ...options,
  });
};
```

## Caching Strategies

### Cache Management

Strategic cache invalidation and updates:

```typescript
// Invalidate related queries after mutations
const invalidateUserData = () => {
  queryClient.invalidateQueries({ queryKey: [profileApiUrl] });
  queryClient.invalidateQueries({ queryKey: [subscriptionUsageApiUrl] });
  queryClient.invalidateQueries({ queryKey: ['user-status'] });
};

// Prefetch commonly needed data
const prefetchDashboardData = async () => {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [profileApiUrl],
      queryFn: () => apiRequest('GET', profileApiUrl),
    }),
    queryClient.prefetchQuery({
      queryKey: [subscriptionsAvailableApiUrl],
      queryFn: () => apiRequest('GET', subscriptionsAvailableApiUrl),
    }),
  ]);
};

// Cache warming on authentication
useEffect(() => {
  if (currentUser) {
    prefetchDashboardData();
  }
}, [currentUser]);
```

This data fetching architecture provides efficient, type-safe API interactions with comprehensive error handling and optimal caching strategies.