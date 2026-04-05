import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getCurrentUserToken } from "./firebase-init";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

/**
 * Throws an error if the response is not OK.
 * Extracts error message from response body or status text.
 * @param res - The fetch Response object to check
 * @throws Error with status code and error message
 */
export async function apiRequest<T>(
  method: string,
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // Default headers
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...options.headers as Record<string, string>,
  };

  // Only add Content-Type: application/json if we're not sending FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    ...options,
    method: method,
    credentials: 'include',
    headers: headers
  });

  await throwIfResNotOk(res);
  return res.json();
}

type UnauthorizedBehavior = 'returnNull' | 'throw';
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      console.log('Fetching data from query client', queryKey);
      const token = await getCurrentUserToken();

      const res = await fetch(queryKey[0] as string, {
        // Adding credentials: "include" will cause CORS issues.
        // credentials: "include",
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (unauthorizedBehavior === 'returnNull' && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: 'throw' }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});