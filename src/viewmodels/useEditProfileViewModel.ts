import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase.config';
import { doc, updateDoc } from 'firebase/firestore';
import { uploadToCloudinary } from '../services/cloudinary.service';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

export const useEditProfileViewModel = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImageUrl || null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUploading(true);
      try {
        const url = await uploadToCloudinary(result.assets[0].uri);
        setProfileImageUrl(url);
        Toast.show({ type: 'success', text1: 'Image uploaded!' });
      } catch (error: any) {
        Toast.show({ type: 'error', text1: 'Upload failed', text2: error.message });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (fullName.length < 2) {
      Toast.show({ type: 'error', text1: 'Name too short' });
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        fullName,
        profileImageUrl,
      });
      Toast.show({ type: 'success', text1: 'Profile updated!' });
      router.back();
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Update failed', text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  return {
    fullName,
    setFullName,
    profileImageUrl,
    pickImage,
    handleSave,
    loading,
    uploading,
  };
};
