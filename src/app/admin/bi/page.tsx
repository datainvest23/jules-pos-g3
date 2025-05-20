
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { BarChartBig, Users, TrendingUp, ShoppingCart, Brain, Loader2, AlertTriangle as AlertTriangleIcon } from "lucide-react"; // Renamed AlertTriangle to avoid conflict
import { fetchAllCustomers, fetchAllProducts } from '@/lib/api';
import type { Customer, Product, TransactionSummary, SuggestPromotionalProductInput, SuggestPromotionalProductOutput } from '@/types';
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval, parseISO } from 'date-fns';
import Link from 'next/link';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

import { suggestPromotionalProduct } from '@/ai/flows/suggest-promotional-product-flow';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


interface DailySale {
  date: string; // YYYY-MM-DD
  total: number;
}

interface TopCustomer extends Customer {
  totalSpent: number;
}

export default function SalesIntelligencePage() {
  const [dailySales, setDailySales] = useState<DailySale[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorData, setErrorData] = useState<string | null>(null);

  const [suggestedPromotion, setSuggestedPromotion] = useState<SuggestPromotionalProductOutput | null>(null);
  const [isLoadingPromotion, setIsLoadingPromotion] = useState(false);
  const [errorPromotion, setErrorPromotion] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoadingData(true);
      setErrorData(null);
      try {
        const [customers, products] = await Promise.all([
          fetchAllCustomers(),
          fetchAllProducts()
        ]);
        setAllProducts(products);

        // Calculate Daily Sales for the last 7 days
        const today = new Date();
        const last7DaysInterval = {
          start: subDays(today, 6),
          end: today
        };
        const dateRange = eachDayOfInterval(last7DaysInterval);
        
        const salesByDay: Record<string, number> = {};
        dateRange.forEach(date => {
          salesByDay[format(date, 'yyyy-MM-dd')] = 0;
        });

        customers.forEach(customer => {
          (customer.purchaseHistory || []).forEach(transaction => {
            const transactionDateStr = format(new Date(transaction.timestamp), 'yyyy-MM-dd');
            if (salesByDay[transactionDateStr] !== undefined) {
              salesByDay[transactionDateStr] += transaction.totalAmount;
            }
          });
        });
        
        const formattedDailySales = Object.entries(salesByDay)
          .map(([date, total]) => ({ date, total, shortDate: format(parseISO(date), 'MMM d') }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setDailySales(formattedDailySales as any); 


        // Calculate Top Customers
        const customerSpending = customers.map(customer => {
          const totalSpent = (customer.purchaseHistory || []).reduce((sum, t) => sum + t.totalAmount, 0);
          return { ...customer, totalSpent };
        });
        const sortedTopCustomers = customerSpending.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
        setTopCustomers(sortedTopCustomers);

      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setErrorData("Could not load dashboard data. Please try again later.");
      } finally {
        setIsLoadingData(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleSuggestPromotion = async () => {
    if (allProducts.length === 0) {
      toast({ title: "No Products", description: "Cannot generate promotion, no product data available.", variant: "destructive" });
      return;
    }
    setIsLoadingPromotion(true);
    setErrorPromotion(null);
    setSuggestedPromotion(null);
    try {
      const productSummaries = allProducts.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        salePrice: p.salePrice,
        stock: p.stock,
        optimumStock: p.optimumStock,
      }));
      const input: SuggestPromotionalProductInput = { products: productSummaries };
      const suggestion = await suggestPromotionalProduct(input);
      setSuggestedPromotion(suggestion);
    } catch (err) {
      console.error("Failed to suggest promotion:", err);
      let errorMessage = "Could not generate promotion suggestion.";
      if (err instanceof Error) {
        errorMessage = err.message.includes("blocked") ? "Content generation blocked by safety filters." : err.message;
      }
      setErrorPromotion(errorMessage);
      toast({ title: "Promotion Suggestion Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoadingPromotion(false);
    }
  };
  
  const chartConfig = {
    sales: {
      label: "Sales ($)",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;


  if (isLoadingData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading Sales Intelligence data...</p>
      </div>
    );
  }

  if (errorData) {
    return (
      <Card className="bg-destructive/10 border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertTriangleIcon className="w-6 h-6 mr-2" />
            Error Loading Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground">{errorData}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight flex items-center">
          <BarChartBig className="w-8 h-8 mr-3 text-primary" />
          Sales Intelligence Dashboard
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Sales Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center"><TrendingUp className="w-6 h-6 mr-2 text-primary"/>Daily Sales (Last 7 Days)</CardTitle>
            <CardDescription>Total sales amount for each day in the past week.</CardDescription>
          </CardHeader>
          <CardContent>
            {dailySales.length > 0 ? (
               <ChartContainer config={chartConfig} className="min-h-[200px] w-full aspect-auto">
                <BarChart accessibilityLayer data={dailySales.map(ds => ({...ds, date: format(parseISO(ds.date), 'MMM d')}))} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                   <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8} 
                    tickFormatter={(value) => value.slice(0, 6)} 
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <RechartsTooltip 
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />} 
                  />
                  <Bar dataKey="total" fill="var(--color-sales)" radius={4} />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground text-center py-4">No sales data available for the last 7 days.</p>
            )}
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Users className="w-6 h-6 mr-2 text-primary"/>Top Customers</CardTitle>
            <CardDescription>Customers with the highest total spending.</CardDescription>
          </CardHeader>
          <CardContent>
            {topCustomers.length > 0 ? (
              <ul className="space-y-3">
                {topCustomers.map(customer => (
                  <li key={customer.id} className="flex justify-between items-center p-2 border rounded-md hover:bg-muted/50">
                    <div>
                      <Link href={`/admin/customers/view/${customer.id}`} className="font-medium text-primary hover:underline">{customer.name}</Link>
                      <p className="text-xs text-muted-foreground">{customer.email}</p>
                    </div>
                    <span className="font-semibold text-foreground">${customer.totalSpent.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">No customer spending data available.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Product Promotion Suggestion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Brain className="w-6 h-6 mr-2 text-primary"/>AI Promotion Suggestion</CardTitle>
          <CardDescription>Get an AI-powered suggestion for which product to promote next.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSuggestPromotion} disabled={isLoadingPromotion || allProducts.length === 0}>
            {isLoadingPromotion ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ShoppingCart className="mr-2 h-4 w-4"/>}
            Suggest Product to Promote
          </Button>
          {isLoadingPromotion && (
            <div className="mt-4 flex items-center text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin"/> Generating suggestion...
            </div>
          )}
          {errorPromotion && !isLoadingPromotion && (
             <Alert variant="destructive" className="mt-4">
                <AlertTriangleIcon className="h-4 w-4"/>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorPromotion}</AlertDescription>
            </Alert>
          )}
          {suggestedPromotion && !isLoadingPromotion && (
            <div className="mt-4 p-4 border rounded-md bg-muted/50">
              <h4 className="font-semibold text-lg text-primary">{suggestedPromotion.productName}</h4>
              <p className="text-sm text-muted-foreground mb-1">Product ID: {suggestedPromotion.productId}</p>
              <p className="text-foreground"><strong className="text-primary">Reason:</strong> {suggestedPromotion.reason}</p>
              <Button variant="outline" size="sm" asChild className="mt-3">
                <Link href={`/admin/products/view/${suggestedPromotion.productId}`}>View Product Details</Link>
              </Button>
            </div>
          )}
           {allProducts.length === 0 && !isLoadingData && (
             <p className="text-sm text-muted-foreground mt-2">No product data available to make suggestions.</p>
           )}
        </CardContent>
      </Card>

    </div>
  );
}
