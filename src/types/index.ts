export interface Product {
  id: string; // SKU or unique ID
  name: string;
  description: string;
  category: string; // e.g., 'Supplements', 'Organic Foods', 'Wellness Items'
  price: number;
  salePrice?: number;
  imageUrl: string;
  stock: number; 
}

export interface SuggestedProduct {
  productId: string;
  productName: string;
  reason: string;
}
