import { useState, useEffect } from 'react';
import { Play, Lock, Star, CheckSquare, Square, ChevronRight, Clock, Flame, Plus, Edit2, Trash2, ArrowUp, ArrowDown, Info, CheckCircle2, X, Dumbbell } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { WorkoutsSkeleton } from '../components/Skeleton';

type Exercise = { id: string; name: string; reps: string; sets: number | string; };
type Workout = { id: string; title: string; duration: string; level: string; calories: string; premium: boolean; exercises: Exercise[]; };

const defaultSuggestions: Workout[] = [
  { 
    id: 'sug-1', 
    title: 'Inferior Focado', 
    duration: '40 min', 
    level: 'sugestao', 
    calories: '300 kcal',
    premium: false,
    exercises: [
      { id: '1-1', name: 'Agachamento Livre', reps: '12 reps', sets: 3 },
      { id: '1-2', name: 'Leg Press (ou Afundo)', reps: '15 reps', sets: 3 },
      { id: '1-3', name: 'Elevação Pélvica', reps: '12 reps', sets: 3 },
      { id: '1-4', name: 'Panturrilha', reps: '20 reps', sets: 4 },
    ]
  },
  { 
    id: 'sug-2', 
    title: 'Superior & Core', 
    duration: '35 min', 
    level: 'sugestao', 
    calories: '250 kcal',
    premium: false,
    exercises: [
      { id: '2-1', name: 'Flexão de Braço', reps: '10 reps', sets: 3 },
      { id: '2-2', name: 'Remada Curvada', reps: '12 reps', sets: 3 },
      { id: '2-3', name: 'Desenvolvimento', reps: '10 reps', sets: 3 },
      { id: '2-4', name: 'Prancha Isométrica', reps: '45 seg', sets: 3 },
    ]
  },
  { 
    id: 'sug-3', 
    title: 'Corpo Inteiro (Full Body)', 
    duration: '45 min', 
    level: 'sugestao', 
    calories: '400 kcal',
    premium: false,
    exercises: [
      { id: '3-1', name: 'Agachamento', reps: '15 reps', sets: 3 },
      { id: '3-2', name: 'Flexão de Braço', reps: '10 reps', sets: 3 },
      { id: '3-3', name: 'Abdominal Remador', reps: '15 reps', sets: 3 },
      { id: '3-4', name: 'Burpees', reps: '10 reps', sets: 3 },
    ]
  },
  { 
    id: 'sug-4', 
    title: 'Cardio Suador', 
    duration: '20 min', 
    level: 'sugestao', 
    calories: '200 kcal',
    premium: false,
    exercises: [
      { id: '4-1', name: 'Polichinelos', reps: '1 min', sets: 4 },
      { id: '4-2', name: 'Corrida Estacionária', reps: '1 min', sets: 4 },
      { id: '4-3', name: 'Mountain Climbers', reps: '45 seg', sets: 4 },
    ]
  }
];

