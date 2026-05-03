import { useState, useEffect } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Booking } from "@/services/bookingService";
import { UserProfile } from "@/services/userService";

export interface AdminStats {
  totalUsers: number;
  totalProviders: number;
  totalCustomers: number;
  totalAdmins: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalServices: number;
  totalCategories: number;
  recentBookings: Booking[];
  topServices: { name: string, count: number, color: string }[];
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalProviders: 0,
    totalCustomers: 0,
    totalAdmins: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalServices: 0,
    totalCategories: 0,
    recentBookings: [],
    topServices: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listeners for all core collections
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      const users = snap.docs.map(doc => doc.data() as UserProfile);
      setStats(prev => ({
        ...prev,
        totalUsers: users.length,
        totalProviders: users.filter(u => u.role === 'provider').length,
        totalCustomers: users.filter(u => u.role === 'customer').length,
        totalAdmins: users.filter(u => u.role === 'admin').length
      }));
    });

    const unsubBookings = onSnapshot(collection(db, "bookings"), (snap) => {
      const bookings = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      
      const serviceCounts: { [key: string]: number } = {};
      bookings.forEach(b => {
        if (b.serviceName) {
          serviceCounts[b.serviceName] = (serviceCounts[b.serviceName] || 0) + 1;
        }
      });

      const colors = ['#4C6FFF', '#10B981', '#F59E0B', '#8B5CF6'];
      const topServices = Object.entries(serviceCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4)
        .map(([name, count], i) => ({
          name,
          count,
          color: colors[i] || '#4C6FFF'
        }));

      setStats(prev => ({
        ...prev,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        completedBookings: bookings.filter(b => b.status === 'completed').length,
        cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
        recentBookings: bookings.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds).slice(0, 5),
        topServices
      }));
    });

    const unsubCategories = onSnapshot(collection(db, "categories"), (snap) => {
      setStats(prev => ({ ...prev, totalCategories: snap.size }));
    });

    const unsubServices = onSnapshot(collection(db, "services"), (snap) => {
      setStats(prev => ({ ...prev, totalServices: snap.size }));
    });

    setLoading(false);

    return () => {
      unsubUsers();
      unsubBookings();
      unsubCategories();
      unsubServices();
    };
  }, []);

  return { stats, loading };
}
