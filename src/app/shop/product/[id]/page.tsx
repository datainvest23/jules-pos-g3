
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { fetchProductById } from '@/lib/api';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, ShoppingCart, Info, Tag, DollarSign, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      setIsLoading(true);
      setError(null);
      fetchProductById(productId)
        .then((data) => {
          if (data) {
            setProduct(data);
          } else {
            setError('Product not found.');
            toast({ title: 'Error', description: 'Product not found.', variant: 'destructive' });
          }
        })
        .catch((err) => {
          console.error('Failed to fetch product:', err);
          setError('Failed to load product details.');
          toast({ title: 'Error', description: 'Could not load product details.', variant: 'destructive' });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [productId, toast]);

  const getStockBadge = (p: Product | null) => {
    if (!p) return null;
    if (p.stock === 0) {
      return <Badge variant="destructive" className="text-sm"><XCircle className="mr-1 h-4 w-4" /> Out of Stock</Badge>;
    }
    if (p.stock <= 10) {
      return <Badge variant="outline" className="text-sm text-accent-foreground border-accent"><AlertTriangle className="mr-1 h-4 w-4" /> Low Stock ({p.stock} left)</Badge>;
    }
    return <Badge variant="default" className="text-sm bg-green-600 hover:bg-green-700"><CheckCircle className="mr-1 h-4 w-4" /> In Stock</Badge>;
  };

  const handleAddToCart = () => {
    if (!product) return;
    // TODO: Implement actual add to cart logic for the shop
    console.log('Adding to shop cart (simulated):', product.name);
    toast({
      title: `${product.name} Added to Cart! (Simulated)`,
      description: "This feature will be fully implemented soon.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive flex items-center justify-center">
              <AlertTriangle className="mr-2 h-7 w-7" /> Product Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">{error || 'The product you are looking for does not exist or could not be loaded.'}</p>
            <Button asChild variant="outline">
              <Link href="/shop">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between space-x-4">
          <Link href="/shop" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <ShoppingCart className="h-7 w-7" />
            <span>HealthStore Shop</span>
          </Link>
          <Button variant="outline" asChild>
            <Link href="/">POS View</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" onClick={() => router.push('/shop')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Products
          </Button>
        </div>

        <Card className="overflow-hidden shadow-xl rounded-lg">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative aspect-square md:aspect-auto bg-muted">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain p-4 md:p-8"
                sizes="(max-width: 768px) 100vw, 50vw"
                 data-ai-hint={product.category === 'Organic Foods' && product.name.toLowerCase().includes('apple') ? 'fruit organic' : 
                                product.category === 'Supplements' && product.name.toLowerCase().includes('vitamin') ? 'supplement pill' :
                                product.category === 'Wellness Items' ? 'fitness yoga' :
                                product.category === 'Supplements' && product.name.toLowerCase().includes('protein') ? 'supplement powder' :
                                product.category === 'Organic Foods' && product.name.toLowerCase().includes('tea') ? 'tea herb' :
                                'product item'}
              />
            </div>
            <div className="p-6 md:p-8 flex flex-col">
              <CardHeader className="p-0 mb-4">
                <Badge variant="outline" className="mb-2 w-fit">{product.category}</Badge>
                <CardTitle className="text-3xl lg:text-4xl font-bold">{product.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Product ID: {product.id}</CardDescription>
              </CardHeader>

              <CardContent className="p-0 flex-grow space-y-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <p className="text-3xl font-bold text-primary">
                    ${(product.salePrice ?? product.price).toFixed(2)}
                  </p>
                  {product.salePrice && (
                    <p className="text-lg text-muted-foreground line-through">
                      ${product.price.toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  {getStockBadge(product)}
                </div>
                
                <Separator className="my-4" />

                <div>
                  <h3 className="text-lg font-semibold mb-1 flex items-center"><Info className="mr-2 h-5 w-5 text-primary"/>Description</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
                </div>
                
                 <Separator className="my-4" />

                {/* Placeholder for future details like ingredients, reviews etc. */}
                 <div className="text-sm text-muted-foreground">
                    <p><Tag className="inline mr-1 h-4 w-4" />Category: {product.category}</p>
                    {product.supplierId && <p className="mt-1"><ShoppingCart className="inline mr-1 h-4 w-4" />Supplier ID: {product.supplierId}</p>}
                 </div>

              </CardContent>
              
              <div className="mt-auto pt-6">
                <Button 
                  size="lg" 
                  className="w-full text-base" 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart (Shop)"}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </main>

      <footer className="py-6 md:px-8 md:py-0 border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} HealthStore Central.
          </p>
          <nav className="flex gap-4">
            <Link href="#" className="text-sm hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="text-sm hover:text-primary transition-colors">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

