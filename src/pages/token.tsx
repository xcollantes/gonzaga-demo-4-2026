/**
 * View and manage API token.
 */

import DashboardLayout from "@/components/DashboardLayout";
import { FirebaseTokenDisplay } from "@/components/FirebaseTokenDisplay";

export default function TokenPage() {
  return (
    <>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">API Token</h1>
          </div>

          <div className="max-w-3xl">
            <FirebaseTokenDisplay />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

