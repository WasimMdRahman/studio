
"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { doc, runTransaction } from "firebase/firestore";
import { Loader2, CreditCard, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { BookingDetails } from "@/lib/slots";

export default function PaymentPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const details = localStorage.getItem('pendingBooking');
    if (details) {
      setBookingDetails(JSON.parse(details));
    } else {
      // No booking details, redirect to dashboard
      router.push('/dashboard');
    }
  }, [router]);

  const sendBookingEmail = async (slotId: string, userEmail: string, expiresAt: number) => {
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: userEmail,
          subject: 'Your ParkWise Booking Confirmation',
          html: `
            <h1>Booking Confirmed!</h1>
            <p>You have successfully booked parking slot <strong>${slotId}</strong>.</p>
            <p>This booking is valid until: <strong>${new Date(expiresAt).toLocaleString()}</strong>.</p>
            <p>Thank you for using ParkWise!</p>
          `,
        }),
      });
    } catch (error) {
      console.error("Failed to send booking email:", error);
    }
  };

  const handlePayment = async () => {
    if (!user || !bookingDetails) return;
    setProcessing(true);

    try {
        await runTransaction(db, async (transaction) => {
            const slotRef = doc(db, "slots", bookingDetails.slotId);
            const slotDoc = await transaction.get(slotRef);

            if (!slotDoc.exists() || slotDoc.data().status !== 'available') {
                throw new Error("Slot is no longer available.");
            }

            const now = Date.now();
            const expiresAt = now + bookingDetails.durationHours * 60 * 60 * 1000;
            
            transaction.update(slotRef, {
                status: "booked",
                bookedBy: user.uid,
                userEmail: user.email,
                userName: bookingDetails.name,
                carNumber: bookingDetails.carNumber,
                bookedAt: now,
                expiresAt: expiresAt,
            });
        });

        // Simulate payment success
        setTimeout(() => {
            setPaymentSuccess(true);
            setProcessing(false);
            localStorage.removeItem('pendingBooking');
            toast({ title: "Payment Successful!", description: `Slot ${bookingDetails.slotId} booked for ${bookingDetails.durationHours} hours.` });
            if (user.email) {
              const expiresAt = Date.now() + bookingDetails.durationHours * 60 * 60 * 1000;
              sendBookingEmail(bookingDetails.slotId, user.email, expiresAt);
            }
        }, 1500);


    } catch (error: any) {
        console.error("Payment failed: ", error);
        toast({ variant: "destructive", title: "Payment Failed", description: error.message });
        setProcessing(false);
        router.push('/dashboard');
    }
  };

  if (authLoading || !bookingDetails) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (paymentSuccess) {
      return (
          <div className="flex h-screen items-center justify-center">
              <Card className="w-full max-w-md text-center animate-fade-in-up">
                  <CardHeader>
                      <CheckCircle className="mx-auto h-16 w-16 text-green-500"/>
                      <CardTitle className="text-2xl mt-4">Payment Confirmed!</CardTitle>
                      <CardDescription>Your parking spot is secured.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <p>You have successfully booked slot <strong className="text-primary">{bookingDetails.slotId}</strong> for <strong className="text-primary">{bookingDetails.durationHours} {bookingDetails.durationHours > 1 ? "hours" : "hour"}</strong>.</p>
                      <div className="text-left mt-4 text-sm text-muted-foreground space-y-2">
                        <p><strong>Name:</strong> {bookingDetails.name}</p>
                        <p><strong>Car Number:</strong> {bookingDetails.carNumber}</p>
                      </div>
                  </CardContent>
                  <CardFooter>
                      <Button className="w-full" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
                  </CardFooter>
              </Card>
          </div>
      )
  }

  return (
    <div className="flex h-screen items-center justify-center bg-secondary/20 p-4">
      <Card className="w-full max-w-md animate-fade-in-up">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Payment</CardTitle>
          <CardDescription>
            You are booking slot <span className="font-bold text-primary">{bookingDetails.slotId}</span> for <span className="font-bold text-primary">{bookingDetails.durationHours} {bookingDetails.durationHours > 1 ? "hours" : "hour"}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Name:</strong> {bookingDetails.name}</p>
                <p><strong>Car Number:</strong> {bookingDetails.carNumber}</p>
            </div>
            <div className="flex items-center justify-center rounded-lg border bg-background/50 p-6">
                <span className="text-muted-foreground mr-2">Total Amount:</span>
                <span className="text-3xl font-bold text-primary">${bookingDetails.totalPrice}</span>
            </div>
             {/* This is a simulated form */}
            <div className="grid gap-2">
                <p className="text-sm text-center text-muted-foreground">This is a simulated payment gateway.</p>
            </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handlePayment} disabled={processing}>
            {processing ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                </>
            ) : (
                <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay Now
                </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
