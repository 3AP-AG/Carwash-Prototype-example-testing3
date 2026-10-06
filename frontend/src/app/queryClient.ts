// The one TanStack QueryClient. A 401 means the session ended (expired or revoked passcode):
// send the whole page to the gate, which is served by Spring outside this bundle.
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/api/client';

function onError(error: unknown) {
  if (error instanceof ApiError && error.status === 401) {
    window.location.assign('/gate');
  }
}

export function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({ onError }),
    mutationCache: new MutationCache({ onError }),
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => !(error instanceof ApiError) && failureCount < 2,
        staleTime: 30_000,
      },
    },
  });
}

export const queryClient = createQueryClient();
