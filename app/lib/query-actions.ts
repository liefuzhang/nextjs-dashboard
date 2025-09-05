"use server";

import { 
  fetchRevenue, 
  fetchLatestInvoices, 
  fetchCardData, 
  fetchFilteredInvoices,
  fetchInvoicesPages,
  fetchInvoiceById,
  fetchCustomers,
  fetchFilteredCustomers
} from "./data";

// Dashboard overview server actions
export async function getRevenue() {
  return await fetchRevenue();
}

export async function getLatestInvoices() {
  return await fetchLatestInvoices();
}

export async function getCardData() {
  return await fetchCardData();
}

// Invoice server actions  
export async function getFilteredInvoices(query: string, currentPage: number) {
  return await fetchFilteredInvoices(query, currentPage);
}

export async function getInvoicesPages(query: string) {
  return await fetchInvoicesPages(query);
}

export async function getInvoiceById(id: string) {
  return await fetchInvoiceById(id);
}

// Customer server actions
export async function getCustomers() {
  return await fetchCustomers();
}

export async function getFilteredCustomers(query: string) {
  return await fetchFilteredCustomers(query);
}