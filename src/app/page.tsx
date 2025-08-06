"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Car, Loader2, Map, ParkingSquare, Wallet, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || (user && !loading)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background overflow-x-hidden">
      <header className="container mx-auto flex h-20 items-center justify-between px-4 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <ParkingSquare className="h-7 w-7" />
          ParkWise
        </h1>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="container relative mx-auto flex flex-col items-center justify-center px-4 py-16 text-center md:py-24">
          <div className="absolute top-1/2 left-0 w-full h-px bg-border -z-10"></div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center w-[200vw]">
             <div className="animate-car-drive flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-40 h-40 text-gray-400"
                  fill="currentColor"
                >
                  <path d="M136.3,288.7H41.5c-3.3,0-6-2.7-6-6V208c0-3.3,2.7-6,6-6h94.8c3.3,0,6,2.7,6,6v74.7C142.3,286,139.6,288.7,136.3,288.7z" />
                  <path d="M470.5,288.7H167.8c-3.3,0-6-2.7-6-6V208c0-3.3,2.7-6,6-6h302.7c3.3,0,6,2.7,6,6v74.7C476.5,286,473.8,288.7,470.5,288.7z" />
                  <path d="M490.5,226.2H21.5c-3.3,0-6-2.7-6-6V120.3c0-3.3,2.7-6,6-6h469c3.3,0,6,2.7,6,6v99.9C496.5,223.5,493.8,226.2,490.5,226.2z" />
                  <path d="M470.5,152.2H41.5c-3.3,0-6-2.7-6-6V71.4c0-3.3,2.7-6,6-6h429c3.3,0,6,2.7,6,6v74.7C476.5,149.4,473.8,152.2,470.5,152.2z" />
                  <path d="M152.5,334.7H97.3c-2.3,0-4.1-1.8-4.1-4.1V178.8c0-2.3,1.8-4.1,4.1-4.1h55.2c2.3,0,4.1,1.8,4.1,4.1v151.8C156.6,332.9,154.8,334.7,152.5,334.7z" />
                  <path d="M414.7,334.7h-55.2c-2.3,0-4.1-1.8-4.1-4.1V178.8c0-2.3,1.8-4.1,4.1-4.1h55.2c2.3,0,4.1,1.8,4.1,4.1v151.8C418.8,332.9,417,334.7,414.7,334.7z" />
                  <circle cx="414.7" cy="360.7" r="38.5" />
                  <circle cx="97.3" cy="360.7" r="38.5" />
                </svg>
             </div>
           </div>
          <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            The smartest way to park.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            ParkWise offers real-time parking availability, seamless booking, and smart suggestions. Never circle the lot again.
          </p>
          <div className="mt-8 flex gap-4 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <Button size="lg" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </section>
        <section className="bg-secondary/50">
          <div className="container mx-auto grid gap-12 px-4 py-20 md:grid-cols-3">
            <div className="flex flex-col items-center text-center animate-fade-in-up">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Real-Time Availability</h3>
              <p className="mt-2 text-muted-foreground">Our network of sensors provides up-to-the-second information on which slots are open, so you can head directly to a vacant spot.</p>
            </div>
            <div className="flex flex-col items-center text-center animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M12 14h0"/></svg>
              </div>
              <h3 className="text-xl font-semibold">One-Click Booking</h3>
              <p className="mt-2 text-muted-foreground">Found your spot? Reserve it instantly with a single click. We'll hold it for you for 15 minutes, giving you plenty of time to arrive.</p>
            </div>
            <div className="flex flex-col items-center text-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
               <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
              </div>
              <h3 className="text-xl font-semibold">AI-Powered Tips</h3>
              <p className="mt-2 text-muted-foreground">Our smart assistant analyzes your parking habits and real-time data to suggest the best available spots for you.</p>
            </div>
             <div className="flex flex-col items-center text-center animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Map className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Live Map Tracking</h3>
              <p className="mt-2 text-muted-foreground">Navigate the parking lot with ease using our live map, which shows your location and highlights available spots nearby.</p>
            </div>
             <div className="flex flex-col items-center text-center animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Wallet className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Seamless Payments</h3>
              <p className="mt-2 text-muted-foreground">Connect your payment method for hassle-free entry and exit. No need to fumble with cash or cards at the gate.</p>
            </div>
             <div className="flex flex-col items-center text-center animate-fade-in-up" style={{animationDelay: '1.0s'}}>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h3 className="text-xl font-semibold">Booking History</h3>
              <p className="mt-2 text-muted-foreground">Keep track of your previous parking sessions, view receipts, and analyze your parking expenses all in one place.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
