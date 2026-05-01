import { useState } from 'react';
import { db } from '../services/firebase.config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

export const useBookingCreationViewModel = (providerId: string, category: string) => {
  const { user } = useAuth();
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBooking = async () => {
    if (!user) return;
    if (description.length < 10) {
      Toast.show({ type: 'error', text1: 'Description too short' });
      return;
    }
    if (address.length < 5) {
      Toast.show({ type: 'error', text1: 'Please enter a valid address' });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        customerId: user.uid,
        providerId: providerId,
        serviceCategory: category,
        description,
        address,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      Toast.show({
        type: 'success',
        text1: 'Request Submitted!',
        text2: 'Wait for the provider to accept.',
      });
      router.replace('/(customer-tabs)/bookings');
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Booking Failed', text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  return {
    description,
    setDescription,
    address,
    setAddress,
    loading,
    handleBooking,
  };
};
