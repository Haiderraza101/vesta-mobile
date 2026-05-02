import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

// ─── Types ───────────────────────────────────────────────
export type UserRole = "customer" | "provider" | null;

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
}

interface AuthContextType {
  /** Firebase auth user object */
  firebaseUser: FirebaseAuthTypes.User | null;
  /** Firestore user profile */
  profile: UserProfile | null;
  /** True while we check initial auth state */
  loading: boolean;
  /** True once login/signup finishes (and profile is loaded) */
  isAuthenticated: boolean;
  /** Convenience: profile fields for backward compat with UI */
  user: { name: string; email: string; role: UserRole; avatarUrl: string } | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setRole: (role: UserRole, serviceCategory?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // ─── Listen to auth state changes ─────────────────────
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (currentUser) => {
      setFirebaseUser(currentUser);

      if (currentUser) {
        // Fetch extended profile from Firestore
        try {
          const userDoc = await firestore()
            .collection("users")
            .doc(currentUser.uid)
            .get();

          if (userDoc.exists) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            // User exists in Auth but not in Firestore (edge case)
            setProfile({
              uid: currentUser.uid,
              email: currentUser.email || "",
              fullName: currentUser.displayName || "",
              role: null,
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // ─── Auth Actions ─────────────────────────────────────
  const login = async (email: string, password: string) => {
    await auth().signInWithEmailAndPassword(email, password);
    // onAuthStateChanged will handle setting firebaseUser + profile
  };

  const signup = async (name: string, email: string, password: string) => {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;

    // Create Firestore user document (role null until role-selection screen)
    await firestore().collection("users").doc(uid).set({
      uid,
      email,
      fullName: name,
      role: null,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    // Update local state immediately (don't wait for onAuthStateChanged)
    setProfile({ uid, email, fullName: name, role: null });
  };

  const logout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const setRole = async (role: UserRole, serviceCategory?: string) => {
    if (!firebaseUser) return;
    const uid = firebaseUser.uid;

    // Update Firestore users collection
    await firestore().collection("users").doc(uid).update({ role });

    // If provider, create providers document
    if (role === "provider") {
      const provDoc = await firestore().collection("providers").doc(uid).get();
      if (!provDoc.exists) {
        await firestore().collection("providers").doc(uid).set({
          providerId: uid,
          fullName: profile?.fullName || "",
          email: profile?.email || "",
          serviceCategory: serviceCategory || "",
          hourlyRate: 50,
          rating: 0,
          jobsCompleted: 0,
          experience: 0,
          isAvailable: true,
          about: "",
          skills: [],
          avatarUrl: "",
        });
      } else if (serviceCategory) {
        await firestore().collection("providers").doc(uid).update({ serviceCategory });
      }
    }

    // Update local state
    setProfile((prev) => (prev ? { ...prev, role } : null));
  };

  // ─── Derived State ────────────────────────────────────
  const isAuthenticated = !!firebaseUser && !!profile;

  // Backward-compatible `user` object for all existing UI components
  const user = profile
    ? {
        name: profile.fullName,
        email: profile.email,
        role: profile.role,
        avatarUrl: "", // No avatar URL stored yet
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        profile,
        loading,
        isAuthenticated,
        user,
        login,
        signup,
        logout,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
