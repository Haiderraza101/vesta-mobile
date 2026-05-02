/**
 * Firebase Database Service Layer
 * ─────────────────────────────────────────────────────────────────
 * Direct Booking Model with Order Lifecycle State Machine:
 *
 *   pending → accepted → en_route → in_progress → completed
 *        ↘ declined                                     ↗
 *         (end)          cancelled ←───────────────────┘
 *                        (customer or provider can cancel
 *                         before in_progress)
 */
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

// ─── Order Status Type (State Machine) ────────────────
export type OrderStatus =
  | "pending"
  | "accepted"
  | "en_route"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "declined";

/** End states — no further transitions allowed */
const END_STATES: OrderStatus[] = ["completed", "cancelled", "declined"];

/** Valid state transitions */
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["accepted", "declined", "cancelled"],
  accepted: ["en_route", "cancelled"],
  en_route: ["in_progress", "cancelled"],
  in_progress: ["completed"],
  completed: [],
  cancelled: [],
  declined: [],
};

// ─── Types ────────────────────────────────────────────
export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  role: "customer" | "provider";
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

export const registerUser = async (
  email: string,
  password: string,
  fullName: string
) => {
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

// ─── User Profile Operations ──────────────────────────

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const doc = await firestore().collection("users").doc(uid).get();
  return !!doc.exists ? (doc.data() as UserProfile) : null;
};

export const setUserRole = async (
  uid: string,
  role: "customer" | "provider",
  providerData?: {
    serviceCategory: string;
    specialty: string;
    hourlyRate: number;
  }
) => {
  await firestore().collection("users").doc(uid).update({ role });

  if (role === "provider" && providerData) {
    const userDoc = await firestore().collection("users").doc(uid).get();
    const userData = userDoc.data();

    await firestore().collection("providers").doc(uid).set({
      providerId: uid,
      fullName: userData?.fullName || "",
      email: userData?.email || "",
      serviceCategory: providerData.serviceCategory,
      specialty: providerData.specialty,
      hourlyRate: providerData.hourlyRate,
      rating: 0,
      jobsCompleted: 0,
      experience: 0,
      about: "",
      skills: [],
      isAvailable: true,
      avatarUrl: "",
    });
  }
};

export const updateUserName = async (uid: string, fullName: string) => {
  await firestore().collection("users").doc(uid).update({ fullName });
  const providerDoc = await firestore().collection("providers").doc(uid).get();
  if (!!providerDoc.exists) {
    await firestore().collection("providers").doc(uid).update({ fullName });
  }
};

// ─── Provider Operations ──────────────────────────────

export const getProviders = async (category?: string): Promise<ProviderProfile[]> => {
  let query = firestore()
    .collection("providers")
    .where("isAvailable", "==", true);

  if (category) {
    query = query.where("serviceCategory", "==", category);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({ ...doc.data(), providerId: doc.id } as ProviderProfile));
};

export const getProviderById = async (providerId: string): Promise<ProviderProfile | null> => {
  const doc = await firestore().collection("providers").doc(providerId).get();
  return !!doc.exists ? ({ ...doc.data(), providerId: doc.id } as ProviderProfile) : null;
};

export const toggleProviderAvailability = async (providerId: string, isAvailable: boolean) => {
  await firestore().collection("providers").doc(providerId).update({ isAvailable });
};

// ─── Booking / Order Operations ───────────────────────

