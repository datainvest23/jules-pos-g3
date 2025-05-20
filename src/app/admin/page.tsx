
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingCart, Users, BarChart3, Truck, Loader2, AlertTriangle, Package, Zap, BarChartBig } from "lucide-react";
import Link from "next/link";
import { fetchAllProducts, fetchAllCustomers, fetchAllSuppliers } from '@/lib/api';

interface DashboardStats {
  productCount: number;
  customerCount: number;
  supplierCount: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      setIsLoading(true);
      setError(null);
      try {
        const [products, customers, suppliers] = await Promise.all([
          fetchAllProducts(),
          fetchAllCustomers(),
          fetchAllSuppliers(),
        ]);
        setStats({
          productCount: products.length,
          customerCount: customers.length,
          supplierCount: suppliers.length,
        });
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
        setError("Could not load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; description?: string, link?: string; linkText?: string }> = 
    ({ title, value, icon: Icon, description, link, linkText }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {link && linkText && (
           <Button variant="link" asChild className="px-0 pt-2 h-auto text-xs">
            <Link href={link}>{linkText} &rarr;</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight flex items-center">
          <LayoutDashboard className="w-8 h-8 mr-3 text-primary" />
          Admin Dashboard
        </h2>
        {/* Optional: Add a refresh button or other global actions here */}
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-3 text-lg text-muted-foreground">Loading dashboard data...</p>
        </div>
      )}

      {error && !isLoading && (
        <Card className="bg-destructive/10 border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="w-6 h-6 mr-2" />
              Error Loading Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground">{error}</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && stats && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Products" value={stats.productCount} icon={Package} description="Products in catalog" link="/admin/products" linkText="Manage Products"/>
            <StatCard title="Total Customers" value={stats.customerCount} icon={Users} description="Registered customers" link="/admin/customers" linkText="Manage Customers"/>
            <StatCard title="Total Suppliers" value={stats.supplierCount} icon={Truck} description="Available suppliers" link="/admin/suppliers" linkText="Manage Suppliers"/>
            <StatCard title="Today's Sales" value="$0.00" icon={BarChart3} description="Simulated - Feature coming soon" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-primary"/>
                  Quick Actions
                </CardTitle>
                <CardDescription>Quickly jump to common tasks.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button asChild variant="outline">
                  <Link href="/">Start New Sale</Link>
                </Button>
                 <Button asChild variant="outline">
                  <Link href="/admin/products/new">Add New Product</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/customers/new">Add New Customer</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/suppliers/new">Add New Supplier</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-2xl font-semibold tracking-tight pt-4">Management Sections</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Product Management
                </CardTitle>
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Products</div>
                <p className="text-xs text-muted-foreground">
                  Manage all {stats.productCount} products. Add, edit, and organize inventory.
                </p>
                <Link href="/admin/products" className="text-sm text-primary hover:underline mt-2 block">
                  Go to Products &rarr;
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Customer Management
                </CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Customers</div>
                <p className="text-xs text-muted-foreground">
                  View and manage data for {stats.customerCount} customers.
                </p>
                 <Link href="/admin/customers" className="text-sm text-primary hover:underline mt-2 block">
                  Go to Customers &rarr;
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Supplier Management
                </CardTitle>
                <Truck className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Suppliers</div>
                <p className="text-xs text-muted-foreground">
                  Oversee information for {stats.supplierCount} suppliers.
                </p>
                 <Link href="/admin/suppliers" className="text-sm text-primary hover:underline mt-2 block">
                  Go to Suppliers &rarr;
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Sales Intelligence
                </CardTitle>
                <BarChartBig className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">BI Dashboard</div>
                <p className="text-xs text-muted-foreground">
                  View sales trends and AI insights.
                </p>
                 <Link href="/admin/bi" className="text-sm text-primary hover:underline mt-2 block">
                  Go to Sales Intelligence &rarr;
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Sales Reports
                </CardTitle>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Reports</div>
                <p className="text-xs text-muted-foreground">
                  Analyze sales and performance. (Coming Soon)
                </p>
                <Link href="#" className="text-sm text-primary hover:underline mt-2 block opacity-50 cursor-not-allowed">
                  View Reports (Soon)
                </Link>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
