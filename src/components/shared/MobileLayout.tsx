import { Outlet, NavLink } from 'react-router-dom';
import { Home, Calendar as CalendarIcon, FileText, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

export default function MobileLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full w-full bg-[#F8F9FA] dark:bg-zinc-950">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        <Outlet />
      </main>

      {/* Bottom Navigation & FAB */}
      <nav className="absolute bottom-0 w-full h-20 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 px-6 flex items-center justify-between select-none z-10 pb-safe">
        <NavLink to="/" className={({isActive}) => cn('flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-widest', isActive ? 'text-[#D32F2F]' : 'text-gray-400 hover:text-gray-600')}>
          <Home className="w-6 h-6" />
          <span>Beranda</span>
        </NavLink>
        <NavLink to="/calendar" className={({isActive}) => cn('flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-widest', isActive ? 'text-[#D32F2F]' : 'text-gray-400 hover:text-gray-600')}>
          <CalendarIcon className="w-6 h-6" />
          <span>Kalender</span>
        </NavLink>
        
        {/* FAB */}
        <div className="-mt-12 z-20">
          <Button 
            onClick={() => navigate('/add-event')}
            className="w-16 h-16 bg-[#D32F2F] hover:bg-red-700 rounded-full shadow-lg shadow-red-200 dark:shadow-red-900/20 flex items-center justify-center text-white ring-[4px] ring-white dark:ring-zinc-900 p-0 transition-transform active:scale-95"
          >
            <span className="text-4xl leading-none font-light block pb-1">+</span>
          </Button>
        </div>

        <NavLink to="/agenda" className={({isActive}) => cn('flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-widest', isActive ? 'text-[#D32F2F]' : 'text-gray-400 hover:text-gray-600')}>
          <FileText className="w-6 h-6" />
          <span>Agenda</span>
        </NavLink>
        <NavLink to="/profile" className={({isActive}) => cn('flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-widest', isActive ? 'text-[#D32F2F]' : 'text-gray-400 hover:text-gray-600')}>
          <User className="w-6 h-6" />
          <span>Profil</span>
        </NavLink>
      </nav>
    </div>
  );
}
