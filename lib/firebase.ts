import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';
// @ts-ignore - getReactNativePersistence is available at runtime in RN but may not show in some TS configs
import { getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAO4YcLqjGmJ6G8qMdp_p1pOJJt5aFXg9A",
  authDomain: "vesta-mobile-601ef.firebaseapp.com",
  projectId: "vesta-mobile-601ef",
  storageBucket: "vesta-mobile-601ef.firebasestorage.app",
  messagingSenderId: "779326097876",
  appId: "1:779326097876:android:aedb21b519f9ebee072e41"
};

// Initialize Firebase with singleton pattern
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
