
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/types';
import { fetchAllProducts } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, ListChecks, Pencil, Trash2, Loader2, Eye } from "lucide-react";

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const fetchedProducts = await fetchAllProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to load products:", error);
        // TODO: Add user-friendly error display, e.g., toast
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center">
            <ListChecks className="w-8 h-8 mr-3 text-primary" />
            Product Management
          </h2>
          <p className="text-muted-foreground">
            View, add, edit, and manage your store's products.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>
            A list of all products in your store. Click on a Product ID to view details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="ml-3 text-lg text-muted-foreground">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p>No products found.</p>
              <p className="text-sm">Try adding some products first!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">SKU/ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-center w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                       <Button variant="link" asChild className="p-0 h-auto text-primary hover:underline">
                        <Link href={`/admin/products/view/${product.id}`}>
                          {product.id}
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {product.salePrice ? (
                        <>
                          <span className="text-destructive">{formatPrice(product.salePrice)}</span>
                          <span className="line-through text-muted-foreground ml-1 text-xs">{formatPrice(product.price)}</span>
                        </>
                      ) : (
                        formatPrice(product.price)
                      )}
                    </TableCell>
                    <TableCell className="text-right">{product.stock}</TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button variant="outline" size="sm" title="View Product" asChild>
                        <Link href={`/admin/products/view/${product.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" title="Edit Product" asChild>
                        <Link href={`/admin/products/edit/${product.id}`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => console.log(`Delete ${product.id}`)} title="Delete Product">
                        <Trash2 className="h-4 w-4" />
                         <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>
                {products.length} product(s) listed.
              </TableCaption>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
