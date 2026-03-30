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
      key={workout.id} 
      onClick={() => setActiveWorkoutId(workout.id)}
      className="bg-white rounded-[1.5rem] p-6 border border-[#3F2A2F]/5 cursor-pointer transition-all hover:bg-[#FAF9F6] group"
    >
      <div className="flex justify-between items-start mb-5">
        <div>
          <h4 className="text-xl font-serif font-light text-[#3F2A2F] leading-tight mb-2 group-hover:text-[#E8B4BC] transition-colors italic">{workout.title}</h4>
          <div className="flex items-center gap-4 text-[9px] font-medium text-[#3F2A2F]/20 uppercase tracking-[0.2em]">
            <span className="flex items-center gap-1.5"><Clock size={14} /> {workout.duration}</span>
            <span className="flex items-center gap-1.5"><Flame size={14} /> {workout.calories}</span>
          </div>
        </div>
        <div className="bg-[#3F2A2F]/5 text-[#3F2A2F]/20 p-2.5 rounded-full group-hover:bg-[#3F2A2F]/10 group-hover:text-[#3F2A2F] transition-colors">
          <ChevronRight size={18} />
        </div>
      </div>
      
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#3F2A2F]/5">
        <div className="flex -space-x-2">
          {workout.exercises.slice(0, 3).map((ex, idx) => (
            <div key={ex.id} className="w-8 h-8 rounded-full bg-[#FAF9F6] border-2 border-white flex items-center justify-center text-[9px] font-medium text-[#3F2A2F]/40 shadow-sm">
              {idx + 1}
            </div>
          ))}
          {workout.exercises.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-[#FAF9F6] border-2 border-white flex items-center justify-center text-[9px] font-medium text-[#3F2A2F]/20 shadow-sm">
              +
            </div>
          )}
        </div>
        <span className="text-[9px] font-medium text-[#3F2A2F]/20 uppercase tracking-[0.2em] ml-1">{workout.exercises.length} exercícios</span>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return <WorkoutsSkeleton />;
  }

  return (
    <div className="flex flex-col h-full bg-[#FAF9F6] relative">
      <AnimatePresence mode="wait">
        {!activeWorkoutId && !isEditing ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full"
          >
            <div className="px-6 pt-6 pb-2">
              <h2 className="text-4xl font-serif font-light mb-2 text-[#3F2A2F] italic">Meus Treinos</h2>
              <p className="text-sm font-light text-[#3F2A2F]/40 mb-6">O app não manda em você. Ele se adapta ao seu ritmo.</p>
              
              {/* Tabs */}
              <div className="flex p-1 rounded-full bg-[#3F2A2F]/5 mb-6">
                <button
                  onClick={() => setActiveTab('meus')}
                  className={`flex-1 py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] rounded-full transition-all ${
                    activeTab === 'meus' ? 'bg-white text-[#3F2A2F] shadow-sm' : 'text-[#3F2A2F]/40 hover:text-[#3F2A2F]/60'
                  }`}
                >
                  Meus Treinos
                </button>
                <button
                  onClick={() => setActiveTab('sugestoes')}
                  className={`flex-1 py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] rounded-full transition-all ${
                    activeTab === 'sugestoes' ? 'bg-white text-[#3F2A2F] shadow-sm' : 'text-[#3F2A2F]/40 hover:text-[#3F2A2F]/60'
                  }`}
                >
                  Sugestões
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4 hide-scrollbar">
              {activeTab === 'meus' && (
                <>
                  <button 
                    onClick={handleCreateNew}
                    className="w-full py-5 rounded-full font-light uppercase tracking-[0.2em] text-[10px] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-4 bg-[#3F2A2F]"
                  >
                    <Plus size={20} /> Criar meu treino personalizado
                  </button>

                  {!isPremium && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-[2rem] p-8 text-[#3F2A2F] text-center mb-6 relative overflow-hidden bg-white border border-[#3F2A2F]/5"
                    >
                      <div className="absolute top-0 right-0 w-48 h-48 bg-[#FAF9F6] rounded-full blur-3xl -mr-10 -mt-10 animate-pulse-soft"></div>
                      <Star className="w-12 h-12 text-[#D4B996] mx-auto mb-4 relative z-10" />
                      <h3 className="text-2xl font-serif font-light mb-3 relative z-10 italic">Treinos feitos para você</h3>
                      <p className="text-[#3F2A2F]/40 text-sm mb-8 relative z-10 font-light leading-relaxed">
                        Desbloqueie treinos 100% personalizados, pensados por especialistas para o seu objetivo real. Vamos juntas?
                      </p>
                      <button 
                        onClick={onUpgrade}
                        className="font-medium uppercase tracking-[0.2em] text-[10px] py-4 px-6 rounded-full w-full transition-all hover:scale-105 hover:shadow-lg bg-[#3F2A2F] text-white shadow-sm relative z-10"
                      >
                        Fazer Upgrade
                      </button>
                    </motion.div>
                  )}

                  {myWorkouts.length === 0 ? (
                    <div className="text-center py-10 text-[#3F2A2F]/10">
                      <Dumbbell size={48} className="mx-auto mb-4 opacity-20" />
                      <p className="font-medium uppercase tracking-[0.2em] text-[9px]">Você ainda não criou nenhum treino.</p>
                    </div>
                  ) : (
                    myWorkouts.map(renderWorkoutCard)
                  )}
                </>
              )}

              {activeTab === 'sugestoes' && (
                <>
                  <div className="bg-white p-4 rounded-[1.5rem] mb-4 text-[9px] text-[#3F2A2F]/40 font-medium uppercase tracking-[0.2em] border border-[#3F2A2F]/5">
                    Sugestões preparadas com carinho para você começar agora. Sinta-se à vontade para editá-las!
                  </div>
                  {defaultSuggestions.map(renderWorkoutCard)}
                </>
              )}

              <div className="mt-6 p-4 bg-white rounded-[1.5rem] border border-[#3F2A2F]/5 flex gap-3 items-start text-[#3F2A2F]/20 text-[9px] font-medium uppercase tracking-[0.2em]">
                <Info size={16} className="shrink-0 mt-0.5" />
                <p>Lembrete: os treinos são sugestões para te apoiar, mas não substituem o olhar de um profissional de educação física, tá?</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full bg-[#FAF9F6]"
          >
            <div className="px-6 pt-6 pb-4 border-b border-[#3F2A2F]/5 flex items-center justify-between sticky top-0 bg-[#FAF9F6] z-20">
              <div className="flex items-center gap-3">
                <button 
                  onClick={isEditing ? handleCancelEdit : () => setActiveWorkoutId(null)}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#3F2A2F]/40 hover:bg-[#3F2A2F]/5 transition-colors border border-[#3F2A2F]/5"
                >
                  {isEditing ? <X size={20} /> : <ChevronRight size={20} className="rotate-180" />}
                </button>
                {!isEditing && (
                  <div>
                    <h2 className="text-2xl font-serif font-light text-[#3F2A2F] italic">{activeWorkout?.title}</h2>
                    <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#3F2A2F]/20">{activeWorkout?.duration} • {activeWorkout?.exercises.length} exercícios</p>
                  </div>
                )}
              </div>
              
              {!isEditing ? (
                <button 
                  onClick={() => startEditing(activeWorkout!)}
                  className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.2em] px-4 py-2 rounded-full bg-white text-[#3F2A2F] border border-[#3F2A2F]/5"
                >
                  <Edit2 size={16} /> Editar
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {activeWorkoutId?.startsWith('custom-') || activeWorkoutId?.startsWith('new-') ? (
                    <button 
                      onClick={handleDeleteWorkout}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-[#E8B4BC]/10 text-[#E8B4BC] shadow-sm hover:bg-[#E8B4BC]/20 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  ) : null}
                  <button 
                    onClick={handleSaveEdit}
                    className="flex items-center gap-1 text-[10px] font-light uppercase tracking-[0.2em] px-6 py-2 rounded-full text-white shadow-md bg-[#3F2A2F]"
                  >
                    Concluir edição
                  </button>
                </div>
              )}
            </div>

            {/* Progress Bar (View Mode) */}
            {!isEditing && (
              <div className="px-6 pt-4 bg-[#FAF9F6]">
                <div className="flex justify-between text-[9px] font-medium uppercase tracking-[0.2em] mb-2 text-[#3F2A2F]/20">
                  <span>Progresso</span>
                  <span className="text-[#E8B4BC]">{Math.round(progressPercent)}%</span>
                </div>
                <div className="h-1 w-full rounded-full overflow-hidden bg-[#3F2A2F]/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full rounded-full bg-[#E8B4BC]"
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 space-y-3 hide-scrollbar">
              {isEditing && (
                <div className="mb-6 space-y-4">
                  <div>
                    <label className="text-[9px] font-medium text-[#3F2A2F]/20 uppercase ml-1 mb-1 block tracking-[0.2em]">Nome do Treino</label>
                    <input 
                      type="text"
                      value={editingWorkout?.title || ''}
                      onChange={(e) => setEditingWorkout(prev => prev ? {...prev, title: e.target.value} : null)}
                      className="w-full text-xl font-serif font-light italic text-[#3F2A2F] bg-white p-4 rounded-[1.5rem] border border-[#3F2A2F]/5 outline-none focus:border-[#E8B4BC]/20 transition-all"
                    />
                  </div>
                  
                  {isPremium && (
                    <div className="bg-white p-4 rounded-[1.5rem] border border-[#3F2A2F]/5 shadow-sm">
                      <p className="text-[9px] font-medium text-[#3F2A2F]/20 uppercase mb-3 flex items-center gap-1 tracking-[0.2em]">
                        <Star size={12} className="text-[#D4B996]" /> Sugestões Inteligentes
                      </p>
                      <div className="flex gap-2">
                        <button onClick={() => addPremiumSuggestion('cardio')} className="text-[9px] font-medium uppercase tracking-[0.2em] px-3 py-2 rounded-full bg-[#FAF9F6] hover:bg-[#3F2A2F]/5 text-[#3F2A2F]/40 transition-colors">
                          + Adicionar Cardio
                        </button>
                        <button onClick={() => addPremiumSuggestion('core')} className="text-[9px] font-medium uppercase tracking-[0.2em] px-3 py-2 rounded-full bg-[#FAF9F6] hover:bg-[#3F2A2F]/5 text-[#3F2A2F]/40 transition-colors">
                          + Focar no Core
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeWorkout?.exercises.map((exercise, index) => {
                const isCompleted = completedExercises[exercise.id];
                
                if (isEditing) {
                  return (
                    <div key={`edit-${exercise.id}`} className="flex flex-col gap-3 p-4 bg-white rounded-[1.5rem] border border-[#3F2A2F]/5 shadow-sm">
                      <div className="flex justify-between items-center gap-2">
                        <input 
                          className="font-serif font-light italic text-lg text-[#3F2A2F] bg-[#FAF9F6] p-2 rounded-xl outline-none w-full border border-transparent focus:border-[#E8B4BC]/20 transition-colors" 
                          value={exercise.name} 
                          onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                          placeholder="Nome do exercício"
                        />
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => moveExercise(index, -1)} disabled={index === 0} className="p-2 bg-[#FAF9F6] rounded-lg text-[#3F2A2F]/20 disabled:opacity-30"><ArrowUp size={16}/></button>
                          <button onClick={() => moveExercise(index, 1)} disabled={index === activeWorkout.exercises.length - 1} className="p-2 bg-[#FAF9F6] rounded-lg text-[#3F2A2F]/20 disabled:opacity-30"><ArrowDown size={16}/></button>
                          <button onClick={() => removeExercise(exercise.id)} className="p-2 bg-[#E8B4BC]/10 rounded-lg text-[#E8B4BC]"><Trash2 size={16}/></button>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="text-[9px] text-[#3F2A2F]/20 uppercase font-medium ml-1 tracking-[0.2em]">Séries</label>
                          <input 
                            className="w-full bg-[#FAF9F6] p-2.5 rounded-xl text-sm font-light text-[#3F2A2F] outline-none border border-transparent focus:border-[#E8B4BC]/20 transition-colors" 
                            value={exercise.sets}
                            onChange={(e) => updateExercise(exercise.id, 'sets', e.target.value)}
                            placeholder="Ex: 3"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[9px] text-[#3F2A2F]/20 uppercase font-medium ml-1 tracking-[0.2em]">Reps/Tempo</label>
                          <input 
                            className="w-full bg-[#FAF9F6] p-2.5 rounded-xl text-sm font-light text-[#3F2A2F] outline-none border border-transparent focus:border-[#E8B4BC]/20 transition-colors" 
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
                      opacity: isCompleted ? 0.4 : 1, 
                      y: 0,
                      scale: isCompleted ? 0.98 : 1,
                      backgroundColor: isCompleted ? 'rgba(63, 42, 47, 0.02)' : 'white'
                    }}
                    whileHover={{ y: isCompleted ? 0 : -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ 
                      delay: index * 0.05,
                      scale: { type: "spring", stiffness: 400, damping: 25 }
                    }}
                    onClick={() => toggleExercise(exercise.id)}
                    className={`p-5 rounded-[1.5rem] border cursor-pointer transition-shadow ${
                      isCompleted 
                        ? 'border-transparent' 
                        : 'border-[#3F2A2F]/5 shadow-sm hover:border-[#E8B4BC]/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className={`font-serif font-light italic text-lg transition-all ${isCompleted ? 'text-[#3F2A2F]/20 line-through' : 'text-[#3F2A2F]'}`}>
                          {exercise.name}
                        </h4>
                        <p className="text-[9px] font-medium uppercase tracking-[0.2em] mt-1 transition-colors" style={{ color: isCompleted ? '#3F2A2F40' : '#E8B4BC' }}>
                          {exercise.sets} séries x {exercise.reps}
                        </p>
                      </div>
                      <motion.div 
                        animate={{ 
                          scale: isCompleted ? [1, 1.2, 1] : 1,
                          rotate: isCompleted ? [0, 10, -10, 0] : 0
                        }}
                        transition={{ duration: 0.4 }}
                        className="p-2 transition-colors rounded-xl"
                        style={{ 
                          color: isCompleted ? '#E8B4BC' : '#3F2A2F20',
                          backgroundColor: isCompleted ? '#E8B4BC10' : 'transparent'
                        }}
                      >
                        {isCompleted ? <CheckSquare size={28} /> : <Square size={28} />}
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}

              {isEditing && (
                <button 
                  onClick={addExercise}
                  className="w-full py-4 rounded-full font-medium uppercase tracking-[0.2em] text-[9px] text-[#3F2A2F]/40 bg-white hover:bg-[#3F2A2F]/5 transition-colors flex items-center justify-center gap-2 mt-4 border border-[#3F2A2F]/5"
                >
                  <Plus size={20} /> Adicionar Exercício
                </button>
              )}
            </div>

            {!isEditing && (
              <div className="p-6 border-t border-[#3F2A2F]/5 bg-[#FAF9F6] sticky bottom-0 z-10">
                <button 
                  onClick={handleFinishWorkout}
                  disabled={completedCount === 0}
                  className="w-full py-5 rounded-full font-light uppercase tracking-[0.2em] text-[10px] text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:shadow-lg bg-[#3F2A2F]"
                >
                  <CheckCircle2 size={20} /> Finalizar Treino
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletion && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#3F2A2F]/80 backdrop-blur-sm p-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl text-center relative border border-[#3F2A2F]/5"
            >
              <button 
                onClick={() => {
                  setShowCompletion(false);
                  setActiveWorkoutId(null);
                  setCompletedExercises({});
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#3F2A2F]/20 hover:bg-[#3F2A2F]/5 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="w-20 h-20 mx-auto bg-[#E8B4BC]/10 rounded-full flex items-center justify-center mb-4 text-[#E8B4BC]">
                <Flame size={40} />
              </div>
              <h2 className="text-2xl font-serif font-light italic text-[#3F2A2F] mb-2">Treino concluído!</h2>
              <p className="text-[#3F2A2F]/40 font-light mb-6">Sinta esse orgulho! Você está evoluindo a cada movimento. 💪</p>
              
              <div className="bg-[#FAF9F6] rounded-2xl p-4 mb-6 grid grid-cols-3 gap-2 border border-[#3F2A2F]/5">
                <div className="flex flex-col items-center">
                  <span className="text-xl font-serif font-light text-[#3F2A2F]">{completedCount}</span>
                  <span className="text-[9px] uppercase font-medium tracking-[0.2em] text-[#3F2A2F]/20 text-center">Excs</span>
                </div>
                <div className="flex flex-col items-center border-x border-[#3F2A2F]/5">
                  <span className="text-xl font-serif font-light text-[#3F2A2F]">{activeWorkout?.duration.replace(/[^0-9]/g, '') || '0'}</span>
                  <span className="text-[9px] uppercase font-medium tracking-[0.2em] text-[#3F2A2F]/20 text-center">Mins</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-serif font-light text-[#3F2A2F]">{activeWorkout?.calories.replace(/[^0-9]/g, '') || '0'}</span>
                  <span className="text-[9px] uppercase font-medium tracking-[0.2em] text-[#3F2A2F]/20 text-center">Kcal</span>
                </div>
              </div>

              <div className="w-full h-1 bg-[#3F2A2F]/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5 }}
                  className="h-full bg-[#E8B4BC]"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
