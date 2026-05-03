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
  Timestamp,
  increment
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
  location: string;
  notes?: string;
  createdAt: any;
  rating?: number;
  review?: string;
  customerRating?: number;
  customerReview?: string;
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
        message: `You have a new booking request for ${booking.serviceName}`,
        type: 'booking'
      });

      return docRef.id;
    } catch (error) {
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
      throw error;
    }
  },

  updateBookingStatus: async (bookingId: string, status: BookingStatus) => {
    try {
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, { status });
    } catch (error) {
      throw error;
    }
  },

  rateProvider: async (bookingId: string, providerId: string, rating: number, review: string) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { 
        rating, 
        review,
        status: 'completed' 
      });

      const providerRef = doc(db, 'users', providerId);
      await updateDoc(providerRef, {
        totalRatings: increment(1),
        ratingSum: increment(rating),
      });

    } catch (error) {
      throw error;
    }
  },

  rateCustomer: async (bookingId: string, customerId: string, rating: number, review: string) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { 
        customerRating: rating, 
        customerReview: review 
      });
    } catch (error) {
      throw error;
    }
  },

  subscribeToBookings: (userId: string, role: UserRole, callback: (bookings: Booking[]) => void) => {
    const field = role === 'customer' ? 'customerId' : 'providerId';
    const q = query(
      collection(db, 'bookings'),
      where(field, '==', userId)
    );

    return onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Booking));
      callback(bookings);
    });
  }
};
