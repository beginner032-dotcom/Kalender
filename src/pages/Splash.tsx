import { CalendarDays } from 'lucide-react';
import { motion } from 'motion/react';

export default function Splash() {
  return (
    <div className="flex bg-[#1C1B1F] w-full h-full text-white items-center justify-center flex-col relative max-w-md mx-auto">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
          <CalendarDays className="w-12 h-12 text-white" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-center leading-tight">
          Kalender Pintar
        </h1>
        <p className="text-zinc-400 mt-3 text-[15px]">Kelola waktu dengan mudah</p>
      </motion.div>

      <div className="absolute bottom-12 flex gap-2">
        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-white"></motion.div>
        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }} className="w-1.5 h-1.5 rounded-full bg-white"></motion.div>
        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 1 }} className="w-1.5 h-1.5 rounded-full bg-white"></motion.div>
      </div>
    </div>
  );
}
