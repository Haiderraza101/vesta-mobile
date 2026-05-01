import { useState, useEffect } from 'react';
import { db } from '../services/firebase.config';
import { doc, onSnapshot, updateDoc, increment, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

export const useActiveJobViewModel = (bookingId: string) => {
  const { user } = useAuth();
  const [booking, setBooking] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!bookingId) return;

    const unsubscribe = onSnapshot(doc(db, 'bookings', bookingId), async (snap) => {
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() };
        setBooking(data);

        const customerSnap = await getDoc(doc(db, 'users', data.customerId));
        if (customerSnap.exists()) {
          setCustomer(customerSnap.data());
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [bookingId]);

  const markAsCompleted = async () => {
    if (!user || !bookingId) return;
    setIsCompleting(true);
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status: 'completed' });
      await updateDoc(doc(db, 'providers_meta', user.uid), { totalJobs: increment(1) });

      Toast.show({ type: 'success', text1: 'Great job!', text2: 'Job marked as completed.' });
      router.replace({
        pathname: '/(provider-tabs)/job-completed',
        params: { bookingId }
      });
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message });
      setIsCompleting(false);
    }
  };

  return {
    booking,
    customer,
    loading,
    isCompleting,
    markAsCompleted,
  };
};
