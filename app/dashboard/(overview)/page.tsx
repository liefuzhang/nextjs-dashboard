"use client";

import { lusitana } from "@/app/ui/fonts";
import {
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
  CardsSkeleton,
} from "@/app/ui/skeletons";
import { useRevenue, useLatestInvoices, useCardData } from "@/app/lib/queries";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function DashboardCards() {
  const { data: cardData, isLoading, error } = useCardData();

  if (isLoading) return <CardsSkeleton />;
  if (error) return <div>Error loading dashboard data</div>;
  if (!cardData) return null;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Collected</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cardData.totalPaidInvoices}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cardData.totalPendingInvoices}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cardData.numberOfInvoices}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cardData.numberOfCustomers}</div>
        </CardContent>
      </Card>
    </>
  );
}

function QueryRevenueChart() {
  const { data: revenue, isLoading, error } = useRevenue();

  if (isLoading) return <RevenueChartSkeleton />;
  if (error) return <div>Error loading revenue data</div>;
  if (!revenue) return null;

  return <RevenueChart revenue={revenue} />;
}

function QueryLatestInvoices() {
  const { data: latestInvoices, isLoading, error } = useLatestInvoices();

  if (isLoading) return <LatestInvoicesSkeleton />;
  if (error) return <div>Error loading latest invoices</div>;
  if (!latestInvoices) return null;

  return <LatestInvoices latestInvoices={latestInvoices} />;
}

export default function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCards />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <QueryRevenueChart />
        <QueryLatestInvoices />
      </div>
    </main>
  );
}
