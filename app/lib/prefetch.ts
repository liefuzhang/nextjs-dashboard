"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { queryKeys } from "./queries";
import { 
  getRevenue, 
  getLatestInvoices, 
  getCardData, 
  getCustomers,
  getFilteredInvoices,
  getInvoicesPages
} from "./query-actions";

/**
 * Custom hook for prefetching data based on anticipated user navigation patterns
 */
export function usePrefetchAnticipatedRoutes(currentPath: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const prefetchData = async () => {
      console.log(`📈 Smart prefetch triggered for path: ${currentPath}`);
      
      // Prefetch dashboard data when on any page (since users often return to dashboard)
      if (currentPath !== "/dashboard") {
        console.log("  └─ Prefetching dashboard return data (cardData, latestInvoices)");
        queryClient.prefetchQuery({
          queryKey: queryKeys.cardData,
          queryFn: getCardData,
          staleTime: 1000 * 60 * 5, // 5 minutes
        });
        
        queryClient.prefetchQuery({
          queryKey: queryKeys.latestInvoices,
          queryFn: getLatestInvoices,
          staleTime: 1000 * 60, // 1 minute for fresh data
        });
      }

      // Route-specific prefetching based on user journey patterns
      switch (currentPath) {
        case "/dashboard":
          console.log("  └─ Prefetching likely next routes (customers, invoices)");
          
          // Check cache status before prefetching
          const customersCache = queryClient.getQueryState(queryKeys.customers);
          console.log("    Customers cache:", customersCache ? `${customersCache.status} (${customersCache.fetchStatus})` : "not in cache");
          
          const invoicesCache = queryClient.getQueryState(queryKeys.invoices("", 1));
          console.log("    Invoices cache:", invoicesCache ? `${invoicesCache.status} (${invoicesCache.fetchStatus})` : "not in cache");
          
          // From dashboard, users likely go to invoices or customers
          queryClient.prefetchQuery({
            queryKey: queryKeys.customers,
            queryFn: getCustomers,
            staleTime: 1000 * 60 * 5,
          }).then(() => {
            console.log("    ✅ Customers prefetch completed");
          });

          // Prefetch first page of invoices with empty query
          queryClient.prefetchQuery({
            queryKey: queryKeys.invoices("", 1),
            queryFn: () => getFilteredInvoices("", 1),
            staleTime: 1000 * 60 * 2,
          }).then(() => {
            console.log("    ✅ Invoices prefetch completed");
          });
          break;

        case "/dashboard/invoices":
          // From invoices, users might go to customers or create invoices
          queryClient.prefetchQuery({
            queryKey: queryKeys.customers,
            queryFn: getCustomers,
            staleTime: 1000 * 60 * 5,
          });

          // Prefetch dashboard data in case they go back
          queryClient.prefetchQuery({
            queryKey: queryKeys.revenue,
            queryFn: getRevenue,
            staleTime: 1000 * 60 * 5,
          });
          break;

        case "/dashboard/customers":
          // From customers, users might go to invoices or dashboard
          queryClient.prefetchQuery({
            queryKey: queryKeys.invoices("", 1),
            queryFn: () => getFilteredInvoices("", 1),
            staleTime: 1000 * 60 * 2,
          });

          queryClient.prefetchQuery({
            queryKey: queryKeys.revenue,
            queryFn: getRevenue,
            staleTime: 1000 * 60 * 5,
          });
          break;

        case "/dashboard/invoices/create":
          // When creating invoices, users need customer data
          queryClient.prefetchQuery({
            queryKey: queryKeys.customers,
            queryFn: getCustomers,
            staleTime: 1000 * 60 * 5,
          });
          break;

        case "/admin":
          // Admin users likely need overview of all data
          queryClient.prefetchQuery({
            queryKey: queryKeys.cardData,
            queryFn: getCardData,
            staleTime: 1000 * 60 * 5,
          });

          queryClient.prefetchQuery({
            queryKey: queryKeys.customers,
            queryFn: getCustomers,
            staleTime: 1000 * 60 * 5,
          });
          break;
      }
    };

    // Delay prefetching to avoid interfering with current page load
    const timeoutId = setTimeout(prefetchData, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [currentPath, queryClient]);
}

