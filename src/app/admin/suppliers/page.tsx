
'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Truck, Loader2 } from "lucide-react";
// import { useEffect, useState } from 'react';
// import type { Supplier } from '@/types';
// import { fetchAllSuppliers } from '@/lib/api'; // We will create this later
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
// import { Pencil, Trash2 } from "lucide-react";


export default function SupplierManagementPage() {
  // const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   async function loadSuppliers() {
  //     setIsLoading(true);
  //     try {
  //       // const fetchedSuppliers = await fetchAllSuppliers(); // To be implemented
  //       // setSuppliers(fetchedSuppliers);
  //       setSuppliers([]); // Placeholder
  //     } catch (error) {
  //       console.error("Failed to load suppliers:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   loadSuppliers();
  // }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center">
            <Truck className="w-8 h-8 mr-3 text-primary" />
            Supplier Management
          </h2>
          <p className="text-muted-foreground">
            View, add, and manage your product suppliers.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/suppliers/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Supplier
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supplier List</CardTitle>
          <CardDescription>
            A list of all suppliers. (Display to be implemented)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* {isLoading ? (
             <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="ml-3 text-lg text-muted-foreground">Loading suppliers...</p>
            </div>
          ) : suppliers.length === 0 ? ( */}
            <div className="text-center py-10 text-muted-foreground">
              <p>Supplier listing functionality coming soon.</p>
              <p className="text-sm">You can start by adding new suppliers.</p>
            </div>
          {/* ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Supplier ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-center w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.id}</TableCell>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.phone || 'N/A'}</TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => console.log(`Edit ${supplier.id}`)} title="Edit Supplier">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => console.log(`Delete ${supplier.id}`)} title="Delete Supplier">
                        <Trash2 className="h-4 w-4" />
                         <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>
                {suppliers.length} supplier(s) listed.
              </TableCaption>
            </Table>
          )} */}
        </CardContent>
      </Card>
    </div>
  );
}
