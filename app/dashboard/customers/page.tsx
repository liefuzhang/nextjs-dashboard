"use client";

import { useCustomers } from "@/app/lib/queries";
import SearchInput from "./search-input";
import ViewToggle from "./view-toggle";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Page() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  
  const { data: customers, isLoading, error } = useCustomers();

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    
    if (!search) return customers;
    
    const searchLower = search.toLowerCase();
    return customers.filter((customer) => 
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.company?.toLowerCase().includes(searchLower)
    );
  }, [customers, search]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="h-16 bg-gray-300 rounded"></div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center text-red-500">
          <p>Error loading customers: {error.message}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <SearchInput />
      </div>

      <ViewToggle customers={filteredCustomers} />
    </div>
  );
}
