"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Loader2, Wand2 } from "lucide-react";
import type { ParkingSlot } from "@/lib/slots";
import { parkingTips } from "@/ai/flows/parking-tips";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface ParkingTipsProps {
    slots: ParkingSlot[];
}

export default function ParkingTips({ slots }: ParkingTipsProps) {
    const [tip, setTip] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGetTip = async () => {
        setLoading(true);
        setError("");
        setTip("");
        try {
            const availableSlots = slots.filter(s => s.status === 'available').length;
            const totalSlots = slots.length;
            const availability = `${availableSlots} out of ${totalSlots} slots are available.`;
            
            // In a real app, this would be derived from a bookings_history collection.
            const bookingHistory = "User tends to book in the morning and prefers Zone A.";

            const result = await parkingTips({
                currentSlotAvailability: availability,
                userBookingHistory: bookingHistory
            });
            setTip(result.parkingTip);
        } catch (e) {
            setError("Could not generate a tip at this moment. Please try again later.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Parking Assistant</CardTitle>
                <CardDescription>Get a smart tip for your next parking move.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading && (
                    <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <p className="ml-2 text-muted-foreground">Generating your tip...</p>
                    </div>
                )}
                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {tip && !loading && (
                    <Alert className="bg-primary/5 border-primary/20">
                        <Wand2 className="h-4 w-4 text-primary" />
                        <AlertTitle className="text-primary">Your Tip!</AlertTitle>
                        <AlertDescription>{tip}</AlertDescription>
                    </Alert>
                )}
                <Button onClick={handleGetTip} disabled={loading} className="w-full mt-4">
                    <Wand2 className="mr-2 h-4 w-4" />
                    {loading ? "Thinking..." : "Generate Tip"}
                </Button>
            </CardContent>
        </Card>
    )
}
