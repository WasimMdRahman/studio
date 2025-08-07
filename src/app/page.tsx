
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
           {/* City Skyline Background */}
          <div className="absolute inset-0 flex items-end z-0 pointer-events-none opacity-50">
            <div className="w-20 h-24 bg-gray-300 opacity-30 mr-2 rounded-t-md"></div>
            <div className="w-16 h-20 bg-gray-400 opacity-25 mr-2 rounded-t-md"></div>
            <div className="w-24 h-32 bg-gray-200 opacity-30 mr-2 rounded-t-md"></div>
            <div className="w-8 h-12 bg-gray-400 opacity-20 mr-2 rounded-t-md"></div>
            <div className="w-32 h-28 bg-gray-300 opacity-20 rounded-t-md"></div>
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
          </div>

          {/* Road lines */}
          <div className="absolute bottom-20 w-full flex justify-center z-10">
            <div className="w-2/3 h-2 border-t-4 border-dashed border-gray-400 opacity-30"></div>
          </div>

          {/* Car Animation Box */}
          <div className="relative w-full h-48 flex items-center animate-drive z-20">
            {/* Car: side view, premium look */}
            <div className="relative mx-auto w-72 md:w-96 h-28 md:h-32">
              {/* Car Shadow */}
              <div className="absolute bottom-0 left-12 right-12 h-5 bg-gray-900 opacity-20 rounded-full blur-sm z-0"></div>
              
              {/* Wheels (front/rear) */}
              <div className="absolute z-10 -bottom-4 left-10 md:left-16 w-10 h-10 bg-black rounded-full border-2 border-gray-700 flex items-center justify-center">
                <div className="w-5 h-5 bg-gray-400 rounded-full border-2 border-gray-600"></div>
              </div>
              <div className="absolute z-10 -bottom-4 right-10 md:right-16 w-10 h-10 bg-black rounded-full border-2 border-gray-700 flex items-center justify-center">
                <div className="w-5 h-5 bg-gray-400 rounded-full border-2 border-gray-600"></div>
              </div>

              {/* Exhaust smoke (optional) */}
              <div className="absolute -left-6 bottom-2 w-3 h-3 bg-gray-400 rounded-full animate-ping opacity-60"></div>

              {/* Car Body */}
              <div className="relative w-full h-full bg-white rounded-xl shadow-2xl border border-gray-300">
                {/* Windows (with luxury gradient) */}
                <div className="absolute z-10 left-12 top-3 w-16 md:w-20 h-7 md:h-8 bg-gradient-to-br from-black via-gray-800 to-gray-700 bg-opacity-80 rounded-sm shadow-inner"></div>
                <div className="absolute z-10 left-32 md:left-40 top-3 w-14 md:w-16 h-7 md:h-8 bg-gradient-to-br from-black via-gray-900 to-gray-700 bg-opacity-70 rounded-sm shadow-inner"></div>

                {/* Door outlines (shadow lines) */}
                <div className="absolute left-0 top-0 w-full h-full border-2 border-gray-400 border-dashed opacity-15 pointer-events-none"></div>
                <div className="absolute left-24 md:left-32 top-4 w-0.5 h-20 bg-gray-300 opacity-40"></div>
                <div className="absolute left-44 md:left-56 top-4 w-0.5 h-20 bg-gray-300 opacity-50"></div>
                <div className="absolute top-16 md:top-20 left-10 md:left-14 w-48 md:w-64 h-0.5 bg-gray-300 opacity-30"></div>
                {/* Door handles (subtle) */}
                <div className="absolute top-12 md:top-16 left-24 w-6 h-1 rounded bg-gray-400 opacity-30"></div>
                <div className="absolute top-12 md:top-16 left-44 w-6 h-1 rounded bg-gray-400 opacity-40"></div>
                
                {/* Headlights (front/rear) */}
                <div className="absolute left-0 md:left-1 top-10 w-2 h-4 bg-yellow-300 rounded-l-md shadow-md"></div>
                <div className="absolute right-0 md:right-1 top-10 w-2 h-4 bg-red-400 rounded-r-md shadow-md"></div>
              </div>
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
        <section className="bg-secondary/50 py-20">
          <div className="container mx-auto grid gap-12 px-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Real-Time Availability</h3>
              <p className="mt-2 text-muted-foreground">Our network of sensors provides up-to-the-second information on which slots are open, so you can head directly to a vacant spot.</p>
            </div>
            <div className="flex flex-col items-center text-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M12 14h0"/></svg>
              </div>
              <h3 className="text-xl font-semibold">One-Click Booking</h3>
              <p className="mt-2 text-muted-foreground">Found your spot? Reserve it instantly with a single click. We'll hold it for you for 15 minutes, giving you plenty of time to arrive.</p>
            </div>
            <div className="flex flex-col items-center text-center animate-fade-in-up" style={{animationDelay: '0.6s'}}>
               <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
              </div>
              <h3 className="text-xl font-semibold">AI-Powered Tips</h3>
              <p className="mt-2 text-muted-foreground">Our smart assistant analyzes your parking habits and real-time data to suggest the best available spots for you.</p>
            </div>
             <div className="flex flex-col items-center text-center animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Map className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Live Map Tracking</h3>
              <p className="mt-2 text-muted-foreground">Navigate the parking lot with ease using our live map, which shows your location and highlights available spots nearby.</p>
            </div>
             <div className="flex flex-col items-center text-center animate-fade-in-up" style={{animationDelay: '1.0s'}}>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Wallet className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Seamless Payments</h3>
              <p className="mt-2 text-muted-foreground">Connect your payment method for hassle-free entry and exit. No need to fumble with cash or cards at the gate.</p>
            </div>
             <div className="flex flex-col items-center text-center animate-fade-in-up" style={{animationDelay: '1.2s'}}>
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
