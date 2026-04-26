import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Service {
  id: string;
  title: string;
  price: string;
  rating: string;
  reviews: string;
  description: string;
  image: string;
  category: string;
  providerId: string;
}

export const serviceService = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const snapshot = await getDocs(collection(db, 'categories'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    } catch (error) {
      console.error("Error getting categories:", error);
      throw error;
    }
  },

  getPopularServices: async (): Promise<Service[]> => {
    try {
      const q = query(collection(db, 'services'), limit(10));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
    } catch (error) {
      console.error("Error getting popular services:", error);
      throw error;
    }
  },

  getServicesByCategory: async (categoryName: string): Promise<Service[]> => {
    try {
      const q = query(collection(db, 'services'), where('category', '==', categoryName));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
    } catch (error) {
      console.error("Error getting services by category:", error);
      throw error;
    }
  }
};
