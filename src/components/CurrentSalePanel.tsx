
'use client';

import type { Customer } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { UserCircle, Loader2, Users } from 'lucide-react';

interface CurrentSalePanelProps {
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer | null) => void;
  customers: Customer[];
  isLoadingCustomers: boolean;
}

const NO_CUSTOMER_VALUE = '__NO_CUSTOMER__';

export default function CurrentSalePanel({
  selectedCustomer,
  onSelectCustomer,
  customers,
  isLoadingCustomers,
}: CurrentSalePanelProps) {
  const handleCustomerChange = (customerId: string) => {
    if (customerId === NO_CUSTOMER_VALUE) {
      onSelectCustomer(null);
    } else {
      const customer = customers.find((c) => c.id === customerId);
      onSelectCustomer(customer || null);
    }
  };

  return (
    <Card className="shadow-lg rounded-lg mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5 text-primary" />
          Current Sale Details
        </CardTitle>
        <CardDescription>Assign a customer to this sale (optional).</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="customer-select">Assign Customer</Label>
          {isLoadingCustomers ? (
            <div className="flex items-center text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Loading customers...</span>
            </div>
          ) : (
            <Select
              value={selectedCustomer?.id || NO_CUSTOMER_VALUE}
              onValueChange={handleCustomerChange}
              disabled={customers.length === 0 && !isLoadingCustomers}
            >
              <SelectTrigger id="customer-select" className="w-full">
                <SelectValue
                  placeholder={
                    customers.length === 0 && !isLoadingCustomers
                      ? 'No customers available'
                      : 'Select a customer or Walk-in'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_CUSTOMER_VALUE}>
                  <div className="flex items-center">
                    <UserCircle className="mr-2 h-4 w-4 opacity-50" />
                    Walk-in / No Customer
                  </div>
                </SelectItem>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </SelectItem>
                ))}
                 {customers.length === 0 && !isLoadingCustomers && (
                   <div className="p-2 text-sm text-muted-foreground text-center">No customers found. Add one in Admin.</div>
                 )}
              </SelectContent>
            </Select>
          )}
        </div>
        {selectedCustomer && (
          <p className="text-sm text-muted-foreground mt-2">
            Selected: <span className="font-semibold text-primary">{selectedCustomer.name}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
