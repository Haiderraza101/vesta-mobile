import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../services/firebase.config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { validateEmail } from '../utils/helpers';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { UserRole } from '../models/User';

export const useRegisterViewModel = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string; confirmPassword?: string; role?: string }>({});
  const router = useRouter();

  const handleRegister = async () => {
    const newErrors: any = {};
    if (fullName.length < 2) newErrors.fullName = 'Name too short';
    if (!validateEmail(email)) newErrors.email = 'Invalid email';
    if (password.length < 6) newErrors.password = 'Min 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!selectedRole) newErrors.role = 'Select your account type';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        fullName,
        email,
        role: selectedRole,
        profileImageUrl: null,
        createdAt: serverTimestamp(),
      });

      Toast.show({
        type: 'success',
        text1: 'Account Created',
        text2: selectedRole === 'provider' ? 'Set up your service profile next.' : 'Your account is ready.',
      });

      if (selectedRole === 'provider') {
        router.replace('/(auth)/role-selection');
      } else {
        router.replace('/(customer-tabs)');
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    selectedRole,
    setSelectedRole,
    loading,
    errors,
    handleRegister,
  };
};
