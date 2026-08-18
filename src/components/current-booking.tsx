
"use client";

import type { ParkingSlot } from "@/lib/slots";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useEffect, useState } from "react";
import { Clock, Info, Car, User, Hash } from "lucide-react";

interface CurrentBookingProps {
  slots: ParkingSlot[];
  currentUserId?: string;
}

export default function CurrentBooking({ slots, currentUserId }: CurrentBookingProps) {
  const [bookedSlot, setBookedSlot] = useState<ParkingSlot | null>(null);
  const [countdown, setCountdown] = useState("");
  const [bookedTime, setBookedTime] = useState("");

  useEffect(() => {
    const userSlot = slots.find(
      (slot) => slot.status === "booked" && slot.bookedBy === currentUserId
    );
    setBookedSlot(userSlot || null);
  }, [slots, currentUserId]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (bookedSlot && bookedSlot.expiresAt) {
      const updateCountdown = () => {
        const now = Date.now();
        const timeLeft = bookedSlot.expiresAt! - now;
        if (timeLeft > 0) {
          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
          const seconds = Math.floor((timeLeft / 1000) % 60);
          setCountdown(
            `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
          );
        } else {
          setCountdown("Expired");
          if (interval) clearInterval(interval);
        }
      };
      updateCountdown();
      interval = setInterval(updateCountdown, 1000);
    }
     if (bookedSlot && bookedSlot.bookedAt) {
      setBookedTime(new Date(bookedSlot.bookedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [bookedSlot]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Booking</CardTitle>
        <CardDescription>Details about your current reservation.</CardDescription>
      </CardHeader>
      <CardContent>
        {bookedSlot ? (
          <div className="space-y-4 text-sm">
             <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2"><User className="h-4 w-4" /> Name</span>
              <span className="font-bold text-foreground">{bookedSlot.userName}</span>
            </div>
             <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2"><Car className="h-4 w-4" /> Car No.</span>
              <span className="font-bold text-foreground">{bookedSlot.carNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2"><Hash className="h-4 w-4" /> Booked Slot</span>
              <span className="font-bold text-primary text-lg">{bookedSlot.id}</span>
            </div>
             <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> Booked At</span>
              <span className="font-bold text-foreground">{bookedTime}</span>
            </div>
            <div className="flex justify-between items-center border-t border-dashed border-gray-600 pt-4 mt-4">
              <span className="text-muted-foreground flex items-center gap-2">Time Left</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-300 text-lg">{countdown}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center text-center text-muted-foreground p-4 justify-center">
            <Info className="mr-2 h-5 w-5" />
            <p>You have no active bookings.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
