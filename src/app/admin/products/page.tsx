
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, ListChecks } from "lucide-react";
import Link from "next/link";

export default function ProductManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center">
            <ListChecks className="w-8 h-8 mr-3 text-primary" />
            Product Management
          </h2>
          <p className="text-muted-foreground">
            Add, edit, and manage your store's products here.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>
            A list of all products in your store. (Displaying actual products coming soon!)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-muted-foreground">
            <p>Product table will be displayed here.</p>
            <p className="text-sm">Functionality to display and manage products is under development.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
