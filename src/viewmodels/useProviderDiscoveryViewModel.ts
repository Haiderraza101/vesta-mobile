import { useState, useEffect } from 'react';
import { db } from '../services/firebase.config';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';

export const useProviderDiscoveryViewModel = (category: string) => {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'providers_meta'),
      where('serviceType', '==', category),
      where('isAvailable', '==', true)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const providerMetas = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));

      const combinedData = await Promise.all(
        providerMetas.map(async (meta) => {
          const userSnap = await getDoc(doc(db, 'users', meta.uid));
          return { ...meta, ...(userSnap.exists() ? userSnap.data() : {}) };
        })
      );

      setProviders(combinedData);
      setLoading(false);
    });

    return unsubscribe;
  }, [category]);

  return {
    providers,
    loading,
  };
};
