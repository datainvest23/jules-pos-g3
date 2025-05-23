
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { format } from "date-fns";

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ArrowLeft, UserCog, CalendarIcon, Loader2, Receipt, Eye, Star, DollarSign } from 'lucide-react';
import { fetchCustomerById, fetchAllProducts } from '@/lib/api'; // Added fetchAllProducts
import type { Customer, TransactionSummary, ReceiptData, Product, CartItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import ReceiptDialog from '@/components/ReceiptDialog'; // Import ReceiptDialog


// Schema can be reused or defined separately if edit has different validation
const customerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100, "Name must be 100 characters or less."),
  email: z.string().email("Invalid email address.").max(100, "Email must be 100 characters or less."),
  phone: z.string().max(20, "Phone number must be 20 characters or less.").optional().nullable(),
  addressStreet: z.string().max(100, "Street address must be 100 characters or less.").optional().nullable(),
  addressCity: z.string().max(50, "City must be 50 characters or less.").optional().nullable(),
  addressState: z.string().max(50, "State must be 50 characters or less.").optional().nullable(),
  addressZip: z.string().max(20, "ZIP code must be 20 characters or less.").optional().nullable(),
  customerSince: z.date({ required_error: "Customer since date is required."}),
  isVip: z.boolean().optional(),
  storeCredit: z.coerce.number({invalid_type_error: "Store credit must be a number."}).nonnegative("Store credit cannot be negative.").optional().nullable(),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

