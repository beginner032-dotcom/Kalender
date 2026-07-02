import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Edit2, Trash2, Calendar, Clock, Bell, AlignLeft } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export default function DetailEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events } = useAppStore();
  const [loading, setLoading] = useState(false);
  
  const event = events.find(e => e.id === id);

  if (!event) {
    return (
        <div className="flex flex-col h-full items-center justify-center">
            <p>Event tidak ditemukan</p>
            <button onClick={() => navigate(-1)}>Kembali</button>
        </div>
    );
  }

  const handleDelete = async () => {
    if(confirm('Hapus event ini?')) {
        setLoading(true);
        try {
            await deleteDoc(doc(db, 'events', event.id));
            navigate(-1);
        } catch(e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#F8F9FA] dark:bg-zinc-950 px-6 pt-12 pb-6">
      <div className="flex justify-between items-center mb-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white dark:hover:bg-zinc-800">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium tracking-tight">Detail Event</h1>
        <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-white dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-300">
                <Edit2 className="w-5 h-5" />
            </button>
            <button onClick={handleDelete} disabled={loading} className="p-2 -mr-2 rounded-full hover:bg-red-50 text-[#D32F2F]">
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="flex items-start gap-4 mb-8">
        <div className="w-3 h-3 bg-[#D32F2F] rounded-full mt-2.5 shadow-sm" />
        <div>
            <h2 className="text-2xl font-semibold tracking-tight">{event.title}</h2>
            <p className="text-zinc-500 text-sm mt-1">{event.category}</p>
        </div>
      </div>

      <div className="space-y-5 bg-white dark:bg-zinc-900 border border-zinc-200/60 p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-4 text-zinc-900 dark:text-zinc-300">
            <div className="p-2 bg-zinc-50 rounded-xl">
              <Calendar className="w-5 h-5 text-zinc-400" />
            </div>
            <span className="font-medium text-[15px]">{format(parseISO(event.eventDate), 'EEEE, dd MMMM yyyy', { locale: localeId })}</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-900 dark:text-zinc-300">
            <div className="p-2 bg-zinc-50 rounded-xl">
              <Clock className="w-5 h-5 text-zinc-400" />
            </div>
            <span className="font-medium text-[15px]">{format(parseISO(event.eventDate), 'HH:mm')}</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-900 dark:text-zinc-300">
            <div className="p-2 bg-zinc-50 rounded-xl">
              <Bell className="w-5 h-5 text-zinc-400" />
            </div>
            <span className="font-medium text-[15px]">Reminder {event.reminderTime}</span>
        </div>
        {event.description && (
            <div className="flex items-start gap-4 text-zinc-700 dark:text-zinc-300 pt-4 border-t border-zinc-100">
                <div className="p-2 bg-zinc-50 rounded-xl">
                  <AlignLeft className="w-5 h-5 text-zinc-400" />
                </div>
                <p className="leading-relaxed text-[15px] text-zinc-600 dark:text-zinc-400 pt-2">{event.description}</p>
            </div>
        )}
      </div>

      <div className="mt-auto flex items-center justify-center gap-2 text-xs text-zinc-400 pb-8">
        <Calendar className="w-4 h-4" />
        <span>Dibuat pada {format(event.createdAt, 'dd MMM yyyy, HH:mm', { locale: localeId })}</span>
      </div>
    </div>
  );
}
