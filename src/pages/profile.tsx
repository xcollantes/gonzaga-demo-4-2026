/**
 * User Profile Page Component
 *
 * This page allows users to view and edit their profile information.
 * Features include:
 * - Display of current user information
 * - Form for updating personal details
 * - Password change functionality
 * - Profile preferences and settings
 *
 * The page is wrapped with the DashboardLayout for consistent navigation.
 */

import DashboardLayout from '@/components/DashboardLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileQuery, useUpdateProfileMutation } from '@/lib/query-calls/profile-query';
import { toastError, toastSuccess } from '@/lib/toast';
import { GENDER_OPTIONS, profileUpdateSchema, ProfileUpdateType } from '@/schemas/user';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function Profile() {
  const { currentUser } = useAuth();
  const [error, setError] = React.useState<string>('');

  const { data: profileData, isLoading: loading } = useProfileQuery(!!currentUser);

  const { mutate: updateProfile, isPending: profileUpdating } = useUpdateProfileMutation();

  /** Fields from existing profile. */
  const form = useForm<ProfileUpdateType>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      email: profileData?.email || '',
      firstName: profileData?.firstName || '',
      gender: profileData?.gender || null,
      lastName: profileData?.lastName || '',
      phoneNumber: profileData?.phoneNumber || '',
    },
  });

  /** Update form with profile data when it loads. */
  useEffect(() => {
    if (profileData) {
      form.reset({
        ...profileData,
      });
    }
  }, [profileData, form, currentUser]);

  const handleSubmit = async (data: ProfileUpdateType) => {
    console.log('Submitting profile data:', data);

    if (!currentUser) return;

    setError('');

    /** Data to push to user profile in Firestore. */
    updateProfile(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
      },
      {
        onSuccess: () => {
          toastSuccess('Profile updated!');
        },
        onError: (error) => {
          console.error('Error updating profile:', error);
          toastError('Failed to update profile.');
        }
      }
    );
  };

  /** Format phone number to (XXX) XXX - XXXX. */
  const formatPhoneNumber = (value: string): string => {
    // Strip all non-numeric characters
    const numbers = value.replace(/\D/g, '');

    // Format based on the length of the input
    if (numbers.length === 0) {
      return '';
    } else if (numbers.length <= 3) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)} - ${numbers.slice(6, 10)}`;
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="py-4">
              {loading ? (
                <LoadingSpinner />
              ) : (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About me</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {error && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                          <span className="block sm:inline">{error}</span>
                        </div>
                      )}

                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-foreground">First name</FormLabel>
                                    <FormControl>
                                      <Input {...field} className="text-foreground" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-foreground">Last name</FormLabel>
                                    <FormControl>
                                      <Input {...field} className="text-foreground" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="phoneNumber"
                              render={({ field: { onChange, ...restField } }) => (
                                <FormItem>
                                  <FormLabel className="text-foreground">Phone number</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...restField}
                                      onChange={(e) => {
                                        const formatted = formatPhoneNumber(e.target.value);
                                        e.target.value = formatted;
                                        onChange(e);
                                      }}
                                      placeholder="(555) 867 - 5309"
                                      maxLength={17}
                                      className="text-foreground"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-foreground">Email address</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled className="text-foreground" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="gender"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-foreground">Gender</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                                    <FormControl>
                                      <SelectTrigger className="text-foreground">
                                        <SelectValue placeholder="Select gender" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="text-foreground">
                                      {GENDER_OPTIONS.map((gender) => (
                                        <SelectItem key={gender} value={gender} className="text-foreground">
                                          {gender}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <Button
                            type="submit"
                            disabled={profileUpdating}
                            loading={profileUpdating}
                            className="action-btn"
                            fullWidthOnMobile
                          >
                            {profileUpdating ? "Saving..." : "Save"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}