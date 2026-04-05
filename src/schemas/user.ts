/**
 * User Zod Schemas
 *
 * This file defines Zod schemas for user-related data validation.
 * These schemas are used to validate user data from forms and API requests.
 */

import { SubscriptionTier } from '@/schemas/subscriptions';
import { z } from 'zod';

export const GENDER_OPTIONS = ['male', 'female', 'non-binary'] as const;

/** Keep the restrictions permissive so we can update the profile even if we
 * include single fields in API call.
 *
 * Make new extended schemas for specific form validation.
 */
export const userInfoSchema = z.object({
  userId: z.string().min(1, 'User ID').optional(),
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  gender: z.enum(GENDER_OPTIONS).optional(),
  phoneNumber: z.string().optional(),
  lastUpdated: z.date().optional(),
  accountCreated: z.date().optional(),
  subscriptionTier: z.nativeEnum(SubscriptionTier).optional(),
  termsAccepted: z.boolean().optional(),
});

export const onboardingFormSchema = userInfoSchema.extend({
  termsAccepted: z.boolean().refine(
    (val) => val === true,
    { message: "You must accept the terms and conditions to continue." }
  ),
}).omit({
  subscriptionTier: true,
  accountCreated: true,
  gender: true,
  userId: true,
});

export const profileUpdateSchema = userInfoSchema.omit({
  userId: true,
  accountCreated: true,
  lastUpdated: true,
  subscriptionTier: true,
  termsAccepted: true,
});

export type UserInfoType = z.infer<typeof userInfoSchema>;
export type OnboardingFormType = z.infer<typeof onboardingFormSchema>;
export type ProfileUpdateType = z.infer<typeof profileUpdateSchema>;