import { fetchCustomers } from "@/app/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CustomerField } from "@/app/lib/definitions";
import SearchInput from "./search-input";
import CustomersTable from "./customers-table";

export default async function Page({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const customers = await fetchCustomers();
  const search = searchParams.search || "";

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = search.toLowerCase();

    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.company.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      <div className="container mx-auto gap-6 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer) => (
          <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={customer.image_url} alt={customer.name} />
                  <AvatarFallback>
                    {customer.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{customer.name}</h3>
                    <Badge
                      variant={
                        customer.status === "active" ? "default" : "secondary"
                      }
                    >
                      {customer.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {customer.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {customer.phone}
                  </p>
                  <div className="pt-2">
                    <p className="text-sm font-medium">{customer.company}</p>
                    <p className="text-xs text-muted-foreground">
                      {customer.location}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* <div>
          <Button>Add Customer</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="warning">Warning</Button>
        </div> */}
      </div>

      <div className="mb-6">
        <SearchInput />
      </div>

      <CustomersTable customers={filteredCustomers} />
    </div>
  );
}
