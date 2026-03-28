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
      className="bg-white rounded-[1.5rem] p-6 soft-shadow-sm border border-stone-100 cursor-pointer transition-all hover:shadow-md group"
    >
      <div className="flex justify-between items-start mb-5">
        <div>
          <h4 className="text-xl font-serif font-bold text-stone-800 leading-tight mb-2 group-hover:text-stone-900 transition-colors">{workout.title}</h4>
          <div className="flex items-center gap-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Clock size={14} /> {workout.duration}</span>
            <span className="flex items-center gap-1.5"><Flame size={14} /> {workout.calories}</span>
          </div>
        </div>
        <div className="bg-stone-50 text-stone-400 p-2.5 rounded-xl group-hover:bg-stone-100 group-hover:text-stone-600 transition-colors">
          <ChevronRight size={18} />
        </div>
      </div>
      
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-stone-50">
        <div className="flex -space-x-2">
          {workout.exercises.slice(0, 3).map((ex, idx) => (
            <div key={ex.id} className="w-8 h-8 rounded-full bg-stone-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-stone-500 shadow-sm">
              {idx + 1}
            </div>
          ))}
          {workout.exercises.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-stone-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-stone-400 shadow-sm">
              +
            </div>
          )}
        </div>
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">{workout.exercises.length} exercícios</span>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return <WorkoutsSkeleton />;
  }

  return (
    <div className="flex flex-col h-full bg-stone-50 relative">
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
              <h2 className="text-3xl font-serif font-bold mb-2 text-stone-800">Treinos</h2>
              <p className="text-sm font-medium text-stone-500 mb-6">O app não manda. Ele se adapta a você.</p>
              
              {/* Tabs */}
              <div className="flex p-1 rounded-2xl bg-stone-100 mb-6">
                <button
                  onClick={() => setActiveTab('meus')}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                    activeTab === 'meus' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  Meus Treinos
                </button>
                <button
                  onClick={() => setActiveTab('sugestoes')}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                    activeTab === 'sugestoes' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500 hover:text-stone-700'
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
                    className="w-full py-4 rounded-2xl font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-4 gradient-bg"
                  >
                    <Plus size={20} /> Criar meu treino
                  </button>

                  {!isPremium && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-[2rem] p-8 text-white text-center mb-6 premium-shadow relative overflow-hidden gradient-bg"
                    >
                      <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl -mr-10 -mt-10 animate-pulse-soft"></div>
                      <Star className="w-12 h-12 text-amber-300 mx-auto mb-4 relative z-10" />
                      <h3 className="text-2xl font-serif font-bold mb-3 relative z-10">Treinos com Especialistas</h3>
                      <p className="text-white/90 text-sm mb-8 relative z-10 font-medium leading-relaxed">
                        Desbloqueie treinos 100% personalizados feitos por um educador físico para o seu objetivo. Pare de tentar sozinha.
                      </p>
                      <button 
                        onClick={onUpgrade}
                        className="font-bold py-4 px-6 rounded-[1.5rem] w-full transition-all hover:scale-105 hover:shadow-lg bg-white text-stone-800 shadow-sm relative z-10"
                      >
                        Fazer Upgrade
                      </button>
                    </motion.div>
                  )}

                  {myWorkouts.length === 0 ? (
                    <div className="text-center py-10 text-stone-400">
                      <Dumbbell size={48} className="mx-auto mb-4 opacity-20" />
                      <p>Você ainda não criou nenhum treino.</p>
                    </div>
                  ) : (
                    myWorkouts.map(renderWorkoutCard)
                  )}
                </>
              )}

              {activeTab === 'sugestoes' && (
                <>
                  <div className="bg-stone-100 p-4 rounded-2xl mb-4 text-sm text-stone-600 font-medium">
                    Sugestões prontas para você começar agora. Você pode editá-las e salvá-las nos seus treinos.
                  </div>
                  {defaultSuggestions.map(renderWorkoutCard)}
                </>
              )}

              <div className="mt-6 p-4 bg-stone-100 rounded-2xl flex gap-3 items-start text-stone-500 text-xs">
                <Info size={16} className="shrink-0 mt-0.5" />
                <p>Os treinos são sugestões e não substituem acompanhamento profissional de um educador físico.</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full bg-stone-50"
          >
            <div className="px-6 pt-6 pb-4 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-stone-50 z-20">
              <div className="flex items-center gap-3">
                <button 
                  onClick={isEditing ? handleCancelEdit : () => setActiveWorkoutId(null)}
                  className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  {isEditing ? <X size={20} /> : <ChevronRight size={20} className="rotate-180" />}
                </button>
                {!isEditing && (
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-stone-800">{activeWorkout?.title}</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{activeWorkout?.duration} • {activeWorkout?.exercises.length} exercícios</p>
                  </div>
                )}
              </div>
              
              {!isEditing ? (
                <button 
                  onClick={() => startEditing(activeWorkout!)}
                  className="flex items-center gap-1 text-sm font-bold px-3 py-2 rounded-xl bg-white shadow-sm"
                  style={{ color: theme.primary }}
                >
                  <Edit2 size={16} /> Editar
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {activeWorkoutId?.startsWith('custom-') || activeWorkoutId?.startsWith('new-') ? (
                    <button 
                      onClick={handleDeleteWorkout}
                      className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-500 shadow-sm hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  ) : null}
                  <button 
                    onClick={handleSaveEdit}
                    className="flex items-center gap-1 text-sm font-bold px-4 py-2 rounded-xl text-white shadow-md gradient-bg"
                  >
                    Concluir edição
                  </button>
                </div>
              )}
            </div>

            {/* Progress Bar (View Mode) */}
            {!isEditing && (
              <div className="px-6 pt-4 bg-stone-50">
                <div className="flex justify-between text-xs font-bold mb-2 text-stone-500">
                  <span>Progresso</span>
                  <span style={{ color: theme.primary }}>{Math.round(progressPercent)}%</span>
                </div>
                <div className="h-2 w-full rounded-full overflow-hidden bg-stone-200">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 space-y-3 hide-scrollbar">
              {isEditing && (
                <div className="mb-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-stone-500 uppercase ml-1 mb-1 block">Nome do Treino</label>
                    <input 
                      type="text"
                      value={editingWorkout?.title || ''}
                      onChange={(e) => setEditingWorkout(prev => prev ? {...prev, title: e.target.value} : null)}
                      className="w-full text-xl font-bold text-stone-800 bg-white p-4 rounded-2xl border border-stone-200 outline-none focus:ring-2"
                      style={{ focusRingColor: theme.primary }}
                    />
                  </div>
                  
                  {isPremium && (
                    <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                      <p className="text-xs font-bold text-stone-500 uppercase mb-3 flex items-center gap-1">
                        <Star size={12} className="text-amber-500" /> Sugestões Inteligentes
                      </p>
                      <div className="flex gap-2">
                        <button onClick={() => addPremiumSuggestion('cardio')} className="text-xs font-bold px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors">
                          + Adicionar Cardio
                        </button>
                        <button onClick={() => addPremiumSuggestion('core')} className="text-xs font-bold px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors">
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
                    <div key={exercise.id} className="flex flex-col gap-3 p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
                      <div className="flex justify-between items-center gap-2">
                        <input 
                          className="font-bold text-lg text-stone-800 bg-stone-50 p-2 rounded-xl outline-none w-full border border-stone-100 focus:border-stone-300 transition-colors" 
                          value={exercise.name} 
                          onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                          placeholder="Nome do exercício"
                        />
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => moveExercise(index, -1)} disabled={index === 0} className="p-2 bg-stone-100 rounded-lg text-stone-500 disabled:opacity-30"><ArrowUp size={16}/></button>
                          <button onClick={() => moveExercise(index, 1)} disabled={index === activeWorkout.exercises.length - 1} className="p-2 bg-stone-100 rounded-lg text-stone-500 disabled:opacity-30"><ArrowDown size={16}/></button>
                          <button onClick={() => removeExercise(exercise.id)} className="p-2 bg-red-50 rounded-lg text-red-500"><Trash2 size={16}/></button>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="text-[10px] text-stone-500 uppercase font-bold ml-1">Séries</label>
                          <input 
                            className="w-full bg-stone-50 p-2.5 rounded-xl text-sm font-medium outline-none border border-stone-100 focus:border-stone-300 transition-colors" 
                            value={exercise.sets}
                            onChange={(e) => updateExercise(exercise.id, 'sets', e.target.value)}
                            placeholder="Ex: 3"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] text-stone-500 uppercase font-bold ml-1">Reps/Tempo</label>
                          <input 
                            className="w-full bg-stone-50 p-2.5 rounded-xl text-sm font-medium outline-none border border-stone-100 focus:border-stone-300 transition-colors" 
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
                    key={exercise.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: isCompleted ? 0.6 : 1, 
                      y: 0,
                      scale: isCompleted ? 0.98 : 1,
                      backgroundColor: isCompleted ? ['#ffffff', '#f0fdf4', '#fafaf9'] : '#ffffff'
                    }}
                    whileHover={{ y: isCompleted ? 0 : -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ 
                      delay: index * 0.05,
                      scale: { type: "spring", stiffness: 400, damping: 25 },
                      backgroundColor: { duration: 0.6, times: [0, 0.5, 1] }
                    }}
                    onClick={() => toggleExercise(exercise.id)}
                    className={`p-5 rounded-[1.5rem] border cursor-pointer transition-shadow ${
                      isCompleted 
                        ? 'border-stone-200' 
                        : 'border-stone-200 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className={`font-serif font-bold text-lg transition-all ${isCompleted ? 'text-stone-500 line-through' : 'text-stone-800'}`}>
                          {exercise.name}
                        </h4>
                        <p className="text-sm font-medium mt-1 transition-colors" style={{ color: isCompleted ? theme.textMuted : theme.primary }}>
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
                          color: isCompleted ? theme.primary : theme.textMuted,
                          backgroundColor: isCompleted ? `${theme.primary}15` : 'transparent'
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
                  className="w-full py-4 rounded-2xl font-bold text-stone-600 bg-stone-200 hover:bg-stone-300 transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  <Plus size={20} /> Adicionar Exercício
                </button>
              )}
            </div>

            {!isEditing && (
              <div className="p-6 border-t border-stone-200 bg-stone-50 sticky bottom-0 z-10">
                <button 
                  onClick={handleFinishWorkout}
                  disabled={completedCount === 0}
                  className="w-full py-4 rounded-2xl font-bold text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:shadow-lg gradient-bg"
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
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl text-center relative"
            >
              <button 
                onClick={() => {
                  setShowCompletion(false);
                  setActiveWorkoutId(null);
                  setCompletedExercises({});
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-500">
                <Flame size={40} />
              </div>
              <h2 className="text-2xl font-bold text-stone-800 mb-2">Treino concluído!</h2>
              <p className="text-stone-500 font-medium mb-6">Você está evoluindo. Continue assim! 💪</p>
              
              <div className="bg-stone-50 rounded-2xl p-4 mb-6 grid grid-cols-3 gap-2 border border-stone-100">
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-stone-800">{completedCount}</span>
                  <span className="text-[10px] uppercase font-bold text-stone-500 text-center">Exercícios</span>
                </div>
                <div className="flex flex-col items-center border-x border-stone-200">
                  <span className="text-xl font-bold text-stone-800">{activeWorkout?.duration.replace(/[^0-9]/g, '') || '0'}</span>
                  <span className="text-[10px] uppercase font-bold text-stone-500 text-center">Minutos</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-stone-800">{activeWorkout?.calories.replace(/[^0-9]/g, '') || '0'}</span>
                  <span className="text-[10px] uppercase font-bold text-stone-500 text-center">Kcal</span>
                </div>
              </div>

              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5 }}
                  className="h-full bg-green-500"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
