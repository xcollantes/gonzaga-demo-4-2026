/**
 * Payment Page Component.
 *
 * This page allows users to:
 * - View current subscription status
 * - Subscribe to plans
 * - Manage existing subscriptions
 * - Access billing portal
 */

import DashboardLayout from '@/components/DashboardLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProtectedRoute from '@/components/ProtectedRoute';
import SubscriptionPlanCards from '@/components/subscription/SubscriptionPlanCards';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import {
  useCreateBillingPortalSession,
  useCreateCheckoutSession
} from '@/lib/query-calls/payment-query';
import { useProfileQuery } from '@/lib/query-calls/profile-query';
import { useAvailablePlansQuery } from '@/lib/query-calls/subscriptions-available-query';
import { toastError, toastSuccess } from '@/lib/toast';
import {
  AvailablePlansType,
  StripePlan,
  SubscriptionTier
} from '@/schemas/subscriptions';
import { ExternalLink } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Payment() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<StripePlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // User profile.
  const { data: userProfile, isLoading: isLoadingUserProfile } = useProfileQuery(!!currentUser);

  // Get available plans.
  const { data: availablePlans, isLoading: isLoadingPlans } = useAvailablePlansQuery(!!currentUser);

  // Create checkout session mutation.
  const { mutate: createCheckoutSession } = useCreateCheckoutSession();

  // Create billing portal session mutation.
  const { mutate: createBillingPortalSession } = useCreateBillingPortalSession();

  const currentPlan = userProfile?.subscriptionTier || SubscriptionTier.FREE;
  console.log("User profile:", userProfile);
  console.log("Current plan:", currentPlan);

  // Convert Stripe plans to a more usable format.
  const convertStripePlansToPlanType = (stripePlans: AvailablePlansType): StripePlan[] => {
    if (!stripePlans) return [];

    const plans = Object.values(stripePlans)
      .map(plan => {
        if (!plan || typeof plan !== 'object') return null;

        const stripePlan = plan as StripePlan;

        const monthlyPrice = stripePlan.prices.find(p => p.interval === 'month') || stripePlan.prices[0];
        const priceAmount = monthlyPrice?.unitAmount ? monthlyPrice.unitAmount : 0;

        // Use taglines if available, otherwise extract feature information from metadata.
        let features: string[] = [];

        if (stripePlan.taglines && Array.isArray(stripePlan.taglines)) {
          features = stripePlan.taglines;
        } else {
          if (stripePlan.adsEnabled === false) features.push('No ads');
        }

        return {
          planId: stripePlan.planId,
          displayName: stripePlan.displayName,
          description: stripePlan.description || '',
          price: priceAmount,
          interval: monthlyPrice?.interval as 'month' | 'year' || 'month',
          features: features.length > 0 ? features : [],
          priceId: monthlyPrice?.priceId || '',
          subscriptionTier: stripePlan.subscriptionTier ||
            stripePlan.planId === 'FREE' ? SubscriptionTier.FREE :
            stripePlan.planId === 'PREMIUM' ? SubscriptionTier.PREMIUM : undefined
        };
      })
      .filter(Boolean) as StripePlan[];

    // Sort plans so that free plans appear first.
    return plans.sort((a, b) => {
      if (a.price === 0 && b.price !== 0) return -1;
      if (a.price !== 0 && b.price === 0) return 1;
      return 0;
    });
  };

  // Get plans from API.
  const allPlans = availablePlans ? convertStripePlansToPlanType(availablePlans) : [];

  console.debug("All plans:", allPlans);

  // Handle checkout.
  const handleCheckout = async (priceId: string) => {
    if (!currentUser) {
      toastError('You need to be logged in to subscribe.');
      return;
    }

    setIsLoading(true);

    try {
      createCheckoutSession(
        {
          priceId: priceId,
          successUrl: `${window.location.origin}/subscription?success=true`,
          cancelUrl: `${window.location.origin}/subscription?cancelled=true`,
        },
        {
          onSuccess: (data) => {
            // Redirect to Stripe checkout.
            window.location.href = data.result.url;
          },
          onError: (error) => {
            console.error('Error creating checkout session:', error);
            toastError('Error creating checkout session.');
            setIsLoading(false);
          },
        }
      );
    } catch (error) {
      console.error('Error in checkout:', error);
      toastError('Error processing checkout.');
      setIsLoading(false);
    }
  };

  // Handle billing portal.
  const handleBillingPortal = async () => {
    if (!currentUser) {
      toastError('You need to be logged in to access billing portal.');
      return;
    }

    setIsLoading(true);

    try {
      createBillingPortalSession(
        {
          returnUrl: `${window.location.origin}/subscription`,
        },
        {
          onSuccess: (data) => {
            // Redirect to Stripe billing portal.
            console.log("Billing portal URL:", data.result.url);

            window.location.href = data.result.url;
          },
          onError: (error) => {
            console.error('Error creating billing portal session:', error);
            toastError('Error accessing billing portal.');
            setIsLoading(false);
          },
        }
      );
    } catch (error) {
      console.error('Error accessing billing portal:', error);
      toastError('Error accessing billing portal.');
      setIsLoading(false);
    }
  };

  // Check URL params for success/cancelled.
  useEffect(() => {
    if (router.query.success === 'true') {
      toastSuccess('Payment successful! Your subscription is now active.');
    } else if (router.query.cancelled === 'true') {
      toastError('Payment cancelled.');
    }
  }, [router.query]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold">Subscription</h1>

            {/* Payment Methods Card. */}
            <div className="mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium">Payment Methods</h3>
                <p className="mt-2 text-sm">
                  Manage your payment methods or update your billing information.
                </p>
                <div className="mt-4">
                  <Button
                    onClick={handleBillingPortal}
                    loading={isLoading}
                    disabled={currentPlan === SubscriptionTier.FREE || isLoadingUserProfile}
                  >
                    Manage Payment in Stripe
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                {currentPlan === SubscriptionTier.FREE && <div className="mt-4">
                  <p className="text-sm">
                    No active subscription found.
                  </p>
                </div>}
              </Card>
            </div>

            {isLoadingPlans ? (
              <div className="mt-6">
                <LoadingSpinner />
              </div>
            ) : (
              <SubscriptionPlanCards
                plans={allPlans}
                currentPlanId={currentPlan}
                selectedPlan={selectedPlan}
                isLoading={isLoading}
                onSelectPlan={(plan) => {
                  setSelectedPlan(plan);
                  handleCheckout(plan.priceId || '');
                }}
              />
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}