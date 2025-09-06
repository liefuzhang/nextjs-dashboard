"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

interface ProvidersProps {
  children: React.ReactNode;
  dehydratedState?: unknown;
}

export function Providers({ children, dehydratedState }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: 5 minutes
        staleTime: 1000 * 60 * 5,
        // Cache time: 10 minutes
        gcTime: 1000 * 60 * 10,
        // Retry failed requests up to 3 times
        retry: 3,
        // Enhanced refetch behavior
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
        // Network mode - continue trying even when offline
        networkMode: "always",
      },
    },
  }));

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
          {children}
        </HydrationBoundary>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}