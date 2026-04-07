import { useState, useEffect } from 'react';
import { 
  Bell, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Play, 
  ChevronRight, 
  Users, 
  X, 
  Heart, 
  Clock,
  ArrowRight,
  Crown,
  Dumbbell,
  Flame,
  Quote
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardSkeleton } from '../components/Skeleton';
import { Logo } from '../components/Logo';

export default function DashboardView({ onNavigate, onUpgrade }: { onNavigate: (tab: string) => void, onUpgrade: () => void }) {
  const { theme } = useTheme();
  const { 
    userName, isPremium, streakCount,
    emotionalStats, dailyMissions, toggleMission
  } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const stats = [
    { label: 'Treinos', value: '12', icon: Dumbbell, color: '#D81BFF' },
    { label: 'Minutos', value: '450', icon: Clock, color: '#F8C1FF' },
    { label: 'Fogo', value: streakCount.toString(), icon: Flame, color: '#FF4D4D' },
  ];

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

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-6 sm:px-10 lg:px-12 py-6 space-y-10"
    >
      {/* Welcome Section */}
      <motion.section variants={itemVariants} className="flex flex-col gap-2">
        <p className="text-[10px] font-bold text-[#D81BFF] uppercase tracking-[0.4em]">
          Bem-vinda de volta
        </p>
        <h1 className="text-4xl font-sans font-bold text-white tracking-tight">
          Olá, {userName}
        </h1>
      </motion.section>

      {/* Daily Quote Card */}
      <motion.div 
        variants={itemVariants}
        className="luxury-card relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <Quote size={80} className="text-[#F8C1FF]" />
        </div>
        <div className="relative z-10">
          <p className="text-xl font-sans font-bold text-white leading-tight mb-4 italic">
            "A sua única competição é quem você era ontem. Evolua no seu tempo."
          </p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-[#D81BFF] rounded-full" />
            <p className="text-[10px] font-bold text-[#B8B0C8] uppercase tracking-widest">Inspiração do Dia</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="luxury-card p-5 flex flex-col items-center text-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center" style={{ color: stat.color }}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-[9px] font-bold text-[#B8B0C8] uppercase tracking-widest">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Daily Missions */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <h2 className="text-xl font-bold text-white tracking-tight">Missões de Hoje</h2>
          <button 
            onClick={() => onNavigate('workouts')}
            className="text-[10px] font-bold text-[#D81BFF] uppercase tracking-widest hover:text-white transition-colors"
          >
            Ver tudo
          </button>
        </div>

        <div className="space-y-4">
          {dailyMissions.slice(0, 3).map((mission, idx) => (
            <motion.div
              key={mission.id}
              variants={itemVariants}
              onClick={() => toggleMission(mission.id)}
              className="luxury-card p-5 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${mission.completed ? 'bg-[#D81BFF] text-white' : 'bg-white/5 text-white/20'}`}>
                  {mission.completed ? <CheckCircle2 size={20} strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-white/20" />}
                </div>
                <div>
                  <p className={`font-bold transition-all ${mission.completed ? 'text-white/40 line-through' : 'text-white'}`}>
                    {mission.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[9px] font-bold text-[#D81BFF] uppercase tracking-widest">Meta Diária</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-[9px] font-bold text-[#B8B0C8] uppercase tracking-widest">Hoje</span>
                  </div>
                </div>
              </div>
              <ArrowRight size={18} className="text-white/10 group-hover:text-[#D81BFF] transition-all" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Community / Upsell Card */}
      {!isPremium && (
        <motion.div 
          variants={itemVariants}
          className="luxury-card bg-gradient-to-br from-[#D81BFF] to-[#1F1638] border-none p-8 relative overflow-hidden"
        >
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#F8C1FF]/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Crown size={24} className="text-[#F8C1FF]" fill="currentColor" />
              <span className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Acesso Exclusivo</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Desbloqueie todo o seu potencial</h3>
            <p className="text-sm text-white/70 mb-8 leading-relaxed">
              Tenha acesso a treinos personalizados, suporte prioritário e nossa comunidade VIP de mulheres que evoluem juntas.
            </p>
            <button 
              onClick={onUpgrade}
              className="w-full py-4 rounded-full bg-white text-[#D81BFF] font-bold uppercase tracking-[0.2em] text-xs hover:scale-[1.02] transition-all shadow-xl"
            >
              Seja Premium Agora
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
