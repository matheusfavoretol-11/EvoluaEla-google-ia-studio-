import { useState, useEffect } from 'react';
import { Flame, Target, Trophy, ChevronRight, Bell, Users, Lock, Heart, TrendingUp, Sparkles, X, CheckCircle2, Circle, Plus, Edit2, Clock, Star, Play } from 'lucide-react';
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

  const handleCommunityClick = () => {
    if (isPremium) {
      window.open('https://chat.whatsapp.com/your-group-link-here', '_blank');
    } else {
      setShowCommunityUpsell(true);
    }
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

  return (
    <div className="p-6 space-y-8 relative bg-black min-h-full">
      {/* Level Indicator */}
      <div className="flex justify-center -mt-2 mb-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-sm">
          <Star size={14} className="text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-white/60">
            Sua Evolução: <span style={{ color: theme.primary }}>{level}</span>
          </span>
        </div>
      </div>

      {/* Trial Banner */}
      {subscriptionStatus === 'trial' && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-800 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Clock size={20} className="text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-bold">Seu período de descoberta</p>
              <p className="text-xs text-stone-300">Aproveite cada segundo! Faltam {getDaysRemaining()} dias.</p>
            </div>
          </div>
          <button 
            onClick={onUpgrade}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-white text-stone-800 hover:bg-stone-100 transition-colors"
          >
            Ver detalhes
          </button>
        </motion.div>
      )}

      {/* Greeting & Motivation */}
      <section className="space-y-3">
        <div className="flex justify-between items-start relative">
          <div className="space-y-1">
            <h2 className="text-4xl md:text-5xl branding-title text-white">
              Bom dia, <br/><span className="gradient-text">{userName}</span> 🌸
            </h2>
            <p className="text-xs font-black uppercase tracking-widest text-white/30">
              Bem-vinda ao seu espaço de evolução
            </p>
          </div>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-12 h-12 rounded-full flex items-center justify-center relative bg-white/5 border border-white/10 shadow-sm hover:bg-white/10 transition-all" 
            style={{ color: '#a8a29e' }}
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full border-2 border-black" style={{ backgroundColor: theme.primary }}></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-12 right-0 w-72 rounded-2xl shadow-xl z-50 overflow-hidden"
                style={{ backgroundColor: theme.surface, border: '1px solid rgba(0,0,0,0.05)' }}
              >
                <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                  <h3 className="font-bold text-sm">Novidades para você</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: theme.primary }}>
                      {unreadCount} novidades
                    </span>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif, idx) => (
                      <div key={`${notif.id}-${idx}`} className={`p-4 border-b hover:bg-black/5 transition-colors cursor-pointer ${!notif.read ? 'bg-stone-50/50' : ''}`} style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                        <p className="text-xs font-bold mb-1" style={{ color: theme.primary }}>{notif.title}</p>
                        <p className="text-sm font-medium mb-1 text-stone-700">
                          {notif.message}
                        </p>
                        <p className="text-xs" style={{ color: theme.textMuted }}>{notif.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-stone-500 text-sm">
                      Tudo tranquilo por aqui no momento. ✨
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl border-l-4 bg-white/5 border-white/10 relative overflow-hidden"
          style={{ borderColor: theme.primary }}
        >
          <div className="absolute -right-4 -top-4 opacity-10 animate-pulse-soft">
            <Sparkles size={80} style={{ color: theme.primary }} />
          </div>
          <p className="italic text-sm font-serif font-medium text-white/70 relative z-10 leading-relaxed">
            "Respire fundo e lembre-se: cada pequeno passo te leva para onde você deseja estar. Você consegue!"
          </p>
        </motion.div>
      </section>

      {/* Strategic Upsell Banner for Free Users */}
      {!isPremium && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 p-5 rounded-[2rem] shadow-sm border border-white/10 relative overflow-hidden cursor-pointer hover:bg-stone-800 transition-all"
          onClick={onUpgrade}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full opacity-50 pointer-events-none" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 gradient-bg text-white shadow-md">
              <Star size={24} fill="currentColor" />
            </div>
            <div>
              <h3 className="branding-title text-lg text-white mb-1 leading-tight">
                Que tal ter um time de especialistas cuidando de cada detalhe para você?
              </h3>
              <p className="text-sm text-white/50 mb-3 font-medium">
                Imagine acordar todos os dias sabendo exatamente o que fazer para evoluir, com apoio total.
              </p>
              <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1" style={{ color: theme.primary }}>
                Quero ver como funciona <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Emotional Progress */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-xl branding-title text-white">Seu progresso hoje</h3>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Esta semana</span>
        </div>
        
        <div className="bg-stone-900 p-6 rounded-[2rem] border border-white/5 space-y-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-white">Sua energia atual</span>
            <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
              <TrendingUp size={14} />
              <span className="text-xs font-bold">+15%</span>
            </div>
          </div>
          
          {[
            { label: 'Confiança', value: emotionalStats.confianca, color: '#ec4899' }, // Pink
            { label: 'Autoestima', value: emotionalStats.autoestima, color: '#8b5cf6' }, // Violet
            { label: 'Disciplina', value: emotionalStats.disciplina, color: '#f59e0b' }, // Amber
            { label: 'Amor Próprio', value: emotionalStats.amorProprio, color: '#ef4444' }, // Red
          ].map((stat, idx) => (
            <div key={stat.label} className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                <span>{stat.label}</span>
                <span>{stat.value}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.value}%` }}
                  transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: stat.color }}
                />
              </div>
            </div>
          ))}
          
          <div className="pt-4 mt-2 border-t border-white/5">
            <p className="text-xs text-white/30 italic text-center">
              "Estou vendo como você está se priorizando. É lindo acompanhar sua mudança!"
            </p>
          </div>
        </div>
      </section>

      {/* Daily Missions (Micro-habits) */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-xl branding-title text-white">Metas de hoje</h3>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
            {completedMissionsCount}/{dailyMissions.length} concluídas
          </span>
        </div>
        
        <div className="space-y-3">
          {dailyMissions.map((mission, idx) => (
            <motion.div 
              key={`${mission.id}-${idx}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                mission.completed ? 'bg-white/5 border-white/10' : 'bg-stone-900 border-white/5 hover:border-white/20'
              }`}
              onClick={() => toggleMission(mission.id)}
            >
              <div className="flex items-center gap-4 flex-1">
                <motion.div 
                  whileTap={{ scale: 0.8 }}
                  className="shrink-0 transition-colors"
                  style={{ color: mission.completed ? theme.primary : '#57534e' }}
                >
                  {mission.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </motion.div>
                <span 
                  className={`text-sm font-bold transition-all ${mission.completed ? 'line-through text-white/20' : 'text-white/90'}`}
                >
                  {mission.title}
                </span>
              </div>
            </motion.div>
          ))}
          
          <AnimatePresence>
            {allMissionsCompleted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-emerald-500/10 text-emerald-400 p-4 rounded-2xl text-sm font-bold text-center border border-emerald-500/20"
              >
                Incrível! Você brilhou e completou tudo o que planejou para hoje. Que orgulho! 🎉
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Next Lesson Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-xl branding-title text-white">Próxima lição</h3>
          <button 
            onClick={() => onNavigate('content')}
            className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors"
          >
            Ver todas
          </button>
        </div>
        <motion.div 
          whileHover={{ y: -4 }}
          onClick={() => onNavigate('content')}
          className="bg-stone-900 p-6 rounded-[2rem] border border-white/5 flex items-center gap-4 cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
            <Play size={24} style={{ color: theme.primary }} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-white mb-1">O poder do "não"</h4>
            <p className="text-xs text-white/40">Áudio • 5 minutos • Nível {level}</p>
          </div>
          <ChevronRight size={20} className="text-white/20 group-hover:text-white transition-colors" />
        </motion.div>
      </section>

      {/* Community Section */}
      <section className="space-y-4 pb-12">
        <div className="flex justify-between items-end">
          <h3 className="text-xl branding-title text-white">Comunidade EvoluaEla</h3>
        </div>
        <motion.div 
          whileHover={{ y: -4 }}
          onClick={() => setShowCommunityUpsell(true)}
          className="bg-gradient-to-br from-stone-900 to-black p-6 rounded-[2rem] border border-white/10 relative overflow-hidden cursor-pointer"
        >
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <Users size={120} style={{ color: theme.primary }} />
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={`community-avatar-${i}`} className="w-10 h-10 rounded-full border-2 border-black bg-stone-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" referrerPolicy="no-referrer" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-black bg-stone-800 flex items-center justify-center text-[10px] font-black text-white/50">
                +2k
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Junte-se a outras mulheres</p>
              <p className="text-xs text-white/40">Troque experiências e cresça junto.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Community Upsell Modal */}
      <AnimatePresence>
        {showCommunityUpsell && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-stone-900 rounded-[2rem] p-8 max-w-sm w-full shadow-2xl relative overflow-hidden border border-white/10"
            >
              <button 
                onClick={() => setShowCommunityUpsell(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="absolute top-0 inset-x-0 h-48 opacity-10" style={{ background: `linear-gradient(to bottom, ${theme.primary}, transparent)` }} />

              <div className="relative z-10 flex flex-col items-center text-center mt-4">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl bg-white/5 text-rose-400">
                  <Users size={48} />
                </div>
                
                <h2 className="text-3xl branding-title text-white mb-4 leading-tight">
                  Esse cantinho especial é exclusivo para nossas alunas Premium 💖
                </h2>
                
                <p className="text-sm text-white/40 mb-10 font-medium">
                  Venha fazer parte desse grupo de mulheres que, assim como você, buscam sua melhor versão todos os dias.
                </p>

                <div className="w-full space-y-5 mb-10 text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-white/5 text-rose-400">
                      <Heart size={20} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-white/60">Troca e apoio entre mulheres</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-white/5 text-rose-400">
                      <TrendingUp size={20} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-white/60">Celebrar conquistas juntas</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-white/5 text-rose-400">
                      <Sparkles size={20} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-white/60">Motivação que contagia</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setShowCommunityUpsell(false);
                    onUpgrade();
                  }}
                  className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs text-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 gradient-bg"
                >
                  Sim, quero entrar!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
