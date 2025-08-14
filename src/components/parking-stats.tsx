import type { ParkingSlot } from "@/lib/slots";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TOTAL_SLOTS } from "@/lib/slots";

interface ParkingStatsProps {
  slots: ParkingSlot[];
}

export default function ParkingStats({ slots }: ParkingStatsProps) {
  const available = slots.filter(s => s.status === 'available').length;
  const booked = TOTAL_SLOTS - available;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Available Slots</span>
            <span className="font-bold text-green-400 text-lg">{available}</span>
        </div>
        <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Booked Slots</span>
            <span className="font-bold text-red-400 text-lg">{booked}</span>
        </div>
        <div className="flex justify-between items-center border-t pt-4 mt-2">
            <span className="text-muted-foreground">Total Capacity</span>
            <span className="font-bold text-blue-400">{TOTAL_SLOTS}</span>
        </div>
      </CardContent>
    </Card>
  );
}
