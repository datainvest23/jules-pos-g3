'use client';

import { useState } from 'react';
import type { Product } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchProductById } from '@/lib/api';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, Tag } from 'lucide-react';

export default function PriceViewer() {
  const [sku, setSku] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handlePriceCheck = async () => {
    if (!sku.trim()) {
      setError('Please enter a Product ID/SKU.');
      setProduct(null);
      setSearched(true);
      return;
    }
    setIsLoading(true);
    setError(null);
    setProduct(null);
    setSearched(true);
    try {
      const foundProduct = await fetchProductById(sku);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setError('Product not found.');
      }
    } catch (err) {
      setError('Failed to fetch product details. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center"><Tag className="mr-2 h-5 w-5 text-primary" /> Price Viewer</CardTitle>
        <CardDescription>Enter a Product ID/SKU to check its price.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            type="text"
            value={sku}
            onChange={(e) => {
              setSku(e.target.value);
              setSearched(false); // Reset searched state on input change
            }}
            placeholder="Enter Product ID/SKU"
            className="flex-grow"
          />
          <Button onClick={handlePriceCheck} disabled={isLoading}>
            <Search className="mr-2 h-4 w-4" /> {isLoading ? 'Checking...' : 'Check Price'}
          </Button>
        </div>
        {isLoading && <p className="text-muted-foreground">Loading product information...</p>}
        {error && searched && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {product && searched && (
          <Alert variant="default" className="bg-accent/20">
            <AlertTitle className="font-semibold">{product.name}</AlertTitle>
            <AlertDescription>
              <p className="text-lg font-bold text-primary">
                Price: ${ (product.salePrice ?? product.price).toFixed(2) }
                {product.salePrice && <span className="text-sm text-muted-foreground line-through ml-2">${product.price.toFixed(2)}</span>}
              </p>
              <p className="text-sm text-muted-foreground">Category: {product.category}</p>
              <p className="text-sm text-muted-foreground">Stock: {product.stock > 0 ? `${product.stock} units available` : 'Out of Stock'}</p>
            </AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && !product && searched && (
            <p className="text-muted-foreground">No product found for SKU: {sku}</p>
        )}
      </CardContent>
    </Card>
  );
}
