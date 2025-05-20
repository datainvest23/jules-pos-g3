
'use server';
/**
 * @fileOverview A Genkit flow to generate a promotional social media post for a product.
 *
 * - generateProductPromotion - A function that handles the product promotion generation.
 * - GenerateProductPromotionInput - The input type for the generateProductPromotion function.
 * - GenerateProductPromotionOutput - The return type for the generateProductPromotion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecentSaleSummarySchema = z.object({
    customerName: z.string().nullable().describe("Name of the customer who made the purchase, or null if walk-in."),
    date: z.string().describe("Date of the sale (e.g., YYYY-MM-DD)."),
    quantity: z.number().describe("Quantity of the product sold in this transaction."),
});

const GenerateProductPromotionInputSchema = z.object({
  productId: z.string().describe('The unique identifier for the product.'),
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A brief description of the product.'),
  productCategory: z.string().describe('The category the product belongs to.'),
  price: z.number().describe('The regular price of the product.'),
  salePrice: z.number().nullable().optional().describe('The sale price of the product, if applicable.'),
  // imageUrl is not directly used by LLM but good for potential future context
  recentSalesSummary: z.array(RecentSaleSummarySchema).describe('A summary of recent sales for this product. This might be an empty array if no recent sales data is available or applicable for summarization.'),
});
export type GenerateProductPromotionInput = z.infer<typeof GenerateProductPromotionInputSchema>;

const GenerateProductPromotionOutputSchema = z.object({
  socialMediaPost: z.string().describe('The generated promotional social media post content, including text and relevant hashtags. The post should be engaging and suitable for platforms like Instagram, Facebook, or Twitter.'),
});
export type GenerateProductPromotionOutput = z.infer<typeof GenerateProductPromotionOutputSchema>;

export async function generateProductPromotion(input: GenerateProductPromotionInput): Promise<GenerateProductPromotionOutput> {
  return generateProductPromotionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductPromotionPrompt',
  input: {schema: GenerateProductPromotionInputSchema},
  output: {schema: GenerateProductPromotionOutputSchema},
  prompt: `You are an expert social media marketer for HealthStore Central, a store specializing in health products.
Your task is to generate an engaging promotional social media post for a specific product.

Product Details:
- Name: {{{productName}}}
- Description: {{{productDescription}}}
- Category: {{{productCategory}}}
- Price: \${{{price}}}{{#if salePrice}} (On Sale for \${{{salePrice}}}){{/if}}

Recent Sales Insights (if available, use this to gauge popularity or target audience):
{{#if recentSalesSummary.length}}
This product has seen some recent activity:
{{#each recentSalesSummary}}
- Sold {{this.quantity}} unit(s) on {{this.date}}{{#if this.customerName}} to a customer like {{this.customerName}}{{/if}}.
{{/each}}
{{else}}
- Consider highlighting the product's unique benefits or introducing it as a new must-have item.
{{/if}}

Instructions for the Social Media Post:
1.  Create a catchy and engaging post.
2.  Highlight the key benefits and features of "{{{productName}}}".
3.  If there's a sale price, emphasize the discount.
4.  Incorporate relevant hashtags (e.g., #HealthStoreCentral #{{{productCategory}}} #HealthyLiving #Wellness #{{{productName}}} #Sale #Promotion).
5.  Use emojis to make the post visually appealing.
6.  Maintain a friendly, enthusiastic, and health-conscious tone.
7.  The post should be suitable for platforms like Instagram, Facebook, or Twitter.
8.  If sales history is sparse or not indicative, focus on the product's intrinsic value and appeal. Do not fabricate sales data.

Generate the social media post content:
`,
});

const generateProductPromotionFlow = ai.defineFlow(
  {
    name: 'generateProductPromotionFlow',
    inputSchema: GenerateProductPromotionInputSchema,
    outputSchema: GenerateProductPromotionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI failed to generate a promotional post.");
    }
    return output;
  }
);

