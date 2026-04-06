import { useState, useEffect } from 'react';
import { Logo } from '../components/Logo';
import { 
  Bell, 
  Star, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Circle, 
  Play, 
  ChevronRight, 
  Users, 
  X, 
  Heart, 
  Clock,
  ArrowRight,
  Zap
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardSkeleton } from '../components/Skeleton';

export default function DashboardView({ onNavigate, onUpgrade }: { onNavigate: (tab: string) => void, onUpgrade: () => void }) {
  const { theme } = useTheme();
  const { 
    userName, isPremium, subscriptionStatus, trialEndDate, 
    level, emotionalStats, dailyMissions, setDailyMissions, updateEmotionalStats,
    onboardingAnswers, userId
  } = useUser();
  const [showCommunityUpsell, setShowCommunityUpsell] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate intelligent notifications based on user context
  const generateNotifications = () => {
    const notifications = [];
    
    // Notification based on completed missions
    const completedMissionsCount = dailyMissions.filter(m => m.completed).length;
    if (completedMissionsCount === dailyMissions.length && dailyMissions.length > 0) {
      notifications.push({
        id: 'all-missions',
        title: 'Você está brilhando! ✨',
        message: 'Olha só! Você completou tudo o que planejou para hoje. Que orgulho! 💖',
        time: 'Agora',
        read: false
      });
    }

    // Notification based on onboarding answers
    if (onboardingAnswers?.objective === 'amor_proprio') {
      notifications.push({
        id: 'obj-amor',
        title: 'Lembrete de Amor Próprio 💖',
        message: `${userName}, lembre-se: você já é maravilhosa do jeitinho que é. Que tal 5 minutinhos só seus agora? 🌸`,
        time: 'Há 2 horas',
        read: true
      });
    } else if (onboardingAnswers?.objective === 'disciplina') {
      notifications.push({
        id: 'obj-disc',
        title: 'Foco e Constância 🎯',
        message: 'Cada pequeno passo hoje constrói a mulher que você quer ser amanhã. Estou com você! 🎯',
        time: 'Há 3 horas',
        read: true
      });
    } else {
      notifications.push({
        id: 'obj-geral',
        title: 'Um passo de cada vez 🌸',
        message: `${userName}, cada escolha positiva de hoje é um presente para o seu futuro. Vamos juntas? ✨`,
        time: 'Há 2 horas',
        read: true
      });
    }

    // Notification based on emotional stats
    if (emotionalStats.confianca < 40) {
      notifications.push({
        id: 'stat-conf',
        title: 'Acredite no seu potencial ✨',
        message: 'Senti que hoje seu coração precisa de um carinho extra. Que tal um áudio de afirmação para elevar essa energia? 💖',
        time: 'Ontem',
        read: true
      });
    } else if (emotionalStats.disciplina > 80) {
      notifications.push({
        id: 'stat-disc',
        title: 'Evolução Visível 🚀',
        message: 'Uau! Sua dedicação está inspiradora. Olha só o quanto você já caminhou! 🚀',
        time: 'Ontem',
        read: true
      });
    }

    return notifications;
  };

  const notifications = generateNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const getDaysRemaining = () => {
    if (!trialEndDate) return 0;
    const now = new Date();
    const diffTime = Math.abs(trialEndDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };

  const toggleMission = async (id: string) => {
    const mission = dailyMissions.find(m => m.id === id);
    if (!mission) return;

    const isCompleting = !mission.completed;

    const updatedMissions = dailyMissions.map(m => 
      m.id === id ? { ...m, completed: isCompleting } : m
    );
    setDailyMissions(updatedMissions);

    let updates = {};
    if (isCompleting) {
      updates = {
        disciplina: Math.min(100, emotionalStats.disciplina + 2),
        confianca: Math.min(100, emotionalStats.confianca + 1),
        amorProprio: Math.min(100, emotionalStats.amorProprio + 1),
      };
    } else {
      updates = {
        disciplina: Math.max(0, emotionalStats.disciplina - 2),
        confianca: Math.max(0, emotionalStats.confianca - 1),
        amorProprio: Math.max(0, emotionalStats.amorProprio - 1),
      };
    }
    updateEmotionalStats(updates);

    if (userId) {
      try {
        const { supabase } = await import('../lib/supabase');
        
        // Update mission
        const updatedMission = updatedMissions.find(m => m.id === id);
        if (updatedMission) {
          await supabase
            .from('daily_missions')
            .upsert({
              id: id,
              user_id: userId,
              title: updatedMission.title,
              completed: updatedMission.completed,
              date: new Date().toISOString().split('T')[0],
              updated_at: new Date().toISOString()
            });
        }

        // Update stats
        await supabase
          .from('emotional_stats')
          .upsert({
            user_id: userId,
            ...emotionalStats,
            ...updates,
            updated_at: new Date().toISOString()
          });

      } catch (error) {
        console.error("Error saving mission update to Supabase:", error);
      }
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const completedMissionsCount = dailyMissions.filter(m => m.completed).length;
  const allMissionsCompleted = completedMissionsCount === dailyMissions.length;

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
      className="px-6 py-10 sm:px-10 space-y-12 relative bg-transparent min-h-full font-sans text-[var(--color-text)] overflow-y-auto hide-scrollbar"
    >
      
      {/* Hero Overview - Infinite Screen Style */}
      <motion.section 
        variants={itemVariants}
        className="relative pt-8 pb-12 px-2"
      >
        <div className="space-y-1 mb-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-text-muted)]/60">Welcome • Overview</p>
          <div className="flex items-baseline gap-4">
            <h1 className="text-8xl md:text-9xl font-light tracking-tighter text-white leading-none">
              {emotionalStats.disciplina}%
            </h1>
            <div className="glass-morphism px-4 py-2 rounded-full flex items-center gap-2">
              <TrendingUp size={14} className="text-[var(--color-primary)]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">All Programs (+12%)</span>
            </div>
          </div>
          <p className="text-xl md:text-2xl font-light text-white/60 tracking-tight">Efficiency Improvements</p>
        </div>

        {/* Minimalist Graph Placeholder (Infinite Style) */}
        <div className="relative h-48 w-full flex items-end justify-between gap-2 px-4">
          {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((height, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 1, delay: i * 0.05 }}
                className="w-0.5 bg-white/20 relative"
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              </motion.div>
              <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">{['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][i]}</span>
            </div>
          ))}
          <div className="absolute bottom-10 left-0 right-0 h-px bg-white/5" />
        </div>
      </motion.section>

      {/* Header & Greeting */}
      <header className="flex justify-between items-start">
        <motion.div 
          variants={itemVariants}
          className="space-y-3"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Logo className="mb-4" size="lg" />
            <h2 className="text-4xl md:text-6xl font-bold text-[var(--color-text)] leading-tight tracking-tighter">
              Olá, <span className="gradient-text">{userName}</span>
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/10 flex items-center gap-2">
                <Star size={12} className="text-[var(--color-primary)]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Nível {level}</span>
              </div>
              {subscriptionStatus === 'trial' && (
                <div className="px-4 py-1.5 rounded-full bg-[var(--color-primary)]/90 border border-[var(--color-primary)]/90 flex items-center gap-2">
                  <Clock size={12} className="text-[var(--color-primary)]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)]">{getDaysRemaining()} dias de teste</span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="relative">
          <motion.button 
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-14 h-14 rounded-2xl flex items-center justify-center relative bg-white/5 border border-white/10 hover:bg-white/10 transition-all" 
          >
            <Bell size={24} className="text-[var(--color-text-muted)]" />
            {unreadCount > 0 && (
              <span className="absolute top-4 right-4 w-3 h-3 rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-primary)]"></span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-16 right-0 w-80 rounded-3xl shadow-2xl z-50 overflow-hidden glass-morphism border border-white/10"
              >
                <div className="p-5 border-b border-white/10 flex justify-between items-center">
                  <h3 className="font-bold text-sm text-[var(--color-text)]">Notificações</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[var(--color-primary)] text-black uppercase tracking-widest">
                      {unreadCount} novas
                    </span>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div key={notif.id} className={`p-5 border-b border-white/10 hover:bg-white/10 transition-colors cursor-pointer ${!notif.read ? 'bg-[var(--color-primary)]/90' : ''}`}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] mb-1">{notif.title}</p>
                        <p className="text-sm font-medium text-[var(--color-text-muted)] mb-2 leading-relaxed">
                          {notif.message}
                        </p>
                        <p className="text-[10px] font-bold text-[var(--color-text-muted)]/60 uppercase tracking-widest">{notif.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-[var(--color-text-muted)]/90 text-sm">
                      Tudo tranquilo por aqui. ✨
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </header>

      {/* Daily Quote Card */}
      <motion.div 
        variants={itemVariants}
        className="glass-morphism p-8 rounded-[2.5rem] relative overflow-hidden group"
      >
        <div className="absolute -right-6 -top-6 opacity-90 group-hover:opacity-90 transition-opacity">
          <Sparkles size={120} className="text-[var(--color-primary)]" />
        </div>
        <div className="relative z-10 flex items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/90 flex items-center justify-center shrink-0">
            <Sparkles size={28} className="text-black" />
          </div>
          <p className="text-xl md:text-2xl font-bold text-[var(--color-text)]/90 leading-tight tracking-tight italic">
            "Sua evolução é um processo contínuo de florescimento. Cada escolha consciente hoje é uma semente para o seu amanhã radiante."
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
        
        {/* Progress & Stats */}
        <motion.section variants={itemVariants} className="space-y-6 lg:col-span-1 xl:col-span-1">
          <div className="flex justify-between items-end px-2">
            <h3 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Seu Equilíbrio</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]/90">Status Atual</span>
          </div>
          
          <div className="glass-morphism p-8 rounded-[2.5rem] space-y-8">
            {[
              { label: 'Confiança', value: emotionalStats.confianca, color: 'var(--color-primary)' },
              { label: 'Autoestima', value: emotionalStats.autoestima, color: 'var(--color-accent)' },
              { label: 'Disciplina', value: emotionalStats.disciplina, color: 'var(--color-primary)' },
              { label: 'Amor Próprio', value: emotionalStats.amorProprio, color: 'var(--color-accent)' },
            ].map((stat, idx) => (
              <div key={`${stat.label}-${idx}`} className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                  <span>{stat.label}</span>
                  <span className="text-[var(--color-text)] font-bold">{stat.value}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.value}%` }}
                    transition={{ duration: 1.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Daily Missions */}
        <motion.section variants={itemVariants} className="space-y-6">
          <div className="flex justify-between items-end px-2">
            <h3 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Metas do Dia</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]/90">
              {completedMissionsCount}/{dailyMissions.length} concluídas
            </span>
          </div>
          
          <div className="space-y-4">
            {dailyMissions.map((mission, idx) => (
              <motion.div 
                key={mission.id}
                variants={itemVariants}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleMission(mission.id)}
                className={`p-6 rounded-3xl border transition-all flex items-center justify-between cursor-pointer group ${
                  mission.completed 
                    ? 'bg-[var(--color-primary)]/90 border-[var(--color-primary)]/90' 
                    : 'glass-morphism border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div 
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                      mission.completed ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-white/10 group-hover:border-[var(--color-primary)]'
                    }`}
                  >
                    {mission.completed && <CheckCircle2 size={14} className="text-black" />}
                  </div>
                  <span className={`text-lg font-bold transition-all ${mission.completed ? 'text-[var(--color-text-muted)]/90 line-through' : 'text-[var(--color-text)]'}`}>
                    {mission.title}
                  </span>
                </div>
                <ChevronRight size={18} className={`transition-all ${mission.completed ? 'text-[var(--color-text-muted)]/90' : 'text-[var(--color-text-muted)]/90 group-hover:text-[var(--color-primary)]'}`} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Content & Community Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-10 pb-12">
        
        {/* Next Lesson */}
        <motion.div variants={itemVariants} className="lg:col-span-2 xl:col-span-3 space-y-6">
          <h3 className="text-2xl font-bold text-[var(--color-text)] tracking-tight px-2">Próxima Lição</h3>
          <motion.div 
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('content')}
            className="glass-morphism flex items-center gap-8 cursor-pointer group p-8 rounded-[2.5rem]"
          >
            <div className="w-20 h-20 rounded-3xl bg-[var(--color-primary)]/90 flex items-center justify-center shrink-0 group-hover:bg-[var(--color-primary)] group-hover:text-black transition-all">
              <Play size={32} fill="currentColor" />
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-[var(--color-text)] mb-2 tracking-tight">O poder do "não"</h4>
              <p className="text-sm font-bold text-[var(--color-text-muted)]/70 uppercase tracking-widest">Áudio • 5 minutos • Especial para você</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[var(--color-text-muted)]/90 group-hover:text-[var(--color-primary)] transition-all">
              <ChevronRight size={24} />
            </div>
          </motion.div>
        </motion.div>

        {/* Community Card */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h3 className="text-2xl font-bold text-[var(--color-text)] tracking-tight px-2">Comunidade</h3>
          <motion.div 
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowCommunityUpsell(true)}
            className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] p-8 rounded-[2.5rem] relative overflow-hidden cursor-pointer h-full flex flex-col justify-between group"
          >
            <div className="absolute -right-8 -bottom-8 opacity-90 group-hover:opacity-90 transition-opacity">
              <Users size={160} className="text-black" />
            </div>
            <div className="relative z-10">
              <div className="flex -space-x-3 mb-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={`user-${i}`} className="w-12 h-12 rounded-full border-4 border-black/90 overflow-hidden bg-neutral-800">
                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-black/90 bg-black flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-widest">
                  +2k
                </div>
              </div>
              <h4 className="text-2xl font-bold text-black mb-2 tracking-tighter">Grupo Exclusivo</h4>
              <p className="text-black/60 font-bold text-sm leading-relaxed">
                Conecte-se com mulheres que buscam a mesma evolução.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black">
              Ver Comunidade <ArrowRight size={14} />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Upsell Modal */}
      <AnimatePresence>
        {showCommunityUpsell && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 sm:p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-card rounded-[3rem] p-8 sm:p-12 w-full shadow-2xl relative overflow-hidden border border-[var(--color-border)]"
            >
              <motion.button 
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowCommunityUpsell(false)}
                className="absolute top-6 right-6 sm:top-8 sm:right-8 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[var(--color-text-muted)]/90 hover:text-[var(--color-text)] transition-colors border border-white/10"
              >
                <X size={24} />
              </motion.button>

              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center mb-8 text-black shadow-2xl">
                  <Users size={44} />
                </div>
                
                <h2 className="text-4xl font-bold text-[var(--color-text)] mb-4 leading-tight tracking-tighter">
                  Espaço Exclusivo <span className="gradient-text italic">Premium</span> 🌸
                </h2>
                
                <p className="text-lg text-[var(--color-text-muted)]/90 mb-10 font-medium leading-relaxed">
                  A nossa comunidade é um jardim secreto reservado para alunas Premium. Um lugar de troca real, apoio e crescimento mútuo.
                </p>

                <div className="w-full space-y-6 mb-12 text-left">
                  {[
                    { icon: Heart, text: 'Apoio mútuo entre mulheres' },
                    { icon: TrendingUp, text: 'Celebração de conquistas' },
                    { icon: Sparkles, text: 'Mentoria e conteúdos extras' }
                  ].map((item, idx) => (
                    <div key={`benefit-comm-${item.text}`} className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-[var(--color-primary)]">
                        <item.icon size={24} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]/80">{item.text}</span>
                    </div>
                  ))}
                </div>

                <motion.button 
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setShowCommunityUpsell(false);
                    onUpgrade();
                  }}
                  className="w-full py-6 rounded-full font-bold text-black bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:scale-[1.02] shadow-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                >
                  Quero ser Premium
                  <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
