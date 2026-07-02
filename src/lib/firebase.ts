import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBwgucYYgRq6ZULfZAd4656XoOeKdugPO0",
  authDomain: "kalender-abd56.firebaseapp.com",
  projectId: "kalender-abd56",
  storageBucket: "kalender-abd56.firebasestorage.app",
  messagingSenderId: "1098114760229",
  appId: "1:1098114760229:web:26f9f9ed37e82ac3b5c9cc",
  measurementId: "G-D6WGG1T3HX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics if supported in the environment (client-side only)
if (typeof window !== 'undefined') {
  getAnalytics(app);
}
