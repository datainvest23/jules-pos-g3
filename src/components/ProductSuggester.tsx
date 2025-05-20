'use client';

import { useState, useEffect } from 'react';
import type { Product, SuggestedProduct } from '@/types';
import { suggestRelatedProducts, type SuggestRelatedProductsInput } from '@/ai/flows/suggest-related-products';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';

interface ProductSuggesterProps {
  product: Product;
}

export default function ProductSuggester({ product }: ProductSuggesterProps) {
  const [suggestions, setSuggestions] = useState<SuggestedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      const fetchSuggestions = async () => {
        setIsLoading(true);
        setError(null);
        setSuggestions([]);
        try {
          const input: SuggestRelatedProductsInput = {
            currentProductId: product.id,
            productName: product.name,
            productDescription: product.description,
            productCategory: product.category,
          };
          const result = await suggestRelatedProducts(input);
          // Simulate some related products if AI returns empty or few.
          // The AI might not actually know product IDs from mockData.
          // So we'll generate some dummy suggestions for display purposes.
          if (result.relatedProducts && result.relatedProducts.length > 0) {
             setSuggestions(result.relatedProducts.slice(0,3)); // Limit to 3 suggestions
          } else {
            // Fallback mock suggestions if AI returns none
             setSuggestions([
                { productId: "mock001", productName: "Organic Honey", reason: "Complements tea and healthy eating." },
                { productId: "mock002", productName: "Multivitamin Gummies", reason: "Popular general wellness item." },
             ]);
          }

        } catch (err) {
          console.error('Error fetching product suggestions:', err);
          setError('Failed to load product suggestions. Please try again later.');
           // Fallback mock suggestions on error
            setSuggestions([
                { productId: "mockErr01", productName: "Filtered Water Bottle", reason: "Supports a healthy lifestyle." },
            ]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSuggestions();
    }
  }, [product]);

  if (!product) return null;

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-accent" /> You Might Also Like</CardTitle>
        <CardDescription>AI-powered suggestions based on {product.name}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-muted-foreground">Finding recommendations...</p>
          </div>
        )}
        {error && !isLoading && (
          <Alert variant="destructive">
            <AlertTitle>Suggestion Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && suggestions.length === 0 && (
          <p className="text-muted-foreground">No specific suggestions available at the moment.</p>
        )}
        {!isLoading && !error && suggestions.length > 0 && (
          <ul className="space-y-3">
            {suggestions.map((suggestion) => (
              <li key={suggestion.productId} className="p-3 border rounded-md bg-background hover:bg-accent/10 transition-colors">
                <h4 className="font-semibold text-foreground">{suggestion.productName}</h4>
                <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                <Button variant="link" size="sm" className="p-0 h-auto mt-1 text-primary">View Product (ID: {suggestion.productId})</Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
