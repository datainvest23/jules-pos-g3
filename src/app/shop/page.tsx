
'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Product } from '@/types';
import { fetchAllProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { Loader2, ShoppingBag, Filter, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation'; // Added useRouter

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const fetchedProducts = await fetchAllProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast({ title: "Error", description: "Failed to load products.", variant: "destructive" });
      } finally {
        setIsLoadingProducts(false);
      }
    };
    loadProducts();
  }, [toast]);

  const handleSelectProductForShop = (product: Product) => {
    router.push(`/shop/product/${product.id}`);
  };

  const productCategories = useMemo(() => {
    if (!products || products.length === 0) return [];
    const categories = new Set(products.map(p => p.category));
    return ['All', ...Array.from(categories)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'All') {
      return products;
    }
    return products.filter(product => product.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between space-x-4">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <ShoppingBag className="h-7 w-7" />
            <span>HealthStore Shop</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/"> <ArrowLeft className="mr-2 h-4 w-4"/> Back to POS</Link>
            </Button>
            {/* Future: Add cart icon, user login/profile */}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Discover Our Products</h1>
          <p className="mt-2 text-lg text-muted-foreground">Browse our curated selection of health and wellness items.</p>
        </div>

        {!isLoadingProducts && products.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-3 justify-center items-center">
            <Filter className="h-5 w-5 text-muted-foreground mr-1 hidden sm:inline-block" />
            {productCategories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category || (selectedCategory === null && category === 'All') ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category === 'All' ? null : category)}
                size="sm"
                className="rounded-full px-4"
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {isLoadingProducts ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-3 text-lg text-muted-foreground">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onSelectProduct={handleSelectProductForShop} 
                // onAddToCart is omitted as this is a browse-only catalog
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-lg py-10">
            {selectedCategory && selectedCategory !== 'All' ? `No products found in the "${selectedCategory}" category.` : 'No products available at the moment.'}
          </p>
        )}
      </main>

      <footer className="py-6 md:px-8 md:py-0 border-t bg-muted/20">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} HealthStore Central.
          </p>
          <nav className="flex gap-4">
            <Link href="/shop/terms" className="text-sm hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/shop/privacy" className="text-sm hover:text-primary transition-colors">Privacy Policy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

