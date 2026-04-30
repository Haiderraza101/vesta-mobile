import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface PlatformSettings {
  currencySymbol: string;
  currencyCode: string;
  taxRate: number;
  platformName: string;
}

const DEFAULT_SETTINGS: PlatformSettings = {
  currencySymbol: '$',
  currencyCode: 'USD',
  taxRate: 0,
  platformName: 'Vesta'
};

export const configService = {
  getSettings: async (): Promise<PlatformSettings> => {
    try {
      const docRef = doc(db, 'config', 'settings');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as PlatformSettings;
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error("Error fetching settings:", error);
      return DEFAULT_SETTINGS;
    }
  },

  updateSettings: async (settings: Partial<PlatformSettings>) => {
    try {
      const docRef = doc(db, 'config', 'settings');
      await setDoc(docRef, settings, { merge: true });
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  },

  subscribeToSettings: (callback: (settings: PlatformSettings) => void) => {
    const docRef = doc(db, 'config', 'settings');
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data() as PlatformSettings);
      } else {
        callback(DEFAULT_SETTINGS);
      }
    });
  }
};
