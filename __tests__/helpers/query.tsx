import { notifyManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configure, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';

// TanStack notifies in a `setTimeout(0)`, which `act` does not wait for: `result.current` would be one
// render behind right after it, with a warning about an update outside `act`.
notifyManager.setScheduler(queueMicrotask);

// The first run has no transform cache, and on a slow machine the 1 s of `waitFor` is not enough.
configure({ asyncUtilTimeout: 20000 });

/**
 * A fresh cache per test, and a wrapper so `renderHook` can run the hooks.
 *
 * `retry: false`: a failed request has to fail now, not after the app's retry.
 * `gcTime: Infinity`: otherwise each finished query and mutation keeps a 5 minute timer open, and Jest
 * waits for it before it exits (measured: 304 s instead of 4 s).
 * `notifyOnChangeProps: 'all'`: a hook normally renders again only for a field that has been read. A test
 * that reads `isError` first never sees `data` arrive, although a screen, which reads both, would.
 */
export function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity, notifyOnChangeProps: 'all' },
      mutations: { gcTime: Infinity },
    },
  });

  function wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return { queryClient, wrapper };
}

/** Waits until the hook in `result` has data, and returns it. */
export function dataOf<T>(result: { current: { data: T | undefined } }): Promise<T> {
  return waitFor(() => {
    const { data } = result.current;
    if (data === undefined) throw new Error('The query has no data yet');
    return data;
  });
}

/** Holds a request or a write until the test calls `open`, to look at a state that normally flies by. */
export function createGate() {
  let open = () => {};
  const opened = new Promise<void>((resolve) => {
    open = resolve;
  });
  return { opened, open };
}