export default function EditCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const customerId = params.id as string;

  const [isFetchingCustomer, setIsFetchingCustomer] = useState(true);
  const [customerNotFound, setCustomerNotFound] = useState(false);
  const [customerData, setCustomerData] = useState<Customer | null>(null);
  
  const [allProducts, setAllProducts] = useState<Product[]>([]); // For mocking receipt items
  const [isViewReceiptDialogOpen, setIsViewReceiptDialogOpen] = useState(false);
  const [selectedReceiptForView, setSelectedReceiptForView] = useState<ReceiptData | null>(null);


  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: { 
      name: '',
      email: '',
      phone: null,
      addressStreet: null,
      addressCity: null,
      addressState: null,
      addressZip: null,
      customerSince: new Date(),
      isVip: false,
      storeCredit: 0,
    },
  });

  useEffect(() => {
    // Fetch all products to be used for mocking receipt items
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchAllProducts();
        setAllProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products for receipt mocking:", error);
        // Not critical for form, so don't show toast
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (customerId) {
      const loadCustomer = async () => {
        setIsFetchingCustomer(true);
        setCustomerNotFound(false);
        try {
          const customer = await fetchCustomerById(customerId);
          if (customer) {
            setCustomerData(customer);
            const formData: CustomerFormValues = {
              name: customer.name,
              email: customer.email,
              phone: customer.phone ?? null,
              addressStreet: customer.address?.street ?? null,
              addressCity: customer.address?.city ?? null,
              addressState: customer.address?.state ?? null,
              addressZip: customer.address?.zip ?? null,
              customerSince: customer.customerSince ? new Date(customer.customerSince) : new Date(),
              isVip: customer.isVip ?? false,
              storeCredit: customer.storeCredit ?? 0,
            };
            form.reset(formData); 
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
  }, [customerId, form, toast]);


  async function onSubmit(data: CustomerFormValues) {
    const updatedCustomerData = {
      id: customerId, 
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: (data.addressStreet && data.addressCity && data.addressState && data.addressZip) ? {
        street: data.addressStreet,
        city: data.addressCity,
        state: data.addressState,
        zip: data.addressZip,
      } : null,
      customerSince: data.customerSince,
      isVip: data.isVip,
      storeCredit: data.storeCredit,
      // purchaseHistory is not part of the form, so it's not included here for update simulation
    };

    console.log('Updated customer data submitted:', updatedCustomerData);
    toast({
      title: "Customer Updated (Simulated)",
      description: (
        <div className="mt-2 w-[340px] rounded-md bg-muted p-4">
          <p className="text-sm text-foreground">The following customer data was prepared for update:</p>
          <pre className="mt-1 text-xs">
            <code className="text-foreground">{JSON.stringify(updatedCustomerData, null, 2)}</code>
          </pre>
        </div>
      ),
      variant: "default",
    });
  }

  const handleViewReceipt = (transaction: TransactionSummary) => {
    if (allProducts.length === 0) {
        toast({ title: "Cannot Show Receipt", description: "Product data not available to generate receipt details.", variant: "destructive"});
        return;
    }

    // Simulate generating cart items for the receipt
    const mockCartItems: CartItem[] = [];
    let simulatedTotal = 0;
    const numItems = Math.floor(Math.random() * 2) + 1; // 1 to 3 items

    for (let i = 0; i < numItems && mockCartItems.length < allProducts.length; i++) {
        const randomProductIndex = Math.floor(Math.random() * allProducts.length);
        const product = allProducts[randomProductIndex];
        // Avoid duplicate products in mock receipt if possible
        if (mockCartItems.find(item => item.product.id === product.id)) {
          if (i > 0) i--; // try again to get a different product
          continue;
        }
        const quantity = 1; // Keep it simple with quantity 1
        const price = product.salePrice ?? product.price;
        
        // Try to not exceed the original totalAmount too much
        if (simulatedTotal + price <= transaction.totalAmount * 1.5 || mockCartItems.length === 0) {
             mockCartItems.push({ product, quantity });
             simulatedTotal += price * quantity;
        } else {
            break; // Stop adding items if it significantly exceeds total
        }
    }
     // If no items could be added (e.g. all products too expensive), add at least one
    if (mockCartItems.length === 0 && allProducts.length > 0) {
        mockCartItems.push({ product: allProducts[0], quantity: 1});
    }


    const receipt: ReceiptData = {
      items: mockCartItems,
      transactionId: transaction.transactionId,
      timestamp: new Date(transaction.timestamp),
      customerId: customerData?.id,
      customerName: customerData?.name,
      totalAmount: transaction.totalAmount, // Use the original total amount
    };
    setSelectedReceiptForView(receipt);
    setIsViewReceiptDialogOpen(true);
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
                <p>The customer you are trying to edit (ID: {customerId}) could not be found.</p>
                <p>It might have been deleted or the ID is incorrect.</p>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
       <div className="flex items-center justify-start mt-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Link>
        </Button>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <UserCog className="w-7 h-7 mr-3 text-primary" />
            Edit Customer
          </CardTitle>
          <CardDescription>Update the details for customer: <span className="font-semibold">{form.getValues('name') || `ID: ${customerId}`}</span></CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="e.g., jane.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="e.g., (555) 123-4567" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerSince"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Customer Since</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP") // Ensure field.value is a Date
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value instanceof Date ? field.value : new Date(field.value)} // Ensure selected is a Date
                            onSelect={(date) => field.onChange(date || new Date())} // Ensure onChange receives a Date
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        The date when the customer first made a purchase or signed up.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Card className="p-4 pt-2 bg-muted/30">
                <CardHeader className="p-2">
                    <CardTitle className="text-lg">Membership Details</CardTitle>
                </CardHeader>
                <CardContent className="p-2 space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                     <FormField
                        control={form.control}
                        name="isVip"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm h-10 bg-background">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="isVip"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel htmlFor="isVip" className="flex items-center cursor-pointer">
                                <Star className="mr-2 h-4 w-4 text-yellow-500" />
                                VIP Customer
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="storeCredit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <DollarSign className="mr-2 h-4 w-4 text-green-600" />
                              Store Credit ($)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="e.g., 10.00"
                                {...field}
                                onChange={event => field.onChange(event.target.value === '' ? null : +event.target.value)}
                                value={field.value ?? ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                   </div>
                </CardContent>
              </Card>
              
              <Card className="p-4 pt-2 bg-muted/30">
                <CardHeader className="p-2">
                    <CardTitle className="text-lg">Address <span className="text-muted-foreground text-sm font-normal">(Optional)</span></CardTitle>
                </CardHeader>
                <CardContent className="p-2 space-y-4">
                    <FormField
                      control={form.control}
                      name="addressStreet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 123 Main St" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                      <FormField
                        control={form.control}
                        name="addressCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Anytown" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="addressState"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State / Province</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., CA" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="addressZip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP / Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 90210" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => router.push('/admin/customers')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid && form.formState.isSubmitted}>
                  {form.formState.isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {customerData && customerData.purchaseHistory && customerData.purchaseHistory.length > 0 && (
        <Card className="shadow-lg mt-8">
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

      {customerData && (!customerData.purchaseHistory || customerData.purchaseHistory.length === 0) && (
         <Card className="shadow-lg mt-8">
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
