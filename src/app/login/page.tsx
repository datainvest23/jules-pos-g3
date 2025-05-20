
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AppNavigation from '@/components/AppNavigation';
import { LogIn, UserPlus, KeyRound } from 'lucide-react'; // Added KeyRound

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between space-x-4">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
             <KeyRound className="h-7 w-7" /> {/* Changed icon */}
            <span>HealthStore Central</span>
          </Link>
          <AppNavigation />
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Welcome Back!</h1>
            <p className="mt-3 text-muted-foreground">
              Please log in to access your account or register if you're new.
            </p>
          </div>

          <div className="bg-card p-8 rounded-lg shadow-xl space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">Email Address</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                className="mt-1 block w-full rounded-md border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3" 
                placeholder="you@example.com" 
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">Password</label>
              <input 
                type="password" 
                name="password" 
                id="password" 
                className="mt-1 block w-full rounded-md border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3" 
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full !mt-8 text-base py-3">
              <LogIn className="mr-2 h-5 w-5" /> Login (Simulated)
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button variant="link" className="p-0 h-auto text-primary" asChild>
                <Link href="#">Register here (Simulated)</Link>
              </Button>
            </div>
             <Button variant="outline" className="w-full mt-4 text-base py-3">
              <UserPlus className="mr-2 h-5 w-5" /> Register (Simulated)
            </Button>
          </div>
          
        </div>
      </main>

      <footer className="py-6 md:px-8 md:py-0 border-t bg-muted/20 mt-auto">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} HealthStore Central.
          </p>
        </div>
      </footer>
    </div>
  );
}
