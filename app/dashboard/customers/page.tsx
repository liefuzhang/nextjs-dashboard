import { fetchCustomers } from "@/app/lib/data";

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <div className="container mx-auto gap-6 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {customers.map((customer) => (
        <div
          className=" bg-white border rounded-lg shadow-md p-4 
          hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer
          flex items-center gap-4"
          key={customer.id}
        >
          <div>
            <img
              src={customer.image_url}
              alt="User Image"
              className="w-12 h-12 rounded-full"
            ></img>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-800">
              {customer.name}
            </div>
            <div className="text-sm text-gray-600">{customer.email}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
