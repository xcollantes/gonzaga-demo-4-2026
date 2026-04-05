import { Checkbox } from "@/components/ui/Checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form";
import { OnboardingFormType } from "@/schemas/user";
import { UseFormReturn } from "react-hook-form";

const PRIVACY_POLICY_URL = process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL;
const TERMS_OF_SERVICE_URL = process.env.NEXT_PUBLIC_TERMS_OF_SERVICE_URL;

export function TermsStep({ form }: { form: UseFormReturn<OnboardingFormType> }) {
  const { control } = form;

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-muted-foreground">Please review and accept our terms to continue.</p>
      </div>

      <div className="p-6 rounded-lg border mb-6">
        <h3 className="text-lg font-medium mb-2">Terms Summary</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>We collect personal information to provide and improve our services.</li>
          <li>Your data is secure and we do not sell your personal information.</li>
          <li>You can delete your account and all associated data at any time.</li>
          <li>For complete details, please read our full Terms and Privacy Policy.</li>
        </ul>
      </div>

      <FormField
        control={control}
        name="termsAccepted"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="font-normal">
                I agree to the <a href={TERMS_OF_SERVICE_URL} className="text-primary underline" target="_blank">Terms and Conditions</a> and <a href={PRIVACY_POLICY_URL} className="text-primary underline" target="_blank">Privacy Policy</a>.
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}