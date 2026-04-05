/** Uniform interface for all query calls. */

import { profileApiUrl } from "@/lib/api-urls";
import { getCurrentUserToken } from "@/lib/firebase-init";
import { UserInfoType } from "@/schemas/user";
import { useMutation, UseMutationResult, useQuery, UseQueryResult } from "@tanstack/react-query";

/**
 * Queries user profile data from the API.
 * @returns The profile data and subscription plan.
 */
async function getProfileData(): Promise<UserInfoType | null> {
  console.log('API PROFILE:', profileApiUrl);

  const token: string = await getCurrentUserToken();

  const response = await fetch(profileApiUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error('Error fetching profile data:', response);
    return null;
  }

  const data = await response.json();
  console.log('Profile data:', data.result.profile);

  return data.result.profile;
}

/**
 * Hook for querying user profile data.
 *
 * This method has caching capabilities.
 * @param enabled Whether the query should be enabled or not.
 * @returns Query result containing profile data, loading state, and error.
 */
export function useProfileQuery(enabled: boolean = true): UseQueryResult<UserInfoType | null> {
  return useQuery({
    queryKey: [profileApiUrl],
    enabled,
    queryFn: getProfileData,
  });
}

/**
 * Updates user profile data in the API.
 * @param profileData The updated profile data.
 * @returns The updated profile data or null if the update failed.
 */
async function updateProfileData(profileData: Partial<UserInfoType>): Promise<UserInfoType | null> {
  console.log('Updating profile data:', profileData);

  const token: string = await getCurrentUserToken();

  const response = await fetch(profileApiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    console.error('Error updating profile data:', response);
    return null;
  }

  const data = await response.json();
  return data.result;
}

/**
 * Hook for updating user profile data.
 *
 * @returns Mutation result for updating profile data.
 */
export function useUpdateProfileMutation(): UseMutationResult<UserInfoType | null, Error, Partial<UserInfoType>> {
  return useMutation({
    mutationFn: updateProfileData,
  });
}
