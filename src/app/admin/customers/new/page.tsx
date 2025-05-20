
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { ArrowLeft, UserPlus, CalendarIcon, Star, DollarSign } from 'lucide-react';

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

// Helper function to generate a unique ID (for mock purposes)
const generateCustomerId = () => `CUST-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;


export default function AddNewCustomerPage() {
  const router = useRouter();
  const { toast } = useToast();

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

  async function onSubmit(data: CustomerFormValues) {
    const customerId = generateCustomerId();
    const newCustomerData = {
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
    };

    // TODO: Implement actual customer creation logic (e.g., API call to save customer)
    console.log('Customer data submitted:', newCustomerData);
    toast({
      title: "Customer Submitted (Simulated)",
      description: (
        <div className="mt-2 w-[340px] rounded-md bg-muted p-4">
          <p className="text-sm text-foreground">The following customer data was prepared:</p>
          <pre className="mt-1 text-xs">
            <code className="text-foreground">{JSON.stringify(newCustomerData, null, 2)}</code>
          </pre>
        </div>
      ),
      variant: "default",
    });
    // Potentially reset form or redirect:
    // form.reset();
    // router.push('/admin/customers'); 
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
            <UserPlus className="w-7 h-7 mr-3 text-primary" />
            Add New Customer
          </CardTitle>
          <CardDescription>Fill in the details below to add a new customer.</CardDescription>
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
                                format(field.value, "PPP")
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
                            selected={field.value}
                            onSelect={field.onChange}
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
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm h-10">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="flex items-center">
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
                  {form.formState.isSubmitting ? 'Adding Customer...' : 'Add Customer'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