export default function WorkoutsView({ onUpgrade }: { onUpgrade: () => void }) {
  const { theme } = useTheme();
  const { isPremium, userName, userId } = useUser();
  
  const [activeTab, setActiveTab] = useState<'meus' | 'sugestoes'>('meus');
  const [myWorkouts, setMyWorkouts] = useState<Workout[]>([]);
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [showCompletion, setShowCompletion] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const activeWorkout = isEditing 
    ? editingWorkout 
    : (myWorkouts.find(w => w.id === activeWorkoutId) || defaultSuggestions.find(w => w.id === activeWorkoutId));

  const totalExercises = activeWorkout?.exercises.length || 0;
  const completedCount = activeWorkout?.exercises.filter(ex => completedExercises[ex.id]).length || 0;
  const progressPercent = totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0;

  // Initialize premium personalized workout if empty
  useEffect(() => {
    if (isPremium && myWorkouts.length === 0) {
      setMyWorkouts([{
        id: 'premium-base',
        title: `Treino Personalizado - ${userName}`,
        duration: '45 min',
        level: 'custom',
        calories: '350 kcal',
        premium: false,
        exercises: [
          { id: 'p-1', name: 'Aquecimento Articular', reps: '5 min', sets: 1 },
          { id: 'p-2', name: 'Agachamento com Peso', reps: '12 reps', sets: 4 },
          { id: 'p-3', name: 'Levantamento Terra', reps: '10 reps', sets: 3 },
          { id: 'p-4', name: 'Prancha', reps: '1 min', sets: 3 },
        ]
      }]);
    }
  }, [isPremium, userName, myWorkouts.length]);

  const toggleExercise = (exerciseId: string) => {
    if (isEditing) return;
    setCompletedExercises(prev => {
      const newState = { ...prev, [exerciseId]: !prev[exerciseId] };
      
      if (!prev[exerciseId] && activeWorkout) {
        const total = activeWorkout.exercises.length;
        const completed = activeWorkout.exercises.filter(ex => newState[ex.id]).length;
        if (completed === total) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: [theme.primary, '#10b981', '#fcd34d']
          });
        }
      }
      
      return newState;
    });
  };

  const handleCreateNew = () => {
    const newWorkout: Workout = {
      id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: 'Meu Novo Treino',
      duration: '30 min',
      level: 'custom',
      calories: '--- kcal',
      premium: false,
      exercises: [
        { id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, name: 'Novo Exercício', sets: 3, reps: '10 reps' }
      ]
    };
    setEditingWorkout(newWorkout);
    setIsEditing(true);
    setActiveWorkoutId(newWorkout.id);
  };

  const startEditing = (workout: Workout) => {
    setEditingWorkout(JSON.parse(JSON.stringify(workout))); // Deep copy
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (activeWorkoutId?.startsWith('new-')) {
      setActiveWorkoutId(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingWorkout) return;
    
    const isExisting = myWorkouts.some(w => w.id === editingWorkout.id);
    let newId = editingWorkout.id;
    let newWorkout = editingWorkout;
    
    if (isExisting) {
      setMyWorkouts(prev => prev.map(w => w.id === editingWorkout.id ? editingWorkout : w));
    } else {
      // It was a suggestion or brand new, save as custom
      newId = editingWorkout.id.startsWith('new-') ? editingWorkout.id : `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      newWorkout = { ...editingWorkout, id: newId, level: 'custom' };
      setMyWorkouts(prev => {
        if (prev.some(w => w.id === newId)) {
          return prev.map(w => w.id === newId ? newWorkout : w);
        }
        return [newWorkout, ...prev];
      });
      setActiveWorkoutId(newId);
      setActiveTab('meus');
    }

    setIsEditing(false);

    if (userId) {
      try {
        const { supabase } = await import('../lib/supabase');
        
        await supabase
          .from('workouts')
          .upsert({
            id: newId,
            user_id: userId,
            title: newWorkout.title,
            duration: newWorkout.duration,
            level: newWorkout.level,
            calories: newWorkout.calories,
            premium: newWorkout.premium,
            exercises: newWorkout.exercises,
            updated_at: new Date().toISOString()
          });
      } catch (error) {
        console.error("Error saving workout to Supabase:", error);
      }
    }
  };

  const handleDeleteWorkout = async () => {
    if (!activeWorkoutId) return;
    
    setMyWorkouts(prev => prev.filter(w => w.id !== activeWorkoutId));
    setIsEditing(false);
    setActiveWorkoutId(null);

    if (userId && !activeWorkoutId.startsWith('new-')) {
      try {
        const { supabase } = await import('../lib/supabase');
        await supabase
          .from('workouts')
          .delete()
          .eq('id', activeWorkoutId)
          .eq('user_id', userId);
      } catch (error) {
        console.error("Error deleting workout from Supabase:", error);
      }
    }
  };

  const updateExercise = (id: string, field: keyof Exercise, value: string | number) => {
    if (!editingWorkout) return;
    setEditingWorkout({
      ...editingWorkout,
      exercises: editingWorkout.exercises.map(ex => ex.id === id ? { ...ex, [field]: value } : ex)
    });
  };

  const removeExercise = (id: string) => {
    if (!editingWorkout) return;
    setEditingWorkout({
      ...editingWorkout,
      exercises: editingWorkout.exercises.filter(ex => ex.id !== id)
    });
  };

  const addExercise = () => {
    if (!editingWorkout) return;
    setEditingWorkout({
      ...editingWorkout,
      exercises: [...editingWorkout.exercises, { id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, name: '', sets: 3, reps: '10 reps' }]
    });
  };

  const moveExercise = (index: number, direction: number) => {
    if (!editingWorkout) return;
    const newExercises = [...editingWorkout.exercises];
    if (index + direction < 0 || index + direction >= newExercises.length) return;
    
    const temp = newExercises[index];
    newExercises[index] = newExercises[index + direction];
    newExercises[index + direction] = temp;
    
    setEditingWorkout({ ...editingWorkout, exercises: newExercises });
  };

  const addPremiumSuggestion = (type: string) => {
    if (!editingWorkout) return;
    let newExercises: Exercise[] = [];
    if (type === 'cardio') {
      newExercises = [{ id: `ex-${Date.now()}-1-${Math.random().toString(36).substr(2, 9)}`, name: 'Polichinelos (Cardio)', sets: 3, reps: '1 min' }];
    } else if (type === 'core') {
      newExercises = [{ id: `ex-${Date.now()}-2-${Math.random().toString(36).substr(2, 9)}`, name: 'Prancha Isométrica', sets: 3, reps: '45 seg' }];
    }
    setEditingWorkout({
      ...editingWorkout,
      exercises: [...editingWorkout.exercises, ...newExercises]
    });
  };

  const handleFinishWorkout = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.5 },
      colors: [theme.primary, '#10b981', '#fcd34d', '#3b82f6']
    });
    setShowCompletion(true);
    setTimeout(() => {
      setShowCompletion(false);
      setActiveWorkoutId(null);
      setCompletedExercises({});
    }, 5000);
  };

  const renderWorkoutCard = (workout: Workout) => (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        key={workout.id} 
        onClick={() => setActiveWorkoutId(workout.id)}
        className="glass-morphism p-6 cursor-pointer transition-all hover:bg-white/10 group border border-white/10"
      >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-2xl font-bold text-[var(--color-text)] leading-tight mb-2 group-hover:text-[var(--color-primary)] transition-colors tracking-tight">{workout.title}</h4>
          <div className="flex items-center gap-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-[var(--color-primary)]" /> {workout.duration}</span>
            <span className="flex items-center gap-1.5"><Flame size={14} className="text-[var(--color-accent)]" /> {workout.calories}</span>
          </div>
        </div>
        <div className="bg-[var(--color-text)]/5 text-[var(--color-text-muted)] p-3 rounded-2xl group-hover:bg-[var(--color-primary)] group-hover:text-black transition-all">
          <ChevronRight size={20} />
        </div>
      </div>
      
      <div className="flex items-center gap-4 mt-6 pt-6 border-t border-[var(--color-border)]">
        <div className="flex -space-x-3">
          {workout.exercises.slice(0, 3).map((ex, idx) => (
            <div key={`${ex.id}-${idx}`} className="w-10 h-10 rounded-full bg-[var(--color-bg)] border-4 border-[var(--color-bg)] flex items-center justify-center text-[10px] font-bold text-[var(--color-text-muted)] shadow-xl">
              {idx + 1}
            </div>
          ))}
          {workout.exercises.length > 3 && (
            <div className="w-10 h-10 rounded-full bg-[var(--color-bg)] border-4 border-[var(--color-bg)] flex items-center justify-center text-[10px] font-bold text-[var(--color-text-muted)] shadow-xl">
              +
            </div>
          )}
        </div>
        <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest ml-1">{workout.exercises.length} exercícios</span>
      </div>
    </motion.div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  if (isLoading) {
    return <WorkoutsSkeleton />;
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col h-full bg-transparent text-[var(--color-text)] font-sans relative"
    >
      <AnimatePresence mode="wait">
        {!activeWorkoutId && !isEditing ? (
          <motion.div 
            key="list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full"
          >
            <div className="px-4 sm:px-6 pt-8 pb-4">
              <motion.h2 variants={itemVariants} className="text-5xl font-bold mb-3 text-[var(--color-text)] tracking-tighter">Seus <span className="gradient-text">Treinos</span></motion.h2>
              <motion.p variants={itemVariants} className="text-sm font-bold text-[var(--color-text-muted)] mb-8 uppercase tracking-widest">O app não manda em você. Ele se adapta ao seu ritmo.</motion.p>
              
              {/* Tabs */}
              <motion.div variants={itemVariants} className="flex p-1.5 rounded-2xl bg-white/5 mb-8 border border-white/10">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab('meus')}
                  className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                    activeTab === 'meus' ? 'bg-[var(--color-text)] text-[var(--color-bg)] shadow-2xl' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  Meus Treinos
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab('sugestoes')}
                  className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                    activeTab === 'sugestoes' ? 'bg-[var(--color-text)] text-[var(--color-bg)] shadow-2xl' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  Sugestões
                </motion.button>
              </motion.div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-10 space-y-6 hide-scrollbar">
              {activeTab === 'meus' && (
                <>
                  <motion.button 
                    variants={itemVariants}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCreateNew}
                    className="w-full py-6 rounded-3xl font-bold uppercase tracking-widest text-xs text-black shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 mb-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
                  >
                    <Plus size={22} /> Criar treino personalizado
                  </motion.button>

                  {!isPremium && (
                    <motion.div 
                      variants={itemVariants}
                      className="rounded-[2.5rem] p-10 text-[var(--color-text)] text-center mb-8 relative overflow-hidden glass-morphism border border-white/10"
                    >
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/90 rounded-full blur-[100px] -mr-20 -mt-20 animate-pulse-soft"></div>
                      <Star className="w-16 h-16 text-[var(--color-accent)] mx-auto mb-6 relative z-10" />
                      <h3 className="text-3xl font-bold mb-4 relative z-10 tracking-tight">Treinos feitos para você</h3>
                      <p className="text-[var(--color-text-muted)] text-base mb-10 relative z-10 font-bold leading-relaxed">
                        Desbloqueie treinos 100% personalizados, pensados por especialistas para o seu objetivo real. Vamos juntas?
                      </p>
                      <motion.button 
                        whileTap={{ scale: 0.97 }}
                        onClick={onUpgrade}
                        className="font-bold uppercase tracking-widest text-xs py-5 px-10 rounded-full w-full transition-all hover:scale-105 hover:shadow-2xl bg-[var(--color-text)] text-[var(--color-bg)] shadow-xl relative z-10"
                      >
                        Fazer Upgrade Premium
                      </motion.button>
                    </motion.div>
                  )}

                  {myWorkouts.length === 0 ? (
                    <motion.div variants={itemVariants} className="text-center py-16 text-[var(--color-text-muted)]/90">
                      <Dumbbell size={64} className="mx-auto mb-6 opacity-90" />
                      <p className="font-bold uppercase tracking-widest text-[10px]">Você ainda não criou nenhum treino.</p>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {myWorkouts.map((workout) => (
                        <motion.div key={workout.id} variants={itemVariants}>
                          {renderWorkoutCard(workout)}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'sugestoes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <motion.div variants={itemVariants} className="md:col-span-2 xl:col-span-3 glass-morphism p-5 text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-widest border border-white/10 text-center">
                    Sugestões preparadas com carinho para você começar agora.
                  </motion.div>
                  {defaultSuggestions.map((workout) => (
                    <motion.div key={workout.id} variants={itemVariants}>
                      {renderWorkoutCard(workout)}
                    </motion.div>
                  ))}
                </div>
              )}

              <motion.div variants={itemVariants} className="mt-8 p-6 glass-morphism border border-white/10 flex gap-4 items-start text-[var(--color-text-muted)] text-[10px] font-bold uppercase tracking-widest">
                <Info size={20} className="shrink-0 mt-0.5 text-[var(--color-accent)]" />
                <p className="leading-relaxed">Lembrete: os treinos são sugestões para te apoiar, mas não substituem o olhar de um profissional de educação física, tá?</p>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full bg-[var(--color-bg)]"
          >
            <div className="px-4 sm:px-6 pt-8 pb-6 border-b border-white/5 flex items-center justify-between sticky top-0 backdrop-blur-xl z-30">
              <div className="flex items-center gap-4">
                <motion.button 
                  whileTap={{ scale: 0.97 }}
                  onClick={isEditing ? handleCancelEdit : () => setActiveWorkoutId(null)}
                  className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[var(--color-text-muted)] hover:bg-white/10 transition-all border border-white/10"
                >
                  {isEditing ? <X size={24} /> : <ChevronRight size={24} className="rotate-180" />}
                </motion.button>
                {!isEditing && (
                  <div>
                    <h2 className="text-3xl font-bold text-[var(--color-text)] tracking-tight">{activeWorkout?.title}</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">{activeWorkout?.duration} • {activeWorkout?.exercises.length} exercícios</p>
                  </div>
                )}
              </div>
              
              {!isEditing ? (
                <motion.button 
                  whileTap={{ scale: 0.97 }}
                  onClick={() => startEditing(activeWorkout!)}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-5 py-3 rounded-2xl bg-white/5 text-[var(--color-text)] border border-white/10 hover:bg-white/10 transition-all"
                >
                  <Edit2 size={18} /> Editar
                </motion.button>
              ) : (
                <div className="flex items-center gap-3">
                  {activeWorkoutId?.startsWith('custom-') || activeWorkoutId?.startsWith('new-') ? (
                    <motion.button 
                      whileTap={{ scale: 0.97 }}
                      onClick={handleDeleteWorkout}
                      className="flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-500/90 text-rose-500 shadow-xl hover:bg-rose-500/90 transition-all border border-rose-500/90"
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  ) : null}
                  <motion.button 
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSaveEdit}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-8 py-3 rounded-2xl text-black shadow-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:scale-105 transition-all"
                  >
                    Salvar
                  </motion.button>
                </div>
              )}
            </div>

            {/* Progress Bar (View Mode) */}
            {!isEditing && (
              <div className="px-4 sm:px-6 pt-6 bg-transparent">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-3 text-[var(--color-text-muted)]">
                  <span>Progresso do Treino</span>
                  <span className="text-[var(--color-primary)]">{Math.round(progressPercent)}%</span>
                </div>
                <div className="h-2 w-full rounded-full overflow-hidden bg-[var(--color-text)]/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 hide-scrollbar">
              {isEditing && (
                <div className="mb-8 space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase ml-2 mb-2 block tracking-widest">Nome do Treino</label>
                    <input 
                      type="text"
                      value={editingWorkout?.title || ''}
                      onChange={(e) => setEditingWorkout(prev => prev ? {...prev, title: e.target.value} : null)}
                      className="w-full text-2xl font-bold text-[var(--color-text)] bg-white/5 p-6 rounded-3xl border border-white/10 outline-none focus:border-[var(--color-primary)]/90 transition-all"
                    />
                  </div>
                  
                  {isPremium && (
                    <div className="glass-morphism p-6 border border-white/10 shadow-2xl">
                      <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase mb-4 flex items-center gap-2 tracking-widest">
                        <Star size={14} className="text-[#D4B996]" /> Sugestões Inteligentes
                      </p>
                      <div className="flex gap-3">
                        <motion.button 
                          whileTap={{ scale: 0.97 }}
                          onClick={() => addPremiumSuggestion('cardio')} 
                          className="text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-[var(--color-text)] transition-all border border-white/10"
                        >
                          + Cardio
                        </motion.button>
                        <motion.button 
                          whileTap={{ scale: 0.97 }}
                          onClick={() => addPremiumSuggestion('core')} 
                          className="text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-[var(--color-text)] transition-all border border-white/10"
                        >
                          + Core
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeWorkout?.exercises.map((exercise, index) => {
                const isCompleted = completedExercises[exercise.id];
                
                if (isEditing) {
                  return (
                    <div key={`edit-${exercise.id}`} className="flex flex-col gap-4 p-6 glass-morphism border border-white/10 shadow-2xl">
                      <div className="flex justify-between items-center gap-4">
                        <input 
                          className="font-bold text-xl text-[var(--color-text)] bg-white/5 p-3 rounded-2xl outline-none w-full border border-transparent focus:border-[var(--color-primary)]/90 transition-all" 
                          value={exercise.name} 
                          onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                          placeholder="Nome do exercício"
                        />
                        <div className="flex gap-2 shrink-0">
                          <motion.button whileTap={{ scale: 0.97 }} onClick={() => moveExercise(index, -1)} disabled={index === 0} className="p-3 bg-white/5 rounded-xl text-[var(--color-text-muted)] disabled:opacity-90 hover:bg-white/10"><ArrowUp size={18}/></motion.button>
                          <motion.button whileTap={{ scale: 0.97 }} onClick={() => moveExercise(index, 1)} disabled={index === activeWorkout.exercises.length - 1} className="p-3 bg-white/5 rounded-xl text-[var(--color-text-muted)] disabled:opacity-90 hover:bg-white/10"><ArrowDown size={18}/></motion.button>
                          <motion.button whileTap={{ scale: 0.97 }} onClick={() => removeExercise(exercise.id)} className="p-3 bg-rose-500/90 rounded-xl text-rose-500 hover:bg-rose-500/90"><Trash2 size={18}/></motion.button>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold ml-2 mb-1 block tracking-widest">Séries</label>
                          <input 
                            className="w-full bg-white/5 p-4 rounded-2xl text-sm font-bold text-[var(--color-text)] outline-none border border-transparent focus:border-[var(--color-primary)]/90 transition-all" 
                            value={exercise.sets}
                            onChange={(e) => updateExercise(exercise.id, 'sets', e.target.value)}
                            placeholder="Ex: 3"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold ml-2 mb-1 block tracking-widest">Reps/Tempo</label>
                          <input 
                            className="w-full bg-white/5 p-4 rounded-2xl text-sm font-bold text-[var(--color-text)] outline-none border border-transparent focus:border-[var(--color-primary)]/90 transition-all" 
                            value={exercise.reps}
                            onChange={(e) => updateExercise(exercise.id, 'reps', e.target.value)}
                            placeholder="Ex: 15 reps"
                          />
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <motion.div 
                    key={`view-${exercise.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: isCompleted ? 0.6 : 1, 
                      y: 0,
                      scale: isCompleted ? 0.98 : 1,
                    }}
                    whileHover={{ y: isCompleted ? 0 : -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ 
                      delay: index * 0.05,
                      scale: { type: "spring", stiffness: 400, damping: 25 }
                    }}
                    onClick={() => toggleExercise(exercise.id)}
                    className={`p-6 rounded-3xl border cursor-pointer transition-all ${
                      isCompleted 
                        ? 'bg-[var(--color-text)]/90 border-transparent' 
                        : 'glass-morphism border-white/10 shadow-xl hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className={`font-bold text-xl transition-all tracking-tight ${isCompleted ? 'text-[var(--color-text-muted)] line-through' : 'text-[var(--color-text)]'}`}>
                          {exercise.name}
                        </h4>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-2 transition-colors" style={{ color: isCompleted ? 'rgba(var(--color-primary-rgb), 0.4)' : 'var(--color-primary)' }}>
                          {exercise.sets} séries x {exercise.reps}
                        </p>
                      </div>
                    <div 
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors`}
                      style={{ 
                        color: isCompleted ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        backgroundColor: isCompleted ? 'rgba(var(--color-primary-rgb), 0.15)' : 'transparent'
                      }}
                    >
                      {isCompleted ? <CheckSquare size={32} /> : <Square size={32} />}
                    </div>
                  </div>
                </motion.div>
              );
            })}

              {isEditing && (
                <motion.button 
                  whileTap={{ scale: 0.97 }}
                  onClick={addExercise}
                  className="w-full py-5 rounded-3xl font-bold uppercase tracking-widest text-[10px] text-[var(--color-text-muted)] bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-3 mt-6 border border-white/10"
                >
                  <Plus size={24} /> Adicionar Exercício
                </motion.button>
              )}
            </div>

            {!isEditing && (
              <div className="p-8 border-t border-white/5 backdrop-blur-xl sticky bottom-0 z-20">
                <motion.button 
                  whileTap={{ scale: 0.97 }}
                  onClick={handleFinishWorkout}
                  disabled={completedCount === 0}
                  className="w-full py-6 rounded-full font-bold uppercase tracking-widest text-xs text-black shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-90 disabled:hover:scale-100 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
                >
                  <CheckCircle2 size={24} /> Finalizar Treino
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletion && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass-morphism p-10 w-full shadow-2xl text-center relative border border-white/10"
            >
              <motion.button 
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setShowCompletion(false);
                  setActiveWorkoutId(null);
                  setCompletedExercises({});
                }}
                className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[var(--color-text-muted)] hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </motion.button>

              <div className="w-24 h-24 mx-auto bg-[var(--color-primary)]/90 rounded-3xl flex items-center justify-center mb-6 text-[var(--color-primary)]">
                <Flame size={48} />
              </div>
              <h2 className="text-3xl font-bold text-[var(--color-text)] mb-3 tracking-tight">Treino concluído!</h2>
              <p className="text-[var(--color-text-muted)] font-medium mb-8">Sinta esse orgulho! Você está evoluindo a cada movimento. 💪</p>
              
              <div className="bg-white/5 rounded-3xl p-6 mb-8 grid grid-cols-3 gap-4 border border-white/10">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-[var(--color-text)]">{completedCount}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-text-muted)] text-center">Excs</span>
                </div>
                <div className="flex flex-col items-center border-x border-[var(--color-border)]">
                  <span className="text-2xl font-bold text-[var(--color-text)]">{activeWorkout?.duration.replace(/[^0-9]/g, '') || '0'}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-text-muted)] text-center">Mins</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-[var(--color-text)]">{activeWorkout?.calories.replace(/[^0-9]/g, '') || '0'}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-text-muted)] text-center">Kcal</span>
                </div>
              </div>

              <div className="w-full h-2 bg-[var(--color-text)]/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5 }}
                  className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
