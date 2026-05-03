import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAO4YcLqjGmJ6G8qMdp_p1pOJJt5aFXg9A",
  authDomain: "vesta-mobile-601ef.firebaseapp.com",
  projectId: "vesta-mobile-601ef",
  storageBucket: "vesta-mobile-601ef.firebasestorage.app",
  messagingSenderId: "779326097876",
  appId: "1:779326097876:android:aedb21b519f9ebee072e41"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const collections = ['users', 'services', 'bookings', 'provider_requests', 'notifications'];

async function wipe() {
  console.log("🧹 Starting Database Wipe...");
  
  for (const col of collections) {
    try {
      const snap = await getDocs(collection(db, col));
      console.log(`Clearing ${col}... (${snap.size} docs)`);
      
      const batch = writeBatch(db);
      snap.forEach(d => batch.delete(doc(db, col, d.id)));
      await batch.commit();
      
      console.log(`✅ ${col} wiped.`);
    } catch (e) {
      console.error(`❌ Failed to wipe ${col}:`, e);
    }
  }
  
  console.log("✨ Platform data reset successfully.");
  process.exit(0);
}

wipe();
