import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Search, Filter } from 'lucide-react';
import { Input } from '../components/ui/input';
import { CATEGORIES } from '../types';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export default function Agenda() {
  const { events } = useAppStore();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<string>('Semua');

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === 'Semua' || e.category === filterCat;
    return matchesSearch && matchesCat;
  }).sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  // Group by date
  const groupedEvents: Record<string, typeof events> = {};
  filteredEvents.forEach(e => {
    const dateStr = format(parseISO(e.eventDate), 'EEEE, dd MMM yyyy', { locale: localeId });
    if (!groupedEvents[dateStr]) groupedEvents[dateStr] = [];
    groupedEvents[dateStr].push(e);
  });

  return (
    <div className="flex flex-col h-full w-full pt-12 pb-6 px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1C1B1F] dark:text-white">Agenda</h1>
        <div className="w-10 h-10 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-full flex items-center justify-center shadow-sm">
          <Filter className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
        <Input 
          className="pl-12 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl h-12 shadow-sm text-sm" 
          placeholder="Cari agenda..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="flex overflow-x-auto gap-2 mb-6 pb-2 hide-scrollbar">
        <button 
          onClick={() => setFilterCat('Semua')}
          className={cn("px-5 py-2 rounded-full text-xs font-bold shrink-0 transition-colors uppercase tracking-wider", filterCat === 'Semua' ? 'bg-[#D32F2F] text-white' : 'bg-white dark:bg-zinc-900 text-gray-500 shadow-sm border border-gray-100 dark:border-zinc-800')}
        >
          Semua
        </button>
        {CATEGORIES.map(cat => (
          <button 
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={cn("px-5 py-2 rounded-full text-xs font-bold shrink-0 transition-colors uppercase tracking-wider", filterCat === cat ? 'bg-[#D32F2F] text-white' : 'bg-white dark:bg-zinc-900 text-gray-500 shadow-sm border border-gray-100 dark:border-zinc-800')}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-6 pb-20 overflow-y-auto">
        {Object.keys(groupedEvents).length === 0 ? (
          <div className="text-center text-gray-400 py-10 text-sm">Belum ada agenda</div>
        ) : (
          Object.keys(groupedEvents).map(dateKey => (
            <div key={dateKey}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{dateKey}</h3>
              <div className="space-y-4">
                {groupedEvents[dateKey].map(evt => {
                  const catIndex = Math.max(0, CATEGORIES.indexOf(evt.category));
                  const colors = [
                    'border-l-blue-500 text-blue-600 bg-blue-50', 
                    'border-l-green-500 text-green-600 bg-green-50', 
                    'border-l-orange-400 text-orange-600 bg-orange-50', 
                    'border-l-[#D32F2F] text-[#D32F2F] bg-red-50', 
                    'border-l-purple-500 text-purple-600 bg-purple-50'
                  ];
                  const colorClass = colors[catIndex % colors.length];
                  
                  // Extract base color class for the tag
                  const bgClass = colorClass.split(' ').find(c => c.startsWith('bg-'));
                  const textClass = colorClass.split(' ').find(c => c.startsWith('text-'));
                  const borderClass = colorClass.split(' ').find(c => c.startsWith('border-l-'));

                  return (
                    <Link to={`/event/${evt.id}`} key={evt.id} className={`p-5 bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-gray-100 dark:border-zinc-800 ${borderClass} border-l-4 flex flex-col justify-between hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-1 ${bgClass} ${textClass} dark:bg-opacity-20 text-[10px] font-bold rounded uppercase tracking-wider`}>
                          {evt.category || 'Event'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {format(parseISO(evt.eventDate), 'HH:mm')}
                        </span>
                      </div>
                      <h4 className="text-base font-bold mt-1 text-[#1C1B1F] dark:text-white">{evt.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{evt.description || 'Tidak ada deskripsi'}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
