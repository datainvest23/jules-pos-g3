
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AppNavigation from '@/components/AppNavigation'; // Assuming you have this for consistent nav
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between space-x-4">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <MessageSquare className="h-7 w-7" /> {/* Changed icon */}
            <span>HealthStore Central</span>
          </Link>
          <AppNavigation />
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Contact Us</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We're here to help! Reach out to us with any questions or feedback.
          </p>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-primary mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              Fill out the form below, or use one of the methods on the right to contact us directly.
            </p>
            {/* Placeholder for a contact form - can be implemented later */}
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground">Full Name</label>
                <input type="text" name="name" id="name" className="mt-1 block w-full rounded-md border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2" placeholder="Your Name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">Email</label>
                <input type="email" name="email" id="email" className="mt-1 block w-full rounded-md border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2" placeholder="you@example.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground">Message</label>
                <textarea id="message" name="message" rows={4} className="mt-1 block w-full rounded-md border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2" placeholder="Your message..."></textarea>
              </div>
              <Button type="submit" className="w-full">Send Message (Simulated)</Button>
            </form>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-primary mb-6">Our Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-foreground">Email Us</h3>
                  <a href="mailto:info@healthstorecentral.com" className="text-muted-foreground hover:text-primary">info@healthstorecentral.com</a>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-foreground">Call Us</h3>
                  <p className="text-muted-foreground">(555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-foreground">Visit Us</h3>
                  <p className="text-muted-foreground">123 Wellness Ave, Healthville, ST 98765</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 md:px-8 md:py-0 border-t bg-muted/20 mt-12">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} HealthStore Central.
          </p>
        </div>
      </footer>
    </div>
  );
}
