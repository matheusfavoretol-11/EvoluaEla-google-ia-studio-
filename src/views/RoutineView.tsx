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
    <div className="p-6 space-y-8">
      <header>
        <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2">Minha Rotina Leve</h2>
        <p className="text-sm font-medium" style={{ color: theme.textMuted }}>Pequenos passos, grandes transformações. Como está seu dia?</p>
      </header>

      {/* Tabs */}
      <div className="flex p-1 rounded-2xl bg-stone-100">
        <button
          onClick={() => setActiveTab('habits')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
            activeTab === 'habits' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          Meus Hábitos
        </button>
        <button
          onClick={() => setActiveTab('meals')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
            activeTab === 'meals' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500 hover:text-stone-700'
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
            <div className="p-8 rounded-[2rem] premium-shadow gradient-bg text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl -mr-10 -mt-10 animate-pulse-soft"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
              
              <div className="flex justify-between items-end mb-6 relative z-10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest block mb-2 opacity-80">Progresso Diário</span>
                  <span className="text-5xl font-serif font-bold">{completedCount}<span className="text-2xl font-medium opacity-80">/{habits.length}</span></span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-2xl block">{Math.round(progress)}%</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-80">Concluído</span>
                </div>
              </div>
              
              <div className="h-3 w-full rounded-full overflow-hidden bg-black/20 relative z-10 backdrop-blur-sm">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                />
              </div>
            </div>

            {/* Habits List */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-stone-400">Checklist de Hábitos</h3>
              
              {habits.map((habit, idx) => {
                const Icon = habit.icon;
                return (
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    key={`${habit.id}-${idx}`}
                    onClick={() => toggleHabit(habit.id)}
                    className={`w-full flex items-center p-4 rounded-[1.5rem] transition-all border ${
                      habit.completed 
                        ? 'bg-stone-50 border-stone-100 opacity-70' 
                        : 'bg-white border-stone-100 soft-shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mr-4 transition-colors"
                      style={{ 
                        backgroundColor: habit.completed ? theme.bg : theme.accent, 
                        color: habit.completed ? theme.textMuted : theme.primary 
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <span 
                        className={`font-serif font-bold text-lg transition-all block ${habit.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}
                      >
                        {habit.title}
                      </span>
                      {habit.streak > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Flame size={12} className={habit.completed ? "text-orange-300" : "text-orange-500"} />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
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
                      className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors"
                      style={{ 
                        backgroundColor: habit.completed ? theme.primary : 'transparent',
                        borderColor: habit.completed ? theme.primary : theme.bg,
                        color: habit.completed ? '#fff' : 'transparent'
                      }}
                    >
                      <Check size={16} strokeWidth={3} />
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
            <div className="bg-white p-8 rounded-[2rem] soft-shadow-sm text-center border border-stone-100">
              <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 gradient-bg-light" style={{ color: theme.primary }}>
                <Camera size={36} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">Nutrindo meu corpo com amor</h3>
              <p className="text-sm text-stone-500 mb-8 font-medium">
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
                className="w-full py-4 rounded-2xl font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 gradient-bg"
              >
                <Plus size={20} /> Registrar Refeição
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500">Histórico Recente</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {meals.map((meal, idx) => (
                  <div key={`${meal.id}-${idx}`} className="bg-white rounded-2xl overflow-hidden soft-shadow-sm border border-stone-100">
                    <div className="aspect-square relative bg-stone-100">
                      {meal.url ? (
                        <img src={meal.url} alt="Refeição" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <ImageIcon size={32} />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold text-stone-800">{meal.type}</p>
                      <p className="text-[10px] text-stone-500">{meal.date}</p>
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
