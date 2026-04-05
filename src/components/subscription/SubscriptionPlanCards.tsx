import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StripePlan, SubscriptionTier } from '@/schemas/subscriptions';

interface SubscriptionPlanCardsProps {
  plans: StripePlan[];
  currentPlanId: SubscriptionTier;
  selectedPlan: StripePlan | null;
  isLoading: boolean;
  onSelectPlan: (plan: StripePlan) => void;
}

export const GreenCheckIcon = () => {
  return (
    <svg className='h-5 w-5 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
      <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
    </svg>
  );
};

export default function SubscriptionPlanCards({
  plans,
  currentPlanId,
  selectedPlan,
  isLoading,
  onSelectPlan,
}: SubscriptionPlanCardsProps) {

  console.log("Current plan ID:", currentPlanId);
  console.log("Selected plan:", selectedPlan);
  console.log("Plans:", plans);

  return (
    <div className="mt-6 grid gap-8 grid-cols-2">
      {plans.map((plan: StripePlan) => (
        <Card key={plan.planId} className={`p-6 flex flex-col ${selectedPlan?.planId === plan.planId ? 'ring-2 ring-blue-500' : ''}`}>
          <h3 className='text-lg font-medium'>
            {plan.displayName}
          </h3>
          <p className='mt-2 text-sm'>
            {plan.description}
          </p>
          <p className='mt-4 flex items-baseline'>
            <span className='text-3xl font-extrabold'>${plan.price}</span>
            <span className='ml-1 text-sm font-medium'>/{plan.interval}</span>
          </p>
          <ul className='mt-6 space-y-2 flex-1'>
            {plan.features && plan.features.length > 0 ? (
              plan.features.map((feature: string, i: number) => (
                <li key={i} className='flex items-start'>
                  <div className='flex-shrink-0'>
                    <GreenCheckIcon />
                  </div>
                  <p className='ml-2 text-sm'>{feature}</p>
                </li>
              ))
            ) : <></>}
          </ul>
          <div className='mt-6 pt-6 border-t border-gray-200'>
            {plan.planId === currentPlanId ? (
              <Button
                disabled={true}
                className='w-full flex justify-center bg-gray-200 hover:bg-gray-300 text-gray-800'
              >
                Current Plan
              </Button>
            ) : (
              <Button
                onClick={() => onSelectPlan(plan)}
                loading={isLoading && selectedPlan?.planId === plan.planId}
                disabled={!plan.priceId}
                className='w-full flex justify-center'
              >
                {currentPlanId === SubscriptionTier.FREE ? 'Upgrade' :
                  (plan.subscriptionTier === SubscriptionTier.FREE ? 'Downgrade' : 'Switch Plan')}
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}