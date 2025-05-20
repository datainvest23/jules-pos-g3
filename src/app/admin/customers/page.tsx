
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Customer } from '@/types';
import { fetchAllCustomers } from '@/lib/api';
import { format } from 'date-fns';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { PlusCircle, Users, Pencil, Trash2, Loader2 } from "lucide-react";

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      setIsLoading(true);
      try {
        const fetchedCustomers = await fetchAllCustomers();
        setCustomers(fetchedCustomers);
      } catch (error) {
        console.error("Failed to load customers:", error);
        // TODO: Add user-friendly error display, e.g., toast
      } finally {
        setIsLoading(false);
      }
    }
    loadCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center">
            <Users className="w-8 h-8 mr-3 text-primary" />
            Customer Management
          </h2>
          <p className="text-muted-foreground">
            View, add, and manage your store's customers.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/customers/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Customer
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            A list of all customers in your store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="ml-3 text-lg text-muted-foreground">Loading customers...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p>No customers found.</p>
              <p className="text-sm">Try adding some customers first!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Customer ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Customer Since</TableHead>
                  <TableHead className="text-center w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone || 'N/A'}</TableCell>
                    <TableCell>{format(new Date(customer.customerSince), 'PPP')}</TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => console.log(`Edit ${customer.id}`)} title="Edit Customer">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => console.log(`Delete ${customer.id}`)} title="Delete Customer">
                        <Trash2 className="h-4 w-4" />
                         <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>
                {customers.length} customer(s) listed.
              </TableCaption>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
