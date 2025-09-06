"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider, HydrationBoundary, DehydratedState } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { SessionRefresher } from "./session-refresher";

interface ProvidersProps {
  children: React.ReactNode;
  dehydratedState?: DehydratedState;
}

export function Providers({ children, dehydratedState }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: 5 minutes
        staleTime: 1000 * 60 * 5,
        // Cache time: 10 minutes
        gcTime: 1000 * 60 * 10,
        // Enhanced retry logic with exponential backoff
        retry: (failureCount, error: Error & { status?: number }) => {
          console.log(`🔄 Query retry attempt ${failureCount} for error:`, error.message);
          
          // Don&apos;t retry for certain error types
          if (error.status === 404 || error.status === 403) {
            console.log(`❌ Not retrying ${error.status} error`);
            return false;
          }
          
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => {
          const delay = Math.min(1000 * 2 ** attemptIndex, 30000); // Exponential backoff, max 30s
          console.log(`⏳ Retry delay: ${delay}ms (attempt ${attemptIndex + 1})`);
          return delay;
        },
        // Enhanced refetch behavior
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
        // Network mode - continue trying even when offline
        networkMode: "always",
        // Throw errors to error boundaries
        throwOnError: true,
      },
      mutations: {
        // Retry mutations with exponential backoff
        retry: (failureCount, error: Error & { status?: number }) => {
          console.log(`🔄 Mutation retry attempt ${failureCount} for error:`, error.message);
          
          // Don&apos;t retry client errors
          if (error.status && error.status >= 400 && error.status < 500) {
            return false;
          }
          
          return failureCount < 2; // Retry mutations up to 2 times
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      },
    },
  }));

  return (
    <SessionProvider>
      <SessionRefresher />
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
          {children}
        </HydrationBoundary>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
