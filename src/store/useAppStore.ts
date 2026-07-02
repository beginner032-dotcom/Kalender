import { create } from 'zustand';
import { UserProfile, AppEvent, Holiday } from '../types';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { collection, query, where, onSnapshot, getDocs, doc } from 'firebase/firestore';

interface AppState {
  user: UserProfile | null;
  events: AppEvent[];
  holidays: Holiday[];
  isAuthLoaded: boolean;
  theme: 'light' | 'dark';
  setUser: (user: UserProfile | null) => void;
  setEvents: (events: AppEvent[]) => void;
  setHolidays: (holidays: Holiday[]) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  events: [],
  holidays: [],
  isAuthLoaded: false,
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  setUser: (user) => set({ user, isAuthLoaded: true }),
  setEvents: (events) => set({ events }),
  setHolidays: (holidays) => set({ holidays }),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    set({ theme });
  },
}));

// Initialization logic
let unsubscribeEvents: () => void = () => {};
let unsubscribeUser: () => void = () => {};

import Holidays from 'date-holidays';

export async function fetchHolidaysForYear(year: number) {
  const state = useAppStore.getState();
  // if we already have holidays for this year, skip
  if (state.holidays.some(h => h.date.startsWith(`${year}-`))) return;
  
  try {
    const hd = new Holidays('ID');
    const hdList = hd.getHolidays(year);
    
    if (Array.isArray(hdList)) {
      const hols: Holiday[] = hdList.map((h: any) => {
        // h.date comes back like "2026-05-27 00:00:00 -0600"
        // we just need the "YYYY-MM-DD" part
        const cleanDate = h.date.split(' ')[0];
        return {
          id: cleanDate + '-' + h.name,
          date: cleanDate,
          title: h.name,
          description: h.name,
          isNationalHoliday: true,
          isCutiBersama: false
        };
      });
      // Merge with existing holidays without duplicates
      const existingDates = new Set(state.holidays.map(h => h.date));
      const newHols = hols.filter(h => !existingDates.has(h.date));
      useAppStore.getState().setHolidays([...state.holidays, ...newHols]);
    }
  } catch (e) {
    console.error("Could not load holidays from date-holidays", e);
  }
}

export function initializeAppStore() {
  const { setTheme, theme } = useAppStore.getState();
  setTheme(theme); // apply initial theme

  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      // We fetch the basic data from Auth, but we also subscribe to Firestore
      // user doc to get potentially larger data like a base64 photoUrl.
      useAppStore.getState().setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        photoUrl: firebaseUser.photoURL || undefined,
        createdAt: Date.now(),
      });
      
      const userRef = doc(db, 'users', firebaseUser.uid);
      unsubscribeUser = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const currentUser = useAppStore.getState().user;
          if (currentUser) {
            useAppStore.getState().setUser({
              ...currentUser,
              name: data.name || currentUser.name,
              photoUrl: data.photoUrl || currentUser.photoUrl,
            });
          }
        }
      });
      
      // Load events
      const q = query(collection(db, 'events'), where('uid', '==', firebaseUser.uid));
      unsubscribeEvents = onSnapshot(q, (snapshot) => {
        const evts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as AppEvent[];
        useAppStore.getState().setEvents(evts);
      });
    } else {
      useAppStore.getState().setUser(null);
      unsubscribeEvents();
      unsubscribeUser();
      useAppStore.getState().setEvents([]);
    }
  });

  // Load holidays once for the current year
  const currentYear = new Date().getFullYear();
  fetchHolidaysForYear(currentYear);
}
