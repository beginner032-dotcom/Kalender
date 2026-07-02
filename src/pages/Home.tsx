import { useAppStore } from '../store/useAppStore';
import { Bell, Calendar as CalendarIcon, FileText, LayoutDashboard, Flag } from 'lucide-react';
import { format, isToday, parseISO, isAfter } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Link } from 'react-router-dom';

export default function Home() {
  const { user, events, holidays } = useAppStore();

  const today = new Date();
  
  // Filter today's events
  const todayEvents = events.filter(e => isToday(parseISO(e.eventDate)));
  
  // Find next event
  const upcomingEvents = events
    .filter(e => isAfter(parseISO(e.eventDate), today))
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  
  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D32F2F] rounded-xl flex items-center justify-center">
             <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#1C1B1F] dark:text-white">Hallo, {user?.name.split(' ')[0]} 👋</h1>
            <p className="text-zinc-500 text-xs">Selamat datang kembali</p>
          </div>
        </div>
        <button className="bg-white dark:bg-zinc-800 p-2.5 rounded-full shadow-sm relative border border-gray-100 dark:border-zinc-800">
          <Bell className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </header>

      {/* Hero Info Card */}
      <section className="bg-[#D32F2F] text-white rounded-[32px] p-6 mb-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">{format(today, 'EEEE, dd MMMM yyyy', { locale: localeId })}</p>
              <h2 className="text-3xl font-bold mt-1">Hari Ini</h2>
              <p className="mt-3 text-xs opacity-80 max-w-[200px]">Anda memiliki {todayEvents.length} agenda hari ini dan {events.filter(e => e.isCompleted).length} telah selesai.</p>
            </div>
            <div className="text-right flex flex-col justify-end">
              <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1">Total</p>
              <p className="text-3xl font-bold">{todayEvents.length}</p>
            </div>
        </div>
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white opacity-10 rounded-full"></div>
        <div className="absolute right-16 -top-10 w-24 h-24 bg-white opacity-5 rounded-full"></div>
      </section>

      {/* Next Event */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3 px-2">
          <h2 className="font-bold text-lg">Event Berikutnya</h2>
        </div>
        {nextEvent ? (
          <Link to={`/event/${nextEvent.id}`} className="bg-white dark:bg-zinc-900 rounded-[24px] p-5 shadow-sm border border-gray-100 dark:border-zinc-800 border-l-4 border-l-[#D32F2F] flex flex-col justify-between hover:opacity-80 transition-opacity">
              <div className="flex justify-between items-start">
                <span className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-[#D32F2F] text-[10px] font-bold rounded uppercase tracking-wider">{nextEvent.category || 'Event'}</span>
                <span className="text-xs text-gray-400">
                  {format(parseISO(nextEvent.eventDate), 'HH:mm - dd MMM', { locale: localeId })}
                </span>
              </div>
              <h3 className="text-base font-bold mt-3 text-[#1C1B1F] dark:text-white">{nextEvent.title}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{nextEvent.description || 'Tidak ada deskripsi'}</p>
          </Link>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-[28px] p-6 shadow-sm border border-gray-100 dark:border-zinc-800 text-center text-zinc-500 text-sm">
            Tidak ada event berikutnya.
          </div>
        )}
      </section>

      {/* Fast Menu */}
      <section className="mb-8">
        <h2 className="font-bold text-lg mb-3 px-2">Menu Cepat</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 px-2 hide-scrollbar">
          <Link to="/add-event" className="flex flex-col items-center gap-2 min-w-[70px]">
             <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 text-[#D32F2F] rounded-[18px] flex items-center justify-center">
                <CalendarIcon className="w-6 h-6" />
             </div>
             <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Tambah</span>
          </Link>
          <Link to="/calendar" className="flex flex-col items-center gap-2 min-w-[70px]">
             <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-[18px] flex items-center justify-center">
                <FileText className="w-6 h-6" />
             </div>
             <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Kalender</span>
          </Link>
          <Link to="/agenda" className="flex flex-col items-center gap-2 min-w-[70px]">
             <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-[18px] flex items-center justify-center">
                <Flag className="w-6 h-6" />
             </div>
             <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Libur</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-2 min-w-[70px]">
             <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-[18px] flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6" />
             </div>
             <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Statistik</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
