import { lusitana } from "@/app/ui/fonts";
import {
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
  CardsSkeleton,
} from "@/app/ui/skeletons";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QueryStatus } from "@/app/components/query-status";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/app/lib/query-client";
import { getCardData } from "@/app/lib/query-actions";
import { queryKeys } from "@/app/lib/queries";
import DashboardClient from "./dashboard-client";

export default async function Page() {
  // Create a server-side query client
  const queryClient = getQueryClient();
  
  // Pre-fetch card data on the server
  console.log("🏗️ Server: Prefetching dashboard cards data...");
  await queryClient.prefetchQuery({
    queryKey: queryKeys.cardData,
    queryFn: getCardData,
  });
  console.log("✅ Server: Dashboard cards data prefetched successfully");

  // Dehydrate the query client to pass to client
  const dehydratedState = dehydrate(queryClient);

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      
      {/* Hydrate the prefetched data for client components */}
      <HydrationBoundary state={dehydratedState}>
        <DashboardClient />
      </HydrationBoundary>
    </main>
  );
}
