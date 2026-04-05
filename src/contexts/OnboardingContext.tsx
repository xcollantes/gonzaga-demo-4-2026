import { useAuth } from "@/contexts/AuthContext";
import { profileApiUrl } from "@/lib/api-urls";
import { getCurrentUserToken } from "@/lib/firebase-init";
import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";

type OnboardingContextType = {
  isInOnboarding: boolean;
  isCheckingOnboarding: boolean;
  setIsInOnboarding: (isInOnboarding: boolean) => void;
  refreshOnboardingStatus: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

/** Require user to complete onboarding before accessing other pages.
 *
 * This hook checks if the user is in onboarding and prevents them from
 * accessing other pages until it's complete.
 *
 * When user is finished onboarding, the Firestore profile is created.
*/
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isInOnboarding, setIsInOnboarding] = useState<boolean>(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState<boolean>(true);
  const { currentUser } = useAuth();

  const checkOnboarding = useCallback(async () => {
    if (!currentUser) {
      setIsInOnboarding(false);
      setIsCheckingOnboarding(false);
      return;
    }

    console.info('Checking onboarding status');
    setIsCheckingOnboarding(true);

    try {
      const token: string = await getCurrentUserToken();
      const response = await fetch(profileApiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.log('Profile not found, user is in onboarding');
        setIsInOnboarding(true);
        return;

      }

      const data = await response.json();
      if (!data.result.profile || Object.keys(data.result.profile).length <= 0) {

        console.log('CHEKCING RPROEI:', data);

        console.log("Profile found but empty, user is in onboarding");
        setIsInOnboarding(true);
        return;
      }

      console.log('Profile found with content, user is not in onboarding');
      setIsInOnboarding(false);
    } catch (error) {
      console.error('Error checking onboarding:', error);
      setIsInOnboarding(true);
    } finally {
      setIsCheckingOnboarding(false);
    }
  }, [currentUser]);

  // Function to manually refresh the onboarding status
  const refreshOnboardingStatus = async () => {
    await checkOnboarding();
  };

  useEffect(() => {
    checkOnboarding();
  }, [checkOnboarding]);

  return (
    <OnboardingContext.Provider value={{
      isInOnboarding,
      isCheckingOnboarding,
      setIsInOnboarding,
      refreshOnboardingStatus
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}