'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Product, ReceiptData, Customer, CartItem } from '@/types';
import { fetchAllProducts, fetchAllCustomers } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import PriceViewer from '@/components/PriceViewer';
import ProductSuggester from '@/components/ProductSuggester';
import QrCodeDisplay from '@/components/QrCodeDisplay';
import ReceiptDialog from '@/components/ReceiptDialog';
import CurrentSalePanel from '@/components/CurrentSalePanel';
import AppNavigation from '@/components/AppNavigation'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Leaf, Loader2, X, UserCog, ShoppingCart, ShieldCheck, Store, Filter, Building, UserCheck, Users } from 'lucide-react'; // Added Building, UserCheck, Users
import { useMode } from '@/context/ModeContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";


export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const { mode, toggleMode, setMode } = useMode();
  const { toast } = useToast();

  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [isLoadingAllCustomers, setIsLoadingAllCustomers] = useState(true);
  const [selectedSaleCustomer, setSelectedSaleCustomer] = useState<Customer | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [showLandingOverlay, setShowLandingOverlay] = useState(true);

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

    const loadCustomers = async () => {
      setIsLoadingAllCustomers(true);
      try {
        const fetchedCustomers = await fetchAllCustomers();
        setAllCustomers(fetchedCustomers);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
        toast({ title: "Error", description: "Failed to load customers.", variant: "destructive" });
      } finally {
        setIsLoadingAllCustomers(false);
      }
    };
    loadCustomers();
  }, [toast]);

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

  const handleAddToCart = (productToAdd: Product) => {
    if (productToAdd.stock === 0) {
      toast({
        title: "Out of Stock",
        description: `${productToAdd.name} is currently out of stock.`,
        variant: "destructive",
      });
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.product.id === productToAdd.id);
      if (existingItem) {
        if (existingItem.quantity + 1 > productToAdd.stock) {
             toast({
                title: "Stock Limit Reached",
                description: `Cannot add more ${productToAdd.name} than available in stock (${productToAdd.stock}).`,
                variant: "destructive",
            });
            return prevItems;
        }
        return prevItems.map(item =>
          item.product.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        if (1 > productToAdd.stock) {
            toast({
                title: "Stock Limit Reached",
                description: `Cannot add ${productToAdd.name} as it exceeds available stock (${productToAdd.stock}).`,
                variant: "destructive",
            });
            return prevItems;
        }
        return [...prevItems, { product: productToAdd, quantity: 1 }];
      }
    });
    toast({
      title: "Item Added",
      description: `${productToAdd.name} has been added to the sale.`,
      variant: "default"
    });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty Sale",
        description: "Please add items to the sale before checking out.",
        variant: "destructive",
      });
      return;
    }

    const totalAmount = cartItems.reduce((total, item) => {
      const price = item.product.salePrice ?? item.product.price;
      return total + (price * item.quantity);
    }, 0);

    const newReceiptData: ReceiptData = {
      items: cartItems,
      transactionId: `TXN-${Date.now().toString().slice(-8)}`,
      timestamp: new Date(),
      customerId: selectedSaleCustomer?.id || null,
      customerName: selectedSaleCustomer?.name || null,
      totalAmount: totalAmount,
    };
    setReceiptData(newReceiptData);
    setIsReceiptDialogOpen(true);
  };
  
  const handleClearCart = useCallback(() => {
    setCartItems([]);
    setSelectedSaleCustomer(null);
    toast({
      title: "Sale Cleared",
      description: "All items have been removed from the current sale.",
    });
  }, [toast]);

  const handleAdminNavigation = () => {
    setMode('admin'); 
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


  if (showLandingOverlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
        <Card className="w-full max-w-lg shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Leaf className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Welcome to HealthStore Central</CardTitle>
            <CardDescription className="text-md text-muted-foreground pt-1">
              Please select your preferred view to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2 pb-6 px-6">
            <Button
              onClick={() => {
                handleAdminNavigation(); // Ensure mode is set to admin
                setShowLandingOverlay(false); 
                // Navigation is handled by Link component
              }}
              className="w-full text-lg py-6"
              asChild
              size="lg"
            >
              <Link href="/admin">
                <Building className="mr-2 h-5 w-5" /> Admin View
              </Link>
            </Button>
            <Button
              onClick={() => {
                setMode('cashier'); // Ensure mode is set to cashier
                setShowLandingOverlay(false);
              }}
              className="w-full text-lg py-6"
              variant="outline"
              size="lg"
            >
              <UserCheck className="mr-2 h-5 w-5" /> Cashier View
            </Button>
            <Button
              onClick={() => { 
                setShowLandingOverlay(false); 
                // Navigation is handled by Link component
              }}
              className="w-full text-lg py-6"
              variant="outline"
              asChild
              size="lg"
            >
              <Link href="/shop">
                <Users className="mr-2 h-5 w-5" /> Client (Shop)
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary mr-6">
            <Leaf className="h-7 w-7" />
            <span>HealthStore</span>
          </Link>
          
          <div className="flex-grow">
            <AppNavigation />
          </div>

          <div className="flex items-center space-x-3 ml-auto">
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
              <Button variant="outline" size="sm" asChild onClick={handleAdminNavigation}>
                <Link href="/admin">
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
              cartItems={cartItems}
              onCheckout={handleCheckout}
              onClearCart={handleClearCart}
              setCartItems={setCartItems}
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
            {mode === 'cashier' && !selectedProduct && (
              <div className="mb-6">
                 <PriceViewer />
              </div>
            )}
            
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

            <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center">
              <Leaf className="w-7 h-7 mr-2 text-primary" /> Our Products
            </h2>
            {isLoadingProducts ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-3 text-lg text-muted-foreground">Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onSelectProduct={handleSelectProduct} onAddToCart={mode === 'cashier' ? handleAddToCart : undefined}/>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground text-lg">
                {selectedCategory && selectedCategory !== 'All' ? `No products found in the "${selectedCategory}" category.` : 'No products available at the moment.'}
              </p>
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
                    onClick={() => handleAddToCart(selectedProduct)} 
                    className="w-full mt-4"
                    disabled={selectedProduct.stock === 0 && mode === 'cashier'}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {mode === 'cashier' ? 'Add to Sale' : 'Simulate Add to Sale'}
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
           <Link href="/shop" className="text-sm font-medium text-primary hover:underline">
              Visit our Online Shop
           </Link>
        </div>
      </footer>
      
      <ReceiptDialog 
        isOpen={isReceiptDialogOpen} 
        onClose={() => {
          setIsReceiptDialogOpen(false);
          if (receiptData) { 
              handleClearCart();
          }
        }} 
        receiptData={receiptData} 
      />
    </div>
  );
}
