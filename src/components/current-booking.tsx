"use client";

import type { ParkingSlot } from "@/lib/slots";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useEffect, useState } from "react";
import { Clock, Info } from "lucide-react";

interface CurrentBookingProps {
  slots: ParkingSlot[];
  currentUserId?: string;
}

export default function CurrentBooking({ slots, currentUserId }: CurrentBookingProps) {
  const [bookedSlot, setBookedSlot] = useState<ParkingSlot | null>(null);
  const [countdown, setCountdown] = useState("");

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
          const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
          const seconds = Math.floor((timeLeft / 1000) % 60);
          setCountdown(
            `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
          );
        } else {
          setCountdown("Expired");
          if (interval) clearInterval(interval);
        }
      };
      updateCountdown();
      interval = setInterval(updateCountdown, 1000);
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
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Booked Slot</span>
              <span className="font-bold text-primary text-lg">{bookedSlot.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Time Left</span>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-400" />
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
