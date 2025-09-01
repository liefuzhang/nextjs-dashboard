import { fetchCustomers } from "@/app/lib/data";

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <div className="container mx-auto p-4">
      {customers.map((customer) => (
        <div key={customer.id}>
          {customer.name}
          <br />
          {customer.email}
        </div>
      ))}
    </div>
  );
}
