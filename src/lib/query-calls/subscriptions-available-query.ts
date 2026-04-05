/** Available plans query calls. */

import { availablePlansApiUrl } from '@/lib/api-urls';
import { getCurrentUserToken } from "@/lib/firebase-init";
import { AvailablePlansType } from "@/schemas/subscriptions";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

/**
 * Queries available plans from the API.
 * @returns The available plans data.
 */
async function getAvailablePlans(): Promise<AvailablePlansType | null> {
  const token = await getCurrentUserToken();

  const response = await fetch(availablePlansApiUrl, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error("Error looking for available plans:", response);
    return null;
  }

  const data = await response.json();
  console.log("Available plans:", data);

  return data.result.available;
}

/**
 * Hook for querying available plans.
 *
 * @param enabled Whether the query should be enabled or not.
 * @returns Query result containing available plans, loading state, and error.
 */
export function useAvailablePlansQuery(enabled: boolean = true): UseQueryResult<AvailablePlansType | null> {
  return useQuery({
    queryKey: [availablePlansApiUrl],
    enabled,
    queryFn: getAvailablePlans,
  });
}