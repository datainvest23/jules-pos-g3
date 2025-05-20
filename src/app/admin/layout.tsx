
import type { Metadata } from 'next';
import Link from 'next/link';
import { Package2, LayoutDashboard, Settings, Users, ShoppingCart, Truck, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin - HealthStore Central',
  description: 'Admin dashboard for HealthStore Central.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/" // Changed to point to homepage for easy mode switching
            className="group flex h-9 w-full items-center justify-start rounded-lg px-3 text-lg font-semibold text-primary-foreground transition-colors hover:text-foreground md:h-8 bg-primary mb-4"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110 mr-2" />
            <span className="truncate">HealthStore Admin</span>
          </Link>
          <Link
            href="/"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
          >
            <Home className="h-4 w-4" />
            Store Front / POS
          </Link>
          <Link
            href="/admin/products"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
          >
            <ShoppingCart className="h-4 w-4" />
            Products
          </Link>
          <Link
            href="/admin/customers"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
          >
            <Users className="h-4 w-4" />
            Customers
          </Link>
          <Link
            href="/admin/suppliers"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
          >
            <Truck className="h-4 w-4" />
            Suppliers
          </Link>
           <Link
            href="/admin" // Main dashboard link
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="#"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
          >
            <Settings className="h-4 w-4" />
            Settings (Soon)
          </Link>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* Mobile Menu Trigger can be added here */}
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">
          {children}
        </main>
      </div>
    </div>
  );
}
