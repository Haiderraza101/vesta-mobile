import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserRole } from './userService';
import { notificationService } from './notificationService';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id?: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
  price: string | number;
  status: BookingStatus;
  date: string;
  time: string;
  address: string;
  createdAt: any;
}

export const bookingService = {
  createBooking: async (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    try {
      const docRef = await addDoc(collection(db, 'bookings'), {
        ...booking,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      await notificationService.sendNotification({
        userId: booking.providerId,
        title: "New Booking Request",
        message: `You have a new booking for ${booking.serviceName}`,
        type: 'booking'
      });

      return docRef.id;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  },

  getCustomerBookings: async (customerId: string): Promise<Booking[]> => {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('customerId', '==', customerId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
    } catch (error) {
      console.error("Error getting customer bookings:", error);
      throw error;
    }
  },

  getProviderBookings: async (providerId: string): Promise<Booking[]> => {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('providerId', '==', providerId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
    } catch (error) {
      console.error("Error getting provider bookings:", error);
      throw error;
    }
  },

  updateBookingStatus: async (bookingId: string, status: BookingStatus) => {
    try {
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, { status });
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw error;
    }
  },

  subscribeToBookings: (userId: string, role: UserRole, callback: (bookings: Booking[]) => void) => {
    let q;
    if (role === 'admin') {
      q = query(collection(db, 'bookings'));
    } else {
      q = query(
        collection(db, 'bookings'),
        where(role === 'provider' ? 'providerId' : 'customerId', '==', userId)
      );
    }

    return onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      callback(bookings);
    });
  }
};