/**
 * Hook for prefetching data on hover (for navigation links)
 */
export function usePrefetchOnHover() {
  const queryClient = useQueryClient();

  const prefetchForRoute = (route: string) => {
    console.log(`🚀 Prefetching data for route: ${route}`);
    
    switch (route) {
      case "/dashboard":
        console.log("  └─ Prefetching dashboard data (cardData, latestInvoices, revenue)");
        queryClient.prefetchQuery({
          queryKey: queryKeys.cardData,
          queryFn: getCardData,
          staleTime: 1000 * 60 * 5,
        });
        
        queryClient.prefetchQuery({
          queryKey: queryKeys.latestInvoices,
          queryFn: getLatestInvoices,
          staleTime: 1000 * 60,
        });
        
        queryClient.prefetchQuery({
          queryKey: queryKeys.revenue,
          queryFn: getRevenue,
          staleTime: 1000 * 60 * 5,
        });
        break;

      case "/dashboard/invoices":
        console.log("  └─ Prefetching invoices data (invoices, invoicesPages)");
        queryClient.prefetchQuery({
          queryKey: queryKeys.invoices("", 1),
          queryFn: () => getFilteredInvoices("", 1),
          staleTime: 1000 * 60 * 2,
        });
        
        queryClient.prefetchQuery({
          queryKey: queryKeys.invoicesPages(""),
          queryFn: () => getInvoicesPages(""),
          staleTime: 1000 * 60 * 5,
        });
        break;

      case "/dashboard/customers":
        console.log("  └─ Prefetching customers data");
        const customerCacheStatus = queryClient.getQueryState(queryKeys.customers);
        console.log("    Cache status:", customerCacheStatus ? `${customerCacheStatus.status} (${customerCacheStatus.fetchStatus})` : "not in cache");
        
        queryClient.prefetchQuery({
          queryKey: queryKeys.customers,
          queryFn: getCustomers,
          staleTime: 1000 * 60 * 5,
        }).then(() => {
          console.log("    ✅ Prefetch completed for customers");
        }).catch((err) => {
          console.log("    ❌ Prefetch failed:", err.message);
        });
        break;

      case "/admin":
        console.log("  └─ Prefetching admin data (cardData)");
        queryClient.prefetchQuery({
          queryKey: queryKeys.cardData,
          queryFn: getCardData,
          staleTime: 1000 * 60 * 5,
        });
        break;
    }
  };

  return { prefetchForRoute };
}

/**
 * Hook for intelligent prefetching based on user behavior patterns
 */
export function useSmartPrefetch() {
  const queryClient = useQueryClient();

  const prefetchRelatedData = (queryKey: readonly unknown[]) => {
    const keyType = queryKey[0] as string;
    console.log(`🔗 Smart prefetch: Related data for ${keyType}`);
    
    // When customer data is fetched, prefetch invoice data since they're related
    if (keyType === "customers") {
      console.log("  └─ Prefetching related invoices");
      queryClient.prefetchQuery({
        queryKey: queryKeys.invoices("", 1),
        queryFn: () => getFilteredInvoices("", 1),
        staleTime: 1000 * 60 * 2,
      });
    }

    // When invoice data is fetched, prefetch customer data
    if (keyType === "invoices") {
      console.log("  └─ Prefetching related customers");
      queryClient.prefetchQuery({
        queryKey: queryKeys.customers,
        queryFn: getCustomers,
        staleTime: 1000 * 60 * 5,
      });
    }

    // When dashboard data is fetched, prefetch related details
    if (keyType === "dashboard") {
      console.log("  └─ Prefetching related dashboard details");
      queryClient.prefetchQuery({
        queryKey: queryKeys.latestInvoices,
        queryFn: getLatestInvoices,
        staleTime: 1000 * 60,
      });
    }
  };

  return { prefetchRelatedData };
}