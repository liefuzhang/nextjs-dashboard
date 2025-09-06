"use client";

import { CreateInvoice } from "@/app/ui/invoices/buttons";
import { lusitana } from "@/app/ui/fonts";
import InfiniteInvoicesTable from "@/app/ui/invoices/infinite-table";
import { useSearchParams } from "next/navigation";
import Search from "@/app/ui/search";
import { Suspense } from "react";
import { QueryErrorBoundary } from "@/app/components/query-error-boundary";

function InvoicesContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <QueryErrorBoundary>
        <InfiniteInvoicesTable query={query} />
      </QueryErrorBoundary>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading search params...</div>}>
      <InvoicesContent />
    </Suspense>
  );
}
