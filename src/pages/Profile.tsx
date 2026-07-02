import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { auth, db } from '../lib/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { User, Bell, Palette, Globe, LogOut, Info, ShieldCheck, Camera, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { compressImage } from '../lib/imageUtils';

export default function Profile() {
  const navigate = useNavigate();
  const { user, theme, setTheme } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!auth.currentUser) return;
      
      try {
        setUploading(true);
        const base64Image = await compressImage(file);
        
        // We only save to Firestore because base64 data urls are generally too large
        // for Firebase Auth's photoURL field limit.
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { photoUrl: base64Image });
        
        // Let onAuthStateChanged from useAppStore handle the store update, 
        // or we could force it here. A force update ensures it feels instant.
        useAppStore.getState().setUser({
          ...user!,
          photoUrl: base64Image
        });
        
      } catch (err) {
        console.error("Gagal mengunggah foto profil:", err);
        alert("Gagal mengunggah foto profil");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full pt-12 pb-24 px-6 bg-[#F8F9FA] dark:bg-zinc-950 overflow-y-auto hide-scrollbar">
      <h1 className="text-2xl font-semibold tracking-tight mb-8">Pengaturan</h1>

      <div className="flex items-center gap-4 mb-10 bg-white dark:bg-zinc-900 border border-zinc-200/60 p-5 rounded-3xl shadow-sm">
        <div 
          onClick={handlePhotoClick}
          className="relative w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-2xl flex justify-center items-center text-[#D32F2F] text-2xl font-medium cursor-pointer overflow-hidden border border-red-100 dark:border-red-900/30 group"
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-[#D32F2F]" />
          ) : user?.photoUrl ? (
            <img src={user.photoUrl} alt="Profil" className="w-full h-full object-cover" />
          ) : (
            user?.name.charAt(0).toUpperCase() || 'U'
          )}
          
          {!uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        
        <div>
          <h2 className="font-semibold text-lg tracking-tight">{user?.name || 'User'}</h2>
          <p className="text-zinc-500 text-sm mt-0.5">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-2 mb-auto">
        <MenuItem 
          icon={<User className="text-[#1C1B1F] dark:text-white" />} 
          title="Akun Saya" 
          onClick={() => navigate('/account')} 
        />
        <MenuItem icon={<Bell className="text-[#1C1B1F] dark:text-white" />} title="Notifikasi" />
        <MenuItem 
          icon={<Palette className="text-[#1C1B1F] dark:text-white" />} 
          title="Tema" 
          value={theme === 'light' ? 'Terang' : 'Gelap'} 
          onClick={toggleTheme}
        />
        <MenuItem icon={<Globe className="text-[#1C1B1F] dark:text-white" />} title="Bahasa" value="Indonesia" />
        <MenuItem icon={<ShieldCheck className="text-zinc-500" />} title="Cadangkan Data" />
        <MenuItem icon={<Info className="text-zinc-500" />} title="Tentang Aplikasi" />
      </div>

      <Button variant="ghost" onClick={handleLogout} className="mt-8 text-[#D32F2F] hover:text-white hover:bg-[#D32F2F] flex items-center justify-center gap-2 py-6 rounded-2xl font-bold text-base transition-colors shrink-0">
        <LogOut className="w-5 h-5" /> Log Out
      </Button>
    </div>
  );
}

function MenuItem({ icon, title, value, onClick }: any) {
  return (
    <div onClick={onClick} className="flex justify-between items-center py-3.5 px-4 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-[#F8F9FA] dark:bg-zinc-800 rounded-xl">{icon}</div>
        <span className="font-medium text-[#1C1B1F] dark:text-zinc-200">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm font-medium text-zinc-400">{value}</span>}
        <span className="text-zinc-300 ml-1">{'>'}</span>
      </div>
    </div>
  );
}
