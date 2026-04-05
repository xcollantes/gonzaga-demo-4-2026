/**
 * Authentication Context
 *
 * This context provides authentication functionality throughout the application.
 * It manages:
 * - User authentication state
 * - Login functionality
 * - Signup functionality
 * - Logout functionality
 * - Loading state during authentication checks
 *
 * Wrap your application with AuthProvider to enable authentication features.
 * Use the useAuth() hook to access authentication functions and state.
 */

import { initUserApiUrl } from '@/lib/api-urls';
import { formatFirebaseError } from '@/lib/firebase-errors';
import { auth, getCurrentUserToken } from '@/lib/firebase-init';
import { toastError, toastSuccess } from '@/lib/toast';
import { UserInfoType } from '@/schemas/user';
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
} from 'firebase/auth';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  loginWithEmailPassword: (email: string, password: string) => Promise<void>;
  signupWithEmailPassword: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initUserTasks: (profile: UserInfoType) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  createWithGoogle: () => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Auth state change listener initialized');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User authenticated' : 'No user');
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signupWithEmailPassword(email: string, password: string): Promise<void> {
    console.log('New signup with email:', email);

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential: UserCredential) => userCredential.user);

  }

  async function loginWithEmailPassword(email: string, password: string): Promise<void> {
    console.log('Login with email:', email);

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: UserCredential) => {
        setCurrentUser(userCredential.user);
        return userCredential.user;
      });

  }

  async function logout(): Promise<void> {
    return signOut(auth);
  }

  async function initUserTasks(profile: UserInfoType): Promise<void> {
    console.log('Account creation tasks...')

    console.log('profile', profile);

    try {
      if (!profile) {
        throw new Error('No user is currently signed in.');
      }

      const token: string = await getCurrentUserToken();

      const response = await fetch(initUserApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)

      });

      if (!response.ok) {
        const errorData = await response.json();

        console.error('errorData', errorData);
        throw new Error(errorData || 'Failed to initialize user in backend');

      }

      const responseData = await response.json();

      console.log('User initialized in backend:', responseData);

      return responseData;

    } catch (error) {
      console.error('Failed to initialize user in backend:', error);
      throw error;

    }
  }

  async function resetPassword(email: string): Promise<void> {
    try {
      setLoading(true);

      await sendPasswordResetEmail(auth, email);

      toastSuccess('Password reset email sent');
    } catch (err) {
      const error = err as Error;

      toastError(formatFirebaseError(error) || 'Failed to send reset password email. Please try again.');

      throw error;

    } finally {
      setLoading(false);

    }
  };

  async function updateUserPassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      setLoading(true);

      // Get current user.
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        throw new Error("No user is currently signed in.");
      }

      // Re-authenticate the user before changing password.
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );

      await reauthenticateWithCredential(currentUser, credential);

      await updatePassword(currentUser, newPassword);

      toastSuccess('Password updated');

    } catch (err) {
      const error = err as Error;
      toastError(formatFirebaseError(error) || error.message);
      throw error;

    } finally {
      setLoading(false);
    }
  };

  const googleProvider = new GoogleAuthProvider();

  /**
   * Create new user with Google.
   *
   * Run this when user clicks "Sign in with Google" or "Sign up with Google"
   * button.
   *
   * If user already exists, we will log them in and redirect to the home page.
   * If user does not exist, we will create a new user and redirect to the home page.
   */
  async function createWithGoogle(): Promise<void> {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      setCurrentUser(result.user);

      toastSuccess('Welcome!');

    } catch (err) {
      const error = err as Error;
      toastError(formatFirebaseError(error) || 'Google login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      createWithGoogle,
      currentUser,
      initUserTasks,
      loading,
      loginWithEmailPassword,
      logout,
      resetPassword,
      signupWithEmailPassword,
      updateUserPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}