
"use client";

import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import type { ParkingSlot } from "@/lib/slots";
import { PARKING_ZONES } from "@/lib/slots";

const zonePositions = {
  A: { lat: 51.51, lng: -0.13 },
  B: { lat: 51.51, lng: -0.128 },
  C: { lat: 51.508, lng: -0.13 },
  D: { lat: 51.508, lng: -0.128 },
};

interface ParkingMapProps {
  slots: ParkingSlot[];
}

export default function ParkingMap({ slots }: ParkingMapProps) {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex items-center justify-center p-4 text-center bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p>
          Google Maps API Key is missing. Please add it to your .env file to display the map.
        </p>
      </div>
    );
  }

  const getZoneStatus = (zone: string) => {
    const zoneSlots = slots.filter((slot) => slot.id.startsWith(zone));
    const available = zoneSlots.filter((slot) => slot.status === "available").length;
    return { available, total: zoneSlots.length };
  };

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border mb-8">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={{ lat: 51.509, lng: -0.129 }}
          defaultZoom={15}
          mapId="PARKWISE_MAP"
        >
          {PARKING_ZONES.map((zone) => {
            const { available, total } = getZoneStatus(zone);
            const isAvailable = available > 0;
            return (
              <AdvancedMarker
                key={zone}
                position={zonePositions[zone as keyof typeof zonePositions]}
                title={`Zone ${zone}`}
              >
                <div
                  className={`flex flex-col items-center justify-center rounded-full border-2 w-16 h-16 shadow-lg
                    ${
                      isAvailable
                        ? "bg-green-500/80 border-green-300 text-white"
                        : "bg-red-500/80 border-red-300 text-white"
                    }`}
                >
                  <span className="text-lg font-bold">Zone {zone}</span>
                  <span className="text-xs font-semibold">{available}/{total}</span>
                </div>
              </AdvancedMarker>
            );
          })}
        </Map>
      </APIProvider>
    </div>
  );
}
