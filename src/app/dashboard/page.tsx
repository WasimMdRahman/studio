
"use client";

import Header from "@/components/header";
import ParkingGrid from "@/components/parking-grid";
import ParkingStats from "@/components/parking-stats";
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
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ParkingMap from "@/components/parking-map";

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [guestId, setGuestId] = useState<string | null>(null);

  useEffect(() => {
    let id = localStorage.getItem("guestId");
    if (!id) {
      id = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("guestId", id);
    }
    setGuestId(id);
  }, []);

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
                description: "This app requires open access to Firestore. For development, please update your security rules to allow read/write access.",
                action: (
                  <Link
                    href="https://console.firebase.google.com/project/parkwise-i92rx/firestore/rules"
                    target="_blank"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Go to Rules
                  </Link>
                ),
                duration: 10000,
            });
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, [initializeSlots, toast]);
  
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

  const handleCancelBooking = async (slotId: string) => {
     if (!guestId) return;
    try {
      await runTransaction(db, async (transaction) => {
        const slotRef = doc(db, "slots", slotId);
        const slotDoc = await transaction.get(slotRef);

        if (!slotDoc.exists() || slotDoc.data().bookedBy !== guestId) {
            throw new Error("This booking does not belong to you.");
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
    if (!guestId) return;
    const slot = slots.find(s => s.id === slotId);
    if(!slot) return;

    if (slot.status === 'booked' && slot.bookedBy === guestId) {
      handleCancelBooking(slotId);
    } else if (slot.status === 'available') {
      const userHasBooking = slots.find(s => s.bookedBy === guestId);
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
    if (!guestId) {
        toast({ variant: "destructive", title: "Action Failed", description: "Could not identify user." });
        return;
    } else {
        localStorage.setItem('pendingBooking', JSON.stringify(details));
        router.push('/payment');
    }
  }

  const handleZoneClick = (zone: string) => {
    const zoneElement = document.getElementById(`zone-${zone}`);
    if (zoneElement) {
      zoneElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
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
              <ParkingMap slots={slots} onZoneClick={handleZoneClick} />
              <ParkingGrid slots={slots} onSlotClick={handleSlotClick} currentUserId={guestId ?? undefined} />
            </div>
            <div className="flex flex-col gap-8">
              <CurrentBooking slots={slots} currentUserId={guestId ?? undefined} />
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
