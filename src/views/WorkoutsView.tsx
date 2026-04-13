import { useState, useEffect } from 'react';
import { 
  Play, 
  Star, 
  CheckSquare, 
  Square, 
  ChevronRight, 
  Clock, 
  Flame, 
  Plus, 
  Edit2, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Info, 
  CheckCircle2, 
  X, 
  Dumbbell,
  Crown,
  ArrowRight,
  Lock
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { WorkoutsSkeleton } from '../components/Skeleton';
import PremiumLock from '../components/PremiumLock';
import PremiumBanner from '../components/PremiumBanner';

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
    title: 'Hipertrofia Avançada', 
    duration: '60 min', 
    level: 'sugestao', 
    calories: '600 kcal',
    premium: true,
    exercises: [
      { id: '4-1', name: 'Supino Reto', reps: '8-10 reps', sets: 4 },
      { id: '4-2', name: 'Crucifixo Inclinado', reps: '12 reps', sets: 3 },
      { id: '4-3', name: 'Tríceps Corda', reps: '15 reps', sets: 3 },
    ]
  }
];

export default function WorkoutsView({ onUpgrade }: { onUpgrade: () => void }) {
  const { theme } = useTheme();
  const { isPremium, userName, userId, selectedDiet, verificarAcessoPremium } = useUser();
  
  const [activeTab, setActiveTab] = useState<'meus' | 'sugestoes'>('meus');
  const [myWorkouts, setMyWorkouts] = useState<Workout[]>([]);
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [showCompletion, setShowCompletion] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);

  const verificacao = verificarAcessoPremium();
  const hasAccess = verificacao.acesso;

  useEffect(() => {
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
            colors: ['#D81BFF', '#F8C1FF', '#ffffff']
          });
        }
      }
      return newState;
    });
  };

  const handleWorkoutClick = (workout: Workout) => {
    if (workout.premium && !hasAccess) {
      setShowPremiumPopup(true);
      return;
    }
    setActiveWorkoutId(workout.id);
  };

  const renderWorkoutCard = (workout: Workout) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      key={workout.id} 
      onClick={() => handleWorkoutClick(workout)}
      className={`luxury-card p-6 cursor-pointer transition-all hover:bg-white/10 group relative ${workout.premium && !hasAccess ? 'opacity-60' : ''}`}
    >
      {workout.premium && !hasAccess && (
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
          {workout.premium && !hasAccess ? <Lock size={20} /> : <ChevronRight size={20} />}
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

  if (isLoading) {
    return <WorkoutsSkeleton />;
  }

  return (
    <div className="flex flex-col h-full text-white font-sans">
      <AnimatePresence mode="wait">
        {!activeWorkoutId ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-6 sm:px-10 py-8 space-y-10"
          >
            <header className="space-y-2">
              <p className="text-[10px] font-bold text-[#D81BFF] uppercase tracking-[0.4em]">Seu Plano</p>
              <h2 className="text-4xl font-sans font-bold text-white tracking-tight">Treinos</h2>
            </header>

            {/* Premium Banner for Free Users */}
            {!hasAccess && (
              <PremiumBanner onUpgrade={onUpgrade} />
            )}

            {/* Diet Integration Card */}
            {hasAccess && selectedDiet && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="luxury-card p-6 bg-gradient-to-br from-[#D81BFF]/20 to-transparent border-[#D81BFF]/30"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#D81BFF] flex items-center justify-center text-white shadow-lg">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white tracking-tight">Plano Sincronizado</h3>
                    <p className="text-[10px] font-bold text-[#D81BFF] uppercase tracking-widest">✓ {selectedDiet}</p>
                  </div>
                </div>
                <p className="text-sm text-[#B8B0C8] leading-relaxed font-medium">
                  Seu treino foi ajustado baseado na sua dieta para maximizar seus resultados e equilibrar sua nutrição.
                </p>
              </motion.div>
            )}

            {/* Tabs */}
            <div className="flex p-1.5 rounded-2xl bg-white/5 border border-white/10">
              <button
                onClick={() => setActiveTab('meus')}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                  activeTab === 'meus' ? 'bg-[#D81BFF] text-white shadow-2xl' : 'text-white/40 hover:text-white'
                }`}
              >
                Meus Treinos
              </button>
              <button
                onClick={() => setActiveTab('sugestoes')}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                  activeTab === 'sugestoes' ? 'bg-[#D81BFF] text-white shadow-2xl' : 'text-white/40 hover:text-white'
                }`}
              >
                Sugestões
              </button>
            </div>

            <div className="space-y-6">
              {activeTab === 'meus' && (
                <>
                  <button 
                    className="luxury-button w-full py-6 rounded-3xl font-bold uppercase tracking-widest text-xs text-white shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 mb-6"
                  >
                    <Plus size={22} /> Criar treino personalizado
                  </button>

                  {!isPremium && (
                    <div className="luxury-card bg-gradient-to-br from-[#D81BFF] to-[#1F1638] border-none p-10 text-center mb-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F8C1FF]/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
                      <Crown className="w-16 h-16 text-[#F8C1FF] mx-auto mb-6 relative z-10" />
                      <h3 className="text-3xl font-bold mb-4 relative z-10 tracking-tight text-white">Treinos feitos para você</h3>
                      <p className="text-white/70 text-base mb-10 relative z-10 font-medium leading-relaxed">
                        Desbloqueie treinos 100% personalizados, pensados por especialistas para o seu objetivo real.
                      </p>
                      <button 
                        onClick={onUpgrade}
                        className="font-bold uppercase tracking-widest text-xs py-5 px-10 rounded-full w-full transition-all hover:scale-105 bg-white text-[#D81BFF] shadow-xl relative z-10"
                      >
                        Fazer Upgrade Premium
                      </button>
                    </div>
                  )}

                  {myWorkouts.length === 0 ? (
                    <div className="text-center py-16 text-white/20">
                      <Dumbbell size={64} className="mx-auto mb-6 opacity-40" />
                      <p className="font-bold uppercase tracking-widest text-[10px]">Você ainda não criou nenhum treino.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {myWorkouts.map(renderWorkoutCard)}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'sugestoes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {defaultSuggestions.map(renderWorkoutCard)}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full"
          >
            <div className="px-6 sm:px-10 pt-8 pb-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0F0A1F]/80 backdrop-blur-xl z-30">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveWorkoutId(null)}
                  className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 transition-all border border-white/10"
                >
                  <ChevronRight size={24} className="rotate-180" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">{activeWorkout?.title}</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8B0C8]">{activeWorkout?.duration} • {activeWorkout?.exercises.length} exercícios</p>
                </div>
              </div>
              
              <button 
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-5 py-3 rounded-2xl bg-white/5 text-white border border-white/10"
              >
                <Edit2 size={18} /> Editar
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 sm:px-10 pt-6">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-3 text-white/40">
                <span>Progresso</span>
                <span className="text-[#D81BFF]">{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2 w-full rounded-full overflow-hidden bg-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-[#D81BFF] to-[#F8C1FF]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-4">
              {activeWorkout?.exercises.map((exercise, index) => {
                const isCompleted = completedExercises[exercise.id];
                return (
                  <motion.div 
                    key={exercise.id}
                    onClick={() => toggleExercise(exercise.id)}
                    className={`p-6 rounded-3xl border cursor-pointer transition-all ${
                      isCompleted 
                        ? 'bg-white/90 border-transparent' 
                        : 'luxury-card border-white/10 hover:border-[#D81BFF]/30'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className={`font-bold text-xl transition-all tracking-tight ${isCompleted ? 'text-black/40 line-through' : 'text-white'}`}>
                          {exercise.name}
                        </h4>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-2 transition-colors ${isCompleted ? 'text-black/60' : 'text-[#D81BFF]'}`}>
                          {exercise.sets} séries x {exercise.reps}
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isCompleted ? 'text-[#D81BFF] bg-black/5' : 'text-white/20'}`}>
                        {isCompleted ? <CheckSquare size={32} /> : <Square size={32} />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="p-8 border-t border-white/5 backdrop-blur-xl sticky bottom-0 z-20">
              <button 
                onClick={() => {
                  confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.5 },
                    colors: ['#D81BFF', '#F8C1FF', '#ffffff']
                  });
                  setShowCompletion(true);
                  setTimeout(() => {
                    setShowCompletion(false);
                    setActiveWorkoutId(null);
                    setCompletedExercises({});
                  }, 3000);
                }}
                disabled={completedCount === 0}
                className="luxury-button w-full py-6 rounded-full font-bold uppercase tracking-widest text-xs text-white shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <CheckCircle2 size={24} /> Finalizar Treino
              </button>
            </div>
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
              className="luxury-card p-10 w-full shadow-2xl text-center relative border border-white/10"
            >
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#D81BFF] to-[#F8C1FF] rounded-3xl flex items-center justify-center mb-6 text-white">
                <Flame size={48} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Treino concluído!</h2>
              <p className="text-[#B8B0C8] font-medium mb-8">Sinta esse orgulho! Você está evoluindo a cada movimento. 💪</p>
              
              <div className="bg-white/5 rounded-3xl p-6 mb-8 grid grid-cols-3 gap-4 border border-white/10">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-white">{completedCount}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 text-center">Excs</span>
                </div>
                <div className="flex flex-col items-center border-x border-white/10">
                  <span className="text-2xl font-bold text-white">{activeWorkout?.duration.replace(/[^0-9]/g, '') || '0'}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 text-center">Mins</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-white">{activeWorkout?.calories.replace(/[^0-9]/g, '') || '0'}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 text-center">Kcal</span>
                </div>
              </div>

              <button 
                onClick={() => setShowCompletion(false)}
                className="luxury-button w-full py-5 rounded-full font-bold text-white uppercase tracking-widest text-xs"
              >
                Continuar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Premium Lock Modal */}
      <AnimatePresence>
        {showPremiumPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPremiumPopup(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg"
            >
              <button 
                onClick={() => setShowPremiumPopup(false)}
                className="absolute -top-12 right-0 text-white/40 hover:text-white transition-colors"
              >
                <X size={32} />
              </button>
              <PremiumLock 
                title="🔒 Treinos Avançados Premium"
                description="Este treino utiliza técnicas avançadas de hipertrofia e progressão de carga exclusivas para assinantes."
                beneficios={[
                  "Treinos de Hipertrofia",
                  "Treinos Funcionais Avançados",
                  "Treinos Personalizados",
                  "Integração com Dieta"
                ]}
                botaoText="Liberar Treinos Completos"
                onUpgrade={() => {
                  setShowPremiumPopup(false);
                  onUpgrade();
                }}
                aba="treino"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
