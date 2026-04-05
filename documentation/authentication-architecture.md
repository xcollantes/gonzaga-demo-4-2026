# Authentication Architecture

## Authentication Flow Overview

The application uses Firebase Authentication with a context-based architecture for state management. The authentication system integrates seamlessly with an onboarding flow for new users.

## Core Components

### AuthContext

Central authentication state management with comprehensive functionality:

```typescript
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  loginWithEmailPassword: (email: string, password: string) => Promise<void>;
  signupWithEmailPassword: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initUserTasks: (profile: OnboardingFormType) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  createWithGoogle: () => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
}
```

### Authentication Provider Implementation

```typescript
export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Authentication methods implementation
  const loginWithEmailPassword = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toastSuccess('Login successful');
    } catch (error: any) {
      toastError(formatFirebaseError(error));
      throw error;
    }
  };
}
```

## Onboarding Integration

### OnboardingContext Architecture

The onboarding system checks user profile completion and enforces mandatory onboarding:

```typescript
interface OnboardingContextType {
  isInOnboarding: boolean;
  isCheckingOnboarding: boolean;
  setIsInOnboarding: (value: boolean) => void;
  refreshOnboardingStatus: () => Promise<void>;
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isInOnboarding, setIsInOnboarding] = useState<boolean>(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState<boolean>(true);
  const { currentUser } = useAuth();

  const checkOnboarding = async () => {
    if (!currentUser) {
      setIsInOnboarding(false);
      setIsCheckingOnboarding(false);
      return;
    }

    try {
      const token = await getCurrentUserToken();
      const response = await fetch(profileApiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setIsInOnboarding(true);
        return;
      }

      const data = await response.json();
      const hasProfile = data.result.profile && Object.keys(data.result.profile).length > 0;
      setIsInOnboarding(!hasProfile);
    } catch (error) {
      console.error('Error checking onboarding:', error);
      setIsInOnboarding(true);
    } finally {
      setIsCheckingOnboarding(false);
    }
  };
}
```

### Onboarding Flow Logic

```typescript
// Dashboard component integrates onboarding check
export default function Dashboard() {
  const { currentUser } = useAuth();
  const { isInOnboarding, isCheckingOnboarding } = useOnboarding();

  if (isCheckingOnboarding) {
    return <LoadingSpinner />;
  }

  if (isInOnboarding) {
    return (
      <OnboardingWizard
        onComplete={handleOnboardingComplete}
        existingProfile={profile}
      />
    );
  }

  return <DashboardContent />;
}
```

## Route Protection

### ProtectedRoute Component

Wraps authenticated pages with automatic redirection:

```typescript
interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/account');
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return <>{children}</>;
}
```

## Firebase Integration

### Configuration Management

Centralized Firebase configuration with environment variable validation:

```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Singleton initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
```

### Token Management

Secure token retrieval for API authentication:

```typescript
const getCurrentUserToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is currently signed in.");
  }
  return await getIdToken(user);
};

// Integration with React Query
const queryFn = async ({ queryKey }) => {
  const token = await getCurrentUserToken();

  const res = await fetch(queryKey[0] as string, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`${res.status}: ${await res.text()}`);
  }

  return await res.json();
};
```

## Error Handling

### Firebase Error Translation

User-friendly error message formatting:

```typescript
export const formatFirebaseError = (error: FirebaseError): string => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
};
```

## Authentication Patterns

### Form Validation Integration

Authentication forms use schema-based validation:

```typescript
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginFormType = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const handleSubmit = async (data: LoginFormType) => {
    try {
      await loginWithEmailPassword(data.email, data.password);
      router.push('/dashboard');
    } catch (error) {
      // Error handling is managed in AuthContext
    }
  };
};
```

### Social Authentication

Google OAuth integration pattern:

```typescript
const createWithGoogle = async () => {
  try {
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: "select_account",
    });

    await signInWithPopup(auth, googleProvider);
    toastSuccess('Successfully signed in with Google');
  } catch (error: any) {
    toastError(formatFirebaseError(error));
    throw error;
  }
};
```

## Password Management

### Password Reset Flow

```typescript
const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    toastSuccess('Password reset email sent. Check your inbox.');
  } catch (error: any) {
    toastError(formatFirebaseError(error));
    throw error;
  }
};
```

### Password Update with Reauthentication

```typescript
const updateUserPassword = async (currentPassword: string, newPassword: string) => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error('No user is currently signed in.');
    }

    // Reauthenticate user before password change
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);
    toastSuccess('Password updated successfully');
  } catch (error: any) {
    toastError(formatFirebaseError(error));
    throw error;
  }
};
```

This authentication architecture provides secure, user-friendly authentication with comprehensive error handling and seamless integration with the application's onboarding flow.