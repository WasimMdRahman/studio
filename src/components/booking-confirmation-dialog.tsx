
"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import type { ParkingSlot, BookingDetails } from "@/lib/slots";
import { Input } from "./ui/input";

interface BookingConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  slot: ParkingSlot;
  onConfirm: (details: BookingDetails) => void;
}

export default function BookingConfirmationDialog({
  isOpen,
  onOpenChange,
  slot,
  onConfirm,
}: BookingConfirmationDialogProps) {
  const [duration, setDuration] = useState(1); // Default to 1 hour
  const [name, setName] = useState("");
  const [carNumber, setCarNumber] = useState("");

  const calculatePrice = (hours: number) => {
    if (hours <= 0) return 0;
    if (hours === 1) return 8;
    return 8 + (hours - 1) * 5;
  };

  const totalPrice = calculatePrice(duration);

  const handleConfirm = () => {
    onConfirm({
      slotId: slot.id,
      durationHours: duration,
      totalPrice: totalPrice,
      name: name,
      carNumber: carNumber,
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm your booking for Slot {slot.id}</AlertDialogTitle>
          <AlertDialogDescription>
            Please provide your details and select your desired parking duration.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="carNumber">Car Number</Label>
                <Input id="carNumber" placeholder="ABC-123" value={carNumber} onChange={(e) => setCarNumber(e.target.value)} />
            </div>
            <div className="grid gap-2">
                 <Label htmlFor="duration">Parking Duration (hours)</Label>
                 <Slider
                    id="duration"
                    min={1}
                    max={8}
                    step={1}
                    value={[duration]}
                    onValueChange={(value) => setDuration(value[0])}
                 />
                 <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1hr</span>
                    <span>4hr</span>
                    <span>8hr</span>
                 </div>
            </div>
            <div className="text-center text-lg font-bold">
                Selected: {duration} {duration > 1 ? "hours" : "hour"}
            </div>
            <div className="text-center text-2xl font-bold text-primary">
                Total: ${totalPrice}
            </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={!name || !carNumber}>Proceed to Payment</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
