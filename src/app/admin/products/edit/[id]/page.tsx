
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';

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
import { ArrowLeft, Pencil, Loader2 } from 'lucide-react';
import { fetchProductById } from '@/lib/api';
import type { Product } from '@/types';

const productCategories = ["Supplements", "Organic Foods", "Wellness Items", "Beverages", "Snacks"] as const;

const productFormSchema = z.object({
  id: z.string().min(1, "SKU/ID is required."),
  name: z.string().min(3, "Product name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  category: z.enum(productCategories, { required_error: "Category is required."}),
  price: z.coerce.number({invalid_type_error: "Price must be a number."}).positive("Price must be positive."),
  salePrice: z.coerce.number({invalid_type_error: "Sale price must be a number."}).nonnegative("Sale price cannot be negative.").optional().nullable(),
  stock: z.coerce.number({invalid_type_error: "Stock must be a number."}).int("Stock must be a whole number.").min(0, "Stock cannot be negative."),
  imageUrl: z.string().url({ message: "Please enter a valid URL for the image." }).min(1, "Image URL is required."),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const productId = params.id as string;

  const [isFetchingProduct, setIsFetchingProduct] = useState(true);
  const [productNotFound, setProductNotFound] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { // Initial empty defaults, will be reset
      id: '',
      name: '',
      description: '',
      category: undefined, 
      price: undefined,
      salePrice: null,
      stock: undefined,
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (productId) {
      const loadProduct = async () => {
        setIsFetchingProduct(true);
        setProductNotFound(false);
        try {
          const product = await fetchProductById(productId);
          if (product) {
            const formData: ProductFormValues = {
                id: product.id,
                name: product.name,
                description: product.description,
                category: product.category as ProductFormValues['category'], // Ensure category from Product is compatible
                price: product.price,
                salePrice: product.salePrice ?? null,
                stock: product.stock,
                imageUrl: product.imageUrl,
            };
            form.reset(formData);
          } else {
            setProductNotFound(true);
            toast({
              title: "Error",
              description: `Product with ID ${productId} not found.`,
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Failed to load product:", error);
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
      loadProduct();
    } else {
        setIsFetchingProduct(false);
        setProductNotFound(true); // No ID, no product to edit
         toast({
            title: "Error",
            description: "Product ID is missing.",
            variant: "destructive",
        });
    }
  }, [productId, form, toast]);

  async function onSubmit(data: ProductFormValues) {
    // TODO: Implement actual product update logic (e.g., API call to update product)
    console.log('Updated product data submitted:', data);
    toast({
      title: "Product Updated (Simulated)",
      description: (
        <div className="mt-2 w-[340px] rounded-md bg-muted p-4">
          <p className="text-sm text-foreground">The following product data was prepared for update:</p>
          <pre className="mt-1 text-xs">
            <code className="text-foreground">{JSON.stringify(data, null, 2)}</code>
          </pre>
        </div>
      ),
      variant: "default",
    });
    // router.push('/admin/products'); // Optionally redirect
  }

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
                <p>The product you are trying to edit (ID: {productId}) could not be found.</p>
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
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Pencil className="w-7 h-7 mr-3 text-primary" />
            Edit Product
          </CardTitle>
          <CardDescription>Update the details for product: <span className="font-semibold">{form.getValues('name') || `ID: ${productId}`}</span></CardDescription>
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
                        <Input {...field} readOnly className="bg-muted/50 cursor-not-allowed" />
                      </FormControl>
                       <FormDescription>Unique identifier for the product (cannot be changed).</FormDescription>
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
                  {form.formState.isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
