import { 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Booking } from './bookingService';
import { Service } from './serviceService';

export interface ProviderStats {
  totalEarnings: number;
  totalBookings: number;
  averageRating: number;
  activeBookings: number;
}

export const providerService = {
  subscribeToProviderStats: (providerId: string, callback: (stats: ProviderStats) => void) => {
    const q = query(
      collection(db, 'bookings'),
      where('providerId', '==', providerId)
    );

    return onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map(doc => doc.data() as Booking);
      
      const stats: ProviderStats = {
        totalEarnings: bookings
          .filter(b => b.status === 'completed')
          .reduce((sum, b) => {
            const priceStr = b.price.replace('$', '').replace(',', '');
            return sum + (parseFloat(priceStr) || 0);
          }, 0),
        totalBookings: bookings.filter(b => b.status !== 'cancelled').length,
        averageRating: 4.9,
        activeBookings: bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length,
      };
      
      callback(stats);
    });
  },

  subscribeToProviderServices: (providerId: string, callback: (services: Service[]) => void) => {
    const q = query(
      collection(db, 'services'),
      where('providerId', '==', providerId)
    );

    return onSnapshot(q, (snapshot) => {
      const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
      callback(services);
    });
  },

  getRecentBookings: async (providerId: string, count: number = 5): Promise<Booking[]> => {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('providerId', '==', providerId),
        orderBy('createdAt', 'desc'),
        limit(count)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
    } catch (error) {
      console.error("Error getting recent bookings:", error);
      return [];
    }
  }
};
