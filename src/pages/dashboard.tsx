/**
 * Dashboard Page Component. Home page for authenticated content.
 *
 * This is the main dashboard page that users see after authentication.
 * It displays:
 * - Overview of key metrics and information
 * - Summary of user activity
 * - Quick access to important features
 * - Data visualizations and statistics
 *
 * The page is wrapped with the DashboardLayout for consistent navigation.
 */

import DashboardLayout from '@/components/DashboardLayout';
import { Logo } from '@/components/icons';
import LoadingSpinner from '@/components/LoadingSpinner';
import OnboardingWizard from '@/components/OnboardingWizard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MetricCard } from '@/components/ui/MetricCard';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { profileApiUrl } from '@/lib/api-urls';
import { useProfileQuery } from '@/lib/query-calls/profile-query';
import { toastError, toastSuccess } from '@/lib/toast';
import toast from '@/lib/useToastAnywhere';
import { SubscriptionTier } from '@/schemas/subscriptions';
import { OnboardingFormType, UserInfoType } from '@/schemas/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// Check if onboarding flow is enabled in environment.
const isOnboardingEnabled: boolean = process.env.NEXT_PUBLIC_ENABLE_ONBOARDING_FLOW === 'true';

export default function Dashboard() {
  const { currentUser, initUserTasks } = useAuth();
  const router = useRouter();
  const { isInOnboarding, refreshOnboardingStatus } = useOnboarding();
  const queryClient = useQueryClient();
  const [showDemoSpinner, setShowDemoSpinner] = useState<boolean>(false);

  // Query to get the user's profile data, but not for onboarding checks
  const { data: profile, isLoading: profileLoading } = useProfileQuery(!!currentUser && !isInOnboarding);

  console.log('onboarding', isInOnboarding);

  // Mutation to create user profile.
  // This is used for the onboarding flow.
  const { mutate: createProfile, isPending: isCreatingProfile } = useMutation({
    mutationFn: async (onboardingData: OnboardingFormType) => {
      if (!currentUser) {
        throw new Error('You must be logged in to create a profile.');
      }

      console.log('onboardingData', onboardingData);

      // Transform the data to match the API's expected format.

      // As you add OAuth2 providers, you'll need to add the provider's data
      // to the transformed data.
      // This is because different OAuth2 providers provide different data.
      const transformedData: UserInfoType = {
        userId: currentUser.uid || '',
        email: currentUser.email || '',
        firstName: onboardingData.firstName,
        lastName: onboardingData.lastName,
        phoneNumber: onboardingData.phoneNumber,
        lastUpdated: new Date(),
        termsAccepted: onboardingData.termsAccepted,
      };

      console.log("Transformed data for onboarding flow:", transformedData);

      // Initialize user in backend now that onboarding is complete.
      await initUserTasks(transformedData);
      console.log("User initialized in backend after onboarding");

      // Return the transformed data so it can be accessed in onSuccess.
      return transformedData;

    },
    onSuccess: async (data) => {
      console.log("Profile created in backend:", data);
      toastSuccess("Profile created");

      queryClient.invalidateQueries({ queryKey: [profileApiUrl] });

      // Refresh onboarding status after profile creation
      await refreshOnboardingStatus();

      // Redirect to home after successful profile creation
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Profile creation error:", error);
      toastError("Failed to create profile. Please try again.");
    },
  });

  // Immediately redirect if not authenticated
  useEffect(() => {
    if (!currentUser) {
      router.push("/account?mode=login");
    }
  }, [currentUser, router]);

  useEffect(() => {
    // If onboarding is NOT enabled and the user is in onboarding
    // (when account just created)
    if (isInOnboarding && !isOnboardingEnabled) {
      if (!currentUser) {
        throw new Error('You must be logged in to initialize a profile.');
      }

      // Initialize user with minimal data.
      // Transform the data to match the API's expected format.

      // As you add OAuth2 providers, you'll need to add the provider's data
      // to the transformed data.
      // This is because different OAuth2 providers provide different data.
      const transformedData: UserInfoType = {
        userId: currentUser.uid || '',
        email: currentUser.email || '',
        firstName: currentUser.displayName?.split(' ')[0] || '',
        lastName: currentUser.displayName?.split(' ').slice(1).join(' ') || '',
        phoneNumber: currentUser.phoneNumber || '',
        lastUpdated: new Date(),
        termsAccepted: true,  // Must make user aware another way other than form.
        subscriptionTier: SubscriptionTier.FREE,  // Default to free tier.
      };

      console.log("Transformed data for onboarding flow:", transformedData);

      // Initialize user in backend now that onboarding is complete.
      initUserTasks(transformedData);
      console.log("User initialized in backend (onboarding disabled)");

      // Refresh onboarding status after profile creation.
      refreshOnboardingStatus();

    }
  }, [isInOnboarding, refreshOnboardingStatus, currentUser, initUserTasks]);

  const handleOnboardingComplete = (data: OnboardingFormType) => {
    console.log('Onboarding complete:', data);
    createProfile(data);
  };

  const handleShowDemoSpinner = () => {
    setShowDemoSpinner(true);
    setTimeout(() => {
      setShowDemoSpinner(false);
    }, 600);
  };

  const handleShowDemoSpinnerUntilClick = () => {
    setShowDemoSpinner(true);

    // Create a one-time click event listener to hide the spinner
    const handleDocumentClick = () => {
      setShowDemoSpinner(false);
      document.removeEventListener('click', handleDocumentClick);
    };

    // Add the click listener after a small delay to prevent immediate triggering
    setTimeout(() => {
      document.addEventListener('click', handleDocumentClick);
    }, 100);
  };

  // Early return with loading state if not authenticated
  if (!currentUser) {
    return <LoadingSpinner />;
  }

  // Show loader during initialization or while profile is being created
  if (profileLoading || isCreatingProfile) {
    return <LoadingSpinner />;
  }

  return (
    <ProtectedRoute>
      <SEOHead
        title="Quantplex.AI"
        description="Access your Quantplex AI dashboard to manage your custom LLM solutions and business integrations."
        ogType="website"
        noIndex={true} // Protected content should not be indexed
      />

      {showDemoSpinner && <LoadingSpinner />}
      {isInOnboarding && isOnboardingEnabled ? (
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          isCreatingProfile={isCreatingProfile}
          existingProfile={profile || undefined} />
      ) : (
        <DashboardLayout>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-4 flex justify-center">
              <Logo className="hidden md:block pb-15" width={800} height={40} />
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="py-4">
                {profileLoading || isCreatingProfile ? (
                  <LoadingSpinner />
                ) : profile ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Metrics Cards Row */}
                    <MetricCard
                      title="Daily Users"
                      value="1,824"
                      change={{ value: "+12%", isPositive: true }}
                      progress={{ value: 0.75 }}
                    />

                    <MetricCard
                      title="Conversions"
                      value="42%"
                      change={{ value: "+5%", isPositive: true }}
                      progress={{ value: 0.4 }}
                    />

                    <MetricCard
                      title="Revenue"
                      value="$9,271"
                      change={{ value: "-3%", isPositive: false }}
                      progress={{ value: 0.8 }}
                    />

                    {/* Toast Testing Card */}
                    <Card className="p-6 md:col-span-3">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Toast Notifications Demo</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <Button
                          onClick={() => toast.success("Success toast message!")}
                          className="w-full"
                        >
                          Success Toast
                        </Button>
                        <Button
                          onClick={() => toast.error("Uh-oh error toast message!")}
                          variant="destructive"
                          className="w-full"
                        >
                          Error Toast
                        </Button>
                        <Button
                          onClick={() => toast.info("Information toast message!")}
                          variant="outline"
                          className="w-full"
                        >
                          Info Toast
                        </Button>
                        <Button
                          onClick={() => toast.warning("Warning toast message!")}
                          className="w-full"
                        >
                          Warning Toast
                        </Button>
                        <Button
                          onClick={() => toast.show("Generic toast message!")}
                          className="w-full"
                          variant="outline"
                        >
                          Generic Toast
                        </Button>
                        <Button
                          onClick={() => toast.show("Toast with action", {
                            action: {
                              label: "Undo",
                              onClick: () => console.log("Undo clicked")
                            }
                          })}
                          className="w-full"
                        >
                          Toast with Action
                        </Button>
                        <Button
                          onClick={() => toast.info("Toast with long duration", {
                            duration: 10000
                          })}
                          className="w-full"
                        >
                          Long Duration (10s)
                        </Button>
                        <Button
                          onClick={() => toast.show("Toast with description", {
                            description: "This is a more detailed description for the toast notification."
                          })}
                          variant="outline"
                          className="w-full"
                        >
                          With Description
                        </Button>
                      </div>
                    </Card>

                    <Card className="p-6 md:col-span-3">
                      <h3 className="font-bold text-lg mb-4">Loading Spinner Demo</h3>
                      <div className="flex flex-row gap-2">
                        <Button
                          onClick={handleShowDemoSpinner}
                          variant="secondary"
                        >
                          Show Loading (Fast)
                        </Button>
                        <Button
                          onClick={handleShowDemoSpinnerUntilClick}
                          variant="secondary"
                        >
                          Show Loading (Click to exit)
                        </Button>
                      </div>
                    </Card>

                    {/* Recent Updates Card */}
                    <Card className="p-6 md:col-span-3">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Recent Updates</h3>
                        <button className="px-3 py-1 bg-accent text-accent-foreground rounded-lg text-sm">View All</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { title: "New Feature Released", time: "2 hours ago", description: "Version 2.5 is now available with improved performance and new UI elements." },
                          { title: "System Maintenance", time: "1 day ago", description: "Scheduled maintenance completed successfully with zero downtime." },
                          { title: "Security Update", time: "3 days ago", description: "Important security patches have been applied to all systems." }
                        ].map((update, index) => (
                          <div key={index} className="border border-border p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{update.title}</h4>
                              <span className="text-xs text-muted-foreground">{update.time}</span>
                            </div>
                            <p className="mt-2 text-sm text-card-foreground">{update.description}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-muted-foreground mt-4">No client information found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DashboardLayout>
      )}
    </ProtectedRoute>
  );
}