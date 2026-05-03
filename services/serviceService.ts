import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  doc,
  onSnapshot,
  updateDoc,
  FirestoreError,
  serverTimestamp,
  deleteDoc
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
  price: string | number;
  rating: string;
  reviews: string;
  description: string;
  image: string;
  category: string;
  providerId: string;
  providerName?: string;
  experience?: string;
  bio?: string;
  isTemplate?: boolean;
}

export interface ProviderRequest {
  id?: string;
  providerId: string;
  providerName: string;
  type: 'hiring' | 'service';
  serviceId?: string;
  serviceName?: string;
  proposedPrice?: number;
  experience?: string;
  additionalInfo?: string;
  category?: string;
  image?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: any;
}

export const serviceService = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const snapshot = await getDocs(collection(db, 'categories'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    } catch (error) {
      throw error;
    }
  },

  subscribeToCategories: (callback: (categories: Category[]) => void) => {
    const q = query(collection(db, 'categories'));
    return onSnapshot(q, (snapshot) => {
      const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      callback(categories);
    });
  },

  addCategory: async (category: Omit<Category, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'categories'), category);
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  deleteCategory: async (categoryId: string) => {
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
    } catch (error) {
      throw error;
    }
  },

  getTemplateServices: async (): Promise<Service[]> => {
    try {
      const q = query(collection(db, 'services'), where('isTemplate', '==', true));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
    } catch (error) {
      throw error;
    }
  },

  subscribeToTemplates: (callback: (services: Service[]) => void) => {
    const q = query(collection(db, 'services'), where('isTemplate', '==', true));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
    });
  },

  subscribeToServices: (callback: (services: Service[]) => void) => {
    const q = query(collection(db, 'services'));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
    });
  },

  addService: async (service: Omit<Service, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'services'), {
        ...service,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  updateService: async (serviceId: string, updates: Partial<Service>) => {
    try {
      const serviceRef = doc(db, 'services', serviceId);
      await updateDoc(serviceRef, updates);
    } catch (error) {
      throw error;
    }
  },

  deleteService: async (serviceId: string) => {
    try {
      await deleteDoc(doc(db, 'services', serviceId));
    } catch (error) {
      throw error;
    }
  },

  requestHiring: async (providerId: string, providerName: string, experience: string, bio: string) => {
    try {
      await addDoc(collection(db, 'provider_requests'), {
        providerId,
        providerName,
        experience,
        additionalInfo: bio,
        type: 'hiring',
        status: 'pending',
        createdAt: serverTimestamp()
      });
    } catch (error) {
      throw error;
    }
  },

  requestServiceProvision: async (request: Omit<ProviderRequest, 'id' | 'status' | 'createdAt' | 'type'>) => {
    try {
      await addDoc(collection(db, 'provider_requests'), {
        ...request,
        type: 'service',
        status: 'pending',
        createdAt: serverTimestamp()
      });
    } catch (error) {
      throw error;
    }
  },

  getProviderRequests: (callback: (requests: ProviderRequest[]) => void) => {
    const q = query(collection(db, 'provider_requests'));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProviderRequest));
      const sorted = data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      callback(sorted);
    });
  },

  verifyProviderRequest: async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      const requestRef = doc(db, 'provider_requests', requestId);
      await updateDoc(requestRef, { status });

      const requestSnap = await getDocs(query(collection(db, 'provider_requests'), orderBy('createdAt', 'desc')));
      const requestData = (await (await import('firebase/firestore')).getDoc(requestRef)).data() as ProviderRequest;

      if (status === 'accepted' && requestData) {
        if (requestData.type === 'hiring') {
          const userRef = doc(db, 'users', requestData.providerId);
          await updateDoc(userRef, { isHired: true });
        } else {
          await addDoc(collection(db, 'services'), {
            title: requestData.serviceName,
            price: requestData.proposedPrice,
            category: requestData.category,
            image: requestData.image,
            providerId: requestData.providerId,
            providerName: requestData.providerName,
            experience: requestData.experience,
            bio: requestData.additionalInfo,
            isTemplate: false,
            rating: '5.0',
            reviews: '0',
            description: requestData.additionalInfo,
            createdAt: serverTimestamp()
          });
        }
      }
    } catch (error) {
      throw error;
    }
  },

  getServicesByCategory: async (categoryName: string): Promise<Service[]> => {
    try {
      const q = query(
        collection(db, 'services'),
        where('category', '==', categoryName),
        where('isTemplate', '==', false)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
    } catch (error) {
      throw error;
    }
  },

  getProvidersForService: async (serviceTitle: string): Promise<Service[]> => {
    try {
      const q = query(
        collection(db, 'services'),
        where('title', '==', serviceTitle),
        where('isTemplate', '==', false)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
    } catch (error) {
      throw error;
    }
  },

  verifyProviderService: async (requestId: string, status: 'accepted' | 'rejected') => {
    return serviceService.verifyProviderRequest(requestId, status);
  }
};
