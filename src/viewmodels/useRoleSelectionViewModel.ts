import { useState } from 'react';
import { db } from '../services/firebase.config';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { UserRole } from '../models/User';

export const useRoleSelectionViewModel = () => {
  const { user, setUser, setProviderMeta } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.role ?? null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    if (!user) return;

    const effectiveRole = user.role ?? selectedRole;

    if (!effectiveRole) {
      return;
    }

    if (effectiveRole === 'provider' && !selectedService) {
      Toast.show({ type: 'info', text1: 'Please select a service type' });
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);

      if (user.role !== effectiveRole) {
        await updateDoc(userRef, { role: effectiveRole });
        setUser({ ...user, role: effectiveRole });
      }

      if (effectiveRole === 'provider') {
        await setDoc(doc(db, 'providers_meta', user.uid), {
          serviceType: selectedService,
          isAvailable: false,
          rating: 0,
          totalJobs: 0,
        });

        setProviderMeta({
          uid: user.uid,
          serviceType: selectedService,
          isAvailable: false,
          rating: 0,
          totalJobs: 0,
        });
      } else {
        setProviderMeta(null);
      }

      Toast.show({
        type: 'success',
        text1: 'Role Selected',
        text2: effectiveRole === 'provider' ? 'Your provider profile is ready.' : 'Your customer account is ready.',
      });

      router.replace(effectiveRole === 'customer' ? '/(customer-tabs)/index' : '/(provider-tabs)/index');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    isProviderSetup: user?.role === 'provider',
    selectedRole,
    setSelectedRole,
    selectedService,
    setSelectedService,
    loading,
    handleContinue,
  };
};
