import React from 'react';
import { motion } from 'motion/react';
import { Clock, Flame, ChevronRight, Lock, Crown } from 'lucide-react';
import { Workout } from '../types';

interface WorkoutCardProps {
  workout: Workout;
  onClick: (workout: Workout) => void;
  hasAccess: boolean;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onClick, hasAccess }) => {
  const isLocked = workout.premium && !hasAccess;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(workout)}
      className={`luxury-card p-6 cursor-pointer transition-all hover:bg-white/10 group relative ${isLocked ? 'opacity-60' : ''}`}
    >
      {isLocked && (
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#D81BFF]/20 flex items-center justify-center text-[#D81BFF] border border-[#D81BFF]/30">
          <Crown size={14} fill="currentColor" />
        </div>
      )}
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-2xl font-bold text-white leading-tight mb-2 group-hover:text-[#D81BFF] transition-colors tracking-tight">{workout.title}</h4>
          <div className="flex items-center gap-4 text-[10px] font-bold text-[#B8B0C8] uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#D81BFF]" /> {workout.duration}</span>
            <span className="flex items-center gap-1.5"><Flame size={14} className="text-[#FF4D4D]" /> {workout.calories}</span>
          </div>
        </div>
        <div className="bg-white/5 text-white/40 p-3 rounded-2xl group-hover:bg-[#D81BFF] group-hover:text-white transition-all">
          {isLocked ? <Lock size={20} /> : <ChevronRight size={20} />}
        </div>
      </div>
      
      <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/5">
        <div className="flex -space-x-3">
          {workout.exercises.slice(0, 3).map((ex, idx) => (
            <div key={`${ex.id}-${idx}`} className="w-10 h-10 rounded-full bg-[#1F1638] border-4 border-[#0F0A1F] flex items-center justify-center text-[10px] font-bold text-white/40 shadow-xl">
              {idx + 1}
            </div>
          ))}
          {workout.exercises.length > 3 && (
            <div className="w-10 h-10 rounded-full bg-[#1F1638] border-4 border-[#0F0A1F] flex items-center justify-center text-[10px] font-bold text-white/40 shadow-xl">
              +
            </div>
          )}
        </div>
        <span className="text-[10px] font-bold text-[#B8B0C8] uppercase tracking-widest ml-1">{workout.exercises.length} exercícios</span>
      </div>
    </motion.div>
  );
};

export default WorkoutCard;
