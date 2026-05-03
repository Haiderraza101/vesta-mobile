import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface OnboardingQuestion {
  id: string;
  text: string;
  type: 'text' | 'choice' | 'number';
  options?: string[];
  field: string;
  placeholder?: string;
}

export interface OnboardingFlow {
  role: 'customer' | 'provider';
  questions: OnboardingQuestion[];
}

export const onboardingService = {
  getQuestions: async (role: 'customer' | 'provider'): Promise<OnboardingQuestion[]> => {
    try {
      const docRef = doc(db, 'onboarding', role);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().questions as OnboardingQuestion[];
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  updateQuestions: async (role: 'customer' | 'provider', questions: OnboardingQuestion[]) => {
    try {
      const docRef = doc(db, 'onboarding', role);
      const sanitizedQuestions = questions.map(q => {
        const cleaned: any = { ...q };
        Object.keys(cleaned).forEach(key => {
          if (cleaned[key] === undefined) {
            delete cleaned[key];
          }
        });
        return cleaned;
      });
      await setDoc(docRef, { role, questions: sanitizedQuestions }, { merge: true });
    } catch (error) {
      throw error;
    }
  }
};
