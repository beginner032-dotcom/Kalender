import { useState, useMemo, useEffect } from 'react';
import { useAppStore, fetchHolidaysForYear } from '../store/useAppStore';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  eachDayOfInterval, isSameMonth, isSameDay, getDay, parseISO 
} from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Menu, CalendarDays } from 'lucide-react';
import { cn } from '../lib/utils';
import { CATEGORIES } from '../types';
import { Link } from 'react-router-dom';

export default function Calendars() {
  const { events, holidays } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysInMonth = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate)
    });
  }, [currentDate]);

  // Pad the beginning of the month to align with weekday columns
  const paddingDays = getDay(daysInMonth[0]) === 0 ? 6 : getDay(daysInMonth[0]) - 1; 

  useEffect(() => {
    fetchHolidaysForYear(currentDate.getFullYear());
  }, [currentDate.getFullYear()]);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // Determine events for the selected day
  const selectedDayEvents = events.filter(e => isSameDay(parseISO(e.eventDate), selectedDate));

  const getDayHolidays = (date: Date) => {
    return holidays.find(h => h.date === format(date, 'yyyy-MM-dd'));
  };

  const hasEvent = (date: Date) => {
    return events.some(e => isSameDay(parseISO(e.eventDate), date));
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto w-full pt-12 pb-6 px-6">
      {/* Top action bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="w-10 h-10 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-full flex items-center justify-center shadow-sm">
          <Menu className="w-5 h-5 text-gray-500" />
        </div>
        <div className="flex items-center gap-4 text-lg font-bold bg-white dark:bg-zinc-900 px-6 py-2 rounded-full shadow-sm border border-gray-100 dark:border-zinc-800 text-[#1C1B1F] dark:text-white">
          <ChevronLeft className="w-5 h-5 cursor-pointer text-gray-400 hover:text-gray-700" onClick={handlePrevMonth} />
          <span className="min-w-[100px] text-center">{format(currentDate, 'MMMM yyyy', { locale: localeId })}</span>
          <ChevronRight className="w-5 h-5 cursor-pointer text-gray-400 hover:text-gray-700" onClick={handleNextMonth} />
        </div>
        <div className="w-10 h-10 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-full flex items-center justify-center shadow-sm">
          <CalendarDays className="w-5 h-5 text-[#D32F2F]" />
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-zinc-900 rounded-[28px] p-6 shadow-sm border border-gray-100 dark:border-zinc-800 mb-6 flex-shrink-0">
        <div className="grid grid-cols-7 gap-y-4 text-center mb-4">
          {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, idx) => (
            <span key={day} className={`text-xs font-bold uppercase tracking-wider ${idx >= 5 ? 'text-[#D32F2F]' : 'text-gray-400'}`}>
              {day}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-x-1 gap-y-2 relative">
          {Array.from({ length: paddingDays }).map((_, i) => (
            <div key={`padding-${i}`} className="h-10"></div>
          ))}
          {daysInMonth.map(day => {
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDate);
            const holiday = getDayHolidays(day);
            const isSunday = getDay(day) === 0;
            const hasEvt = hasEvent(day);

            return (
              <div 
                key={day.toISOString()} 
                onClick={() => setSelectedDate(day)}
                className="relative flex justify-center items-center h-10 w-full"
              >
                <div className={cn(
                  "w-10 h-10 flex items-center justify-center text-sm font-medium cursor-pointer transition-all",
                  isSelected 
                    ? "bg-[#D32F2F] text-white shadow-md shadow-red-600/30 font-bold rounded-xl" 
                    : isToday 
                    ? "border border-gray-200 dark:border-zinc-700 text-[#1C1B1F] dark:text-white rounded-xl"
                    : isSunday || holiday
                    ? "text-[#D32F2F] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                    : "text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
                )}>
                  {format(day, 'd')}
                </div>
                {/* Event Indicator dot */}
                {hasEvt && !isSelected && (
                  <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                )}
              </div>
            );
          })}
        </div>
        {/* Selected Date Insight */}
        {getDayHolidays(selectedDate) && (
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#D32F2F]">
              <span className="w-2 h-2 bg-[#D32F2F] rounded-full"></span>
              <span>{format(selectedDate, 'dd MMMM')}: {getDayHolidays(selectedDate)!.title}</span>
            </div>
          </div>
        )}
      </div>

      {/* Agenda Section */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="font-bold text-lg text-[#1C1B1F] dark:text-white">Agenda Hari Ini</h3>
            <p className="text-sm text-gray-500">{format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: localeId })}</p>
          </div>
        </div>
        
        <div className="space-y-4 pb-20">
          {selectedDayEvents.length === 0 ? (
            <div className="text-center p-8 text-gray-400 text-sm bg-white dark:bg-zinc-900 rounded-[24px] border border-dashed border-gray-300 dark:border-zinc-700">
              <div className="w-12 h-12 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <CalendarDays className="w-5 h-5 text-gray-400" />
              </div>
              <p>Tidak ada agenda</p>
            </div>
          ) : (
            selectedDayEvents.map(evt => {
              const catIndex = Math.max(0, CATEGORIES.indexOf(evt.category));
              const colors = [
                'border-l-blue-500 text-blue-600 bg-blue-50', 
                'border-l-green-500 text-green-600 bg-green-50', 
                'border-l-orange-400 text-orange-600 bg-orange-50', 
                'border-l-[#D32F2F] text-[#D32F2F] bg-red-50', 
                'border-l-purple-500 text-purple-600 bg-purple-50'
              ];
              const colorClass = colors[catIndex % colors.length];
              
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
              )
            })
          )}
        </div>
      </div>
    </div>
  );
}
