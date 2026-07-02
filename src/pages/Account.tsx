import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Phone, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useAppStore } from '../store/useAppStore';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export default function Account() {
  const navigate = useNavigate();
  const { user: storeUser, setUser } = useAppStore();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [birthdate, setBirthdate] = useState('');

  useEffect(() => {
    async function loadUserData() {
      if (!auth.currentUser) return;
      try {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || auth.currentUser.displayName || '');
          setAddress(data.address || '');
          setPhone(data.phone || '');
          setBirthdate(data.birthdate || '');
        } else {
          setName(auth.currentUser.displayName || '');
        }
      } catch (err: any) {
        setError(err.message || 'Gagal memuat data');
      } finally {
        setLoading(false);
      }
    }
    
    loadUserData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, { displayName: name });
      
      // Update Firestore document
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        name,
        address,
        phone,
        birthdate,
        updatedAt: Date.now()
      });
      
      // Update local store state
      if (storeUser) {
        setUser({
          ...storeUser,
          name,
        });
      }
      
      setSuccess('Data berhasil disimpan');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#F8F9FA] dark:bg-zinc-950 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center p-6 pb-2 sticky top-0 bg-[#F8F9FA]/90 dark:bg-zinc-950/90 backdrop-blur-md z-10">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-full shadow-sm mr-4"
        >
          <ArrowLeft className="w-5 h-5 text-[#1C1B1F] dark:text-zinc-200" />
        </button>
        <h1 className="text-xl font-semibold tracking-tight text-[#1C1B1F] dark:text-white">Akun Saya</h1>
      </div>

      <div className="px-6 py-6 pb-24">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#D32F2F]" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            {error && <div className="text-[#D32F2F] text-sm bg-red-50 p-3 rounded-xl border border-red-100">{error}</div>}
            {success && <div className="text-green-700 text-sm bg-green-50 p-3 rounded-xl border border-green-100">{success}</div>}
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Nama Lengkap</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-4 top-4.5 text-zinc-400" />
                <Input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                  className="rounded-2xl bg-white border border-zinc-200/60 shadow-sm h-14 pl-12 text-[15px]" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">No. Handphone</label>
              <div className="relative">
                <Phone className="w-5 h-5 absolute left-4 top-4.5 text-zinc-400" />
                <Input 
                  type="text" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="081234567890"
                  className="rounded-2xl bg-white border border-zinc-200/60 shadow-sm h-14 pl-12 text-[15px]" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Tanggal Lahir</label>
              <div className="relative">
                <CalendarIcon className="w-5 h-5 absolute left-4 top-4.5 text-zinc-400" />
                <Input 
                  type="date" 
                  value={birthdate} 
                  onChange={e => setBirthdate(e.target.value)} 
                  className="rounded-2xl bg-white border border-zinc-200/60 shadow-sm h-14 pl-12 pr-4 text-[15px] block w-full" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Alamat Lengkap</label>
              <div className="relative">
                <MapPin className="w-5 h-5 absolute left-4 top-4 text-zinc-400" />
                <textarea 
                  value={address} 
                  onChange={e => setAddress(e.target.value)} 
                  placeholder="Masukkan alamat domisili..."
                  className="w-full rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 shadow-sm pl-12 p-3.5 text-[15px] min-h-[100px] flex form-textarea outline-none focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent transition-all" 
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#D32F2F] hover:bg-red-700 h-14 rounded-2xl text-[15px] font-bold tracking-wide text-white shadow-none mt-8" 
              disabled={saving}
            >
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