/**
 * Create a new booking (Direct Booking Model).
 * The customer selects a SPECIFIC provider → status starts as "pending".
 */
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

  const bookingRef = await firestore().collection("bookings").add({
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

  return bookingRef.id;
};

/**
 * State-machine-aware status updater.
 * Validates the transition is legal before writing to Firestore.
 */
export const updateOrderStatus = async (bookingId: string, newStatus: OrderStatus) => {
  const doc = await firestore().collection("bookings").doc(bookingId).get();
  if (!doc.exists) throw new Error("Booking not found");

  const currentStatus = doc.data()?.status as OrderStatus;

  if (END_STATES.includes(currentStatus)) {
    throw new Error(`Cannot transition from end state "${currentStatus}"`);
  }

  const allowed = VALID_TRANSITIONS[currentStatus];
  if (!allowed || !allowed.includes(newStatus)) {
    throw new Error(`Invalid transition: "${currentStatus}" → "${newStatus}"`);
  }

  const updateData: any = {
    status: newStatus,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  };

  // When a job is completed, increment the provider's jobsCompleted count
  if (newStatus === "completed") {
    const bookingData = doc.data();
    if (bookingData?.providerId) {
      const providerRef = firestore().collection("providers").doc(bookingData.providerId);
      await providerRef.update({
        jobsCompleted: firestore.FieldValue.increment(1),
      });
    }
  }

  await firestore().collection("bookings").doc(bookingId).update(updateData);
};

/** Get a single booking by ID */
export const getBookingById = async (bookingId: string): Promise<Booking | null> => {
  const doc = await firestore().collection("bookings").doc(bookingId).get();
  return !!doc.exists ? ({ id: doc.id, ...doc.data() } as Booking) : null;
};

// ─── Real-time Subscriptions (onSnapshot) ─────────────

/**
 * PROVIDER: Subscribe to jobs sent DIRECTLY to this provider.
 * Strict filtering: providerId == current user's uid.
 */
export const subscribeToProviderJobs = (
  providerId: string,
  onUpdate: (jobs: Booking[]) => void
) => {
  return firestore()
    .collection("bookings")
    .where("providerId", "==", providerId)
    .orderBy("createdAt", "desc")
    .onSnapshot(
      (snapshot) => {
        const jobs = snapshot?.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Booking[];
        onUpdate(jobs || []);
      },
      (error) => {
        console.error("Provider jobs subscription error:", error);
        onUpdate([]);
      }
    );
};

/**
 * CUSTOMER: Subscribe to their own order history.
 * Strict filtering: customerId == current user's uid.
 */
export const subscribeToCustomerOrders = (
  customerId: string,
  onUpdate: (orders: Booking[]) => void
) => {
  return firestore()
    .collection("bookings")
    .where("customerId", "==", customerId)
    .orderBy("createdAt", "desc")
    .onSnapshot(
      (snapshot) => {
        const orders = snapshot?.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Booking[];
        onUpdate(orders || []);
      },
      (error) => {
        console.error("Customer orders subscription error:", error);
        onUpdate([]);
      }
    );
};

/**
 * Subscribe to a SINGLE booking for live status updates.
 * Used by both customer order tracker and provider active job.
 */
export const subscribeToBooking = (
  bookingId: string,
  onUpdate: (booking: Booking | null) => void
) => {
  return firestore()
    .collection("bookings")
    .doc(bookingId)
    .onSnapshot(
      (doc) => {
        if (!!doc.exists) {
          onUpdate({ id: doc.id, ...doc.data() } as Booking);
        } else {
          onUpdate(null);
        }
      },
      (error) => {
        console.error("Booking subscription error:", error);
        onUpdate(null);
      }
    );
};

// ─── Legacy one-shot queries (kept for backward compat) ─

export const getCustomerBookings = async (customerId: string): Promise<Booking[]> => {
  const snapshot = await firestore()
    .collection("bookings")
    .where("customerId", "==", customerId)
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Booking));
};

export const getProviderBookings = async (
  providerId: string,
  status?: string
): Promise<Booking[]> => {
  let query = firestore()
    .collection("bookings")
    .where("providerId", "==", providerId);

  if (status) {
    query = query.where("status", "==", status);
  }

  const snapshot = await query.orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Booking));
};

/** @deprecated Use updateOrderStatus instead — it validates transitions */
export const updateBookingStatus = updateOrderStatus;
