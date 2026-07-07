import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, signInWithRedirect, GoogleAuthProvider, browserPopupRedirectResolver } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { CalendarDays, User, Mail, Lock } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });
      
      const userDoc = {
        name,
        email,
        createdAt: Date.now(),
        photoUrl: user.photoURL || '',
      };
      
      await setDoc(doc(db, 'users', user.uid), userDoc);
      
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Pendaftaran Email & Password sudah diaktifkan, namun Firebase membutuhkan waktu beberapa menit untuk memperbarui sistem. Mohon tunggu 2-5 menit dan coba lagi.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.');
      } else {
        setError(`Registration failed: ${err.message} (${err.code})`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
      const user = result.user;
      
      // Check if user exists in db
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          name: user.displayName || 'User',
          email: user.email,
          createdAt: Date.now(),
          photoUrl: user.photoURL || '',
        });
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, provider);
          return;
        } catch (redirectErr: any) {
          setError(redirectErr.message || 'Google Login redirect failed');
        }
      } else if (err.code === 'auth/unauthorized-domain') {
        setError(`Domain (${window.location.hostname}) sedang menunggu update dari server Firebase (bisa memakan waktu 15-30 menit setelah ditambahkan). Sementara menunggu, Anda bisa menggunakan Email & Password untuk mendaftar/masuk.`);
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Login Google belum diaktifkan. Silakan aktifkan provider Google di Firebase Console > Authentication > Sign-in method.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Login dibatalkan.');
      } else {
        setError(err.message || 'Google Login failed');
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#F8F9FA] dark:bg-zinc-950 overflow-y-auto">
      <div className="min-h-full flex flex-col items-center justify-center p-6 pb-12">
        <div className="w-full max-w-[340px] flex flex-col items-center">
          <div className="w-20 h-20 bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200/50 dark:border-zinc-800 rounded-3xl flex items-center justify-center mb-8 mt-4 shrink-0">
              <CalendarDays className="w-10 h-10 text-[#D32F2F]" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1C1B1F] dark:text-white mb-2 shrink-0">Buat Akun</h1>
          <p className="text-zinc-500 mb-8 text-[15px] shrink-0">Daftar untuk memulai</p>

        <form onSubmit={handleRegister} className="w-full space-y-4 shrink-0">
          {error && (
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex flex-col gap-2">
              <span className="text-[#D32F2F] text-[14px] leading-relaxed">{error}</span>
              {error.includes('belum diizinkan') && (
                <div className="bg-white/60 p-2.5 rounded-xl border border-red-200/50 flex justify-between items-center mt-1">
                  <code className="text-red-800 text-xs font-mono select-all">{window.location.hostname}</code>
                  <button 
                    type="button" 
                    onClick={() => navigator.clipboard.writeText(window.location.hostname)}
                    className="text-xs font-medium text-[#D32F2F] bg-white px-3 py-1.5 rounded-lg shadow-sm border border-red-100 active:scale-95 transition-all"
                  >
                    Salin
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="relative">
            <User className="w-5 h-5 absolute left-4 top-4.5 text-zinc-400" />
            <Input type="text" placeholder="Nama Lengkap" value={name} onChange={e => setName(e.target.value)} required className="rounded-2xl bg-white border border-zinc-200/60 shadow-sm h-14 pl-12 text-[15px]" />
          </div>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-4 top-4.5 text-zinc-400" />
            <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="rounded-2xl bg-white border border-zinc-200/60 shadow-sm h-14 pl-12 text-[15px]" />
          </div>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-4 top-4.5 text-zinc-400" />
            <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="rounded-2xl bg-white border border-zinc-200/60 shadow-sm h-14 pl-12 text-[15px]" />
          </div>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-4 top-4.5 text-zinc-400" />
            <Input type="password" placeholder="Konfirmasi Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="rounded-2xl bg-white border border-zinc-200/60 shadow-sm h-14 pl-12 text-[15px]" />
          </div>
          
          <Button type="submit" className="w-full bg-[#D32F2F] hover:bg-red-700 h-14 rounded-2xl text-[15px] font-bold tracking-wide text-white shadow-none mt-4" disabled={loading}>
            {loading ? 'Mendaftar...' : 'Daftar'}
          </Button>
        </form>

        <div className="w-full flex items-center gap-4 my-6 opacity-60 shrink-0">
            <div className="h-px bg-zinc-300 flex-1"></div>
            <span className="text-xs uppercase font-medium">atau</span>
            <div className="h-px bg-zinc-300 flex-1"></div>
        </div>

        <Button type="button" onClick={handleGoogleLogin} variant="outline" className="w-full bg-white h-14 rounded-2xl text-[15px] font-semibold text-[#1C1B1F] shadow-sm border border-zinc-200/60 hover:bg-zinc-50 shrink-0" disabled={loading}>
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Daftar dengan Google
        </Button>

        <div className="mt-8 text-[15px] mb-8 text-zinc-500 shrink-0 text-center flex flex-col gap-1">
          <span>Sudah punya akun? <Link to="/login" className="text-[#D32F2F] font-bold hover:underline">Masuk</Link></span><span className="text-[10px] opacity-40">Versi: 2.1 (Update Vercel)</span>
        </div>
      </div>
      </div>
    </div>
  );
}
