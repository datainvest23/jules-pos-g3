
'use client';

import { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { fetchAllProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import PriceViewer from '@/components/PriceViewer';
import ProductSuggester from '@/components/ProductSuggester';
import QrCodeDisplay from '@/components/QrCodeDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Leaf, Loader2, X, UserCog } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const fetchedProducts = await fetchAllProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        // Potentially set an error state to display to the user
      } finally {
        setIsLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleClearSelection = () => {
    setSelectedProduct(null);
  };

  const getStockBadgeForSelectedProduct = (product: Product | null) => {
    if (!product) return null;
    if (product.stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (product.stock <= 10) {
      return <Badge variant="outline" className="text-accent-foreground border-accent">Low Stock ({product.stock} left)</Badge>;
    }
    return <Badge variant="default">In Stock</Badge>;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between space-x-4">
          <div className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Leaf className="h-7 w-7" />
            <span>HealthStore Central</span>
          </div>
          <nav>
            <Button variant="outline" asChild>
              <Link href="/admin/products">
                <UserCog className="mr-2 h-4 w-4" />
                Admin Panel
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Main content area for products */}
          <section className={`transition-all duration-300 ease-in-out ${selectedProduct ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
            <div className="mb-6">
              <PriceViewer />
            </div>
            
            <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center">
              <Leaf className="w-7 h-7 mr-2 text-primary" /> Our Products
            </h2>
            {isLoadingProducts ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-3 text-lg text-muted-foreground">Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onSelectProduct={handleSelectProduct} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground text-lg">No products available at the moment.</p>
            )}
          </section>

          {/* Sidebar for selected product details, suggestions, and QR */}
          {selectedProduct && (
            <aside className="lg:col-span-4 space-y-6 sticky top-20 h-fit"> {/* sticky top to account for header height */}
              <Card className="shadow-xl rounded-lg overflow-hidden">
                <CardHeader className="relative bg-muted/50 p-4">
                  <CardTitle className="text-xl">{selectedProduct.name}</CardTitle>
                  <CardDescription>{selectedProduct.category}</CardDescription>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearSelection}
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    aria-label="Close product details"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="aspect-video relative w-full rounded-md overflow-hidden mb-4">
                    <Image
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                      data-ai-hint={selectedProduct.category === 'Organic Foods' && selectedProduct.name.toLowerCase().includes('apple') ? 'fruit organic' : 
                                    selectedProduct.category === 'Supplements' && selectedProduct.name.toLowerCase().includes('vitamin') ? 'supplement pill' :
                                    selectedProduct.category === 'Wellness Items' ? 'fitness yoga' :
                                    selectedProduct.category === 'Supplements' && selectedProduct.name.toLowerCase().includes('protein') ? 'supplement powder' :
                                    selectedProduct.category === 'Organic Foods' && selectedProduct.name.toLowerCase().includes('tea') ? 'tea herb' :
                                    'product item'}
                    />
                  </div>
                  <p className="text-muted-foreground text-sm">{selectedProduct.description}</p>
                  <div className="mb-2">
                    {getStockBadgeForSelectedProduct(selectedProduct)}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-primary">
                      ${(selectedProduct.salePrice ?? selectedProduct.price).toFixed(2)}
                    </p>
                    {selectedProduct.salePrice && (
                      <p className="text-md text-muted-foreground line-through">
                        ${selectedProduct.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <ProductSuggester product={selectedProduct} />
                  <QrCodeDisplay productId={selectedProduct.id} productName={selectedProduct.name} />
                </CardContent>
              </Card>
            </aside>
          )}
        </div>
      </main>

      <footer className="py-6 md:px-8 md:py-0 border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} HealthStore Central. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
