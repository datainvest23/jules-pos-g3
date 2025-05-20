import type { Product } from '@/types';
import { mockProducts } from './mockData';

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
