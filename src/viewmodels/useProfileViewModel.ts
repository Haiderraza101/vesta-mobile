import { useAuth } from '../context/AuthContext';
import { auth } from '../services/firebase.config';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

export const useProfileViewModel = () => {
  const { user, providerMeta } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Toast.show({ type: 'success', text1: 'Signed out successfully' });
      router.replace('/(auth)/login');
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Sign out failed', text2: error.message });
    }
  };

  return {
    user,
    providerMeta,
    handleSignOut,
  };
};
