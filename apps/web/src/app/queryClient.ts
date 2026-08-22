import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents aggressive refetching on click/focus
      retry: (failureCount, error: any) => {
        // Do not retry 400, 401, 403, 404, or specific validation errors
        if (error?.status && [400, 401, 403, 404, 409].includes(error.status)) {
          return false;
        }
        return failureCount < 2; // Retry transient network/server failures up to 2 times
      },
      staleTime: 5 * 60 * 1000, // cache stale time 5m
    },
    mutations: {
      retry: false, // Never auto-retry mutations (especially checkout/cart edits)
    }
  },
});
