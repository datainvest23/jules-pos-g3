
'use client';

import type { Customer, CartItem, Product } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserCircle, Loader2, Users, ShoppingCart, XCircle, Trash2, Minus, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';

interface CurrentSalePanelProps {
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer | null) => void;
  customers: Customer[];
  isLoadingCustomers: boolean;
  cartItems: CartItem[];
  onCheckout: () => void;
  onClearCart: () => void;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const NO_CUSTOMER_VALUE = '__NO_CUSTOMER__';

export default function CurrentSalePanel({
  selectedCustomer,
  onSelectCustomer,
  customers,
  isLoadingCustomers,
  cartItems,
  onCheckout,
  onClearCart,
  setCartItems,
}: CurrentSalePanelProps) {
  const { toast } = useToast();

  const handleCustomerChange = (customerId: string) => {
    if (customerId === NO_CUSTOMER_VALUE) {
      onSelectCustomer(null);
    } else {
      const customer = customers.find((c) => c.id === customerId);
      onSelectCustomer(customer || null);
    }
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const productInCart = cartItems.find(item => item.product.id === productId)?.product;
    if (!productInCart) return;

    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
      toast({ title: "Item Removed", description: `${productInCart.name} removed from sale.`});
    } else if (newQuantity > productInCart.stock) {
        toast({
            title: "Stock Limit Exceeded",
            description: `Cannot set quantity for ${productInCart.name} above available stock (${productInCart.stock}).`,
            variant: "destructive",
        });
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItemFromCart = (productId: string) => {
    const productToRemove = cartItems.find(item => item.product.id === productId)?.product.name;
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    if (productToRemove) {
        toast({ title: "Item Removed", description: `${productToRemove} removed from sale.`});
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.salePrice ?? item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  const totalAmount = calculateTotal();

  return (
    <Card className="shadow-lg rounded-lg mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCart className="mr-2 h-6 w-6 text-primary" />
          Current Sale
        </CardTitle>
        <CardDescription>Manage items and customer for this transaction.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="customer-select" className="text-sm font-medium">Assign Customer</Label>
          {isLoadingCustomers ? (
            <div className="flex items-center text-muted-foreground mt-1">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Loading customers...</span>
            </div>
          ) : (
            <Select
              value={selectedCustomer?.id || NO_CUSTOMER_VALUE}
              onValueChange={handleCustomerChange}
              disabled={customers.length === 0 && !isLoadingCustomers}
            >
              <SelectTrigger id="customer-select" className="w-full mt-1">
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
          {selectedCustomer && (
            <p className="text-xs text-muted-foreground mt-1">
              Selected: <span className="font-semibold text-primary">{selectedCustomer.name}</span>
            </p>
          )}
        </div>

        <Separator />
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Items in Sale ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</h3>
          {cartItems.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No items added to the sale yet.</p>
          ) : (
            <ScrollArea className="h-[200px] w-full pr-3">
              <ul className="space-y-3">
                {cartItems.map(({ product, quantity }) => {
                  const price = product.salePrice ?? product.price;
                  return (
                    <li key={product.id} className="flex items-center justify-between p-2 border rounded-md bg-muted/30">
                      <div className="flex-grow">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ${price.toFixed(2)} ea.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mx-3">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleQuantityChange(product.id, quantity - 1)} disabled={quantity <= 0}>
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease quantity</span>
                        </Button>
                        <Input 
                            type="number" 
                            value={quantity} 
                            onChange={(e) => {
                                const newQty = parseInt(e.target.value);
                                if (!isNaN(newQty)) {
                                   handleQuantityChange(product.id, newQty);
                                }
                            }}
                            className="h-7 w-12 text-center px-1"
                            min="0"
                            max={product.stock}
                        />
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleQuantityChange(product.id, quantity + 1)} disabled={quantity >= product.stock}>
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Increase quantity</span>
                        </Button>
                      </div>
                      <p className="font-semibold text-sm w-20 text-right">${(price * quantity).toFixed(2)}</p>
                      <Button variant="ghost" size="icon" className="h-7 w-7 ml-2 text-destructive hover:text-destructive" onClick={() => removeItemFromCart(product.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-6 border-t">
          <div className="w-full flex justify-between items-center text-xl font-bold">
            <span>Grand Total:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={onClearCart} disabled={cartItems.length === 0}>
              <XCircle className="mr-2 h-4 w-4" /> Clear Sale
            </Button>
            <Button onClick={onCheckout} disabled={cartItems.length === 0} className="bg-primary hover:bg-primary/90">
              Proceed to Checkout
            </Button>
          </div>
        </CardFooter>
    </Card>
  );
}
