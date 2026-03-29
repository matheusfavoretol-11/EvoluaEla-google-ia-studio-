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
    <div className="p-8 space-y-10 relative bg-[#FAF7F5] min-h-full font-sans text-[#3F2A2F]">
      
      {/* Header & Greeting */}
      <header className="flex justify-between items-start pt-4">
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-poppins font-extrabold text-[#3F2A2F] leading-tight">
              Bem-vinda de volta, <br/><span className="text-[#E8B4BC]">{userName}</span> 🌸
            </h2>
            <div className="flex items-center gap-3 mt-4">
              <div className="px-4 py-1.5 rounded-full bg-[#E8B4BC]/10 border border-[#E8B4BC]/20 flex items-center gap-2">
                <Star size={14} className="text-[#E8B4BC]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E8B4BC]">Nível {level}</span>
              </div>
              {subscriptionStatus === 'trial' && (
                <div className="px-4 py-1.5 rounded-full bg-[#A8C4B8]/10 border border-[#A8C4B8]/20 flex items-center gap-2">
                  <Clock size={14} className="text-[#A8C4B8]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#A8C4B8]">{getDaysRemaining()} dias restantes</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-14 h-14 rounded-2xl flex items-center justify-center relative bg-white border border-[#3F2A2F]/5 soft-shadow hover:bg-[#FAF7F5] transition-all" 
          >
            <Bell size={24} className="text-[#3F2A2F]/40" />
            {unreadCount > 0 && (
              <span className="absolute top-4 right-4 w-3 h-3 rounded-full border-2 border-white bg-[#E8B4BC]"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-16 right-0 w-80 rounded-3xl shadow-2xl z-50 overflow-hidden bg-white border border-[#3F2A2F]/5"
              >
                <div className="p-5 border-b border-[#3F2A2F]/5 flex justify-between items-center">
                  <h3 className="font-poppins font-bold text-sm text-[#3F2A2F]">Notificações</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#E8B4BC] text-white">
                      {unreadCount} novas
                    </span>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif, idx) => (
                      <div key={`${notif.id}-${idx}`} className={`p-5 border-b border-[#3F2A2F]/5 hover:bg-[#FAF7F5] transition-colors cursor-pointer ${!notif.read ? 'bg-[#E8B4BC]/5' : ''}`}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#E8B4BC] mb-1">{notif.title}</p>
                        <p className="text-sm font-medium text-[#3F2A2F] mb-2 leading-relaxed">
                          {notif.message}
                        </p>
                        <p className="text-[10px] font-bold text-[#3F2A2F]/30">{notif.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-[#3F2A2F]/30 text-sm">
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
        className="p-8 rounded-[2.5rem] bg-white border border-[#3F2A2F]/5 soft-shadow relative overflow-hidden"
      >
        <div className="absolute -right-6 -top-6 opacity-5">
          <Sparkles size={120} className="text-[#E8B4BC]" />
        </div>
        <div className="relative z-10 flex items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-[#E8B4BC]/10 flex items-center justify-center shrink-0">
            <Sparkles size={24} className="text-[#E8B4BC]" />
          </div>
          <p className="text-xl font-poppins font-medium text-[#3F2A2F]/80 leading-relaxed italic">
            "Sua evolução é um processo contínuo de florescimento. Cada escolha consciente hoje é uma semente para o seu amanhã radiante."
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Progress & Stats */}
        <section className="space-y-6">
          <div className="flex justify-between items-end px-2">
            <h3 className="text-2xl font-poppins font-bold text-[#3F2A2F]">Seu Equilíbrio</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#3F2A2F]/30">Status Atual</span>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-[#3F2A2F]/5 soft-shadow space-y-8">
            {[
              { label: 'Confiança', value: emotionalStats.confianca, color: '#E8B4BC' },
              { label: 'Autoestima', value: emotionalStats.autoestima, color: '#A8C4B8' },
              { label: 'Disciplina', value: emotionalStats.disciplina, color: '#E8B4BC' },
              { label: 'Amor Próprio', value: emotionalStats.amorProprio, color: '#A8C4B8' },
            ].map((stat, idx) => (
              <div key={stat.label} className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#3F2A2F]/40">
                  <span>{stat.label}</span>
                  <span>{stat.value}%</span>
                </div>
                <div className="h-2.5 bg-[#FAF7F5] rounded-full overflow-hidden">
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
        <section className="space-y-6">
          <div className="flex justify-between items-end px-2">
            <h3 className="text-2xl font-poppins font-bold text-[#3F2A2F]">Metas do Dia</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#3F2A2F]/30">
              {completedMissionsCount}/{dailyMissions.length} concluídas
            </span>
          </div>
          
          <div className="space-y-4">
            {dailyMissions.map((mission, idx) => (
              <motion.div 
                key={`${mission.id}-${idx}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => toggleMission(mission.id)}
                className={`p-6 rounded-3xl border transition-all flex items-center justify-between cursor-pointer group ${
                  mission.completed 
                    ? 'bg-[#A8C4B8]/5 border-[#A8C4B8]/20' 
                    : 'bg-white border-[#3F2A2F]/5 hover:border-[#E8B4BC]/30 soft-shadow'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div 
                    className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                      mission.completed ? 'bg-[#A8C4B8] border-[#A8C4B8]' : 'border-[#3F2A2F]/10 group-hover:border-[#E8B4BC]'
                    }`}
                  >
                    {mission.completed && <CheckCircle2 size={18} className="text-white" />}
                  </div>
                  <span className={`text-lg font-medium transition-all ${mission.completed ? 'text-[#3F2A2F]/30 line-through' : 'text-[#3F2A2F]'}`}>
                    {mission.title}
                  </span>
                </div>
                <ChevronRight size={20} className={`transition-all ${mission.completed ? 'text-[#3F2A2F]/10' : 'text-[#3F2A2F]/20 group-hover:text-[#E8B4BC]'}`} />
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Content & Community Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-12">
        
        {/* Next Lesson */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-poppins font-bold text-[#3F2A2F] px-2">Próxima Lição</h3>
          <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => onNavigate('content')}
            className="bg-white p-8 rounded-[2.5rem] border border-[#3F2A2F]/5 soft-shadow flex items-center gap-8 cursor-pointer group"
          >
            <div className="w-20 h-20 rounded-3xl bg-[#E8B4BC]/10 flex items-center justify-center shrink-0 group-hover:bg-[#E8B4BC]/20 transition-colors">
              <Play size={32} className="text-[#E8B4BC]" />
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-poppins font-bold text-[#3F2A2F] mb-2">O poder do "não"</h4>
              <p className="text-sm font-medium text-[#3F2A2F]/40">Áudio • 5 minutos • Especial para você</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#FAF7F5] flex items-center justify-center text-[#3F2A2F]/20 group-hover:text-[#E8B4BC] transition-all">
              <ChevronRight size={24} />
            </div>
          </motion.div>
        </div>

        {/* Community Card */}
        <div className="space-y-6">
          <h3 className="text-2xl font-poppins font-bold text-[#3F2A2F] px-2">Comunidade</h3>
          <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => setShowCommunityUpsell(true)}
            className="bg-[#3F2A2F] p-8 rounded-[2.5rem] relative overflow-hidden cursor-pointer h-full flex flex-col justify-between"
          >
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <Users size={160} className="text-white" />
            </div>
            <div className="relative z-10">
              <div className="flex -space-x-3 mb-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={`user-${i}`} className="w-12 h-12 rounded-full border-4 border-[#3F2A2F] overflow-hidden bg-[#FAF7F5]">
                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-[#3F2A2F] bg-[#E8B4BC] flex items-center justify-center text-xs font-bold text-white">
                  +2k
                </div>
              </div>
              <h4 className="text-xl font-poppins font-bold text-white mb-2">Grupo Exclusivo</h4>
              <p className="text-sm text-white/50 font-medium leading-relaxed">
                Conecte-se com mulheres que buscam a mesma evolução.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#E8B4BC]">
              Ver Comunidade <ArrowRight size={14} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Upsell Modal */}
      <AnimatePresence>
        {showCommunityUpsell && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3F2A2F]/40 backdrop-blur-md p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-2xl relative overflow-hidden border border-[#3F2A2F]/5"
            >
              <button 
                onClick={() => setShowCommunityUpsell(false)}
                className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-[#FAF7F5] flex items-center justify-center text-[#3F2A2F]/20 hover:text-[#3F2A2F] transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-[2rem] bg-[#E8B4BC]/10 flex items-center justify-center mb-8 text-[#E8B4BC]">
                  <Users size={48} />
                </div>
                
                <h2 className="text-4xl font-poppins font-extrabold text-[#3F2A2F] mb-6 leading-tight">
                  Espaço Exclusivo 💖
                </h2>
                
                <p className="text-lg text-[#3F2A2F]/50 mb-10 font-medium leading-relaxed">
                  A nossa comunidade é um jardim secreto reservado para alunas Premium. Um lugar de troca real, apoio e crescimento mútuo.
                </p>

                <div className="w-full space-y-6 mb-12 text-left">
                  {[
                    { icon: Heart, text: 'Apoio mútuo entre mulheres' },
                    { icon: TrendingUp, text: 'Celebração de conquistas' },
                    { icon: Sparkles, text: 'Mentoria e conteúdos extras' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-[#FAF7F5] flex items-center justify-center shrink-0 text-[#E8B4BC]">
                        <item.icon size={24} />
                      </div>
                      <span className="text-sm font-bold uppercase tracking-widest text-[#3F2A2F]/60">{item.text}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    setShowCommunityUpsell(false);
                    onUpgrade();
                  }}
                  className="w-full py-6 rounded-2xl font-poppins font-bold text-white bg-[#E8B4BC] hover:bg-[#3F2A2F] shadow-xl transition-all flex items-center justify-center gap-3"
                >
                  Quero ser Premium
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
