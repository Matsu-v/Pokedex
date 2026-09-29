import { QueryClient } from '@tanstack/react-query';

/** The one QueryClient of the app. PokeAPI data hardly ever changes, so it stays fresh for a while. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});
