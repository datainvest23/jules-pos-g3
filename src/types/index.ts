
export interface Product {
  id: string; // SKU or unique ID
  name: string;
  description: string;
  category: string; // e.g., 'Supplements', 'Organic Foods', 'Wellness Items'
  price: number;
  salePrice?: number;
  imageUrl: string;
  stock: number;
  optimumStock?: number | null; // New field for optimal stock level
  supplierId?: string | null; // Optional: ID of the supplier
}

export interface SuggestedProduct {
  productId: string;
  productName: string;
  reason: string;
}

export interface Customer {
  id: string; // Auto-generated or from a system
  name: string;
  email: string;
  phone?: string | null; // Allow null for optional fields
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  } | null;
  customerSince: Date;
  // purchaseHistory?: string[]; // Array of order IDs or similar - for future use
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ReceiptData {
  items: CartItem[];
  transactionId: string;
  timestamp: Date;
  customerId?: string | null;
  customerName?: string | null;
  totalAmount: number;
}

export interface Supplier {
  id: string; // Auto-generated or system ID
  name: string;
  contactPerson?: string | null;
  email: string;
  phone?: string | null;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  } | null;
  notes?: string | null; // Any other relevant information
}
