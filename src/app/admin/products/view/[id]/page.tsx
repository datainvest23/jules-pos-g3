
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from "date-fns";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Package, DollarSign, BarChart3, ImageIcon, Info, Tag, Users, CalendarDays, Hash, Brain, Edit, ShoppingCart, MessageSquare, Eye } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { fetchProductById, fetchAllCustomers, fetchAllSuppliers, fetchSupplierById } from '@/lib/api'; // Assuming fetchSupplierById exists
import type { Product, Customer, Supplier, TransactionSummary, ProductSalesHistoryItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// AI Promotion Flow
import { generateProductPromotion, type GenerateProductPromotionInput } from '@/ai/flows/generate-product-promotion-flow';

export default function ViewProductPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const productId = params.id as string;

  const [isFetchingProduct, setIsFetchingProduct] = useState(true);
  const [productNotFound, setProductNotFound] = useState(false);
  const [productData, setProductData] = useState<Product | null>(null);
  const [supplierName, setSupplierName] = useState<string | null>(null);
  const [salesHistory, setSalesHistory] = useState<ProductSalesHistoryItem[]>([]);
  const [isLoadingSalesHistory, setIsLoadingSalesHistory] = useState(true);

  // AI Promotion State
  const [isGeneratingPromotion, setIsGeneratingPromotion] = useState(false);
  const [aiPromotionPost, setAiPromotionPost] = useState<string | null>(null);
  const [aiPromotionError, setAiPromotionError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      const loadProductAndRelatedData = async () => {
        setIsFetchingProduct(true);
        setProductNotFound(false);
        setAiPromotionPost(null);
        setAiPromotionError(null);

        try {
          const product = await fetchProductById(productId);
          if (product) {
            setProductData(product);

            if (product.supplierId) {
              try {
                const supplier = await fetchSupplierById(product.supplierId);
                setSupplierName(supplier?.name || 'N/A');
              } catch (e) {
                setSupplierName('Error loading supplier');
              }
            } else {
              setSupplierName('None');
            }

            // Simulate fetching sales history
            setIsLoadingSalesHistory(true);
            const customers = await fetchAllCustomers();
            const simulatedHistory: ProductSalesHistoryItem[] = [];
            customers.forEach(customer => {
              (customer.purchaseHistory || []).forEach(transaction => {
                // For this simulation, we assume any transaction *could* contain this product.
                // A real system would have line items linking transactions to specific products.
                // We'll randomly decide if this transaction included the product for mock purposes.
                if (Math.random() < 0.2) { // 20% chance this transaction included the current product
                   const quantitySold = Math.floor(Math.random() * 3) + 1; // 1 to 3 units
                   simulatedHistory.push({
                    transactionId: transaction.transactionId,
                    customerId: customer.id,
                    customerName: customer.name,
                    date: transaction.timestamp,
                    quantitySold: quantitySold,
                    saleAmount: (product.salePrice || product.price) * quantitySold,
                  });
                }
              });
            });
            setSalesHistory(simulatedHistory.sort((a,b) => b.date.getTime() - a.date.getTime()).slice(0,10)); // Show latest 10
            setIsLoadingSalesHistory(false);

          } else {
            setProductNotFound(true);
            toast({
              title: "Error",
              description: `Product with ID ${productId} not found.`,
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Failed to load product or related data:", error);
          toast({
            title: "Error",
            description: "Failed to load product data. Please try again.",
            variant: "destructive",
          });
          setProductNotFound(true);
        } finally {
          setIsFetchingProduct(false);
        }
      };
      loadProductAndRelatedData();
    } else {
      setIsFetchingProduct(false);
      setProductNotFound(true);
      toast({
        title: "Error",
        description: "Product ID is missing.",
        variant: "destructive",
      });
    }
  }, [productId, toast]);

  const handleGeneratePromotion = async () => {
    if (!productData) return;
    setIsGeneratingPromotion(true);
    setAiPromotionPost(null);
    setAiPromotionError(null);
    try {
      const simplifiedSales: GenerateProductPromotionInput['recentSalesSummary'] = salesHistory.slice(0, 5).map(sale => ({ // Take up to 5 recent sales
        customerName: sale.customerName || "A customer",
        date: format(sale.date, "yyyy-MM-dd"),
        quantity: sale.quantitySold,
      }));

      const input: GenerateProductPromotionInput = {
        productId: productData.id,
        productName: productData.name,
        productDescription: productData.description,
        productCategory: productData.category,
        price: productData.price,
        salePrice: productData.salePrice || null,
        imageUrl: productData.imageUrl, // Not directly used by LLM prompt here, but available
        recentSalesSummary: simplifiedSales,
      };
      const result = await generateProductPromotion(input);
      setAiPromotionPost(result.socialMediaPost);
    } catch (error) {
      console.error("Failed to generate AI promotion:", error);
      let errorMessage = "Could not generate AI promotion. Please try again.";
       if (error instanceof Error) {
        errorMessage = error.message.includes("blocked") ? "Content generation blocked by safety filters. Please review input or try a different approach." : error.message;
      }
      setAiPromotionError(errorMessage);
      toast({ title: "AI Promotion Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsGeneratingPromotion(false);
    }
  };
  
  const DetailItem: React.FC<{ icon: React.ElementType, label: string, value?: string | number | null, children?: React.ReactNode, isBadge?: boolean, badgeVariant?: "default" | "secondary" | "destructive" | "outline" }> = 
    ({ icon: Icon, label, value, children, isBadge, badgeVariant }) => {
    let displayValue: React.ReactNode = 'N/A';
    if (value !== undefined && value !== null) {
        if (typeof value === 'number' && (label.toLowerCase().includes('price') || label.toLowerCase().includes('amount'))) {
            displayValue = `$${value.toFixed(2)}`;
        } else if (typeof value === 'number') {
             displayValue = value.toString();
        }
         else {
            displayValue = value;
        }
    }
    if (children) displayValue = children;

    if (isBadge && typeof displayValue === 'string') {
        displayValue = <Badge variant={badgeVariant || 'default'}>{displayValue}</Badge>
    }


    return (
        <div className="flex items-start space-x-3">
            <Icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <div className="font-medium text-foreground">{displayValue}</div>
            </div>
        </div>
    );
  };


  if (isFetchingProduct) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (productNotFound) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-12 pt-6 text-center">
         <div className="flex items-center justify-start my-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
            </Button>
          </div>
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl text-destructive">Product Not Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p>The product you are trying to view (ID: {productId}) could not be found.</p>
            </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!productData) {
    return <p>No product data available.</p>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
       <div className="flex items-center justify-between mt-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
             <Link href={`/admin/products/edit/${productData.id}`}>
                <Edit className="mr-2 h-4 w-4" /> Edit Product
             </Link>
        </Button>
      </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="shadow-lg md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Package className="w-7 h-7 mr-3 text-primary" />
            {productData.name}
          </CardTitle>
          <CardDescription>Product ID (SKU): {productData.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="aspect-[16/9] relative w-full rounded-md overflow-hidden mb-4 border bg-muted">
                 <Image
                    src={productData.imageUrl}
                    alt={productData.name}
                    fill
                    className="object-contain" // Use contain to see full image, cover might crop
                     data-ai-hint={productData.category === 'Organic Foods' && productData.name.toLowerCase().includes('apple') ? 'fruit organic' : 
                                  productData.category === 'Supplements' && productData.name.toLowerCase().includes('vitamin') ? 'supplement pill' :
                                  productData.category === 'Wellness Items' ? 'fitness yoga' :
                                  productData.category === 'Supplements' && productData.name.toLowerCase().includes('protein') ? 'supplement powder' :
                                  productData.category === 'Organic Foods' && productData.name.toLowerCase().includes('tea') ? 'tea herb' :
                                  'product item'}
                  />
            </div>
            <DetailItem icon={Info} label="Description" value={productData.description} />
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <DetailItem icon={Tag} label="Category" value={productData.category} isBadge />
                <DetailItem icon={Users} label="Supplier" value={supplierName || (productData.supplierId ? "Loading..." : "None")} />
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <DetailItem icon={DollarSign} label="Price">
                   <div className="flex items-baseline gap-2">
                    <p className="text-lg font-bold text-primary">
                        ${(productData.salePrice ?? productData.price).toFixed(2)}
                    </p>
                    {productData.salePrice && (
                        <p className="text-md text-muted-foreground line-through">
                        ${productData.price.toFixed(2)}
                        </p>
                    )}
                    </div>
                </DetailItem>
                <DetailItem icon={BarChart3} label="Stock">
                    <span>{productData.stock} units</span>
                    {productData.optimumStock !== null && productData.optimumStock !== undefined && (
                        <span className="text-xs text-muted-foreground ml-2">(Optimum: {productData.optimumStock})</span>
                    )}
                </DetailItem>
            </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg md:col-span-1 h-fit sticky top-20">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <MessageSquare className="w-6 h-6 mr-2 text-primary" />
            Promote Product
          </CardTitle>
        </CardHeader>
        <CardContent>
           {isGeneratingPromotion && <div className="flex items-center justify-center p-4"><Loader2 className="h-6 w-6 animate-spin mr-2"/>Generating...</div>}
           {aiPromotionError && <p className="text-destructive text-sm">{aiPromotionError}</p>}
           {aiPromotionPost && !isGeneratingPromotion && (
            <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded-md border">
                <h4 className="font-semibold text-foreground mb-2">Generated Social Media Post:</h4>
                {aiPromotionPost}
            </div>
           )}
           {!isGeneratingPromotion && !aiPromotionPost && !aiPromotionError && <p className="text-sm text-muted-foreground">Click the button to generate an AI-powered promotional post.</p>}
           <Button 
            onClick={handleGeneratePromotion} 
            disabled={isGeneratingPromotion || !productData} 
            className="w-full mt-4"
           >
            {isGeneratingPromotion ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <Brain className="h-4 w-4 mr-2"/>}
            Generate Promotion
           </Button> 
        </CardContent>
      </Card>
    </div>

    <Card className="shadow-lg mt-6">
        <CardHeader>
            <CardTitle className="flex items-center text-xl">
                <ShoppingCart className="w-6 h-6 mr-3 text-primary" />
                Simulated Sales History
            </CardTitle>
            <CardDescription>
                Recent simulated transactions involving {productData.name}.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoadingSalesHistory ? (
                 <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-3 text-md text-muted-foreground">Loading sales history...</p>
                </div>
            ) : salesHistory.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Qty Sold</TableHead>
                        <TableHead className="text-right">Sale Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {salesHistory.map((sale) => (
                        <TableRow key={sale.transactionId + productData.id}>
                            <TableCell className="font-medium">{sale.transactionId}</TableCell>
                            <TableCell>{sale.customerName || 'Walk-in'}</TableCell>
                            <TableCell>{format(new Date(sale.date), 'PPP p')}</TableCell>
                            <TableCell className="text-right">{sale.quantitySold}</TableCell>
                            <TableCell className="text-right">${sale.saleAmount.toFixed(2)}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    <TableCaption>
                        Showing last {salesHistory.length} simulated transaction(s) for this product.
                    </TableCaption>
                </Table>
            ) : (
                 <p className="text-muted-foreground text-center py-4">No simulated sales history found for this product.</p>
            )}
        </CardContent>
    </Card>
    </div>
  );
}
