import { useState, useEffect } from 'react';
import { db } from '../services/firebase.config';
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';

export const useProviderHomeViewModel = () => {
  const { user, providerMeta } = useAuth();
  const [isAvailable, setIsAvailable] = useState(providerMeta?.isAvailable || false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (providerMeta) {
      setIsAvailable(providerMeta.isAvailable);
    }
  }, [providerMeta]);

  useEffect(() => {
    if (!providerMeta || !isAvailable) {
      setJobs([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'bookings'),
      where('serviceCategory', '==', providerMeta.serviceType),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const incomingJobs = await Promise.all(
        snapshot.docs.map(async (bookingDoc) => {
          const bookingData = { id: bookingDoc.id, ...bookingDoc.data() } as any;
          const customerSnap = await getDoc(doc(db, 'users', bookingData.customerId));
          return { ...bookingData, customerName: customerSnap.exists() ? customerSnap.data().fullName : 'Customer' };
        })
      );

      incomingJobs.sort((left, right) => {
        const leftTime = left.createdAt?.toMillis ? left.createdAt.toMillis() : new Date(left.createdAt || 0).getTime();
        const rightTime = right.createdAt?.toMillis ? right.createdAt.toMillis() : new Date(right.createdAt || 0).getTime();
        return rightTime - leftTime;
      });

      setJobs(incomingJobs);
      setLoading(false);
    });

    return unsubscribe;
  }, [providerMeta, isAvailable]);

  const toggleAvailability = async (value: boolean) => {
    if (!user) return;
    setIsAvailable(value);
    try {
      await updateDoc(doc(db, 'providers_meta', user.uid), { isAvailable: value });
    } catch (error: any) {
      setIsAvailable(!value);
      Toast.show({ type: 'error', text1: 'Update Failed', text2: error.message });
    }
  };

  const acceptJob = async (bookingId: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'accepted',
        providerId: user.uid,
      });
      Toast.show({ type: 'success', text1: 'Job Accepted!', text2: 'Go to active job to manage it.' });
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Accept Failed', text2: error.message });
    }
  };

  return {
    isAvailable,
    toggleAvailability,
    jobs,
    loading,
    acceptJob,
    firstName: user?.fullName.split(' ')[0] || '',
  };
};
