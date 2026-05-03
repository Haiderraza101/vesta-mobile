import { useState, useEffect } from "react";
import { collection, onSnapshot, getDocs } from "firebase/firestore";
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

  const calculateTopServices = (bookings: Booking[]) => {
    const serviceCounts: { [key: string]: number } = {};
    bookings.forEach(b => {
      if (b.serviceName) {
        serviceCounts[b.serviceName] = (serviceCounts[b.serviceName] || 0) + 1;
      }
    });

    const colors = ['#4C6FFF', '#10B981', '#F59E0B', '#8B5CF6'];
    return Object.entries(serviceCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([name, count], i) => ({
        name,
        count,
        color: colors[i] || '#4C6FFF'
      }));
  };

  const refreshStats = async () => {
    try {
      const [usersSnap, catsSnap, servsSnap, booksSnap] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "categories")),
        getDocs(collection(db, "services")),
        getDocs(collection(db, "bookings"))
      ]);

      const allUsers = usersSnap.docs.map(doc => doc.data() as UserProfile);
      const allBookings = booksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));

      setStats({
        totalUsers: allUsers.length,
        totalProviders: allUsers.filter(u => u.role === 'provider').length,
        totalCustomers: allUsers.filter(u => u.role === 'customer').length,
        totalAdmins: allUsers.filter(u => u.role === 'admin').length,
        totalBookings: allBookings.length,
        pendingBookings: allBookings.filter(b => b.status === 'pending').length,
        completedBookings: allBookings.filter(b => b.status === 'completed').length,
        cancelledBookings: allBookings.filter(b => b.status === 'cancelled').length,
        totalServices: servsSnap.size,
        totalCategories: catsSnap.size,
        recentBookings: allBookings.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 3),
        topServices: calculateTopServices(allBookings)
      });
    } catch (error) {
      console.error("Refresh error:", error);
    }
  };

  useEffect(() => {
    let usersLoaded = false;
    let categoriesLoaded = false;
    let servicesLoaded = false;
    let bookingsLoaded = false;

    const checkLoading = () => {
      if (usersLoaded && categoriesLoaded && servicesLoaded && bookingsLoaded) {
        setLoading(false);
      }
    };

    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const allUsers = snapshot.docs.map(doc => doc.data() as UserProfile);
      setStats(prev => ({
        ...prev,
        totalUsers: allUsers.length,
        totalProviders: allUsers.filter(u => u.role === 'provider').length,
        totalCustomers: allUsers.filter(u => u.role === 'customer').length,
        totalAdmins: allUsers.filter(u => u.role === 'admin').length,
      }));
      usersLoaded = true;
      checkLoading();
    });

    const unsubCategories = onSnapshot(collection(db, "categories"), (snapshot) => {
      setStats(prev => ({ ...prev, totalCategories: snapshot.size }));
      categoriesLoaded = true;
      checkLoading();
    });

    const unsubServices = onSnapshot(collection(db, "services"), (snapshot) => {
      setStats(prev => ({ ...prev, totalServices: snapshot.size }));
      servicesLoaded = true;
      checkLoading();
    });

    const unsubBookings = onSnapshot(collection(db, "bookings"), (snapshot) => {
      const allBookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setStats(prev => ({
        ...prev,
        totalBookings: allBookings.length,
        pendingBookings: allBookings.filter(b => b.status === 'pending').length,
        completedBookings: allBookings.filter(b => b.status === 'completed').length,
        cancelledBookings: allBookings.filter(b => b.status === 'cancelled').length,
        recentBookings: allBookings.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 3),
        topServices: calculateTopServices(allBookings)
      }));
      bookingsLoaded = true;
      checkLoading();
    });

    return () => {
      unsubUsers();
      unsubCategories();
      unsubServices();
      unsubBookings();
    };
  }, []);

  return { stats, loading, refreshStats };
}
