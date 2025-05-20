
'use client';

import { useEffect, useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, PlusCircle, Loader2 } from 'lucide-react';
import { fetchAllSuppliers } from '@/lib/api';
import type { Supplier } from '@/types';

const productCategories = ["Supplements", "Organic Foods", "Wellness Items", "Beverages", "Snacks"] as const;
const NO_SUPPLIER_VALUE = "___NO_SUPPLIER_SELECTED___";
const NO_SUPPLIERS_AVAILABLE_VALUE = "___NO_SUPPLIERS_AVAILABLE___";


const productFormSchema = z.object({
  id: z.string().min(1, "SKU/ID is required."),
  name: z.string().min(3, "Product name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  category: z.enum(productCategories, { required_error: "Category is required."}),
  supplierId: z.string().optional().nullable(),
  price: z.coerce.number({invalid_type_error: "Price must be a number."}).positive("Price must be positive."),
  salePrice: z.coerce.number({invalid_type_error: "Sale price must be a number."}).nonnegative("Sale price cannot be negative.").optional().nullable(),
  stock: z.coerce.number({invalid_type_error: "Stock must be a number."}).int("Stock must be a whole number.").min(0, "Stock cannot be negative."),
  optimumStock: z.coerce.number({invalid_type_error: "Optimum stock must be a number."}).int("Optimum stock must be a whole number.").min(0, "Optimum stock cannot be negative.").optional().nullable(),
  imageUrl: z.string().url({ message: "Please enter a valid URL for the image." }).min(1, "Image URL is required."),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export default function AddNewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(true);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      id: '',
      name: '',
      description: '',
      category: undefined,
      supplierId: NO_SUPPLIER_VALUE, // Default to "None" selected
      price: undefined,
      salePrice: null,
      stock: undefined,
      optimumStock: null,
      imageUrl: '',
    },
  });

  useEffect(() => {
    async function loadSuppliers() {
      setIsLoadingSuppliers(true);
      try {
        const fetchedSuppliers = await fetchAllSuppliers();
        setSuppliers(fetchedSuppliers);
      } catch (error) {
        console.error("Failed to load suppliers:", error);
        toast({
          title: "Error",
          description: "Could not load suppliers for selection.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingSuppliers(false);
      }
    }
    loadSuppliers();
  }, [toast]);

  async function onSubmit(data: ProductFormValues) {
    // If supplierId is our sentinel for "None", convert it back to null for actual data processing
    const processedData = {
      ...data,
      supplierId: data.supplierId === NO_SUPPLIER_VALUE ? null : data.supplierId,
    };
    console.log('Product data submitted:', processedData);
    toast({
      title: "Product Submitted (Simulated)",
      description: (
        <div className="mt-2 w-[340px] rounded-md bg-muted p-4">
          <p className="text-sm text-foreground">The following product data was prepared:</p>
          <pre className="mt-1 text-xs">
            <code className="text-foreground">{JSON.stringify(processedData, null, 2)}</code>
          </pre>
        </div>
      ),
      variant: "default",
    });
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
       <div className="flex items-center justify-start mt-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <PlusCircle className="w-7 h-7 mr-3 text-primary" />
            Add New Product
          </CardTitle>
          <CardDescription>Fill in the details below to add a new product to the store catalog.</CardDescription>
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
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Organic Vitamin D3 Capsules" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU / Product ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., HS007VITA" {...field} />
                      </FormControl>
                       <FormDescription>Unique identifier for the product.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed description of the product, its benefits, and ingredients if applicable."
                        className="resize-y min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === NO_SUPPLIER_VALUE ? null : value)}
                        value={field.value === null || field.value === undefined ? NO_SUPPLIER_VALUE : field.value}
                        disabled={isLoadingSuppliers}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isLoadingSuppliers ? "Loading suppliers..." : "Select a supplier"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingSuppliers ? (
                            <div className="flex items-center justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading...
                            </div>
                          ) : suppliers.length === 0 ? (
                             <SelectItem value={NO_SUPPLIERS_AVAILABLE_VALUE} disabled>No suppliers available</SelectItem>
                          ) : (
                            <>
                              <SelectItem value={NO_SUPPLIER_VALUE}><em>None</em></SelectItem>
                              {suppliers.map(supplier => (
                                <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
                              ))}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {suppliers.length > 0 ? "Choose the supplier for this product." : isLoadingSuppliers ? "" :
                        <span>No suppliers found. <Link href="/admin/suppliers/new" className="text-primary hover:underline">Add a supplier?</Link></span>}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                 <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 100"
                          {...field}
                          onChange={event => field.onChange(event.target.value === '' ? undefined : +event.target.value)}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="optimumStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Optimum Stock <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 150"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regular Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="e.g., 19.99"
                          {...field}
                          onChange={event => field.onChange(event.target.value === '' ? undefined : +event.target.value)}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sale Price ($) <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="e.g., 15.99"
                          {...field}
                          onChange={event => field.onChange(event.target.value === '' ? null : +event.target.value)}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormDescription>Leave blank if the product is not on sale.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://placehold.co/600x400.png" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a direct link to the product image. For placeholders, you can use sites like
                      <Link href="https://placehold.co" target="_blank" className="text-primary hover:underline ml-1">placehold.co</Link>.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid && form.formState.isSubmitted}>
                  {form.formState.isSubmitting ? 'Adding Product...' : 'Add Product'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
