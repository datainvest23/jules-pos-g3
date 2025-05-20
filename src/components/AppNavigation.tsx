
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ShoppingBag, MessageSquare, LogIn } from 'lucide-react';

export default function AppNavigation() {
  return (
    <nav className="flex items-center space-x-1 sm:space-x-2">
      <Button variant="ghost" size="sm" asChild className="px-2 sm:px-3">
        <Link href="/">
          <Home className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Home</span>
        </Link>
      </Button>
      <Button variant="ghost" size="sm" asChild className="px-2 sm:px-3">
        <Link href="/shop">
          <ShoppingBag className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Shop</span>
        </Link>
      </Button>
      <Button variant="ghost" size="sm" asChild className="px-2 sm:px-3">
        <Link href="/contact">
          <MessageSquare className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Contact</span>
        </Link>
      </Button>
      <Button variant="outline" size="sm" asChild className="px-2 sm:px-3">
        <Link href="/login">
          <LogIn className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Login</span>
        </Link>
      </Button>
    </nav>
  );
}
