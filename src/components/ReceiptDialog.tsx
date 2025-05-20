
'use client';

import type { ReceiptData } from '@/types';
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
import { Printer, X, User } from 'lucide-react';
import { format } from 'date-fns';

interface ReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptData | null;
}

export default function ReceiptDialog({ isOpen, onClose, receiptData }: ReceiptDialogProps) {
  if (!receiptData) {
    return null;
  }

  const { product, transactionId, quantity, timestamp, customerName } = receiptData;
  const itemPrice = product.salePrice ?? product.price;
  const totalAmount = itemPrice * quantity;

  const handlePrint = () => {
    // In a real app, this would trigger the browser's print dialog
    console.log('Simulating print receipt:', receiptData);
    alert('Printing receipt (simulated). Check console for details.');
    // window.print(); // Uncomment for actual print functionality if needed
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Transaction Receipt</DialogTitle>
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
              Customer: <span className="font-medium ml-1">{customerName}</span>
            </div>
          )}
          
          <Separator />

          <div>
            <h4 className="font-semibold mb-2 text-lg">Item Purchased:</h4>
            <div className="flex justify-between items-center">
              <span>{product.name} (x{quantity})</span>
              <span className="font-medium">${itemPrice.toFixed(2)}</span>
            </div>
          </div>

          <Separator />
          
          <div className="flex justify-between items-center text-xl font-bold mt-4">
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
            <Button type="button" variant="secondary">
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
