
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Added import for Badge
import { LayoutDashboard, ShoppingCart, Users, BarChart3, Truck, Loader2, AlertTriangle, Package, Zap, BarChartBig, ListChecks, Settings } from "lucide-react"; // Added ListChecks and Settings
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

  const NavCard: React.FC<{ title: string; description: string; icon: React.ElementType; link: string; count?: number | string; countLabel?: string, comingSoon?: boolean }> =
    ({ title, description, icon: Icon, link, count, countLabel, comingSoon }) => (
    <Link href={link} className={`block rounded-lg ${comingSoon ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg transition-shadow'}`}>
        <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
            <div className="space-y-1">
            <CardTitle className="text-lg font-semibold flex items-center">
                <Icon className="w-6 h-6 mr-3 text-primary" />
                {title}
            </CardTitle>
            {count !== undefined && countLabel && (
                <p className="text-xs text-muted-foreground">
                {count} {countLabel}
                </p>
            )}
            </div>
            {comingSoon && <Badge variant="outline">Soon</Badge>}
        </CardHeader>
        <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter className="pt-3">
             <Button variant="outline" className="w-full" disabled={comingSoon}>
                {comingSoon ? 'Coming Soon' : `Go to ${title}`}
             </Button>
        </CardFooter>
        </Card>
    </Link>
  );


  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight flex items-center">
          <LayoutDashboard className="w-8 h-8 mr-3 text-primary" />
          Admin Dashboard
        </h2>
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
                <Link href="/">Start New Sale (POS)</Link>
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

          <h3 className="text-2xl font-semibold tracking-tight pt-4">Management Sections</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <NavCard
              title="Products"
              description="Manage all products. Add, edit, view details, and organize inventory."
              icon={ListChecks}
              link="/admin/products"
              count={stats.productCount}
              countLabel="products"
            />
            <NavCard
              title="Customers"
              description="View and manage data for all customers. Access profiles and purchase history."
              icon={Users}
              link="/admin/customers"
              count={stats.customerCount}
              countLabel="customers"
            />
            <NavCard
              title="Suppliers"
              description="Oversee information for product suppliers. Add new suppliers and manage contacts."
              icon={Truck}
              link="/admin/suppliers"
              count={stats.supplierCount}
              countLabel="suppliers"
            />
            <NavCard
              title="Sales Intelligence"
              description="View sales trends, top customer insights, and AI-powered promotion suggestions."
              icon={BarChartBig}
              link="/admin/bi"
            />
            <NavCard
              title="Sales Reports"
              description="Analyze sales performance, track revenue, and generate detailed reports."
              icon={BarChart3}
              link="#" 
              comingSoon
            />
             <NavCard
              title="Settings"
              description="Configure application settings, user roles, and integrations."
              icon={Settings}
              link="#"
              comingSoon
            />
          </div>
        </>
      )}
    </div>
  );
}

    
