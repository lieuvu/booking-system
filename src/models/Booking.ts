enum BookingStatus {
  Active = 'active',
  Inactive = 'inactive',
}

interface Booking {
  id: number;
  user_id: number;
  machine_id: number;
  start_time: string;
  end_time: string;
}

// Export
export type { Booking };
export { BookingStatus };
