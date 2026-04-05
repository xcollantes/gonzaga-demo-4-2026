/**
 * Login Form Component
 *
 * This component provides the user authentication form for existing users.
 * Features include:
 * - Email and password login form
 * - Form validation
 * - Error handling for authentication failures
 * - Redirect to dashboard after successful login
 */

import LoadingSpinner from '@/components/LoadingSpinner';
import { GoogleColoredIcon } from '@/components/icons/oauth-icons';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { formatFirebaseError } from '@/lib/firebase-errors';
import { toastError, toastSuccess } from '@/lib/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState<boolean>(false);
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(null);
  const router = useRouter();
  const { loginWithEmailPassword, resetPassword, createWithGoogle } = useAuth();

  const loginSchema = z.object({
    email: z.string()
      .min(1, { message: "Email is required." })
      .email({ message: "Please enter a valid email address." })
      .transform(email => email.toLowerCase().trim())
      .refine(email => !email.includes(" "), { message: "Email cannot contain spaces." })
      .refine(email => email.length <= 254, { message: "Email is too long." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  });

  const resetPasswordSchema = z.object({
    email: z.string()
      .min(1, { message: "Email is required." })
      .email({ message: "Please enter a valid email address." })
      .transform(email => email.toLowerCase().trim())
      .refine(email => !email.includes(" "), { message: "Email cannot contain spaces." })
      .refine(email => email.length <= 254, { message: "Email is too long." }),
  });

  type LoginFormValues = z.infer<typeof loginSchema>;
  type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleResetPasswordDialogChange = (open: boolean) => {
    setResetPasswordDialogOpen(open);
    if (!open) {
      setResetPasswordError(null);
      resetPasswordForm.reset();
    }
  };

  const handleResetPassword = async (data: { email: string }) => {
    try {
      console.log('Resetting password for email:', data.email);
      await resetPassword(data.email);
    } catch (error) {
      if (error instanceof Error) {
        toastError(error.message || "Failed to send reset password email. Please try again.");
      } else {
        toastError("An unexpected error occurred.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await createWithGoogle();
      router.push('/dashboard');
    } catch (err) {
      toastError(err as string);
      console.error(err as string);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        {loginError && (
          <div className="mb-4 p-3 bg-destructive/15 text-destructive rounded-md text-sm">
            {loginError}
          </div>
        )}
        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(async (data) => {
              try {
                setLoginError(null);
                await loginWithEmailPassword(data.email, data.password);
                toastSuccess("Login successful");
                router.push('/dashboard');
              } catch (error) {
                if (error instanceof Error) {
                  toastError(formatFirebaseError(error) || "Failed to login. Please check your credentials.");
                  setLoginError(formatFirebaseError(error) || "Failed to login. Please check your credentials.");
                } else {
                  setLoginError("An unexpected error occurred.");
                }
              }
            })}
            className="space-y-4"
          >
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-foreground'>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-foreground'>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full action-btn"
              disabled={isLoading}
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex items-center justify-between w-full">
          <Dialog open={resetPasswordDialogOpen} onOpenChange={handleResetPasswordDialogChange}>
            <DialogTrigger asChild>
              <Button variant="link" className="px-0">Forgot password?</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset password</DialogTitle>
                <DialogDescription>
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </DialogDescription>
              </DialogHeader>
              {resetPasswordError && (
                <div className="mb-4 p-3 bg-destructive/15 text-destructive rounded-md text-sm">
                  {resetPasswordError}
                </div>
              )}
              <Form {...resetPasswordForm}>
                <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-4">
                  <FormField
                    control={resetPasswordForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send reset link
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Link href="/account?mode=signup">
            <Button variant="link" className="px-0">Need an account?</Button>
          </Link>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <GoogleColoredIcon />
          )}
          Sign in with Google
        </Button>
      </CardFooter>
    </Card>
  );
}