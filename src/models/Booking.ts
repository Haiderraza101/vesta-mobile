export type BookingStatus = 'pending' | 'accepted' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  serviceCategory: string;
  description: string;
  address: string;
  status: BookingStatus;
  createdAt: any;
}
