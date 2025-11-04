
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
  onZoneClick?: (zone: string) => void;
}

export default function ParkingMap({ slots, onZoneClick }: ParkingMapProps) {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY") {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center bg-yellow-100/80 border border-yellow-400 text-yellow-800 rounded-lg space-y-4">
        <div>
          <p className="font-bold">Action Required: Your Google Maps API key is missing or invalid.</p>
          <p>Please add your key to the <code>.env</code> file to display the map.</p>
        </div>
        <div>
          <p className="font-bold mt-2">If the error persists after adding the key, please check the following in your Google Cloud Console:</p>
          <ul className="text-left list-disc list-inside mt-2 space-y-1">
            <li><a href="https://console.cloud.google.com/apis/library/maps-javascript-backend.googleapis.com?project=parkwise-i92rx" target="_blank" rel="noopener noreferrer" className="underline font-medium">Ensure the Maps JavaScript API is enabled.</a></li>
            <li><a href="https://console.cloud.google.com/billing?project=parkwise-i92rx" target="_blank" rel="noopener noreferrer" className="underline font-medium">Ensure a billing account is linked to your project.</a></li>
            <li><a href="https://console.cloud.google.com/apis/credentials?project=parkwise-i92rx" target="_blank" rel="noopener noreferrer" className="underline font-medium">Check your API key restrictions (try removing them temporarily).</a></li>
          </ul>
        </div>
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
                title={`Zone ${zone}: ${available} of ${total} slots available`}
                onClick={() => onZoneClick?.(zone)}
              >
                <div
                  className={`flex flex-col items-center justify-center rounded-full border-2 w-20 h-20 shadow-lg transition-all cursor-pointer
                    ${
                      isAvailable
                        ? "bg-green-500/80 border-green-300 text-white"
                        : "bg-red-500/80 border-red-300 text-white"
                    }`}
                >
                  <span className="text-lg font-bold">Zone {zone}</span>
                  <span className="text-sm font-semibold">{available} / {total}</span>
                  <span className="text-xs">available</span>
                </div>
              </AdvancedMarker>
            );
          })}
        </Map>
      </APIProvider>
    </div>
  );
}
