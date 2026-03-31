import { useState, useEffect } from 'react';
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
  ArrowRight
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

  return (
    <div className="p-6 sm:p-8 space-y-8 sm:space-y-10 relative bg-[#FAF9F6] min-h-full font-sans text-[#3F2A2F]">
      
      {/* Header & Greeting */}
      <header className="flex justify-between items-start pt-2 sm:pt-4">
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#3F2A2F] leading-tight">
              Bem-vinda de volta, <br/><span className="text-[#E8B4BC] italic">{userName}</span> 🌸
            </h2>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4">
              <div className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#E8B4BC]/10 border border-[#E8B4BC]/20 flex items-center gap-2">
                <Star size={10} className="text-[#E8B4BC] sm:w-3 sm:h-3" />
                <span className="text-[8px] sm:text-[9px] font-medium uppercase tracking-[0.2em] text-[#E8B4BC]">Nível {level}</span>
              </div>
              {subscriptionStatus === 'trial' && (
                <div className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#A8C4B8]/10 border border-[#A8C4B8]/20 flex items-center gap-2">
                  <Clock size={10} className="text-[#A8C4B8] sm:w-3 sm:h-3" />
                  <span className="text-[8px] sm:text-[9px] font-medium uppercase tracking-[0.2em] text-[#A8C4B8]">{getDaysRemaining()} dias restantes</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center relative bg-white border border-[#3F2A2F]/5 soft-shadow hover:bg-[#FAF7F5] transition-all" 
          >
            <Bell size={20} className="text-[#3F2A2F]/40 sm:w-6 sm:h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-3 right-3 sm:top-4 sm:right-4 w-2 sm:w-3 h-2 sm:h-3 rounded-full border-2 border-white bg-[#E8B4BC]"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-14 sm:top-16 right-0 w-72 sm:w-80 rounded-2xl sm:rounded-3xl shadow-2xl z-50 overflow-hidden bg-white border border-[#3F2A2F]/5"
              >
                <div className="p-4 sm:p-5 border-b border-[#3F2A2F]/5 flex justify-between items-center">
                  <h3 className="font-serif font-light text-sm sm:text-base text-[#3F2A2F]">Notificações</h3>
                  {unreadCount > 0 && (
                    <span className="text-[8px] sm:text-[9px] font-medium px-2 py-0.5 sm:py-1 rounded-full bg-[#E8B4BC] text-white uppercase tracking-wider">
                      {unreadCount} novas
                    </span>
                  )}
                </div>
                <div className="max-h-64 sm:max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div key={notif.id} className={`p-4 sm:p-5 border-b border-[#3F2A2F]/5 hover:bg-[#FAF9F6] transition-colors cursor-pointer ${!notif.read ? 'bg-[#E8B4BC]/5' : ''}`}>
                        <p className="text-[8px] sm:text-[9px] font-medium uppercase tracking-[0.2em] text-[#E8B4BC] mb-1">{notif.title}</p>
                        <p className="text-xs sm:text-sm font-light text-[#3F2A2F] mb-2 leading-relaxed">
                          {notif.message}
                        </p>
                        <p className="text-[8px] sm:text-[9px] font-medium text-[#3F2A2F]/30 uppercase tracking-widest">{notif.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 sm:p-8 text-center text-[#3F2A2F]/30 text-xs sm:text-sm">
                      Tudo tranquilo por aqui. ✨
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Daily Quote Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-white border border-[#3F2A2F]/5 soft-shadow relative overflow-hidden"
      >
        <div className="absolute -right-4 -top-4 sm:-right-6 sm:-top-6 opacity-5">
          <Sparkles size={80} className="text-[#E8B4BC] sm:w-[120px] sm:h-[120px]" />
        </div>
        <div className="relative z-10 flex items-start gap-4 sm:gap-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#E8B4BC]/10 flex items-center justify-center shrink-0">
            <Sparkles size={20} className="text-[#E8B4BC] sm:w-6 sm:h-6" />
          </div>
          <p className="text-lg sm:text-xl font-serif font-light text-[#3F2A2F]/80 leading-relaxed italic">
            "Sua evolução é um processo contínuo de florescimento. Cada escolha consciente hoje é uma semente para o seu amanhã radiante."
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
        
        {/* Progress & Stats */}
        <section className="space-y-4 sm:space-y-6">
          <div className="flex justify-between items-end px-2">
            <h3 className="text-xl sm:text-2xl font-serif font-light text-[#3F2A2F]">Seu Equilíbrio</h3>
            <span className="text-[8px] sm:text-[9px] font-medium uppercase tracking-[0.2em] text-[#3F2A2F]/30">Status Atual</span>
          </div>
          
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-[#3F2A2F]/5 soft-shadow space-y-6 sm:space-y-8">
            {[
              { label: 'Confiança', value: emotionalStats.confianca, color: '#E8B4BC' },
              { label: 'Autoestima', value: emotionalStats.autoestima, color: '#A8C4B8' },
              { label: 'Disciplina', value: emotionalStats.disciplina, color: '#E8B4BC' },
              { label: 'Amor Próprio', value: emotionalStats.amorProprio, color: '#A8C4B8' },
            ].map((stat, idx) => (
              <div key={`${stat.label}-${idx}`} className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-[8px] sm:text-[9px] font-medium uppercase tracking-[0.2em] text-[#3F2A2F]/40">
                  <span>{stat.label}</span>
                  <span>{stat.value}%</span>
                </div>
                <div className="h-1 sm:h-1.5 bg-[#FAF9F6] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.value}%` }}
                    transition={{ duration: 1.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: stat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Daily Missions */}
        <section className="space-y-4 sm:space-y-6">
          <div className="flex justify-between items-end px-2">
            <h3 className="text-xl sm:text-2xl font-serif font-light text-[#3F2A2F]">Metas do Dia</h3>
            <span className="text-[8px] sm:text-[9px] font-medium uppercase tracking-[0.2em] text-[#3F2A2F]/30">
              {completedMissionsCount}/{dailyMissions.length} concluídas
            </span>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {dailyMissions.map((mission, idx) => (
              <motion.div 
                key={mission.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => toggleMission(mission.id)}
                className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all flex items-center justify-between cursor-pointer group ${
                  mission.completed 
                    ? 'bg-[#A8C4B8]/5 border-[#A8C4B8]/20' 
                    : 'bg-white border-[#3F2A2F]/5 hover:border-[#E8B4BC]/30 soft-shadow'
                }`}
              >
                <div className="flex items-center gap-4 sm:gap-5">
                  <div 
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg border flex items-center justify-center transition-all ${
                      mission.completed ? 'bg-[#A8C4B8] border-[#A8C4B8]' : 'border-[#3F2A2F]/10 group-hover:border-[#E8B4BC]'
                    }`}
                  >
                    {mission.completed && <CheckCircle2 size={12} className="text-white sm:w-3.5 sm:h-3.5" />}
                  </div>
                  <span className={`text-base sm:text-lg font-light transition-all ${mission.completed ? 'text-[#3F2A2F]/30 line-through' : 'text-[#3F2A2F]'}`}>
                    {mission.title}
                  </span>
                </div>
                <ChevronRight size={16} className={`transition-all sm:w-[18px] sm:h-[18px] ${mission.completed ? 'text-[#3F2A2F]/10' : 'text-[#3F2A2F]/20 group-hover:text-[#E8B4BC]'}`} />
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Content & Community Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 pb-8 sm:pb-12">
        
        {/* Next Lesson */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <h3 className="text-xl sm:text-2xl font-serif font-light text-[#3F2A2F] px-2">Próxima Lição</h3>
          <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => onNavigate('content')}
            className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-[#3F2A2F]/5 soft-shadow flex items-center gap-6 sm:gap-8 cursor-pointer group"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#E8B4BC]/10 flex items-center justify-center shrink-0 group-hover:bg-[#E8B4BC]/20 transition-colors">
              <Play size={24} className="text-[#E8B4BC] sm:w-8 sm:h-8" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl sm:text-2xl font-serif font-light text-[#3F2A2F] mb-1 sm:mb-2">O poder do "não"</h4>
              <p className="text-xs sm:text-sm font-light text-[#3F2A2F]/40">Áudio • 5 minutos • Especial para você</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#3F2A2F]/20 group-hover:text-[#E8B4BC] transition-all">
              <ChevronRight size={20} className="sm:w-6 sm:h-6" />
            </div>
          </motion.div>
        </div>

        {/* Community Card */}
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-xl sm:text-2xl font-serif font-light text-[#3F2A2F] px-2">Comunidade</h3>
          <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => setShowCommunityUpsell(true)}
            className="bg-[#3F2A2F] p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] relative overflow-hidden cursor-pointer h-full flex flex-col justify-between"
          >
            <div className="absolute -right-6 -bottom-6 sm:-right-8 sm:-bottom-8 opacity-10">
              <Users size={120} className="text-white sm:w-[160px] sm:h-[160px]" />
            </div>
            <div className="relative z-10">
              <div className="flex -space-x-2 sm:-space-x-3 mb-4 sm:mb-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={`user-${i}`} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 sm:border-4 border-[#3F2A2F] overflow-hidden bg-[#FAF9F6]">
                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                  </div>
                ))}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 sm:border-4 border-[#3F2A2F] bg-[#E8B4BC] flex items-center justify-center text-[8px] sm:text-[9px] font-medium text-white uppercase tracking-widest">
                  +2k
                </div>
              </div>
              <h4 className="text-lg sm:text-xl font-serif font-light text-white mb-1 sm:mb-2">Grupo Exclusivo</h4>
              <p className="text-xs sm:text-sm text-white/50 font-light leading-relaxed">
                Conecte-se com mulheres que buscam a mesma evolução.
              </p>
            </div>
            <div className="mt-6 sm:mt-8 flex items-center gap-2 text-[8px] sm:text-[9px] font-medium uppercase tracking-[0.2em] text-[#E8B4BC]">
              Ver Comunidade <ArrowRight size={12} className="sm:w-3.5 sm:h-3.5" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Upsell Modal */}
      <AnimatePresence>
        {showCommunityUpsell && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3F2A2F]/40 backdrop-blur-md p-4 sm:p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 max-w-lg w-full shadow-2xl relative overflow-hidden border border-[#3F2A2F]/5"
            >
              <button 
                onClick={() => setShowCommunityUpsell(false)}
                className="absolute top-6 right-6 sm:top-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FAF7F5] flex items-center justify-center text-[#3F2A2F]/20 hover:text-[#3F2A2F] transition-colors"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.5rem] sm:rounded-[2rem] bg-[#E8B4BC]/10 flex items-center justify-center mb-6 sm:mb-8 text-[#E8B4BC]">
                  <Users size={40} className="sm:w-12 sm:h-12" />
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#3F2A2F] mb-4 sm:mb-6 leading-tight">
                  Espaço Exclusivo <span className="italic">Premium</span> 🌸
                </h2>
                
                <p className="text-base sm:text-lg text-[#3F2A2F]/50 mb-8 sm:mb-10 font-light leading-relaxed">
                  A nossa comunidade é um jardim secreto reservado para alunas Premium. Um lugar de troca real, apoio e crescimento mútuo.
                </p>

                <div className="w-full space-y-4 sm:space-y-6 mb-10 sm:mb-12 text-left">
                  {[
                    { icon: Heart, text: 'Apoio mútuo entre mulheres' },
                    { icon: TrendingUp, text: 'Celebração de conquistas' },
                    { icon: Sparkles, text: 'Mentoria e conteúdos extras' }
                  ].map((item, idx) => (
                    <div key={`benefit-comm-${idx}`} className="flex items-center gap-4 sm:gap-5">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FAF7F5] flex items-center justify-center shrink-0 text-[#E8B4BC]">
                        <item.icon size={20} className="sm:w-6 sm:h-6" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.2em] text-[#3F2A2F]/60">{item.text}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    setShowCommunityUpsell(false);
                    onUpgrade();
                  }}
                  className="w-full py-5 sm:py-6 rounded-full font-sans font-light text-white bg-[#E8B4BC] hover:bg-[#3F2A2F] shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs sm:text-sm"
                >
                  Quero ser Premium
                  <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
