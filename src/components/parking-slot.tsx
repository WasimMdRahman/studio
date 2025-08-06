"use client";

import type { ParkingSlot as ParkingSlotType } from "@/lib/slots";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { cn } from "@/lib/utils";
import { Car, Check, Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useEffect, useState } from "react";

interface ParkingSlotProps {
  slot: ParkingSlotType;
  onClick: (slotId: string) => void;
  currentUserId?: string;
}

const statusConfig = {
  available: {
    label: "Available",
    icon: Check,
    cardClass: "border-green-500/50 bg-green-500/20 hover:bg-green-500/30 text-green-900",
    iconClass: "text-green-700",
    footerClass: "text-green-800"
  },
  booked: {
    label: "Booked",
    icon: Car,
    cardClass: "border-red-500/50 bg-red-500/10 text-red-900",
    iconClass: "text-red-600",
    footerClass: 'text-red-700'
  },
  expired: {
    label: "Expired",
    icon: Clock,
    cardClass: "border-gray-500/30 bg-gray-500/50 text-gray-800",
    iconClass: "text-gray-600",
    footerClass: "text-gray-700",
  }
};

export default function ParkingSlot({ slot, onClick, currentUserId }: ParkingSlotProps) {
  const isBookedByCurrentUser = slot.status === "booked" && slot.bookedBy === currentUserId;
  const isClickable = slot.status === "available" || isBookedByCurrentUser;
  
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (slot.status === 'booked' && slot.expiresAt) {
      const updateCountdown = () => {
        const now = Date.now();
        const timeLeft = slot.expiresAt! - now;
        if (timeLeft > 0) {
          const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
          const seconds = Math.floor((timeLeft / 1000) % 60);
          setCountdown(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        } else {
          setCountdown("Expired");
          if(interval) clearInterval(interval);
        }
      };
      updateCountdown();
      interval = setInterval(updateCountdown, 1000);
    }
    return () => {
      if(interval) clearInterval(interval);
    };
  }, [slot.status, slot.expiresAt]);

  const config = statusConfig[slot.status];
  const cardClasses = cn(
    "text-center transition-colors",
    config.cardClass,
    isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-80",
    isBookedByCurrentUser && "border-yellow-500 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-900"
  );
  const iconClasses = cn(
    "mx-auto h-8 w-8",
    config.iconClass,
    isBookedByCurrentUser && "text-yellow-700"
  );
  
  const footerClasses = cn(
    "p-2 pt-0 text-xs flex justify-center h-4",
    isBookedByCurrentUser ? "text-yellow-800" : config.footerClass
  );

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={cardClasses}
            onClick={() => isClickable && onClick(slot.id)}
            aria-label={`Parking slot ${slot.id}, status: ${isBookedByCurrentUser ? 'Booked by you' : slot.status}`}
          >
            <CardHeader className="p-2 pb-0">
              <config.icon className={iconClasses} />
            </CardHeader>
            <CardContent className="p-2 pb-0">
              <p className="font-bold text-lg">{slot.id}</p>
            </CardContent>
            <CardFooter className={footerClasses}>
              {isBookedByCurrentUser ? (
                <span className="font-medium">{countdown} left</span>
              ) : slot.status === 'booked' ? (
                'Booked'
              ) : (
                'Available'
              )}
            </CardFooter>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
            {isBookedByCurrentUser ? (
                <p>Click to cancel your booking.</p>
            ) : slot.status === 'booked' ? (
                <p>Booked by another user.</p>
            ) : slot.status === 'available' ? (
                <p>Click to book this slot.</p>
            ) : (
                <p>This slot recently expired.</p>
            )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
