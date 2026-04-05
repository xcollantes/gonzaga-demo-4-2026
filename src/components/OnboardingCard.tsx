import { cn } from '@/lib/utils';

export function OnboardingProgress({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="w-full">
      <div className='flex justify-between items-center mt-6'>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-2 rounded-full flex-1 mx-1 transition-all duration-300',
              index + 1 <= currentStep ? 'bg-primary' : 'bg-muted'
            )}
          />
        ))}
      </div>
      <p className='text-sm text-center mt-2 text-muted-foreground'>Step {currentStep} of {totalSteps}</p>
    </div>
  );
}

export function OnboardingCard({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn(
      'bg-card text-card-foreground rounded-lg shadow-2xl p-8 relative z-10',
      className
    )}>
      {children}
    </div>
  );
}

export function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-background">
      <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
        {children}
      </div>
    </div>
  );
}
