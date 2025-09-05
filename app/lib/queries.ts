import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getRevenue, 
  getLatestInvoices, 
  getCardData, 
  getFilteredInvoices,
  getInvoicesPages,
  getInvoiceById,
  getCustomers,
  getFilteredCustomers
} from "./query-actions";

// Query Keys - centralized for consistency
export const queryKeys = {
  revenue: ["revenue"] as const,
  latestInvoices: ["invoices", "latest"] as const,
  cardData: ["dashboard", "cards"] as const,
  invoices: (query?: string, page?: number) => 
    ["invoices", { query, page }] as const,
  invoicesPages: (query: string) => 
    ["invoices", "pages", query] as const,
  invoice: (id: string) => 
    ["invoices", id] as const,
  customers: ["customers"] as const,
  filteredCustomers: (query: string) => 
    ["customers", "filtered", query] as const,
};

// Dashboard Overview Queries
export function useRevenue() {
  return useQuery({
    queryKey: queryKeys.revenue,
    queryFn: getRevenue,
  });
}

export function useLatestInvoices() {
  return useQuery({
    queryKey: queryKeys.latestInvoices,
    queryFn: getLatestInvoices,
  });
}

export function useCardData() {
  return useQuery({
    queryKey: queryKeys.cardData,
    queryFn: getCardData,
  });
}

// Invoice Queries
export function useFilteredInvoices(query: string, currentPage: number) {
  return useQuery({
    queryKey: queryKeys.invoices(query, currentPage),
    queryFn: () => getFilteredInvoices(query, currentPage),
    // Only fetch if query has some value
    enabled: query !== undefined,
  });
}

export function useInvoicesPages(query: string) {
  return useQuery({
    queryKey: queryKeys.invoicesPages(query),
    queryFn: () => getInvoicesPages(query),
    enabled: query !== undefined,
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: queryKeys.invoice(id),
    queryFn: () => getInvoiceById(id),
    enabled: !!id,
  });
}

// Customer Queries
export function useCustomers() {
  return useQuery({
    queryKey: queryKeys.customers,
    queryFn: getCustomers,
  });
}

export function useFilteredCustomers(query: string) {
  return useQuery({
    queryKey: queryKeys.filteredCustomers(query),
    queryFn: () => getFilteredCustomers(query),
    enabled: query !== undefined,
  });
}