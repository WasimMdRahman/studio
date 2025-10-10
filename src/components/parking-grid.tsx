import type { ParkingSlot as ParkingSlotType } from "@/lib/slots";
import ParkingSlot from "./parking-slot";
import { PARKING_ZONES } from "@/lib/slots";

interface ParkingGridProps {
  slots: ParkingSlotType[];
  onSlotClick: (slotId: string) => void;
  currentUserId?: string;
}

export default function ParkingGrid({ slots, onSlotClick, currentUserId }: ParkingGridProps) {
  return (
    <div>
      {PARKING_ZONES.map((zone) => (
        <div key={zone} className="mb-8 scroll-mt-20" id={`zone-${zone}`}>
          <h2 className="text-2xl font-bold mb-4">Zone {zone}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {slots
              .filter((slot) => slot.id.startsWith(zone))
              .map((slot) => (
                <ParkingSlot
                  key={slot.id}
                  slot={slot}
                  onClick={onSlotClick}
                  currentUserId={currentUserId}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
