import type { Product, Customer } from '@/types';
import { mockProducts, mockCustomers } from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchAllProducts(): Promise<Product[]> {
  await delay(500); // Simulate network latency
  return mockProducts;
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  await delay(300); // Simulate network latency
  return mockProducts.find(product => product.id === id);
}

export async function fetchAllCustomers(): Promise<Customer[]> {
  await delay(400); // Simulate network latency
  return mockCustomers;
}

export async function fetchCustomerById(id: string): Promise<Customer | undefined> {
  await delay(250); // Simulate network latency
  return mockCustomers.find(customer => customer.id === id);
}
