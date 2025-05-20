
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Users, ListFilter } from "lucide-react";
import Link from "next/link";

export default function CustomerManagementPage() {
  // Placeholder for customer data and fetching logic
  const customers = []; 
  const isLoading = false;

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
        <Button onClick={() => console.log('Add new customer clicked. TODO: Link to /admin/customers/new')}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            A list of all customers in your store.
          </CardDescription>
          {/* Placeholder for filtering options if needed in the future */}
          {/* 
          <div className="pt-2">
            <Button variant="outline" size="sm">
              <ListFilter className="mr-2 h-4 w-4" />
              Filter Customers
            </Button>
          </div>
          */}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading customers...</p>
          ) : customers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p>No customers found.</p>
              <p className="text-sm">Try adding some customers first!</p>
            </div>
          ) : (
            <div>
              {/* Customer table/list will go here */}
              <p className="text-muted-foreground">Customer listing will be implemented here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
