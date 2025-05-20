
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-related-products.ts';
import '@/ai/flows/generate-customer-profile-flow.ts';
import '@/ai/flows/generate-product-promotion-flow.ts';
import '@/ai/flows/suggest-promotional-product-flow.ts'; // Added new BI flow

