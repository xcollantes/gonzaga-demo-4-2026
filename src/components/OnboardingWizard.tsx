import { OnboardingCard, OnboardingLayout, OnboardingProgress } from '@/components/OnboardingCard';
import { BasicInfoStep } from '@/components/onboarding-steps/basic-info-step';
import { TermsStep } from '@/components/onboarding-steps/terms-step';
import { Button } from '@/components/ui/Button';
import { Form } from '@/components/ui/Form';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { onboardingFormSchema, OnboardingFormType, UserInfoType } from '@/schemas/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';


interface OnboardingWizardProps {
  onComplete: (data: OnboardingFormType) => void;
  isCreatingProfile?: boolean;
  existingProfile?: UserInfoType;
}

/**
 * Onboarding wizard component.
 * @param onComplete - Callback function to handle onboarding completion.
 * @param isCreatingProfile - Whether the profile is being created.
 * @param existingProfile - Existing profile data.
 * @returns Onboarding wizard component.
 */
export default function OnboardingWizard({ onComplete, isCreatingProfile = false, existingProfile }: OnboardingWizardProps) {
  const { currentUser } = useAuth();
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  // Total number of steps
  const totalSteps: number = 2;

  // Initialize onboarding form using Firestore profile data if it exists.
  const onboardingForm = useForm<OnboardingFormType>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      email: currentUser?.email || '',
      firstName: existingProfile?.firstName || '',
      lastName: existingProfile?.lastName || '',
      phoneNumber: existingProfile?.phoneNumber || '',
      termsAccepted: existingProfile?.termsAccepted || false,
    },
  });

  const handleNextStep = () => {
    // Validate the current step before proceeding.
    // NOTE: UPDATE-ONBOARDING-STEPS: Change order in handleNextStep to match the order of the steps.
    if (onboardingStep === 1) {
      onboardingForm.trigger(['firstName', 'lastName']).then((isValid) => {
        if (isValid) setOnboardingStep(prev => prev + 1);
      });
    } else if (onboardingStep === 2) {

      try {
        onboardingForm.trigger(['termsAccepted']).then((isValid) => {
          if (isValid) {
            onboardingForm.handleSubmit((data) => {
              console.info('Completing onboarding with converted data:', data);
              onComplete(data);
            })();
          }
        });
      } catch (error) {
        console.error('Error validating terms:', error);
      }
    }
  };

  const handlePrevStep = () => {
    setOnboardingStep(prev => Math.max(prev - 1, 1));
  };

  // Render the current step component based on onboardingStep.
  // NOTE: UPDATE-ONBOARDING-STEPS: Change order in renderCurrentStep to match the order of the steps.
  const renderCurrentStep = () => {
    switch (onboardingStep) {
      case 1:
        return <BasicInfoStep form={onboardingForm} />;
      case 2:
        return <TermsStep form={onboardingForm} />;
      default:
        return <TermsStep form={onboardingForm} />;
    }
  };

  const handleHelpClick = () => {
    console.info('Help button clicked');
    setShowHelp(prev => !prev);
  };

  return (
    <OnboardingLayout>
      <OnboardingCard>
        <div className='mb-6'>
          <div className='flex items-center justify-between gap-2 mb-2'>
            <h1 className='text-3xl font-bold'>Let&apos;s get to know you</h1>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='outline' size='sm' onClick={handleHelpClick} className='h-8 w-8 p-0'>
                  <HelpCircle className='h-5 w-5 text-muted-foreground' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className='text-sm'>Why?</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showHelp ? 'max-h-[200px] opacity-100 my-4' : 'max-h-0 opacity-0 my-0'}`}>
            <div className='p-4 rounded-md border'>
              <p className='text-sm'>Have peace of mind that we are extremely strict on industry security standards. <i>You can delete your account and all your data at any time.</i></p>
            </div>
          </div>

          <OnboardingProgress currentStep={onboardingStep} totalSteps={totalSteps} />
        </div>

        <Form {...onboardingForm}>
          <form className='space-y-4'>
            {renderCurrentStep()}
          </form>
        </Form>

        <div className='flex justify-between mt-8'>
          {onboardingStep > 1 ? (
            <Button
              variant='default'
              onClick={handlePrevStep}
              disabled={isCreatingProfile}
              className="px-6"
            >
              <ChevronLeft className='mr-2 h-4 w-4' /> Previous
            </Button>
          ) : (
            <div></div>
          )}

          <Button
            variant='default'
            onClick={handleNextStep}
            disabled={isCreatingProfile}
            className="px-6"
          >
            {onboardingStep < totalSteps ? (
              <>Next <ChevronRight className='ml-2 h-4 w-4' /></>
            ) : (
              isCreatingProfile ? 'Creating profile...' : 'Complete'
            )}
          </Button>
        </div>
      </OnboardingCard>
    </OnboardingLayout>
  );
}