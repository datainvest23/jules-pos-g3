
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AppNavigation from '@/components/AppNavigation';
import { LogIn, UserPlus, KeyRound, Loader2, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label as FormLabel } from '@/components/ui/label'; // Renamed to avoid conflict with react-hook-form's Label
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});
type LoginFormValues = z.infer<typeof loginSchema>;

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});
type RegisterFormValues = z.infer<typeof registerSchema>;


export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setAuthError(error.message);
        toast({ title: "Login Failed", description: error.message, variant: "destructive" });
      } else if (authData.user) {
        toast({ title: "Login Successful!", description: `Welcome back, ${authData.user.email}` });
        console.log("Logged in user:", authData.user);
        loginForm.reset();
        // TODO: Redirect user or update global user state
      } else {
        setAuthError("An unexpected error occurred during login.");
        toast({ title: "Login Failed", description: "An unexpected error occurred.", variant: "destructive" });
      }
    } catch (e: any) {
      setAuthError(e.message || "An unexpected error occurred.");
      toast({ title: "Login Error", description: e.message || "An unexpected error occurred.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setAuthError(error.message);
        toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
      } else if (authData.user) {
        toast({ title: "Registration Successful!", description: "Please check your email to verify your account." });
        console.log("Registered user:", authData.user);
        registerForm.reset();
        // Potentially switch to login tab or show message
      } else if (authData.session === null && !authData.user) {
        // This can happen if email confirmation is required and user already exists but is unconfirmed.
        // Supabase might return a user object here if it's an existing unconfirmed user.
        // If both user and session are null, and no error, it's an odd state, but likely means confirmation needed.
        setAuthError("Registration successful, but email confirmation might be required or user exists.");
        toast({ title: "Registration Pending", description: "Please check your email for a confirmation link, or try logging in if you've already registered." });
      }
      else {
        setAuthError("An unexpected error occurred during registration.");
        toast({ title: "Registration Failed", description: "An unexpected error occurred.", variant: "destructive" });
      }
    } catch (e: any) {
      setAuthError(e.message || "An unexpected error occurred.");
      toast({ title: "Registration Error", description: e.message || "An unexpected error occurred.", variant: "destructive" });
    }
    setIsLoading(false);
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between space-x-4">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
             <KeyRound className="h-7 w-7" />
            <span>HealthStore Central</span>
          </Link>
          <AppNavigation />
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {activeTab === "login" ? "Welcome Back!" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {activeTab === "login" ? "Log in to access your HealthStore account." : "Join HealthStore Central today."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6 pt-4">
                  {authError && activeTab === 'login' && (
                     <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Login Error</AlertTitle>
                        <AlertDescription>{authError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <FormLabel htmlFor="login-email">Email Address</FormLabel>
                    <Input 
                      id="login-email"
                      type="email" 
                      placeholder="you@example.com" 
                      {...loginForm.register("email")}
                      className={loginForm.formState.errors.email ? "border-destructive" : ""}
                    />
                    {loginForm.formState.errors.email && <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="login-password">Password</FormLabel>
                    <Input 
                      id="login-password"
                      type="password" 
                      placeholder="••••••••"
                      {...loginForm.register("password")}
                      className={loginForm.formState.errors.password ? "border-destructive" : ""}
                    />
                     {loginForm.formState.errors.password && <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>}
                  </div>
                  <Button type="submit" className="w-full !mt-8 text-base py-3" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : <LogIn className="mr-2 h-5 w-5" />}
                    Login
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6 pt-4">
                   {authError && activeTab === 'register' && (
                     <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Registration Error</AlertTitle>
                        <AlertDescription>{authError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <FormLabel htmlFor="register-email">Email Address</FormLabel>
                    <Input 
                      id="register-email"
                      type="email" 
                      placeholder="you@example.com" 
                      {...registerForm.register("email")}
                      className={registerForm.formState.errors.email ? "border-destructive" : ""}
                    />
                    {registerForm.formState.errors.email && <p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="register-password">Password</FormLabel>
                    <Input 
                      id="register-password"
                      type="password" 
                      placeholder="Create a password (min. 6 characters)"
                      {...registerForm.register("password")}
                       className={registerForm.formState.errors.password ? "border-destructive" : ""}
                    />
                    {registerForm.formState.errors.password && <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
                    <Input 
                      id="confirm-password"
                      type="password" 
                      placeholder="Confirm your password"
                      {...registerForm.register("confirmPassword")}
                      className={registerForm.formState.errors.confirmPassword ? "border-destructive" : ""}
                    />
                    {registerForm.formState.errors.confirmPassword && <p className="text-sm text-destructive">{registerForm.formState.errors.confirmPassword.message}</p>}
                  </div>
                  <Button type="submit" className="w-full !mt-8 text-base py-3" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : <UserPlus className="mr-2 h-5 w-5" />}
                    Register
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
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
