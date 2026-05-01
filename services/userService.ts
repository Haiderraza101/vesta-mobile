import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export type UserRole = 'customer' | 'provider';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: any;
  phoneNumber?: string;
}

export const userService = {
  createUserProfile: async (uid: string, profile: Omit<UserProfile, 'uid' | 'createdAt'>) => {
    try {
      await setDoc(doc(db, 'users', uid), {
        ...profile,
        uid,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  },

  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  },

  updateUserProfile: async (uid: string, data: Partial<UserProfile>) => {
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },
};
