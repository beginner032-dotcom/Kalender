import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Check } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { CATEGORIES } from '../types';
import { format } from 'date-fns';

export default function AddEvent() {
  const navigate = useNavigate();
  const { user } = useAppStore();
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [eventTime, setEventTime] = useState(format(new Date(), 'HH:mm'));
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [reminder, setReminder] = useState('30 menit sebelum');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !eventDate || !eventTime || !user) {
      alert("Judul event harus diisi!");
      return;
    }
    
    setLoading(true);
    try {
      const combinedDateTime = new Date(`${eventDate}T${eventTime}`).toISOString();
      const newEvent = {
        uid: user.uid,
        title,
        description,
        category,
        eventDate: combinedDateTime,
        reminderTime: reminder,
        createdAt: Date.now(),
        isCompleted: false
      };
      
      await addDoc(collection(db, 'events'), newEvent);
      alert("Event berhasil disimpan!");
      navigate(-1);
    } catch (e: any) {
      console.error(e);
      alert("Gagal menyimpan event: " + e.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#F8F9FA] dark:bg-zinc-950 px-6 pt-12 pb-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white dark:hover:bg-zinc-800">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium tracking-tight">Tambah Event</h1>
        <button onClick={handleSave} disabled={loading || !title.trim()} className="p-2 -mr-2 rounded-full text-[#1C1B1F] dark:text-white disabled:opacity-50">
          <Check className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <Input 
            placeholder="Judul Event" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-semibold tracking-tight border-none px-0 bg-transparent shadow-none focus-visible:ring-0 placeholder:text-zinc-400"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-xs font-medium text-zinc-500 mb-1.5 block uppercase tracking-wider">Tanggal</label>
            <input 
              type="date" 
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-3.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>
          <div className="flex-[0.7]">
            <label className="text-xs font-medium text-zinc-500 mb-1.5 block uppercase tracking-wider">Waktu</label>
            <input 
              type="time" 
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-3.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-500 mb-1.5 block uppercase tracking-wider">Kategori</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-3.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 appearance-none"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-500 mb-1.5 block uppercase tracking-wider">Deskripsi</label>
          <textarea 
            placeholder="Tulis deskripsi event..." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-3.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-500 mb-1.5 block uppercase tracking-wider">Reminder</label>
          <select 
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-3.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 appearance-none"
          >
            <option value="10 menit sebelum">10 menit sebelum</option>
            <option value="30 menit sebelum">30 menit sebelum</option>
            <option value="1 jam sebelum">1 jam sebelum</option>
            <option value="1 hari sebelum">1 hari sebelum</option>
          </select>
        </div>
      </div>
      
      <div className="mt-auto pt-6">
          <Button onClick={handleSave} disabled={loading || !title.trim()} className="w-full bg-[#1C1B1F] hover:bg-black h-12 rounded-2xl text-white font-medium shadow-none disabled:opacity-50">
            {loading ? 'Menyimpan...' : 'Simpan Event'}
          </Button>
      </div>
    </div>
  );
}
