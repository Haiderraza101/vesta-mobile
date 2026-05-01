import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../services/firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { User, ProviderMeta } from '../models/User';

interface AuthContextType {
  user: User | null;
  providerMeta: ProviderMeta | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setProviderMeta: (meta: ProviderMeta | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [providerMeta, setProviderMeta] = useState<ProviderMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setProviderMeta(null);

      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = { uid: firebaseUser.uid, ...userSnap.data() } as User;
          setUser(userData);

          if (userData.role === 'provider') {
            const metaSnap = await getDoc(doc(db, 'providers_meta', firebaseUser.uid));

            if (metaSnap.exists()) {
              setProviderMeta({ uid: firebaseUser.uid, ...metaSnap.data() } as ProviderMeta);
            }
          }
        } else {
          const fallbackUser: User = {
            uid: firebaseUser.uid,
            fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email || '',
            role: null,
            profileImageUrl: null,
            createdAt: null,
          };

          setUser(fallbackUser);
        }
      } else {
        setUser(null);
        setProviderMeta(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      providerMeta,
      loading,
      isAuthenticated: !!user,
      setUser,
      setProviderMeta
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
