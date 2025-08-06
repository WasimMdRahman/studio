"use client";

import Header from "@/components/header";
import ParkingGrid from "@/components/parking-grid";
import ParkingStats from "@/components/parking-stats";
import ParkingTips from "@/components/parking-tips";
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

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [loading, setLoading] = useState(true);

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
    });

    return () => unsubscribe();
  }, [user, initializeSlots]);
  
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
              userEmail: null
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

  const handleSlotAction = async (slotId: string) => {
    if (!user) return;

    try {
      await runTransaction(db, async (transaction) => {
        const slotsRef = collection(db, "slots");
        const allSlotsSnapshot = await getDocs(query(slotsRef));
        const allSlots = allSlotsSnapshot.docs.map(d => d.data() as ParkingSlot);
        const userHasBooking = allSlots.find(s => s.bookedBy === user.uid);
        
        const slotRef = doc(db, "slots", slotId);
        const slotDoc = await transaction.get(slotRef);

        if (!slotDoc.exists()) {
          throw new Error("Slot does not exist!");
        }

        const currentSlotData = slotDoc.data() as ParkingSlot;

        if (currentSlotData.status === "booked" && currentSlotData.bookedBy === user.uid) {
            transaction.update(slotRef, {
                status: "available",
                bookedBy: null,
                bookedAt: null,
                expiresAt: null,
                userEmail: null,
            });
            toast({ title: "Booking Cancelled", description: `You have cancelled your booking for slot ${slotId}.` });
        }
        else if (currentSlotData.status === "available") {
            if (userHasBooking) {
                throw new Error(`You already have a booking for slot ${userHasBooking.id}.`);
            }
            const now = Date.now();
            const expiresAt = now + EXPIRATION_MINUTES * 60 * 1000;
            transaction.update(slotRef, {
                status: "booked",
                bookedBy: user.uid,
                userEmail: user.email,
                bookedAt: now,
                expiresAt: expiresAt,
            });
            toast({ title: "Slot Booked!", description: `You have successfully booked slot ${slotId}. It will be held for ${EXPIRATION_MINUTES} minutes.` });
        } else {
          throw new Error("This slot is not available for booking.");
        }
      });
    } catch (error: any) {
      console.error("Transaction failed: ", error);
      toast({ variant: "destructive", title: "Action Failed", description: error.message });
    }
  };

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
      <main className="flex-1 bg-secondary/50 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ParkingGrid slots={slots} onSlotClick={handleSlotAction} currentUserId={user?.uid} />
            </div>
            <div className="flex flex-col gap-8">
              <ParkingStats slots={slots} />
              <ParkingTips slots={slots} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
