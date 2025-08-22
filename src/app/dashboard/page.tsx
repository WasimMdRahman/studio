
"use client";

import Header from "@/components/header";
import ParkingGrid from "@/components/parking-grid";
import ParkingStats from "@/components/parking-stats";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  writeBatch,
} from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import type { ParkingSlot } from "@/lib/slots";
import { PARKING_ZONES, SLOTS_PER_ZONE, EXPIRATION_MINUTES } from "@/lib/slots";
import { useToast } from "@/hooks/use-toast";
import CurrentBooking from "@/components/current-booking";
import BookingConfirmationDialog from "@/components/booking-confirmation-dialog";
import type { BookingDetails } from "@/lib/slots";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  const initializeSlots = useCallback(async () => {
    console.log("Checking if slots need initialization...");
    const slotsCollection = collection(db, "slots");
    const snapshot = await getDocs(slotsCollection);
    if (snapshot.empty) {
      console.log("No slots found. Initializing...");
      const batch = writeBatch(db);
      const initialSlots: ParkingSlot[] = [];
      PARKING_ZONES.forEach((zone) => {
        for (let i = 1; i <= SLOTS_PER_ZONE; i++) {
          const slotId = `${zone}${i}`;
          const slotDoc = doc(db, "slots", slotId);
          const newSlot: ParkingSlot = {
            id: slotId,
            status: "available",
          };
          batch.set(slotDoc, newSlot);
          initialSlots.push(newSlot);
        }
      });
      await batch.commit();
      setSlots(initialSlots);
      console.log("Slots initialized.");
    }
  }, []);

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/login");
    }
  }, [user, authLoading, router]);
  
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "slots"));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      if (querySnapshot.empty) {
        await initializeSlots();
      }
      
      const slotsData: ParkingSlot[] = [];
      querySnapshot.forEach((doc) => {
        slotsData.push({ id: doc.id, ...doc.data() } as ParkingSlot);
      });
      
      slotsData.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
      setSlots(slotsData);
      setLoading(false);
    }, (error) => {
        console.error("Firestore snapshot error:", error);
        if (error.code === 'permission-denied') {
            toast({
                variant: "destructive",
                title: "Firestore Permission Denied",
                description: "Your security rules are blocking access. For development, go to your Firebase console -> Firestore -> Rules and use: allow read, write: if true;",
                duration: 10000,
            });
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user, initializeSlots, toast]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setSlots(currentSlots => {
        const expiredSlots = currentSlots.filter(
          (slot) => slot.status === "booked" && slot.expiresAt && slot.expiresAt < now
        );
  
        if (expiredSlots.length > 0) {
          const batch = writeBatch(db);
          expiredSlots.forEach((slot) => {
            const slotRef = doc(db, "slots", slot.id);
            batch.update(slotRef, { 
              status: "available",
              bookedBy: null,
              bookedAt: null,
              expiresAt: null,
              userEmail: null,
              userName: null,
              carNumber: null
            });
          });
          batch.commit().then(() => {
              console.log(`${expiredSlots.length} slots auto-released.`);
          });
        }
        return currentSlots;
      })
    }, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, []);

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

  const handleCancelBooking = async (slotId: string) => {
     if (!user) return;
    try {
      await runTransaction(db, async (transaction) => {
        const slotRef = doc(db, "slots", slotId);
        const slotDoc = await transaction.get(slotRef);

        if (!slotDoc.exists() || slotDoc.data().bookedBy !== user.uid) {
            throw new Error("Cannot cancel this booking.");
        }
        transaction.update(slotRef, {
            status: "available",
            bookedBy: null,
            bookedAt: null,
            expiresAt: null,
            userEmail: null,
            userName: null,
            carNumber: null,
        });
        toast({ title: "Booking Cancelled", description: `You have cancelled your booking for slot ${slotId}.` });
      });
    } catch (error: any) {
        console.error("Transaction failed: ", error);
        toast({ variant: "destructive", title: "Action Failed", description: error.message });
    }
  }

  const handleSlotClick = async (slotId: string) => {
    if (!user) return;
    const slot = slots.find(s => s.id === slotId);
    if(!slot) return;

    if (slot.status === 'booked' && slot.bookedBy === user.uid) {
      handleCancelBooking(slotId);
    } else if (slot.status === 'available') {
      const userHasBooking = slots.find(s => s.bookedBy === user.uid);
      if (userHasBooking) {
        toast({
          variant: "destructive",
          title: "Action Failed",
          description: `You already have a booking for slot ${userHasBooking.id}.`,
        });
        return;
      }
      setSelectedSlot(slot);
      setConfirmOpen(true);
    }
  };

  const handleBookingConfirm = (details: BookingDetails) => {
    setConfirmOpen(false);
    if (!user) {
        // If user not logged in, store details and redirect to signup
        localStorage.setItem('pendingBooking', JSON.stringify(details));
        router.push('/signup');
    } else {
        // If user is logged in, proceed to payment
        localStorage.setItem('pendingBooking', JSON.stringify(details));
        router.push('/payment');
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-secondary/20 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ParkingGrid slots={slots} onSlotClick={handleSlotClick} currentUserId={user?.uid} />
            </div>
            <div className="flex flex-col gap-8">
              <CurrentBooking slots={slots} currentUserId={user?.uid} />
              <ParkingStats slots={slots} />
            </div>
          </div>
        </div>
      </main>
      {selectedSlot && (
         <BookingConfirmationDialog 
            isOpen={isConfirmOpen}
            onOpenChange={setConfirmOpen}
            slot={selectedSlot}
            onConfirm={handleBookingConfirm}
         />
      )}
    </div>
  );
}
