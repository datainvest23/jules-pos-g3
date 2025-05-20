
'use server';
/**
 * @fileOverview A Genkit flow to suggest a product to promote based on various factors.
 *
 * - suggestPromotionalProduct - A function that triggers the product promotion suggestion flow.
 * - SuggestPromotionalProductInput - The input type for the flow.
 * - SuggestPromotionalProductOutput - The return type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { SuggestPromotionalProductInput, SuggestPromotionalProductOutput } from '@/types'; // Using types from index

const ProductSummaryForAISchema = z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    price: z.number(),
    salePrice: z.number().nullable().optional(),
    stock: z.number(),
    optimumStock: z.number().nullable().optional(),
});

const SuggestPromotionalProductInputSchema = z.object({
  products: z.array(ProductSummaryForAISchema).describe('A list of all available products with their current stock, price, category, and optimum stock levels.'),
  // Consider adding recent sales trends or overall business goals if available.
});

const SuggestPromotionalProductOutputSchema = z.object({
  productId: z.string().describe('The ID of the suggested product to promote.'),
  productName: z.string().describe('The name of the suggested product.'),
  reason: z.string().describe('The reasoning behind why this product is a good candidate for promotion (e.g., high stock, good margin potential, seasonal relevance).'),
});

export async function suggestPromotionalProduct(input: SuggestPromotionalProductInput): Promise<SuggestPromotionalProductOutput> {
  return suggestPromotionalProductFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPromotionalProductPrompt',
  input: {schema: SuggestPromotionalProductInputSchema},
  output: {schema: SuggestPromotionalProductOutputSchema},
  prompt: `You are a Sales Strategy AI for HealthStore Central.
Your goal is to analyze the current product catalog and suggest ONE product that should be actively promoted to boost sales or manage inventory effectively.

Consider the following factors when making your suggestion:
1.  **Overstock Situations**: Products where current stock significantly exceeds optimum stock, or just generally high stock levels.
2.  **Profit Margin Potential**:
    *   Products with a high regular price.
    *   Products currently on sale (salePrice is lower than price) might attract customers, but also consider the original margin.
    *   (Note: Actual cost price is not provided, so infer margin potential from retail prices).
3.  **Popularity/Demand (Inferred)**: While direct sales velocity isn't provided, consider:
    *   Products in popular categories (e.g., 'Supplements' for general health, 'Organic Foods' for staple items).
    *   New or unique items that could generate buzz.
4.  **Seasonal Relevance or Trends**: (If discernible from product names/categories, though limited data here).
5.  **Strategic Goals**:
    *   Clearing out old stock to make space for new items.
    *   Introducing a new product to the market.
    *   Highlighting a high-value item.

Product Data:
{{#each products}}
- ID: {{this.id}}, Name: "{{this.name}}", Category: {{this.category}}, Price: \${{this.price}}{{#if this.salePrice}} (Sale: \${{this.salePrice}}){{/if}}, Stock: {{this.stock}}{{#if this.optimumStock}} (Optimum: {{this.optimumStock}}){{/if}}
{{/each}}

Based on the data above, select ONE product to prioritize for promotion.
Provide its ID, name, and a concise reason for your suggestion.
The reason should clearly state which factors (e.g., overstock, margin, etc.) make this product a good choice for promotion right now.
Focus on a single, actionable product suggestion.
`,
});

const suggestPromotionalProductFlow = ai.defineFlow(
  {
    name: 'suggestPromotionalProductFlow',
    inputSchema: SuggestPromotionalProductInputSchema,
    outputSchema: SuggestPromotionalProductOutputSchema,
  },
  async (input: SuggestPromotionalProductInput) => {
    if (!input.products || input.products.length === 0) {
        throw new Error("No products provided to analyze for promotion suggestion.");
    }
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI failed to generate a promotional product suggestion.");
    }
    return output;
  }
);
