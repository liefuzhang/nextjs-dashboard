import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { 
  getRevenue, 
  getLatestInvoices, 
  getCardData, 
  getFilteredInvoices,
  getInvoicesPages,
  getInvoiceById,
  getCustomers,
  getFilteredCustomers,
  getInfiniteInvoices
} from "./query-actions";
import { createCustomer, updateCustomer, deleteCustomer } from "./actions";
import { CustomerField } from "./definitions";
import { useSmartPrefetch } from "./prefetch";

// Query Keys - centralized for consistency
export const queryKeys = {
  revenue: ["revenue"] as const,
  latestInvoices: ["invoices", "latest"] as const,
  cardData: ["dashboard", "cards"] as const,
  invoices: (query?: string, page?: number) => 
    ["invoices", { query, page }] as const,
  infiniteInvoices: (query: string) =>
    ["invoices", "infinite", { query }] as const,
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
    // Enhanced background refetch settings
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
    refetchIntervalInBackground: true, // Continue refetching even when tab is not active
  });
}

export function useLatestInvoices() {
  return useQuery({
    queryKey: queryKeys.latestInvoices,
    queryFn: getLatestInvoices,
    // Refetch latest invoices more frequently since they change often
    refetchInterval: 1000 * 30, // Every 30 seconds
    refetchOnWindowFocus: true, // Always refetch when user returns to tab
  });
}

export function useCardData() {
  const { prefetchRelatedData } = useSmartPrefetch();
  
  return useQuery({
    queryKey: queryKeys.cardData,
    queryFn: async () => {
      const result = await getCardData();
      
      // Prefetch related data after successful fetch
      prefetchRelatedData(queryKeys.cardData);
      
      return result;
    },
    // Dashboard cards are important metrics - keep them fresh
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    // Refetch every 5 minutes for dashboard overview
    refetchInterval: 1000 * 60 * 5, 
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

export function useInfiniteInvoices(query: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.infiniteInvoices(query),
    queryFn: getInfiniteInvoices,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: query !== undefined,
    staleTime: 1000 * 60, // 1 minute
  });
}

// Customer Queries
export function useCustomers() {
  const { prefetchRelatedData } = useSmartPrefetch();
  
  return useQuery({
    queryKey: queryKeys.customers,
    queryFn: async () => {
      try {
        console.log("Fetching customers...");
        const result = await getCustomers();
        console.log("Customers fetched successfully:", result);
        
        // Prefetch related data after successful fetch
        prefetchRelatedData(queryKeys.customers);
        
        return result;
      } catch (error) {
        console.error("Error fetching customers:", error);
        throw error;
      }
    },
  });
}

export function useFilteredCustomers(query: string) {
  return useQuery({
    queryKey: queryKeys.filteredCustomers(query),
    queryFn: () => getFilteredCustomers(query),
    enabled: query !== undefined,
  });
}

// Customer Mutations
export function useCreateCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const prevState = { message: null, errors: {} };
      return await createCustomer(prevState, formData);
    },
    onMutate: async (formData: FormData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.customers });
      
      // Snapshot the previous value
      const previousCustomers = queryClient.getQueryData<CustomerField[]>(queryKeys.customers);
      
      // Create optimistic customer object from form data
      const optimisticCustomer = {
        id: `temp-${Date.now()}`, // Temporary ID
        name: formData.get('name') as string || '',
        email: formData.get('email') as string || '',
        phone: formData.get('phone') as string || '',
        company: formData.get('company') as string || '',
        location: formData.get('location') as string || '',
        status: formData.get('status') as 'active' | 'inactive' || 'active',
        image_url: '/customers/default.png', // Default image until upload completes
      };
      
      // Optimistically update the cache
      queryClient.setQueryData<CustomerField[]>(queryKeys.customers, (old) => {
        return old ? [...old, optimisticCustomer] : [optimisticCustomer];
      });
      
      // Return a context object with the snapshotted value
      return { previousCustomers, optimisticCustomer };
    },
    onError: (err, newCustomer, context) => {
      // Rollback to previous state on error
      queryClient.setQueryData(queryKeys.customers, context?.previousCustomers);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.customers });
      queryClient.invalidateQueries({ queryKey: ["customers", "filtered"] });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const prevState = { message: null, errors: {} };
      return await updateCustomer(id, prevState, formData);
    },
    onSuccess: () => {
      // Invalidate customers list and individual customer queries
      queryClient.invalidateQueries({ queryKey: queryKeys.customers });
      queryClient.invalidateQueries({ queryKey: ["customers", "filtered"] });
      // Also invalidate dashboard cards as customer count might change
      queryClient.invalidateQueries({ queryKey: queryKeys.cardData });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteCustomer(id);
    },
    onMutate: async (id: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.customers });
      
      // Snapshot the previous value
      const previousCustomers = queryClient.getQueryData<CustomerField[]>(queryKeys.customers);
      
      // Get the customer being deleted for potential rollback
      const deletedCustomer = previousCustomers?.find(c => c.id === id);
      
      // Optimistically remove the customer from cache
      queryClient.setQueryData<CustomerField[]>(queryKeys.customers, (old) => {
        return old?.filter(customer => customer.id !== id) || [];
      });
      
      // Return context for potential rollback
      return { previousCustomers, deletedCustomer };
    },
    onError: (err, id, context) => {
      // Rollback to previous state on error
      queryClient.setQueryData(queryKeys.customers, context?.previousCustomers);
    },
    onSettled: () => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.customers });
      queryClient.invalidateQueries({ queryKey: ["customers", "filtered"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.cardData });
      // Invalidate all invoice-related queries since customer deletion affects invoices
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}