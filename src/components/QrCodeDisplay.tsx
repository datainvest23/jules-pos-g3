'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode } from 'lucide-react';

interface QrCodeDisplayProps {
  productId: string;
  productName: string;
}

export default function QrCodeDisplay({ productId, productName }: QrCodeDisplayProps) {
  // Using a placeholder domain for the product URL
  const productUrl = `https://healthstore.example.com/product/${productId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(productUrl)}`;

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center"><QrCode className="mr-2 h-5 w-5 text-primary" /> Scan for Details</CardTitle>
        <CardDescription>Scan this QR code to quickly access details for {productName}.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        {qrCodeUrl ? (
          <Image
            src={qrCodeUrl}
            alt={`QR Code for ${productName}`}
            width={150}
            height={150}
            className="rounded-md border p-1 bg-white"
          />
        ) : (
          <p className="text-muted-foreground">Generating QR Code...</p>
        )}
      </CardContent>
    </Card>
  );
}
