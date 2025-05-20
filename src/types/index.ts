
export interface Product {
  id: string; // SKU or unique ID
  name: string;
  description: string;
  category: string; // e.g., 'Supplements', 'Organic Foods', 'Wellness Items'
  price: number;
  salePrice?: number; // Optional, should be a number or undefined/null
  imageUrl: string;
  stock: number;
  optimumStock?: number | null;
  supplierId?: string | null; // Foreign key to Supplier
}

export interface SuggestedProduct {
  productId: string;
  productName: string;
  reason: string;
}

export interface TransactionSummary {
  transactionId: string;
  timestamp: Date;
  totalAmount: number;
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
  purchaseHistory?: TransactionSummary[];
  isVip?: boolean;
  storeCredit?: number;
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
  address?: { // This structure is maintained in the app type
    street: string;
    city: string;
    state: string;
    zip: string;
  } | null;
  notes?: string | null;
}

// For View Product Page - Sales History
export interface ProductSalesHistoryItem {
  transactionId: string;
  customerId?: string | null;
  customerName?: string | null;
  date: Date;
  quantitySold: number; 
  saleAmount: number; 
}

// For AI Product Promotion Flow (View Product Page)
export interface GenerateProductPromotionInput {
  productId: string;
  productName: string;
  productDescription: string;
  productCategory: string;
  price: number;
  salePrice?: number | null;
  imageUrl: string; // Added imageUrl as per flow
  recentSalesSummary: Array<{ customerName: string | null, date: string, quantity: number }>;
}

export interface GenerateProductPromotionOutput {
  socialMediaPost: string;
}

// For AI Suggest Promotional Product Flow (BI Page)
interface ProductSummaryForAISuggestion {
    id: string;
    name: string;
    category: string;
    price: number;
    salePrice?: number | null;
    stock: number;
    optimumStock?: number | null;
}
export interface SuggestPromotionalProductInput {
  products: ProductSummaryForAISuggestion[];
}

export interface SuggestPromotionalProductOutput {
  productId: string;
  productName: string;
  reason: string;
}
