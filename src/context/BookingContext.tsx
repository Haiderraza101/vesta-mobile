import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../services/db.service';
import { Booking } from '../models/Booking';
import { useAuth } from './AuthContext';
import { where } from 'firebase/firestore';

interface BookingContextType {
  activeBookings: Booking[];
  bookingHistory: Booking[];
  loading: boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.role) {
      setActiveBookings([]);
      setBookingHistory([]);
      setLoading(false);
      return;
    }

    const roleField = user.role === 'customer' ? 'customerId' : 'providerId';

    // For providers, we also want to see 'pending' bookings of their category
    // but the handoff says P-01 has its own listener for pending feed.
    // So this context will focus on the user's OWN bookings.

    const queries = [
      where(roleField, '==', user.uid),
    ];

    const unsubscribe = dbService.subscribe('bookings', queries, (data) => {
      const bookings = [...(data as Booking[])].sort((left, right) => {
        const leftTime = left.createdAt?.toMillis ? left.createdAt.toMillis() : new Date(left.createdAt || 0).getTime();
        const rightTime = right.createdAt?.toMillis ? right.createdAt.toMillis() : new Date(right.createdAt || 0).getTime();
        return rightTime - leftTime;
      });
      setActiveBookings(bookings.filter(b => ['pending', 'accepted'].includes(b.status)));
      setBookingHistory(bookings.filter(b => ['completed', 'cancelled'].includes(b.status)));
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  return (
    <BookingContext.Provider value={{ activeBookings, bookingHistory, loading }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};
