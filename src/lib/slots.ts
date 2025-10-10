
export interface ParkingSlot {
  id: string;
  status: 'available' | 'booked' | 'expired';
  bookedBy?: string | null;
  bookedAt?: number | null;
  expiresAt?: number | null;
  userEmail?: string | null;
  userName?: string | null;
  carNumber?: string | null;
}

export interface BookingDetails {
    slotId: string;
    durationHours: number;
    totalPrice: number;
    name: string;
    carNumber: string;
    email: string;
}

export const PARKING_ZONES = ['A', 'B', 'C', 'D'];
export const SLOTS_PER_ZONE = 6;
export const TOTAL_SLOTS = PARKING_ZONES.length * SLOTS_PER_ZONE;
export const EXPIRATION_MINUTES = 15;
