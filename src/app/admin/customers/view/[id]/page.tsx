
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from "date-fns";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, CalendarIcon, Loader2, Receipt, Eye, Info, Brain, Building, Mail, Phone, MapPin, Pencil } from 'lucide-react';
import { fetchCustomerById, fetchAllProducts } from '@/lib/api';
import type { Customer, TransactionSummary, ReceiptData, Product, CartItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import ReceiptDialog from '@/components/ReceiptDialog';
import { Separator } from '@/components/ui/separator';

// AI Profile section imports
import { generateCustomerProfile, type GenerateCustomerProfileInput } from '@/ai/flows/generate-customer-profile-flow';


export default function ViewCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const customerId = params.id as string;

  const [isFetchingCustomer, setIsFetchingCustomer] = useState(true);
  const [customerNotFound, setCustomerNotFound] = useState(false);
  const [customerData, setCustomerData] = useState<Customer | null>(null);
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isViewReceiptDialogOpen, setIsViewReceiptDialogOpen] = useState(false);
  const [selectedReceiptForView, setSelectedReceiptForView] = useState<ReceiptData | null>(null);

  // AI Profile State
  const [isGeneratingAiProfile, setIsGeneratingAiProfile] = useState(false);
  const [aiProfile, setAiProfile] = useState<string | null>(null);
  const [aiProfileError, setAiProfileError] = useState<string | null>(null);


  useEffect(() => {
    // Fetch all products to be used for mocking receipt items
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchAllProducts();
        setAllProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products for receipt mocking:", error);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (customerId) {
      const loadCustomer = async () => {
        setIsFetchingCustomer(true);
        setCustomerNotFound(false);
        setAiProfile(null); // Reset AI profile when customer changes
        setAiProfileError(null);
        try {
          const customer = await fetchCustomerById(customerId);
          if (customer) {
            setCustomerData(customer);
          } else {
            setCustomerNotFound(true);
            toast({
              title: "Error",
              description: `Customer with ID ${customerId} not found.`,
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Failed to load customer:", error);
          toast({
            title: "Error",
            description: "Failed to load customer data. Please try again.",
            variant: "destructive",
          });
          setCustomerNotFound(true);
        } finally {
          setIsFetchingCustomer(false);
        }
      };
      loadCustomer();
    } else {
        setIsFetchingCustomer(false);
        setCustomerNotFound(true);
         toast({
            title: "Error",
            description: "Customer ID is missing.",
            variant: "destructive",
        });
    }
  }, [customerId, toast]);

  const handleViewReceipt = (transaction: TransactionSummary) => {
    if (allProducts.length === 0) {
        toast({ title: "Cannot Show Receipt", description: "Product data not available to generate receipt details.", variant: "destructive"});
        return;
    }
    const mockCartItems: CartItem[] = [];
    let simulatedTotal = 0;
    const numItems = Math.floor(Math.random() * 2) + 1; 

    for (let i = 0; i < numItems && mockCartItems.length < allProducts.length; i++) {
        const randomProductIndex = Math.floor(Math.random() * allProducts.length);
        const product = allProducts[randomProductIndex];
        if (mockCartItems.find(item => item.product.id === product.id)) {
          if (i > 0) i--; 
          continue;
        }
        const quantity = 1; 
        const price = product.salePrice ?? product.price;
        
        if (simulatedTotal + price <= transaction.totalAmount * 1.5 || mockCartItems.length === 0) {
             mockCartItems.push({ product, quantity });
             simulatedTotal += price * quantity;
        } else {
            break; 
        }
    }
    if (mockCartItems.length === 0 && allProducts.length > 0) {
        mockCartItems.push({ product: allProducts[0], quantity: 1});
    }

    const receipt: ReceiptData = {
      items: mockCartItems,
      transactionId: transaction.transactionId,
      timestamp: new Date(transaction.timestamp),
      customerId: customerData?.id,
      customerName: customerData?.name,
      totalAmount: transaction.totalAmount,
    };
    setSelectedReceiptForView(receipt);
    setIsViewReceiptDialogOpen(true);
  };

  const handleGenerateAiProfile = async () => {
    if (!customerData) return;
    setIsGeneratingAiProfile(true);
    setAiProfile(null);
    setAiProfileError(null);
    try {
      const input: GenerateCustomerProfileInput = {
        customerId: customerData.id,
        customerSince: customerData.customerSince.toISOString(),
        purchaseHistory: (customerData.purchaseHistory || []).map(txn => ({
            ...txn,
            timestamp: txn.timestamp.toISOString(),
        })),
      };
      const result = await generateCustomerProfile(input);
      setAiProfile(result.profile);
    } catch (error) {
      console.error("Failed to generate AI profile:", error);
      let errorMessage = "Could not generate AI customer profile. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message.includes("blocked") ? "Content generation blocked by safety filters. Please review input or try a different approach." : error.message;
      }
      setAiProfileError(errorMessage);
      toast({ title: "AI Profile Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsGeneratingAiProfile(false);
    }
  };


  if (isFetchingCustomer) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading customer details...</p>
      </div>
    );
  }

  if (customerNotFound) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-12 pt-6 text-center">
         <div className="flex items-center justify-start my-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/customers">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Customers
              </Link>
            </Button>
          </div>
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl text-destructive">Customer Not Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p>The customer you are trying to view (ID: {customerId}) could not be found.</p>
                <p>It might have been deleted or the ID is incorrect.</p>
            </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!customerData) { // Should be covered by above, but good for safety
    return <p>No customer data available.</p>;
  }

  const DetailItem: React.FC<{ icon: React.ElementType, label: string, value?: string | null | Date }> = ({ icon: Icon, label, value }) => {
    let displayValue = 'N/A';
    if (value instanceof Date) {
        displayValue = format(value, "PPP");
    } else if (value) {
        displayValue = value;
    }

    return (
        <div className="flex items-start space-x-3">
            <Icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-medium text-foreground">{displayValue}</p>
            </div>
        </div>
    );
  };


  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
       <div className="flex items-center justify-between mt-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
             <Link href={`/admin/customers/edit/${customerData.id}`}>
                <Pencil className="mr-2 h-4 w-4" /> Edit Customer
             </Link>
        </Button>
      </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="shadow-lg md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <User className="w-7 h-7 mr-3 text-primary" />
            {customerData.name}
          </CardTitle>
          <CardDescription>Customer ID: {customerData.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <DetailItem icon={Mail} label="Email Address" value={customerData.email} />
                <DetailItem icon={Phone} label="Phone Number" value={customerData.phone} />
            </div>
            <Separator />
             <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center"><MapPin className="w-5 h-5 mr-2 text-primary"/> Address</h3>
                {customerData.address ? (
                    <div className="space-y-4">
                        <DetailItem icon={Building} label="Street Address" value={customerData.address.street} />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                           <DetailItem icon={Info} label="City" value={customerData.address.city} />
                           <DetailItem icon={Info} label="State/Province" value={customerData.address.state} />
                           <DetailItem icon={Info} label="ZIP/Postal Code" value={customerData.address.zip} />
                        </div>
                    </div>
                ) : (
                    <p className="text-muted-foreground">No address on file.</p>
                )}
            </div>
            <Separator />
            <DetailItem icon={CalendarIcon} label="Customer Since" value={customerData.customerSince} />
        </CardContent>
      </Card>
      
      <Card className="shadow-lg md:col-span-1 h-fit">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Brain className="w-6 h-6 mr-2 text-primary" />
            AI Customer Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
           {isGeneratingAiProfile && <div className="flex items-center justify-center p-4"><Loader2 className="h-6 w-6 animate-spin mr-2"/>Generating...</div>}
           {aiProfileError && <p className="text-destructive text-sm">{aiProfileError}</p>}
           {aiProfile && !isGeneratingAiProfile && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{aiProfile}</p>}
           {!isGeneratingAiProfile && !aiProfile && !aiProfileError && <p className="text-sm text-muted-foreground">Click the button to generate an AI-powered profile.</p>}
           <Button 
            onClick={handleGenerateAiProfile} 
            disabled={isGeneratingAiProfile || !customerData} 
            className="w-full mt-4"
           >
            {isGeneratingAiProfile ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <Brain className="h-4 w-4 mr-2"/>}
            Generate AI Profile
           </Button> 
        </CardContent>
      </Card>
    </div>


      {customerData.purchaseHistory && customerData.purchaseHistory.length > 0 && (
        <Card className="shadow-lg mt-6">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Receipt className="w-6 h-6 mr-3 text-primary" />
              Purchase History
            </CardTitle>
            <CardDescription>
              List of transactions made by {customerData.name}. Click on a Transaction ID to view receipt.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerData.purchaseHistory.map((transaction) => (
                  <TableRow key={transaction.transactionId}>
                    <TableCell className="font-medium">
                      <Button 
                        variant="link" 
                        onClick={() => handleViewReceipt(transaction)}
                        className="p-0 h-auto text-primary hover:underline"
                      >
                        {transaction.transactionId}
                      </Button>
                    </TableCell>
                    <TableCell>{format(new Date(transaction.timestamp), 'PPP p')}</TableCell>
                    <TableCell className="text-right">${transaction.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewReceipt(transaction)}
                        title="View Receipt"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Receipt</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>
                {customerData.purchaseHistory.length} transaction(s) found.
              </TableCaption>
            </Table>
          </CardContent>
        </Card>
      )}

      {(!customerData.purchaseHistory || customerData.purchaseHistory.length === 0) && (
         <Card className="shadow-lg mt-6">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Receipt className="w-6 h-6 mr-3 text-primary" />
              Purchase History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-4">No purchase history found for this customer.</p>
          </CardContent>
        </Card>
      )}

      <ReceiptDialog
        isOpen={isViewReceiptDialogOpen}
        onClose={() => {
            setIsViewReceiptDialogOpen(false);
            setSelectedReceiptForView(null);
        }}
        receiptData={selectedReceiptForView}
      />
    </div>
  );
}

