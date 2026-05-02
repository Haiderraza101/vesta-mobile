import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  deleteDoc,
  doc
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
  price: number;
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
  },

  addCategory: async (category: Omit<Category, 'id'>) => {
    try {
      await addDoc(collection(db, 'categories'), category);
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  },

  addService: async (service: Omit<Service, 'id'>) => {
    try {
      await addDoc(collection(db, 'services'), service);
    } catch (error) {
      console.error("Error adding service:", error);
      throw error;
    }
  },

  deleteCategory: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },

  deleteService: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (error) {
      console.error("Error deleting service:", error);
      throw error;
    }
  }
};
