
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, ShoppingCart, Users, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center">
          <LayoutDashboard className="w-8 h-8 mr-3 text-primary" />
          Admin Dashboard
        </h2>
        <p className="text-muted-foreground">
          Overview and quick access to management sections.
        </p>
      </div>

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
              Add, edit, and manage all products.
            </p>
            <Link href="/admin/products" className="text-sm text-primary hover:underline mt-2 block">
              Go to Products &rarr;
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customer Management (Soon)
            </CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Customers</div>
            <p className="text-xs text-muted-foreground">
              View and manage customer data.
            </p>
             <p className="text-sm text-muted-foreground mt-2 block">
              Coming Soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sales Reports (Soon)
            </CardTitle>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Reports</div>
            <p className="text-xs text-muted-foreground">
              Analyze sales and performance.
            </p>
            <p className="text-sm text-muted-foreground mt-2 block">
              Coming Soon
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
