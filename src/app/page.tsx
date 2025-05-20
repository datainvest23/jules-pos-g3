
'use client';

import { useState, useEffect } from 'react';
import type { Product, ReceiptData, Customer } from '@/types';
import { fetchAllProducts, fetchAllCustomers } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import PriceViewer from '@/components/PriceViewer';
import ProductSuggester from '@/components/ProductSuggester';
import QrCodeDisplay from '@/components/QrCodeDisplay';
import ReceiptDialog from '@/components/ReceiptDialog';
import CurrentSalePanel from '@/components/CurrentSalePanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Leaf, Loader2, X, UserCog, ShoppingCart, ShieldCheck, Store } from 'lucide-react';
import { useMode } from '@/context/ModeContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const { mode, toggleMode, setMode } = useMode();

  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [isLoadingAllCustomers, setIsLoadingAllCustomers] = useState(true);
  const [selectedSaleCustomer, setSelectedSaleCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const fetchedProducts = await fetchAllProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    loadProducts();

    const loadCustomers = async () => {
      setIsLoadingAllCustomers(true);
      try {
        const fetchedCustomers = await fetchAllCustomers();
        setAllCustomers(fetchedCustomers);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setIsLoadingAllCustomers(false);
      }
    };
    loadCustomers();
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

  const handleBuyNow = (product: Product) => {
    if (product.stock === 0) {
      alert("This product is out of stock and cannot be purchased.");
      return;
    }
    const newReceiptData: ReceiptData = {
      product: product,
      transactionId: `TXN-${Date.now().toString().slice(-8)}`,
      quantity: 1,
      timestamp: new Date(),
      customerId: selectedSaleCustomer?.id || null,
      customerName: selectedSaleCustomer?.name || null,
    };
    setReceiptData(newReceiptData);
    setIsReceiptDialogOpen(true);
  };

  const handleAdminNavigation = () => {
    setMode('admin'); 
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between space-x-4">
          <div className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Leaf className="h-7 w-7" />
            <span>HealthStore Central</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Store className={`h-5 w-5 ${mode === 'cashier' ? 'text-primary' : 'text-muted-foreground'}`} />
              <Switch
                id="mode-switch"
                checked={mode === 'admin'}
                onCheckedChange={toggleMode}
                aria-label={`Switch to ${mode === 'cashier' ? 'Admin' : 'Cashier'} mode`}
              />
              <ShieldCheck className={`h-5 w-5 ${mode === 'admin' ? 'text-primary' : 'text-muted-foreground'}`} />
              <Label htmlFor="mode-switch" className="text-sm hidden md:inline">
                {mode === 'cashier' ? 'Cashier Mode' : 'Admin Mode'}
              </Label>
            </div>
            {mode === 'admin' && (
              <Button variant="outline" asChild onClick={handleAdminNavigation}>
                <Link href="/admin/products">
                  <UserCog className="mr-2 h-4 w-4" />
                  Admin Panel
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        {mode === 'cashier' ? (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold text-foreground">Cashier Point of Sale</h1>
              <p className="text-muted-foreground">Select products to add to sale.</p>
            </div>
            <CurrentSalePanel
              selectedCustomer={selectedSaleCustomer}
              onSelectCustomer={setSelectedSaleCustomer}
              customers={allCustomers}
              isLoadingCustomers={isLoadingAllCustomers}
            />
          </>
        ) : (
           <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-foreground">Product Catalog (Admin View)</h1>
            <p className="text-muted-foreground">Browse products. Use Admin Panel for management.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <section className={`transition-all duration-300 ease-in-out ${selectedProduct ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
            {mode === 'cashier' && !selectedProduct && ( // Show price viewer only if no product is selected for details
              <div className="mb-6">
                 <PriceViewer />
              </div>
            )}
            
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

          {selectedProduct && (
            <aside className="lg:col-span-4 space-y-6 sticky top-20 h-fit">
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
                  
                  <Button 
                    onClick={() => handleBuyNow(selectedProduct)} 
                    className="w-full mt-4"
                    disabled={selectedProduct.stock === 0}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {mode === 'cashier' ? 'Add to Sale' : 'Simulate Purchase'}
                  </Button>
                  
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
      
      <ReceiptDialog 
        isOpen={isReceiptDialogOpen} 
        onClose={() => setIsReceiptDialogOpen(false)} 
        receiptData={receiptData} 
      />
    </div>
  );
}
