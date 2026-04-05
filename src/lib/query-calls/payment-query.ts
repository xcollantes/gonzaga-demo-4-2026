/**
 * Payment query functions.
 */

import {
  stripeBillingPortalApiUrl,
  stripeCheckoutApiUrl,
} from '@/lib/api-urls';
import { getCurrentUserToken } from '@/lib/firebase-init';
import { useMutation } from '@tanstack/react-query';

/**
 * Create a Stripe checkout session.
 */
export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: async ({
      priceId,
      successUrl,
      cancelUrl,
    }: {
      priceId: string;
      successUrl: string;
      cancelUrl: string;
    }) => {
      const token: string = await getCurrentUserToken();
      const response = await fetch(stripeCheckoutApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          priceId: priceId,
          successUrl: successUrl,
          cancelUrl: cancelUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create checkout session: ${response.statusText}`);
      }

      return response.json();
    },
  });
};

/**
 * Create a Stripe billing portal session.
 */
export const useCreateBillingPortalSession = () => {
  return useMutation({
    mutationFn: async ({ returnUrl }: { returnUrl: string }) => {
      const token: string = await getCurrentUserToken();
      const response = await fetch(stripeBillingPortalApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          returnUrl: returnUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create billing portal session: ${response.statusText}`);
      }

      return response.json();
    },
  });
};