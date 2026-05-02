/**
 * Firebase Database Service Layer
 * ─────────────────────────────────
 * Order Lifecycle State Machine:
 *   pending → accepted → en_route → in_progress → completed
 *                ↓                                     
 *            declined                              cancelled
 *
 * Data isolation:
 *   - Customers see ONLY their own bookings (customerId == uid)
 *   - Providers see ONLY bookings assigned to them (providerId == uid)
 */
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

// ─── Status Type (State Machine) ──────────────────────
export type OrderStatus =
  | "pending"
  | "accepted"
  | "en_route"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "declined";

// ─── Data Types ───────────────────────────────────────
export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  role: "customer" | "provider" | "";
  createdAt: any;
}

export interface ProviderProfile {
  providerId: string;
  fullName: string;
  email: string;
  serviceCategory: string;
  specialty: string;
  hourlyRate: number;
  rating: number;
  jobsCompleted: number;
  experience: number;
  about: string;
  skills: string[];
  isAvailable: boolean;
  avatarUrl: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  serviceCategory: string;
  title: string;
  description: string;
  customerMessage: string;
  status: OrderStatus;
  scheduledDate: any;
  address: string;
  notes: string;
  price: number;
  createdAt: any;
  updatedAt: any;
}

// ─── Auth Operations ──────────────────────────────────

export const registerUser = async (email: string, password: string, fullName: string) => {
  const credential = await auth().createUserWithEmailAndPassword(email, password);
  const uid = credential.user.uid;
  await firestore().collection("users").doc(uid).set({
    uid,
    email,
    fullName,
    role: "",
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
  return credential.user;
};

export const loginUser = async (email: string, password: string) => {
  const credential = await auth().signInWithEmailAndPassword(email, password);
  return credential.user;
};

export const logoutUser = async () => {
  await auth().signOut();
};

// ─── User Profile ─────────────────────────────────────

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const doc = await firestore().collection("users").doc(uid).get();
  return doc.data() ? (doc.data() as UserProfile) : null;
};

export const setUserRole = async (
  uid: string,
  role: "customer" | "provider",
  providerData?: { serviceCategory: string; specialty: string; hourlyRate: number }
) => {
  await firestore().collection("users").doc(uid).update({ role });
  if (role === "provider" && providerData) {
    const userDoc = await firestore().collection("users").doc(uid).get();
    const d = userDoc.data();
    await firestore().collection("providers").doc(uid).set({
      providerId: uid,
      fullName: d?.fullName || "",
      email: d?.email || "",
      serviceCategory: providerData.serviceCategory,
      specialty: providerData.specialty,
      hourlyRate: providerData.hourlyRate,
      rating: 0, jobsCompleted: 0, experience: 0,
      about: "", skills: [], isAvailable: true, avatarUrl: "",
    });
  }
};

export const updateUserName = async (uid: string, fullName: string) => {
  await firestore().collection("users").doc(uid).update({ fullName });
  const pDoc = await firestore().collection("providers").doc(uid).get();
  if (pDoc.data()) {
    await firestore().collection("providers").doc(uid).update({ fullName });
  }
};

// ─── Provider Operations ──────────────────────────────

export const getProviders = async (category?: string): Promise<ProviderProfile[]> => {
  let query = firestore().collection("providers").where("isAvailable", "==", true);
  if (category) query = query.where("serviceCategory", "==", category);
  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({ ...doc.data(), providerId: doc.id } as ProviderProfile));
};

export const getProviderById = async (id: string): Promise<ProviderProfile | null> => {
  const doc = await firestore().collection("providers").doc(id).get();
  return doc.data() ? ({ ...doc.data(), providerId: doc.id } as ProviderProfile) : null;
};

export const toggleProviderAvailability = async (id: string, isAvailable: boolean) => {
  await firestore().collection("providers").doc(id).update({ isAvailable });
};

// ─── Booking Creation (Direct Booking Model) ─────────

export const createBooking = async (data: {
  providerId: string;
  providerName: string;
  serviceCategory: string;
  title: string;
  description: string;
  customerMessage: string;
  address: string;
  notes: string;
  price: number;
  scheduledDate: Date;
}) => {
  const currentUser = auth().currentUser;
  if (!currentUser) throw new Error("User must be logged in");
  const userDoc = await firestore().collection("users").doc(currentUser.uid).get();
  const userData = userDoc.data();

  const ref = await firestore().collection("bookings").add({
    customerId: currentUser.uid,
    customerName: userData?.fullName || "Customer",
    providerId: data.providerId,
    providerName: data.providerName,
    serviceCategory: data.serviceCategory,
    title: data.title,
    description: data.description,
    customerMessage: data.customerMessage,
    status: "pending" as OrderStatus,
    scheduledDate: firestore.Timestamp.fromDate(data.scheduledDate),
    address: data.address,
    notes: data.notes,
    price: data.price,
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
  return ref.id;
};

// ─── Real-time Subscriptions (onSnapshot) ─────────────

/** Provider sees ONLY jobs sent to them (strict providerId filter) */
export const subscribeToProviderJobs = (
  providerId: string,
  onUpdate: (jobs: Booking[]) => void
) => {
  return firestore()
    .collection("bookings")
    .where("providerId", "==", providerId)
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      const jobs = snapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Booking)) || [];
      onUpdate(jobs);
    });
};

/** Customer sees ONLY their own orders (strict customerId filter) */
export const subscribeToCustomerOrders = (
  customerId: string,
  onUpdate: (orders: Booking[]) => void
) => {
  return firestore()
    .collection("bookings")
    .where("customerId", "==", customerId)
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      const orders = snapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Booking)) || [];
      onUpdate(orders);
    });
};

// ─── Order Status Updates (State Machine) ─────────────

/** Universal status updater - advances the order through the lifecycle */
export const updateOrderStatus = async (bookingId: string, newStatus: OrderStatus) => {
  await firestore().collection("bookings").doc(bookingId).update({
    status: newStatus,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
};

/** When provider completes: update booking + increment their jobsCompleted */
export const completeJob = async (bookingId: string, providerId: string) => {
  const batch = firestore().batch();
  const bookingRef = firestore().collection("bookings").doc(bookingId);
  const providerRef = firestore().collection("providers").doc(providerId);

  batch.update(bookingRef, {
    status: "completed" as OrderStatus,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
  batch.update(providerRef, {
    jobsCompleted: firestore.FieldValue.increment(1),
  });

  await batch.commit();
};

// ─── Single-doc Fetchers ──────────────────────────────

export const getBookingById = async (bookingId: string): Promise<Booking | null> => {
  const doc = await firestore().collection("bookings").doc(bookingId).get();
  return doc.data() ? ({ id: doc.id, ...doc.data() } as Booking) : null;
};
