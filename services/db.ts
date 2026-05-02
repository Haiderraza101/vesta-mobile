/**
 * Firestore Database Service
 * Handles all CRUD operations for users, providers, and bookings collections
 */
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

// ─── Types ───────────────────────────────────────────────
export type UserRole = "customer" | "provider";

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: any;
}

export interface ProviderProfile {
  providerId: string;
  fullName: string;
  email: string;
  serviceCategory: string;
  hourlyRate: number;
  rating: number;
  jobsCompleted: number;
  experience: number;
  isAvailable: boolean;
  about: string;
  skills: string[];
  avatarUrl: string;
}

export interface Booking {
  id?: string;
  customerId: string;
  providerId: string;
  providerName: string;
  serviceCategory: string;
  status: "pending" | "accepted" | "completed" | "cancelled";
  scheduledDate: any;
  notes: string;
  address: string;
  estimatedPrice: number;
  createdAt: any;
}

// ─── Auth + User Registration ────────────────────────────
export const registerUser = async (
  email: string,
  password: string,
  fullName: string,
  role: UserRole
) => {
  // 1. Create the user in Firebase Auth
  const userCredential = await auth().createUserWithEmailAndPassword(email, password);
  const uid = userCredential.user.uid;

  // 2. Save their profile in the 'users' collection
  await firestore().collection("users").doc(uid).set({
    uid,
    email,
    fullName,
    role,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });

  // 3. If provider, also create a providers document
  if (role === "provider") {
    await firestore().collection("providers").doc(uid).set({
      providerId: uid,
      fullName,
      email,
      serviceCategory: "",
      hourlyRate: 0,
      rating: 0,
      jobsCompleted: 0,
      experience: 0,
      isAvailable: true,
      about: "",
      skills: [],
      avatarUrl: "",
    });
  }

  return userCredential.user;
};

export const loginUser = async (email: string, password: string) => {
  const userCredential = await auth().signInWithEmailAndPassword(email, password);
  return userCredential.user;
};

export const logoutUser = async () => {
  await auth().signOut();
};

// ─── User Profile ────────────────────────────────────────
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const doc = await firestore().collection("users").doc(uid).get();
  if (doc.exists) {
    return doc.data() as UserProfile;
  }
  return null;
};

export const updateUserRole = async (uid: string, role: UserRole, serviceCategory?: string) => {
  await firestore().collection("users").doc(uid).update({ role });

  // If switching to provider, create provider profile if it doesn't exist
  if (role === "provider") {
    const provDoc = await firestore().collection("providers").doc(uid).get();
    if (!provDoc.exists) {
      const userDoc = await firestore().collection("users").doc(uid).get();
      const userData = userDoc.data();
      await firestore().collection("providers").doc(uid).set({
        providerId: uid,
        fullName: userData?.fullName || "",
        email: userData?.email || "",
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
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  await firestore().collection("users").doc(uid).update(data);
};

// ─── Provider Operations ─────────────────────────────────
export const getProviders = async (): Promise<ProviderProfile[]> => {
  const snapshot = await firestore()
    .collection("providers")
    .where("isAvailable", "==", true)
    .get();

  return snapshot.docs.map((doc) => ({ ...doc.data() } as ProviderProfile));
};

export const getProvidersByCategory = async (category: string): Promise<ProviderProfile[]> => {
  const snapshot = await firestore()
    .collection("providers")
    .where("serviceCategory", "==", category)
    .where("isAvailable", "==", true)
    .get();

  return snapshot.docs.map((doc) => ({ ...doc.data() } as ProviderProfile));
};

export const getProviderById = async (providerId: string): Promise<ProviderProfile | null> => {
  const doc = await firestore().collection("providers").doc(providerId).get();
  if (doc.exists) {
    return doc.data() as ProviderProfile;
  }
  return null;
};

export const updateProviderAvailability = async (providerId: string, isAvailable: boolean) => {
  await firestore().collection("providers").doc(providerId).update({ isAvailable });
};

export const updateProviderProfile = async (providerId: string, data: Partial<ProviderProfile>) => {
  await firestore().collection("providers").doc(providerId).update(data);
};

// ─── Booking Operations ──────────────────────────────────
export const createBooking = async (
  providerId: string,
  providerName: string,
  serviceCategory: string,
  scheduledDate: Date,
  notes: string,
  address: string,
  estimatedPrice: number
) => {
  const customerId = auth().currentUser?.uid;
  if (!customerId) throw new Error("User must be logged in to create a booking");

  const docRef = await firestore().collection("bookings").add({
    customerId,
    providerId,
    providerName,
    serviceCategory,
    status: "pending",
    scheduledDate: firestore.Timestamp.fromDate(scheduledDate),
    notes,
    address,
    estimatedPrice,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });

  return docRef.id;
};

export const getBookingsForCustomer = async (customerId: string): Promise<Booking[]> => {
  const snapshot = await firestore()
    .collection("bookings")
    .where("customerId", "==", customerId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Booking));
};

export const getBookingsForProvider = async (providerId: string): Promise<Booking[]> => {
  const snapshot = await firestore()
    .collection("bookings")
    .where("providerId", "==", providerId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Booking));
};

export const getPendingBookings = async (): Promise<Booking[]> => {
  const snapshot = await firestore()
    .collection("bookings")
    .where("status", "==", "pending")
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Booking));
};

export const updateBookingStatus = async (
  bookingId: string,
  status: "pending" | "accepted" | "completed" | "cancelled"
) => {
  await firestore().collection("bookings").doc(bookingId).update({ status });
};
