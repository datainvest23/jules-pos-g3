
'use client';

import type { Product } from '@/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export default function ProductCard({ product, onSelectProduct }: ProductCardProps) {
  const displayPrice = product.salePrice ?? product.price;
  const originalPrice = product.salePrice ? product.price : null;

  const getStockBadge = () => {
    if (product.stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (product.stock <= 10) {
      return <Badge variant="outline" className="text-accent-foreground border-accent">Low Stock ({product.stock} left)</Badge>;
    }
    return <Badge variant="default">In Stock</Badge>;
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0">
        <div className="aspect-[3/2] relative w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint={product.category === 'Organic Foods' && product.name.toLowerCase().includes('apple') ? 'fruit organic' : 
                          product.category === 'Supplements' && product.name.toLowerCase().includes('vitamin') ? 'supplement pill' :
                          product.category === 'Wellness Items' ? 'fitness yoga' :
                          product.category === 'Supplements' && product.name.toLowerCase().includes('protein') ? 'supplement powder' :
                          product.category === 'Organic Foods' && product.name.toLowerCase().includes('tea') ? 'tea herb' :
                          'product item'}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Badge variant="outline" className="mb-2">{product.category}</Badge>
        <CardTitle className="text-lg font-semibold mb-1">{product.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-2 h-10 overflow-hidden text-ellipsis">
          {product.description}
        </CardDescription>
        <div className="mb-2">
          {getStockBadge()}
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-xl font-bold text-primary">
            ${displayPrice.toFixed(2)}
          </p>
          {originalPrice && (
            <p className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={() => onSelectProduct(product)} className="w-full" variant="outline">
          <Eye className="mr-2 h-4 w-4" /> View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

