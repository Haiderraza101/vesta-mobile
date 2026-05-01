import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAO4YcLqjGmJ6G8qMdp_p1pOJJt5aFXg9A",
  authDomain: "vesta-mobile-601ef.firebaseapp.com",
  projectId: "vesta-mobile-601ef",
  storageBucket: "vesta-mobile-601ef.firebasestorage.app",
  messagingSenderId: "779326097876",
  appId: "1:779326097876:android:aedb21b519f9ebee072e41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
