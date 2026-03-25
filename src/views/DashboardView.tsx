import { useState, useEffect } from 'react';
import { Flame, Target, Trophy, ChevronRight, Bell, Users, Lock, Heart, TrendingUp, Sparkles, X, CheckCircle2, Circle, Plus, Edit2, Clock, Star } from 'lucide-react';
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
        title: 'Você é incrível! 🌟',
        message: 'Todas as missões de hoje foram concluídas. Sinta orgulho de si mesma!',
        time: 'Agora',
        read: false
      });
    }

    // Notification based on onboarding answers
    if (onboardingAnswers?.objective === 'amor_proprio') {
      notifications.push({
        id: 'obj-amor',
        title: 'Lembrete de Amor Próprio 💖',
        message: `${userName}, você é suficiente exatamente como é hoje. Tire 5 minutos para você.`,
        time: 'Há 2 horas',
        read: true
      });
    } else if (onboardingAnswers?.objective === 'disciplina') {
      notifications.push({
        id: 'obj-disc',
        title: 'Foco e Constância 🎯',
        message: 'A disciplina é a ponte entre seus objetivos e suas realizações. Continue firme!',
        time: 'Há 3 horas',
        read: true
      });
    } else {
      notifications.push({
        id: 'obj-geral',
        title: 'Um passo de cada vez 🌸',
        message: `${userName}, cada pequeno esforço conta para a sua evolução.`,
        time: 'Há 2 horas',
        read: true
      });
    }

    // Notification based on emotional stats
    if (emotionalStats.confianca < 40) {
      notifications.push({
        id: 'stat-conf',
        title: 'Acredite no seu potencial ✨',
        message: 'Notei que sua confiança está precisando de um abraço. Que tal ouvir um áudio de afirmação hoje?',
        time: 'Ontem',
        read: true
      });
    } else if (emotionalStats.disciplina > 80) {
      notifications.push({
        id: 'stat-disc',
        title: 'Evolução Visível 🚀',
        message: 'Sua disciplina está nas alturas! Veja o quanto você evoluiu essa semana.',
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
    <div className="p-6 space-y-8 relative">
      {/* Level Indicator */}
      <div className="flex justify-center -mt-2 mb-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 border border-stone-200 shadow-sm">
          <Star size={14} className="text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-stone-600">
            Nível: <span style={{ color: theme.primary }}>{level}</span>
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
              <p className="text-sm font-bold">Período de teste gratuito</p>
              <p className="text-xs text-stone-300">Faltam {getDaysRemaining()} dias</p>
            </div>
          </div>
          <button 
            onClick={onUpgrade}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-white text-stone-800 hover:bg-stone-100 transition-colors"
          >
            Gerenciar
          </button>
        </motion.div>
      )}

      {/* Greeting & Motivation */}
      <section className="space-y-3">
        <div className="flex justify-between items-start relative">
          <h2 className="text-3xl font-serif text-stone-800">
            Bom dia, <br/><span className="font-bold gradient-text">{userName}</span> ✨
          </h2>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-12 h-12 rounded-full flex items-center justify-center relative bg-white shadow-sm hover:shadow-md transition-all" 
            style={{ color: theme.textMuted }}
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: theme.primary }}></span>
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
                  <h3 className="font-bold text-sm">Notificações</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: theme.primary }}>
                      {unreadCount} novas
                    </span>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div key={notif.id} className={`p-4 border-b hover:bg-black/5 transition-colors cursor-pointer ${!notif.read ? 'bg-stone-50/50' : ''}`} style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                        <p className="text-xs font-bold mb-1" style={{ color: theme.primary }}>{notif.title}</p>
                        <p className="text-sm font-medium mb-1 text-stone-700">
                          {notif.message}
                        </p>
                        <p className="text-xs" style={{ color: theme.textMuted }}>{notif.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-stone-500 text-sm">
                      Nenhuma notificação no momento.
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
          className="p-6 rounded-3xl soft-shadow-sm border-l-4 gradient-bg-light relative overflow-hidden"
          style={{ borderColor: theme.primary }}
        >
          <div className="absolute -right-4 -top-4 opacity-10 animate-pulse-soft">
            <Sparkles size={80} style={{ color: theme.primary }} />
          </div>
          <p className="italic text-sm font-serif font-medium text-stone-700 relative z-10 leading-relaxed">
            "Você está mais perto do que imagina. A constância é a sua maior força."
          </p>
        </motion.div>
      </section>

      {/* Strategic Upsell Banner for Free Users */}
      {!isPremium && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 rounded-[2rem] shadow-sm border border-stone-100 relative overflow-hidden cursor-pointer hover:shadow-md transition-all"
          onClick={onUpgrade}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100 to-transparent rounded-bl-full opacity-50 pointer-events-none" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 gradient-bg text-white shadow-md">
              <Star size={24} fill="currentColor" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-800 mb-1 leading-tight">
                Você está a 1 passo de ter acompanhamento profissional
              </h3>
              <p className="text-sm text-stone-500 mb-3 font-medium">
                Imagina ter especialistas te guiando exatamente no que fazer todos os dias?
              </p>
              <button className="text-xs font-bold uppercase tracking-widest flex items-center gap-1" style={{ color: theme.primary }}>
                Conhecer o Premium <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Emotional Progress */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-xl font-serif font-bold text-stone-800">Sua Evolução</h3>
          <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Esta Semana</span>
        </div>
        
        <div className="bg-white p-6 rounded-[2rem] soft-shadow-sm border border-stone-100 space-y-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-stone-800">Evolução Geral</span>
            <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">
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
              <div className="flex justify-between text-xs font-medium text-stone-600">
                <span>{stat.label}</span>
                <span>{stat.value}%</span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
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
          
          <div className="pt-4 mt-2 border-t border-stone-100">
            <p className="text-xs text-stone-500 italic text-center">
              "Percebo que você está mais focada em si mesma essa semana. Continue assim!"
            </p>
          </div>
        </div>
      </section>

      {/* Daily Missions (Micro-habits) */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-xl font-serif font-bold text-stone-800">Missões Diárias</h3>
          <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
            {completedMissionsCount}/{dailyMissions.length}
          </span>
        </div>
        
        <div className="space-y-3">
          {dailyMissions.map((mission) => (
            <motion.div 
              key={mission.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl soft-shadow-sm border transition-all flex items-center justify-between cursor-pointer ${
                mission.completed ? 'bg-stone-50 border-stone-200' : 'bg-white border-stone-100 hover:border-stone-300'
              }`}
              onClick={() => toggleMission(mission.id)}
            >
              <div className="flex items-center gap-4 flex-1">
                <motion.div 
                  whileTap={{ scale: 0.8 }}
                  className="shrink-0 transition-colors"
                  style={{ color: mission.completed ? theme.primary : theme.textMuted }}
                >
                  {mission.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </motion.div>
                <span 
                  className={`text-sm font-medium transition-all ${mission.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}
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
                className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl text-sm font-medium text-center border border-emerald-100"
              >
                Incrível! Você completou todas as missões de hoje. 🎉
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Community Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl p-6 soft-shadow-sm relative overflow-hidden"
        style={{ backgroundColor: theme.surface, border: `1px solid ${theme.accent}` }}
      >
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: theme.accent, color: theme.primary }}>
            <Users size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1" style={{ color: theme.text }}>Comunidade EvoluaEla</h3>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: theme.textMuted }}>
              Você não está sozinha. Aqui você evolui junto com outras mulheres.
            </p>
            <button 
              onClick={handleCommunityClick}
              className="w-full py-3 rounded-xl font-bold text-white shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
              style={{ backgroundColor: isPremium ? '#25D366' : theme.primary }}
            >
              {isPremium ? 'Entrar na Comunidade' : <><Lock size={18} /> Desbloquear Comunidade</>}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Community Upsell Modal */}
      <AnimatePresence>
        {showCommunityUpsell && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2rem] p-6 max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setShowCommunityUpsell(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors z-10"
              >
                <X size={18} />
              </button>

              <div className="absolute top-0 inset-x-0 h-32 opacity-20" style={{ background: `linear-gradient(to bottom, ${theme.primary}, transparent)` }} />

              <div className="relative z-10 flex flex-col items-center text-center mt-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg" style={{ backgroundColor: theme.accent, color: theme.primary }}>
                  <Users size={40} />
                </div>
                
                <h2 className="text-2xl font-bold text-stone-800 mb-2 leading-tight">
                  A comunidade é exclusiva para o plano completo 💖
                </h2>
                
                <p className="text-sm text-stone-500 mb-8">
                  Faça o upgrade para se juntar a centenas de mulheres focadas na mesma evolução que você.
                </p>

                <div className="w-full space-y-4 mb-8 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: theme.accent, color: theme.primary }}>
                      <Heart size={16} />
                    </div>
                    <span className="text-sm font-medium text-stone-700">Apoio de outras mulheres</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: theme.accent, color: theme.primary }}>
                      <TrendingUp size={16} />
                    </div>
                    <span className="text-sm font-medium text-stone-700">Compartilhamento de evolução</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: theme.accent, color: theme.primary }}>
                      <Sparkles size={16} />
                    </div>
                    <span className="text-sm font-medium text-stone-700">Motivação diária em grupo</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setShowCommunityUpsell(false);
                    onUpgrade();
                  }}
                  className="w-full py-4 rounded-2xl font-bold text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: theme.primary }}
                >
                  Quero fazer parte
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
