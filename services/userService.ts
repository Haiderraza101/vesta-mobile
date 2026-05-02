import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  collection,
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export type UserRole = 'customer' | 'provider' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: any;
  phoneNumber?: string;
  avatar?: string;
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

  getAllUsers: async (page: number = 1, limit: number = 10): Promise<UserProfile[]> => {
    try {
      // In production, we'd use Firestore limit() and startAfter()
      // For now, we simulate the interface
      const snapshot = await getDocs(collection(db, 'users'));
      const allUsers = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
      
      const start = (page - 1) * limit;
      return allUsers.slice(start, start + limit);
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  },

  updateUserRole: async (uid: string, role: UserRole) => {
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, { role });
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  }
};
