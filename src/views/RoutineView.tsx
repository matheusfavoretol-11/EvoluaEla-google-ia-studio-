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
    <div className="p-4 sm:p-6 space-y-10 bg-[var(--color-bg)] min-h-full text-[var(--color-text)] font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#E8B4BC]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="relative z-10">
        <h2 className="text-5xl font-bold text-[var(--color-text)] mb-3 tracking-tighter">Minha <span className="gradient-text">Rotina</span></h2>
        <p className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Pequenos passos, grandes transformações. Como está seu dia?</p>
      </header>

      {/* Tabs */}
      <div className="flex p-1.5 rounded-2xl bg-[var(--color-text)]/5 border border-[var(--color-border)] relative z-10 backdrop-blur-md">
        <button
          onClick={() => setActiveTab('habits')}
          className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
            activeTab === 'habits' ? 'bg-[var(--color-text)] shadow-2xl text-[var(--color-bg)] scale-[1.02]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
          }`}
        >
          Meus Hábitos
        </button>
        <button
          onClick={() => setActiveTab('meals')}
          className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
            activeTab === 'meals' ? 'bg-[var(--color-text)] shadow-2xl text-[var(--color-bg)] scale-[1.02]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
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
            className="space-y-10 relative z-10"
          >
            {/* Progress Card */}
            <div className="p-10 rounded-[3rem] bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bg)] text-[var(--color-text)] relative overflow-hidden shadow-2xl border border-[var(--color-border)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8B4BC]/90 rounded-full blur-[100px] -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D4B996]/5 rounded-full blur-[80px] -ml-20 -mb-20"></div>
              
              <div className="flex justify-between items-end mb-8 relative z-10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest block mb-3 text-[var(--color-text-muted)]">Progresso Diário</span>
                  <span className="text-6xl font-bold tracking-tighter">{completedCount}<span className="text-2xl font-bold text-[var(--color-text-muted)]/90 ml-2">/{habits.length}</span></span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-3xl block tracking-tight">{Math.round(progress)}%</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Concluído</span>
                </div>
              </div>
              
              <div className="h-3 w-full rounded-full overflow-hidden bg-[var(--color-text)]/5 relative z-10 backdrop-blur-sm border border-[var(--color-border)]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-[#E8B4BC] to-[#D4B996] shadow-[0_0_20px_rgba(232,180,188,0.3)]"
                />
              </div>
            </div>

            {/* Habits List */}
            <div className="space-y-5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-[var(--color-text-muted)]">Checklist de Hábitos</h3>
              
              {habits.map((habit, idx) => {
                const Icon = habit.icon;
                return (
                  <motion.button
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id)}
                    className={`w-full flex items-center p-6 rounded-[2.5rem] transition-all border shadow-2xl ${
                      habit.completed 
                        ? 'bg-[var(--color-text)]/5 border-transparent opacity-90' 
                        : 'glass-card border-[var(--color-border)] hover:border-[#E8B4BC]/90'
                    }`}
                  >
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mr-5 transition-all shadow-2xl border border-[var(--color-border)]"
                      style={{ 
                        backgroundColor: habit.completed ? '#E8B4BC' : 'rgba(var(--color-text-rgb), 0.05)', 
                        color: habit.completed ? '#000' : '#E8B4BC' 
                      }}
                    >
                      <Icon size={28} strokeWidth={2} />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <span 
                        className={`font-bold text-xl tracking-tight transition-all block ${habit.completed ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text)]'}`}
                      >
                        {habit.title}
                      </span>
                      {habit.streak > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <Flame size={14} className={habit.completed ? "text-[#D4B996]/90" : "text-[#D4B996]"} />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
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
                      className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all shadow-2xl"
                      style={{ 
                        backgroundColor: habit.completed ? '#E8B4BC' : 'transparent',
                        borderColor: habit.completed ? '#E8B4BC' : 'rgba(var(--color-text-rgb), 0.1)',
                        color: habit.completed ? '#000' : 'transparent'
                      }}
                    >
                      <Check size={20} strokeWidth={3} />
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
            className="space-y-8 relative z-10"
          >
            <div className="glass-card p-10 rounded-[3rem] border border-[var(--color-border)] text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8B4BC]/5 rounded-full blur-[60px] -mr-10 -mt-10"></div>
              <div className="w-24 h-24 mx-auto rounded-[2rem] flex items-center justify-center mb-8 bg-[var(--color-text)]/5 border border-[var(--color-border)] text-[#E8B4BC] shadow-2xl">
                <Camera size={44} strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-bold text-[var(--color-text)] mb-4 tracking-tight">Nutrindo meu corpo</h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-10 font-bold uppercase tracking-widest leading-relaxed">
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
                className="w-full py-6 rounded-2xl font-bold uppercase tracking-widest text-xs text-black shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 bg-gradient-to-r from-[#E8B4BC] to-[#D4B996]"
              >
                <Plus size={24} /> Registrar Refeição
              </button>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Histórico Recente</h3>
              
              <div className="grid grid-cols-2 gap-5">
                {meals.map((meal, idx) => (
                  <div key={meal.id} className="glass-card rounded-[2.5rem] overflow-hidden border border-[var(--color-border)] shadow-2xl group">
                    <div className="aspect-square relative bg-[var(--color-text)]/5 overflow-hidden">
                      {meal.url ? (
                        <img src={meal.url} alt="Refeição" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]/90">
                          <ImageIcon size={40} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="p-5">
                      <p className="font-bold text-lg text-[var(--color-text)] tracking-tight">{meal.type}</p>
                      <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mt-1">{meal.date}</p>
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
