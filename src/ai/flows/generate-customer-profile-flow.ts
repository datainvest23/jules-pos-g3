
'use server';
/**
 * @fileOverview A Genkit flow to generate an AI-powered customer profile based on their ID and purchase history.
 *
 * - generateCustomerProfile - A function that handles the customer profile generation process.
 * - GenerateCustomerProfileInput - The input type for the generateCustomerProfile function.
 * - GenerateCustomerProfileOutput - The return type for the generateCustomerProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TransactionSummarySchema = z.object({
  transactionId: z.string(),
  timestamp: z.string().describe("ISO date string of the transaction"),
  totalAmount: z.number().describe("Total amount of the transaction"),
});

const GenerateCustomerProfileInputSchema = z.object({
  customerId: z.string().describe('The unique identifier for the customer.'),
  customerSince: z.string().describe('The date (ISO string) when the customer relationship started.'),
  purchaseHistory: z.array(TransactionSummarySchema)
    .describe('A list of the customer\'s past transactions, including ID, timestamp, and total amount.'),
});
export type GenerateCustomerProfileInput = z.infer<typeof GenerateCustomerProfileInputSchema>;

const GenerateCustomerProfileOutputSchema = z.object({
  profile: z.string().describe('The generated AI customer profile, including analysis and recommendations, formatted as per instructions.'),
});
export type GenerateCustomerProfileOutput = z.infer<typeof GenerateCustomerProfileOutputSchema>;

export async function generateCustomerProfile(input: GenerateCustomerProfileInput): Promise<GenerateCustomerProfileOutput> {
  return generateCustomerProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCustomerProfilePrompt',
  input: {schema: GenerateCustomerProfileInputSchema},
  output: {schema: GenerateCustomerProfileOutputSchema},
  prompt: `You are an AI assistant tasked with analyzing customer data to identify health patterns and make holistic health recommendations.
Do NOT mention the customer's name or any other PII beyond the provided customerId. Focus on patterns from purchase history.

Customer ID: {{{customerId}}}
Customer Since: {{{customerSince}}}

Purchase History:
{{#if purchaseHistory.length}}
{{#each purchaseHistory}}
- Transaction ID: {{this.transactionId}}, Date: {{this.timestamp}}, Amount: \${{this.totalAmount}}
{{/each}}
{{else}}
- No purchase history available.
{{/if}}

Analyze the provided information to identify health patterns and make holistic health recommendations.

[Details]

- Analyze customer ID, customer since date, and purchase history (transaction dates and amounts) for patterns and potential preferences in health-related spending. Note: Specific items purchased are not available, so infer based on transaction frequency and amounts.
- Consider potential lifestyle factors that might influence health choices based on purchasing patterns (e.g., regular small purchases vs. infrequent large purchases).
- Offer health recommendations based on identified patterns, focusing on potential benefits.

# Output Format

Provide a clear analysis followed by a list of recommendations, using bullet points for clarity.

Example (adapt based on actual data):
**Analysis:**
Based on the purchase history for customer {{{customerId}}}, who has been with us since {{{customerSince}}}, we observe [describe observed patterns, e.g., consistent monthly spending around $X, or increased spending during certain periods, etc.]. This might suggest an interest in [e.g., regular supplement replenishment, seasonal wellness products, etc.].

**Recommendations:**
*   [Recommendation 1 based on patterns, e.g., "Explore our range of daily multivitamins to support consistent wellness."]
*   [Recommendation 2, e.g., "Consider our loyalty program for benefits on regular purchases."]
*   [Recommendation 3, e.g., "Look into seasonal allergy support products if spending increases during spring."]

# Steps

1. Review the customer ID, customer since date, and purchase history (transaction dates and amounts).
2. Identify patterns (e.g., frequency of purchases, average spending, changes over time), potential preferences, or recurring financial commitments that might relate to health products.
3. Relate these patterns to potential health needs or goals (e.g., regular purchases might indicate ongoing supplement use, larger infrequent purchases might indicate stocking up on specific items).
4. Offer recommendations that could enhance health or wellness, based on the identified patterns. Focus on product categories or general wellness advice relevant to a health store.

# Notes

- Focus on aligning recommendations with holistic health practices.
- Be sensitive to privacy; avoid making medical claims or diagnoses. Base recommendations on general wellness principles and product categories typically found in a health store.
- If purchase history is sparse or non-existent, acknowledge this and provide more general wellness tips or encourage exploring different product categories.
`,
});

const generateCustomerProfileFlow = ai.defineFlow(
  {
    name: 'generateCustomerProfileFlow',
    inputSchema: GenerateCustomerProfileInputSchema,
    outputSchema: GenerateCustomerProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI failed to generate a profile.");
    }
    return output;
  }
);
