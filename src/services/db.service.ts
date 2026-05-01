import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  orderBy
} from "firebase/firestore";
import { db } from "./firebase.config";

export const dbService = {
  get: async (coll: string, id: string) => {
    const docRef = doc(db, coll, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  set: async (coll: string, id: string, data: any) => {
    await setDoc(doc(db, coll, id), data);
  },

  update: async (coll: string, id: string, data: any) => {
    await updateDoc(doc(db, coll, id), data);
  },

  add: async (coll: string, data: any) => {
    return await addDoc(collection(db, coll), data);
  },

  list: async (coll: string, queries: any[] = []) => {
    const q = query(collection(db, coll), ...queries);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  subscribe: (coll: string, queries: any[], callback: (data: any[]) => void) => {
    const q = query(collection(db, coll), ...queries);
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    });
  }
};
