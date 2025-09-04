import { fetchCustomers } from "@/app/lib/data";
import { CustomerField } from "@/app/lib/definitions";
import SearchInput from "./search-input";
import ViewToggle from "./view-toggle";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const customers = await fetchCustomers();
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams.search || "";

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = search.toLowerCase();

    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.company?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <SearchInput />
      </div>

      <ViewToggle customers={filteredCustomers} />
    </div>
  );
}
