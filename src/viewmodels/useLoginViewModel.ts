import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../services/firebase.config';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { validateEmail } from '../utils/helpers';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

export const useLoginViewModel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const router = useRouter();

  const handleLogin = async () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!validateEmail(email)) newErrors.email = 'Invalid email address';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email,
          role: null,
          profileImageUrl: null,
          createdAt: serverTimestamp(),
        });
      }

      const userData = userSnap.exists() ? userSnap.data() : null;

      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: 'You have successfully signed in.',
      });

      if (!userData?.role) {
        router.replace('/(auth)/role-selection');
        return;
      }

      router.replace(userData.role === 'customer' ? '/(customer-tabs)' : '/(provider-tabs)');
    } catch (error: any) {
      const messageByCode: Record<string, string> = {
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/user-not-found': 'No account was found for that email.',
        'auth/wrong-password': 'Incorrect email or password.',
        'auth/invalid-credential': 'Incorrect email or password.',
        'auth/network-request-failed': 'Network error. Check your connection and try again.',
      };

      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: messageByCode[error?.code] || error.message || 'Unable to sign in right now.',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    errors,
    handleLogin,
  };
};
