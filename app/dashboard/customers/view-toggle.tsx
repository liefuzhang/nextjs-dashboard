"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { CustomerField } from "@/app/lib/definitions";
import CustomersTable from "./customers-table";
import {
  AddCustomerModal,
  EditCustomerModal,
  DeleteCustomerModal,
} from "./customer-modals";
import CustomerCard from "./customer-card";
import { Plus, Filter, SortAsc } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ViewType = "cards" | "table";

export default function ViewToggle({
  customers,
}: {
  customers: CustomerField[];
}) {
  const [viewType, setViewType] = useState<ViewType>("cards");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerField | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortBy, setSortBy] = useState<"name" | "email" | "company">("name");

  // Load saved preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("customers-view");
    if (saved === "cards" || saved === "table") {
      setViewType(saved);
    }
  }, []);

  // Save preference to localStorage
  const handleViewChange = (checked: boolean) => {
    const newView: ViewType = checked ? "table" : "cards";
    setViewType(newView);
    localStorage.setItem("customers-view", newView);
  };

  // Action handlers for cards view
  const handleView = (customer: CustomerField) => {
    console.log("View customer:", customer.name);
  };

  const handleEdit = (customer: CustomerField) => {
    setSelectedCustomer(customer);
    setEditModalOpen(true);
  };

  const handleDelete = (customer: CustomerField) => {
    setSelectedCustomer(customer);
    setDeleteModalOpen(true);
  };

  // Filter and sort customers
  const filteredAndSortedCustomers = customers
    .filter(
      (customer) => statusFilter === "all" || customer.status === statusFilter
    )
    .sort((a, b) => {
      const aValue = a[sortBy].toLowerCase();
      const bValue = b[sortBy].toLowerCase();
      return aValue.localeCompare(bValue);
    });

  return (
    <div>
      {/* Toggle UI */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <span
            className={`text-sm font-medium ${
              viewType === "cards" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Cards
          </span>
          <Switch
            checked={viewType === "table"}
            onCheckedChange={handleViewChange}
          />
          <span
            className={`text-sm font-medium ${
              viewType === "table" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Table
          </span>
          {/* Filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-4">
                <Filter className="w-4 h-4 mr-2" />
                Filter: {statusFilter === "all" ? "All" : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All Customers
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                Active Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                Inactive Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Sort dropdown */}
          {viewType === "cards" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SortAsc className="w-4 h-4 mr-2" />
                  Sort by {sortBy}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("name")}>
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("email")}>
                  Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("company")}>
                  Company
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Conditional rendering */}
      {viewType === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <CustomersTable
          customers={filteredAndSortedCustomers}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal components */}
      <AddCustomerModal open={addModalOpen} onOpenChange={setAddModalOpen} />

      <EditCustomerModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        customer={selectedCustomer}
      />

      <DeleteCustomerModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        customer={selectedCustomer}
      />
    </div>
  );
}
