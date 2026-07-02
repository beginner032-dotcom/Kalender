export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  photoUrl?: string;
  createdAt: number;
};

export type AppEvent = {
  id: string; // The firestore document ID
  uid: string;
  title: string;
  description: string;
  category: string;
  eventDate: string; // ISO string
  reminderTime: string;
  createdAt: number;
  isCompleted: boolean;
};

export type Holiday = {
  id: string; // document ID
  title: string;
  date: string; // YYYY-MM-DD
  description: string;
  isNationalHoliday: boolean;
  isCutiBersama: boolean;
};

export const CATEGORIES = ['Kerja', 'Pribadi', 'Maintenance', 'Penting', 'Libur'];
