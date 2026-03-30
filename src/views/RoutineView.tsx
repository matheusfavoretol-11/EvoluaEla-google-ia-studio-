import React, { useState, useRef, useEffect } from 'react';
import { Check, Droplets, Moon, BookOpen, Dumbbell, Apple, Camera, Plus, Image as ImageIcon, Flame } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { RoutineSkeleton } from '../components/Skeleton';

export default function RoutineView() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'habits' | 'meals'>('habits');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [habits, setHabits] = useState([
    { id: 1, title: 'Beber 2L de água', icon: Droplets, completed: true, streak: 12 },
    { id: 2, title: 'Treino do dia', icon: Dumbbell, completed: false, streak: 3 },
    { id: 3, title: 'Alimentação limpa', icon: Apple, completed: true, streak: 5 },
    { id: 4, title: 'Leitura (10 min)', icon: BookOpen, completed: false, streak: 0 },
    { id: 5, title: 'Dormir 8h', icon: Moon, completed: false, streak: 1 },
  ]);

  const [meals, setMeals] = useState<{ id: string, url: string, date: string, type: string }[]>([
    { id: '1', url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=500&q=80', date: 'Hoje', type: 'Almoço' },
    { id: '2', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80', date: 'Hoje', type: 'Café da Manhã' }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleHabit = (id: number) => {
    setHabits(habits.map(h => {
      if (h.id === id) {
        const isCompleting = !h.completed;
        return { 
          ...h, 
          completed: isCompleting,
          streak: isCompleting ? h.streak + 1 : Math.max(0, h.streak - 1)
        };
      }
      return h;
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMeals([{ id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, url, date: 'Hoje', type: 'Lanche' }, ...meals]);
    }
  };

  const completedCount = habits.filter(h => h.completed).length;
  const progress = (completedCount / habits.length) * 100;

  if (isLoading) {
    return <RoutineSkeleton />;
  }

  return (
    <div className="p-6 space-y-8 bg-[#FAF9F6] min-h-full">
      <header>
        <h2 className="text-3xl font-serif font-light text-[#3F2A2F] mb-2 italic">Minha Rotina Leve</h2>
        <p className="text-sm font-light text-[#3F2A2F]/40">Pequenos passos, grandes transformações. Como está seu dia?</p>
      </header>

      {/* Tabs */}
      <div className="flex p-1 rounded-full bg-[#3F2A2F]/5">
        <button
          onClick={() => setActiveTab('habits')}
          className={`flex-1 py-3 text-[10px] font-medium uppercase tracking-[0.2em] rounded-full transition-all ${
            activeTab === 'habits' ? 'bg-white shadow-sm text-[#3F2A2F]' : 'text-[#3F2A2F]/40 hover:text-[#3F2A2F]'
          }`}
        >
          Meus Hábitos
        </button>
        <button
          onClick={() => setActiveTab('meals')}
          className={`flex-1 py-3 text-[10px] font-medium uppercase tracking-[0.2em] rounded-full transition-all ${
            activeTab === 'meals' ? 'bg-white shadow-sm text-[#3F2A2F]' : 'text-[#3F2A2F]/40 hover:text-[#3F2A2F]'
          }`}
        >
          Minhas Refeições
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'habits' ? (
          <motion.div
            key="habits"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            {/* Progress Card */}
            <div className="p-8 rounded-[2rem] bg-[#3F2A2F] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 animate-pulse-soft"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
              
              <div className="flex justify-between items-end mb-6 relative z-10">
                <div>
                  <span className="text-[9px] font-medium uppercase tracking-[0.2em] block mb-2 opacity-60">Progresso Diário</span>
                  <span className="text-5xl font-serif font-light">{completedCount}<span className="text-2xl font-light opacity-60">/{habits.length}</span></span>
                </div>
                <div className="text-right">
                  <span className="font-light text-2xl block">{Math.round(progress)}%</span>
                  <span className="text-[9px] font-medium uppercase tracking-[0.2em] opacity-60">Concluído</span>
                </div>
              </div>
              
              <div className="h-1.5 w-full rounded-full overflow-hidden bg-white/10 relative z-10 backdrop-blur-sm">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                />
              </div>
            </div>

            {/* Habits List */}
            <div className="space-y-4">
              <h3 className="text-[9px] font-medium uppercase tracking-[0.2em] mb-4 text-[#3F2A2F]/20">Checklist de Hábitos</h3>
              
              {habits.map((habit, idx) => {
                const Icon = habit.icon;
                return (
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id)}
                    className={`w-full flex items-center p-4 rounded-[1.5rem] transition-all border ${
                      habit.completed 
                        ? 'bg-[#3F2A2F]/5 border-transparent opacity-60' 
                        : 'bg-white border-[#3F2A2F]/5 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-colors"
                      style={{ 
                        backgroundColor: habit.completed ? '#3F2A2F' : '#E8B4BC10', 
                        color: habit.completed ? '#fff' : '#E8B4BC' 
                      }}
                    >
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <span 
                        className={`font-serif font-light italic text-lg transition-all block ${habit.completed ? 'line-through text-[#3F2A2F]/40' : 'text-[#3F2A2F]'}`}
                      >
                        {habit.title}
                      </span>
                      {habit.streak > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Flame size={12} className={habit.completed ? "text-[#D4B996]/40" : "text-[#D4B996]"} />
                          <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#3F2A2F]/20">
                            {habit.streak} {habit.streak === 1 ? 'dia' : 'dias'} seguidos
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <motion.div 
                      animate={{ 
                        scale: habit.completed ? [1, 1.2, 1] : 1,
                        rotate: habit.completed ? [0, 10, -10, 0] : 0
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors"
                      style={{ 
                        backgroundColor: habit.completed ? '#E8B4BC' : 'transparent',
                        borderColor: habit.completed ? '#E8B4BC' : '#3F2A2F10',
                        color: habit.completed ? '#fff' : 'transparent'
                      }}
                    >
                      <Check size={14} strokeWidth={2} />
                    </motion.div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="meals"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white p-8 rounded-[2rem] border border-[#3F2A2F]/5 text-center">
              <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 bg-[#E8B4BC]/10" style={{ color: '#E8B4BC' }}>
                <Camera size={36} strokeWidth={1} />
              </div>
              <h3 className="text-xl font-serif font-light text-[#3F2A2F] mb-2 italic">Nutrindo meu corpo com amor</h3>
              <p className="text-sm text-[#3F2A2F]/40 mb-8 font-light">
                Fotografe suas refeições para aumentar sua consciência alimentar. Sem pressão, apenas um registro carinhoso.
              </p>
              
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handlePhotoUpload}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 rounded-full font-light uppercase tracking-[0.2em] text-[10px] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 bg-[#3F2A2F]"
              >
                <Plus size={20} /> Registrar Refeição
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#3F2A2F]/20">Histórico Recente</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {meals.map((meal, idx) => (
                  <div key={meal.id} className="bg-white rounded-[1.5rem] overflow-hidden border border-[#3F2A2F]/5">
                    <div className="aspect-square relative bg-[#FAF9F6]">
                      {meal.url ? (
                        <img src={meal.url} alt="Refeição" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#3F2A2F]/10">
                          <ImageIcon size={32} />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-serif font-light italic text-[#3F2A2F]">{meal.type}</p>
                      <p className="text-[10px] font-light text-[#3F2A2F]/40">{meal.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
