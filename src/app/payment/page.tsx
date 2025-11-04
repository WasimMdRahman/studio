
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { doc, runTransaction } from "firebase/firestore";
import { Loader2, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { BookingDetails } from "@/lib/slots";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PaymentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [guestId, setGuestId] = useState<string | null>(null);
  
  // IMPORTANT: Replace "YOUR_PAYPAL_CLIENT_ID" with your actual client ID from your PayPal Developer Dashboard.
  const PAYPAL_CLIENT_ID = "YOUR_PAYPAL_CLIENT_ID";

  useEffect(() => {
    const details = localStorage.getItem('pendingBooking');
    const id = localStorage.getItem('guestId');
    
    if (details && id) {
      setBookingDetails(JSON.parse(details));
      setGuestId(id);
    } else {
      router.push('/dashboard');
    }
  }, [router]);

  const sendBookingEmail = async (slotId: string, userEmail: string | null, expiresAt: number) => {
    if (!userEmail) return;
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

  const handleSuccessfulPayment = async () => {
    if (!guestId || !bookingDetails) return;
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
                bookedBy: guestId,
                userEmail: bookingDetails.email, // Use email from booking details
                userName: bookingDetails.name,
                carNumber: bookingDetails.carNumber,
                bookedAt: now,
                expiresAt: expiresAt,
            });
        });

        setPaymentSuccess(true);
        setProcessing(false);
        localStorage.removeItem('pendingBooking');
        toast({ title: "Payment Successful!", description: `Slot ${bookingDetails.slotId} booked for ${bookingDetails.durationHours} hours.` });

        const expiresAt = Date.now() + bookingDetails.durationHours * 60 * 60 * 1000;
        sendBookingEmail(bookingDetails.slotId, bookingDetails.email, expiresAt);


    } catch (error: any) {
        console.error("Booking update failed: ", error);
        toast({ variant: "destructive", title: "Action Failed", description: error.message });
        setProcessing(false);
        router.push('/dashboard');
    }
  };

  if (!bookingDetails) {
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
                        <p><strong>Email:</strong> {bookingDetails.email}</p>
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
          <CardTitle className="text-2xl">Complete Your Booking</CardTitle>
          <CardDescription>
            You are booking slot <span className="font-bold text-primary">{bookingDetails.slotId}</span> for <span className="font-bold text-primary">{bookingDetails.durationHours} {bookingDetails.durationHours > 1 ? "hours" : "hour"}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Name:</strong> {bookingDetails.name}</p>
                <p><strong>Email:</strong> {bookingDetails.email}</p>
                <p><strong>Car Number:</strong> {bookingDetails.carNumber}</p>
            </div>
            <div className="flex items-center justify-center rounded-lg border bg-background/50 p-6">
                <span className="text-muted-foreground mr-2">Total Amount:</span>
                <span className="text-3xl font-bold text-primary">${bookingDetails.totalPrice}</span>
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
            {processing ? (
                 <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="ml-2 text-muted-foreground">Processing your booking...</p>
                </div>
            ) : PAYPAL_CLIENT_ID === "YOUR_PAYPAL_CLIENT_ID" ? (
                 <div className="text-center text-sm text-yellow-500 p-4 rounded-md bg-yellow-900/20 border border-yellow-700">
                    <p className="font-bold">PayPal Sandbox is not configured.</p>
                    <p>To enable payments, get a Client ID from the PayPal Developer Dashboard and add it to <code>src/app/payment/page.tsx</code>.</p>
                    <Button variant="link" asChild><a href="https://developer.paypal.com/dashboard/applications/sandbox" target="_blank" rel="noopener noreferrer">Get PayPal Client ID</a></Button>
                 </div>
            ) : (
                <PayPalScriptProvider options={{ "clientId": PAYPAL_CLIENT_ID, currency: "USD" }}>
                    <PayPalButtons
                        style={{ layout: "vertical" }}
                        createOrder={(data, actions) => {
                            return actions.order.create({
                                purchase_units: [{
                                    amount: {
                                        value: bookingDetails.totalPrice.toString(),
                                    },
                                    description: `Parking Slot Booking: ${bookingDetails.slotId} for ${bookingDetails.durationHours}h`,
                                }]
                            })
                        }}
                        onApprove={(data, actions) => {
                            // This function is called when the payment is successful.
                            // The `actions.order.capture()` function captures the transaction.
                            return actions.order!.capture().then(async (details) => {
                                console.log("Payment successful:", details);
                                toast({ title: "PayPal Payment Approved", description: `Transaction ID: ${details.id}`});
                                await handleSuccessfulPayment();
                            });
                        }}
                        onError={(err) => {
                            console.error("PayPal Error:", err);
                            toast({ variant: "destructive", title: "PayPal Error", description: "Something went wrong with the payment." });
                        }}
                        onCancel={() => {
                            toast({ variant: "destructive", title: "Payment Cancelled", description: "You have cancelled the payment." });
                        }}
                    />
                </PayPalScriptProvider>
            )}
        </CardFooter>
      </Card>
    </div>
  );
}
