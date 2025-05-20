// This is an auto-generated file from Firebase Studio.

'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting related products based on the currently viewed item.
 *
 * @requires genkit
 * @requires zod
 *
 * @exports suggestRelatedProducts - The main function to trigger the related products suggestion flow.
 * @exports SuggestRelatedProductsInput - The input type for the suggestRelatedProducts function.
 * @exports SuggestRelatedProductsOutput - The output type for the suggestRelatedProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const SuggestRelatedProductsInputSchema = z.object({
  currentProductId: z.string().describe('The ID of the product currently being viewed.'),
  productName: z.string().describe('The name of the product currently being viewed.'),
  productDescription: z.string().describe('The description of the product currently being viewed.'),
  productCategory: z.string().describe('The category of the product currently being viewed (e.g., supplements, organic foods).'),
});

export type SuggestRelatedProductsInput = z.infer<typeof SuggestRelatedProductsInputSchema>;

// Define the output schema
const SuggestRelatedProductsOutputSchema = z.object({
  relatedProducts: z.array(
    z.object({
      productId: z.string().describe('The ID of the related product.'),
      productName: z.string().describe('The name of the related product.'),
      reason: z.string().describe('Explanation of why the product is related.'),
    })
  ).describe('A list of related products with their IDs, names, and reasons for being related.'),
});

export type SuggestRelatedProductsOutput = z.infer<typeof SuggestRelatedProductsOutputSchema>;


export async function suggestRelatedProducts(input: SuggestRelatedProductsInput): Promise<SuggestRelatedProductsOutput> {
  return suggestRelatedProductsFlow(input);
}

const suggestRelatedProductsPrompt = ai.definePrompt({
  name: 'suggestRelatedProductsPrompt',
  input: {schema: SuggestRelatedProductsInputSchema},
  output: {schema: SuggestRelatedProductsOutputSchema},
  prompt: `You are an AI assistant helping customers discover related products in a health store.

  Based on the product the customer is currently viewing, suggest other products that might be of interest.
  Provide a reason for each suggestion.

  Current Product:
  Name: {{{productName}}}
  Description: {{{productDescription}}}
  Category: {{{productCategory}}}

  Suggest related products:
  `,
});

const suggestRelatedProductsFlow = ai.defineFlow(
  {
    name: 'suggestRelatedProductsFlow',
    inputSchema: SuggestRelatedProductsInputSchema,
    outputSchema: SuggestRelatedProductsOutputSchema,
  },
  async input => {
    const {output} = await suggestRelatedProductsPrompt(input);
    return output!;
  }
);
