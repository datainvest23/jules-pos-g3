import type { Product } from '@/types';

export const mockProducts: Product[] = [
  {
    id: 'HS001',
    name: 'Organic Apples (Bag)',
    description: 'A bag of fresh, crisp organic apples, perfect for snacking or baking. Rich in vitamins and fiber.',
    category: 'Organic Foods',
    price: 5.99,
    imageUrl: 'https://placehold.co/600x400.png', // data-ai-hint: "fruit organic"
    stock: 150,
  },
  {
    id: 'HS002',
    name: 'Vitamin C 1000mg',
    description: 'High-potency Vitamin C supplement to support immune health and provide antioxidant benefits.',
    category: 'Supplements',
    price: 12.49,
    salePrice: 10.99,
    imageUrl: 'https://placehold.co/600x400.png', // data-ai-hint: "supplement pill"
    stock: 80,
  },
  {
    id: 'HS003',
    name: 'Eco-Friendly Yoga Mat',
    description: 'Durable and non-slip yoga mat made from sustainable materials. Perfect for all types of yoga and exercise.',
    category: 'Wellness Items',
    price: 29.99,
    imageUrl: 'https://placehold.co/600x400.png', // data-ai-hint: "fitness yoga"
    stock: 45,
  },
  {
    id: 'HS004',
    name: 'Plant-Based Protein Powder',
    description: 'Vanilla flavored plant-based protein powder, ideal for post-workout recovery or as a meal supplement.',
    category: 'Supplements',
    price: 35.00,
    imageUrl: 'https://placehold.co/600x400.png', // data-ai-hint: "supplement powder"
    stock: 60,
  },
  {
    id: 'HS005',
    name: 'Organic Chamomile Tea',
    description: 'Soothing organic chamomile tea bags, naturally caffeine-free. Promotes relaxation and restful sleep.',
    category: 'Organic Foods',
    price: 7.29,
    imageUrl: 'https://placehold.co/600x400.png', // data-ai-hint: "tea herb"
    stock: 120,
  },
  {
    id: 'HS006',
    name: 'Probiotic Capsules',
    description: 'Daily probiotic supplement with 50 billion CFUs to support digestive health and gut balance.',
    category: 'Supplements',
    price: 24.95,
    imageUrl: 'https://placehold.co/600x400.png', // data-ai-hint: "supplement capsule"
    stock: 70,
  },
];
