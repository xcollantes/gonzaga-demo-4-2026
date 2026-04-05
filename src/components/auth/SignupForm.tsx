/**
 * Signup Form Component
 *
 * This component provides the registration form for new users.
 * Features include:
 * - Email and password registration form
 * - Form validation for password requirements
 * - Error handling for registration failures
 * - Redirect to dashboard after successful signup
 */

import LoadingSpinner from '@/components/LoadingSpinner';
import { GoogleColoredIcon } from '@/components/icons/oauth-icons';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
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

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const router = useRouter();
  const { signupWithEmailPassword, createWithGoogle } = useAuth();

  const registerSchema = z.object({
    email: z.string()
      .min(1, { message: "Email is required." })
      .email({ message: "Please enter a valid email address." })
      .transform(email => email.toLowerCase().trim())
      .refine(email => !email.includes(" "), { message: "Email cannot contain spaces." })
      .refine(email => email.length <= 254, { message: "Email is too long." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string().min(6, { message: "Confirm password is required." }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

  type RegisterFormValues = z.infer<typeof registerSchema>;

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleGoogleSignup = async () => {
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
        <CardTitle>Create account</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        {registerError && (
          <div className="mb-4 p-3 bg-destructive/15 text-destructive rounded-md text-sm">
            {registerError}
          </div>
        )}
        <Form {...registerForm}>
          <form
            onSubmit={registerForm.handleSubmit(async (data) => {
              try {
                setRegisterError(null);
                setIsLoading(true);
                await signupWithEmailPassword(data.email, data.password);
                toastSuccess('Account created successfully');
                router.push('/dashboard');
              } catch (error) {
                if (error instanceof Error) {
                  setRegisterError(formatFirebaseError(error) || "Failed to register. Please try again.");
                } else {
                  setRegisterError("An unexpected error occurred.");
                }
              } finally {
                setIsLoading(false);
              }
            })}
            className="space-y-4"
          >
            <FormField
              control={registerForm.control}
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
            <FormField
              control={registerForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex items-center justify-center">
          <Link href="/account?mode=login">
            <Button variant="link">Already have an account? Login</Button>
          </Link>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignup}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <GoogleColoredIcon />
          )}
          Sign up with Google
        </Button>
      </CardFooter>
    </Card>
  );
}