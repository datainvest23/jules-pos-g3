
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-related-products.ts';
import '@/ai/flows/generate-customer-profile-flow.ts';
import '@/ai/flows/generate-product-promotion-flow.ts'; // Added new flow
