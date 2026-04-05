/** Usage limits query calls. */

import { usageApiUrl } from "@/lib/api-urls";
import { getCurrentUserToken } from "@/lib/firebase-init";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { UsageResponseType } from '@/schemas/subscriptions';

/**
 * Queries user usage limits from the API.
 * @returns The usage limits data including daily outfits and wardrobe uploads.
 * @throws {Error} Problem with getting usage data.
*/
async function getUserUsage(): Promise<UsageResponseType | null> {
  const token: string = await getCurrentUserToken();

  const response = await fetch(usageApiUrl, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error("Error fetching usage data:", response);
    throw new Error("Error fetching usage data");
  }

  const data: UsageResponseType = await response.json();
  console.log("Usage data:", data);

  return data;
}

/**
 * Hook for querying user usage limits.
 *
 * This method has caching capabilities and refetches every 5 minutes.
 * @param enabled Whether the query should be enabled or not.
 * @returns Query result containing usage data, loading state, and error.
 */
export function useUsageQuery(enabled: boolean = true): UseQueryResult<UsageResponseType | null> {
  return useQuery({
    queryKey: [usageApiUrl],
    enabled,
    queryFn: getUserUsage,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}