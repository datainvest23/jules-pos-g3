
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Truck } from 'lucide-react';

const supplierFormSchema = z.object({
  name: z.string().min(2, "Supplier name must be at least 2 characters.").max(100),
  contactPerson: z.string().max(100).optional().nullable(),
  email: z.string().email("Invalid email address.").max(100),
  phone: z.string().max(20).optional().nullable(),
  addressStreet: z.string().max(100).optional().nullable(),
  addressCity: z.string().max(50).optional().nullable(),
  addressState: z.string().max(50).optional().nullable(),
  addressZip: z.string().max(20).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export type SupplierFormValues = z.infer<typeof supplierFormSchema>;

// Helper function to generate a unique ID (for mock purposes)
const generateSupplierId = () => `SUPP-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

export default function AddNewSupplierPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: '',
      contactPerson: null,
      email: '',
      phone: null,
      addressStreet: null,
      addressCity: null,
      addressState: null,
      addressZip: null,
      notes: null,
    },
  });

  async function onSubmit(data: SupplierFormValues) {
    const supplierId = generateSupplierId();
    const newSupplierData = {
      id: supplierId,
      name: data.name,
      contactPerson: data.contactPerson,
      email: data.email,
      phone: data.phone,
      address: (data.addressStreet && data.addressCity && data.addressState && data.addressZip) ? {
        street: data.addressStreet,
        city: data.addressCity,
        state: data.addressState,
        zip: data.addressZip,
      } : null,
      notes: data.notes,
    };

    // TODO: Implement actual supplier creation logic (e.g., API call)
    console.log('Supplier data submitted:', newSupplierData);
    toast({
      title: "Supplier Submitted (Simulated)",
      description: (
        <div className="mt-2 w-[340px] rounded-md bg-muted p-4">
          <p className="text-sm text-foreground">The following supplier data was prepared:</p>
          <pre className="mt-1 text-xs">
            <code className="text-foreground">{JSON.stringify(newSupplierData, null, 2)}</code>
          </pre>
        </div>
      ),
      variant: "default",
    });
    // form.reset();
    // router.push('/admin/suppliers'); 
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
       <div className="flex items-center justify-start mt-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/suppliers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Suppliers
          </Link>
        </Button>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Truck className="w-7 h-7 mr-3 text-primary" />
            Add New Supplier
          </CardTitle>
          <CardDescription>Fill in the details below to add a new supplier.</CardDescription>
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
                      <FormLabel>Supplier Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., HealthGoods Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Smith" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                 <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="e.g., contact@healthgoods.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="e.g., (555) 987-6543" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
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
                            <Input placeholder="e.g., 456 Supply Rd" {...field} value={field.value ?? ''} />
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
                              <Input placeholder="e.g., Metropolis" {...field} value={field.value ?? ''} />
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
                              <Input placeholder="e.g., NY" {...field} value={field.value ?? ''} />
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
                              <Input placeholder="e.g., 10001" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                </CardContent>
              </Card>

              <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any additional notes about the supplier (e.g., payment terms, delivery schedule)."
                          className="resize-y min-h-[100px]"
                          {...field}
                           value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => router.push('/admin/suppliers')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid && form.formState.isSubmitted}>
                  {form.formState.isSubmitting ? 'Adding Supplier...' : 'Add Supplier'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
