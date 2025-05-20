
'use client';

import type { ReceiptData, CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Printer, X, User, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';
import { ScrollArea } from './ui/scroll-area';

interface ReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptData | null;
}

export default function ReceiptDialog({ isOpen, onClose, receiptData }: ReceiptDialogProps) {
  if (!receiptData) {
    return null;
  }

  const { items, transactionId, timestamp, customerName, totalAmount } = receiptData;

  const handlePrint = () => {
    console.log('Simulating print receipt:', receiptData);
    alert('Printing receipt (simulated). Check console for details.');
    // window.print(); // Uncomment for actual print functionality if needed
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center">
            <ShoppingBag className="mr-2 h-6 w-6 text-primary"/>
            Transaction Receipt
          </DialogTitle>
          <DialogDescription>
            Thank you for your purchase! Transaction ID: {transactionId}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-sm text-muted-foreground">
            Date: {format(timestamp, "PPP p")}
          </div>

          {customerName && (
            <div className="text-sm text-muted-foreground flex items-center">
              <User className="mr-2 h-4 w-4" />
              Customer: <span className="font-medium ml-1 text-foreground">{customerName}</span>
            </div>
          )}
          
          <Separator />

          <div>
            <h4 className="font-semibold mb-2 text-md">Items Purchased:</h4>
            {items.length > 0 ? (
              <ScrollArea className="h-[150px] w-full pr-3 mb-2">
                <ul className="space-y-2">
                  {items.map(({ product, quantity }, index) => {
                    const itemPrice = product.salePrice ?? product.price;
                    return (
                      <li key={`${product.id}-${index}`} className="text-sm">
                        <div className="flex justify-between items-start">
                          <span className="flex-1 pr-2">{product.name}</span>
                          <div className="text-right">
                            <span className="text-muted-foreground">{quantity} x ${itemPrice.toFixed(2)}</span>
                            <span className="font-medium ml-2">${(itemPrice * quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground">No items in this transaction.</p>
            )}
          </div>

          <Separator />
          
          <div className="flex justify-between items-center text-xl font-bold mt-4 text-primary">
            <span>Total Amount:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            HealthStore Central - Your wellness partner.
          </p>
        </div>
        <DialogFooter className="sm:justify-between gap-2">
          <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Receipt
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
