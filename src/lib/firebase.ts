import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
export const auth = getAuth(app);

// Initialize Analytics if supported in the environment (client-side only)
if (typeof window !== 'undefined') {
  getAnalytics(app);
}
