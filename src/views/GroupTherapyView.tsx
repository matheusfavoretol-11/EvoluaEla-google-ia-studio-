import { useState, useEffect } from 'react';
import { Heart, Users, Calendar, Play, Lock, ChevronRight, Clock, Star, MessageCircle, CheckCircle2, X, ArrowRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import { format, isAfter, isBefore, addMinutes, differenceInSeconds } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type TherapySession = {
  id: string;
  date: string;
  status: 'scheduled' | 'ongoing' | 'completed';
  zoom_link: string;
  zoom_meeting_id: string;
  password?: string;
  participants: string[];
  recorded_url?: string;
};

export default function GroupTherapyView({ onUpgrade }: { onUpgrade: () => void }) {
  const { isPremium, acessoTerapiaGrupo, userId, userName } = useUser();
  const { theme } = useTheme();
  
  const hasAccess = isPremium || acessoTerapiaGrupo;
  const [nextSession, setNextSession] = useState<TherapySession | null>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<TherapySession[]>([]);
  const [pastSessions, setPastSessions] = useState<TherapySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState<string>('');
  const [isJoinActive, setIsJoinActive] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Generic Title
  const therapyTitle = "Círculos de Terapia em Grupo";

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (!nextSession) return;

    const interval = setInterval(() => {
      const now = new Date();
      const sessionDate = new Date(nextSession.date);
      const diff = differenceInSeconds(sessionDate, now);

      if (diff <= 0) {
        setCountdown('Em andamento');
        // Active 10 mins before and during the session (assume 60 mins duration)
        const sessionEnd = addMinutes(sessionDate, 60);
        setIsJoinActive(isAfter(now, addMinutes(sessionDate, -10)) && isBefore(now, sessionEnd));
      } else {
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
        setIsJoinActive(diff <= 600); // 10 minutes
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextSession]);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      const now = new Date();
      const upcoming = data.filter(s => isAfter(new Date(s.date), now));
      const past = data.filter(s => isBefore(new Date(s.date), now)).reverse();

      setNextSession(upcoming[0] || null);
      setUpcomingSessions(upcoming.slice(1, 4));
      setPastSessions(past);
    } catch (err) {
      console.error('Error fetching therapy sessions:', err);
      // Mock data for demo if table doesn't exist yet
      const mockDate = new Date();
      mockDate.setHours(mockDate.getHours() + 2);
      setNextSession({
        id: '1',
        date: mockDate.toISOString(),
        status: 'scheduled',
        zoom_link: 'https://zoom.us/j/123456789',
        zoom_meeting_id: '123456789',
        participants: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = () => {
    if (!nextSession || !isJoinActive) return;
    window.open(nextSession.zoom_link, '_blank');
    // In a real app, we'd track participation
  };

  if (!hasAccess) {
    return (
      <div className="flex flex-col h-full bg-[#0A0A0A] text-white p-6">
        <div className="mb-10">
          <h2 className="text-5xl font-bold text-white mb-3 tracking-tighter"><span className="gradient-text">{therapyTitle}</span></h2>
          <p className="text-sm font-bold text-white/30 uppercase tracking-widest">Terapia em grupo quinzenal para mulheres que buscam evolução real.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2.5rem] p-10 text-white text-center mb-8 relative overflow-hidden glass-card border border-white/10"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8B4BC]/10 rounded-full blur-[100px] -mr-20 -mt-20 animate-pulse-soft"></div>
          <Heart className="w-16 h-16 text-[#D4B996] mx-auto mb-6 relative z-10" />
          <h3 className="text-3xl font-bold mb-4 relative z-10 tracking-tight">Acesso Exclusivo Premium</h3>
          <p className="text-white/40 text-base mb-10 relative z-10 font-medium leading-relaxed">
            Nossas sessões de terapia em grupo são um espaço seguro e acolhedor. 
            Participe de encontros quinzenais ao vivo com especialistas e outras mulheres da nossa comunidade.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
            <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
              <CheckCircle2 className="text-[#E8B4BC] shrink-0 mt-1" size={18} />
              <p className="text-sm text-white/60">Sessões quinzenais ao vivo</p>
            </div>
            <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
              <CheckCircle2 className="text-[#E8B4BC] shrink-0 mt-1" size={18} />
              <p className="text-sm text-white/60">Ambiente seguro e anônimo</p>
            </div>
            <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
              <CheckCircle2 className="text-[#E8B4BC] shrink-0 mt-1" size={18} />
              <p className="text-sm text-white/60">Gravações disponíveis por 7 dias</p>
            </div>
            <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
              <CheckCircle2 className="text-[#E8B4BC] shrink-0 mt-1" size={18} />
              <p className="text-sm text-white/60">Máximo de 25 participantes</p>
            </div>
          </div>

          <button 
            onClick={onUpgrade}
            className="font-bold uppercase tracking-widest text-xs py-5 px-10 rounded-full w-full transition-all hover:scale-105 hover:shadow-2xl bg-white text-black shadow-xl relative z-10"
          >
            Fazer Upgrade por R$ 97/mês
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-white p-6 pb-32 overflow-y-auto hide-scrollbar">
      <div className="mb-10">
        <h2 className="text-5xl font-bold text-white mb-3 tracking-tighter"><span className="gradient-text">{therapyTitle}</span></h2>
        <p className="text-sm font-bold text-white/30 uppercase tracking-widest">Seu espaço seguro de acolhimento e troca.</p>
      </div>

      {/* Próxima Sessão Card */}
      {nextSession ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden mb-10"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8B4BC]/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E8B4BC]/10 text-[#E8B4BC] rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#E8B4BC]/20">
                <Clock size={12} /> Próxima Sessão
              </div>
              <h3 className="text-3xl font-bold tracking-tight">O Poder da Vulnerabilidade</h3>
              <div className="flex items-center gap-4 text-white/40 text-sm font-medium">
                <span className="flex items-center gap-2"><Calendar size={16} /> {format(new Date(nextSession.date), "dd 'de' MMMM", { locale: ptBR })}</span>
                <span className="flex items-center gap-2"><Clock size={16} /> {format(new Date(nextSession.date), "HH:mm")}</span>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-4">
              <div className="text-center md:text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Começa em</p>
                <p className="text-3xl font-mono font-bold text-[#D4B996]">{countdown}</p>
              </div>
              
              <button 
                onClick={handleJoin}
                disabled={!isJoinActive}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all shadow-2xl ${
                  isJoinActive 
                    ? 'bg-gradient-to-r from-[#E8B4BC] to-[#D4B996] text-black hover:scale-105' 
                    : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                }`}
              >
                {isJoinActive ? <Play size={18} fill="currentColor" /> : <Lock size={18} />}
                Entrar na Sala
              </button>
              {!isJoinActive && (
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/20">Ativo 10 min antes do início</p>
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="glass-card p-10 rounded-[2.5rem] border border-white/5 text-center mb-10">
          <Calendar className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/40 font-medium">Nenhuma sessão agendada no momento.</p>
        </div>
      )}

      {/* Calendário Próximas Sessões */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-white mb-6 tracking-tight flex items-center gap-3">
          <Calendar className="text-[#E8B4BC]" size={24} /> Próximos Encontros
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingSessions.length > 0 ? upcomingSessions.map((session, idx) => (
            <div key={session.id} className="glass-card p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4B996] mb-2">Sessão {idx + 2}</p>
              <p className="font-bold text-lg mb-1">{format(new Date(session.date), "dd/MM", { locale: ptBR })}</p>
              <p className="text-sm text-white/40">{format(new Date(session.date), "EEEE, HH:mm", { locale: ptBR })}</p>
            </div>
          )) : (
            [1, 2, 3].map(i => (
              <div key={i} className="glass-card p-6 rounded-3xl border border-white/5 opacity-40">
                <div className="h-4 w-12 bg-white/10 rounded mb-2" />
                <div className="h-6 w-20 bg-white/10 rounded mb-1" />
                <div className="h-4 w-24 bg-white/10 rounded" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Histórico e Replays */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6 tracking-tight flex items-center gap-3">
          <Play className="text-[#E8B4BC]" size={24} /> Histórico & Replays
        </h3>
        <div className="space-y-4">
          {pastSessions.length > 0 ? pastSessions.map((session) => (
            <div key={session.id} className="glass-card p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-[#E8B4BC]/10 group-hover:text-[#E8B4BC] transition-all">
                  <Play size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg tracking-tight">Sessão de {format(new Date(session.date), "dd 'de' MMMM", { locale: ptBR })}</h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Disponível até {format(addMinutes(new Date(session.date), 10080), "dd/MM")}</p>
                </div>
              </div>
              <button 
                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 transition-all border border-white/5"
                onClick={() => session.recorded_url && window.open(session.recorded_url, '_blank')}
              >
                <ExternalLink size={20} />
              </button>
            </div>
          )) : (
            <div className="text-center py-10 text-white/10">
              <p className="text-[10px] font-bold uppercase tracking-widest">Nenhum replay disponível ainda.</p>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedback && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass-card p-10 max-w-md w-full shadow-2xl text-center relative border border-white/10"
            >
              <button onClick={() => setShowFeedback(false)} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors">
                <X size={24} />
              </button>
              <div className="w-20 h-20 bg-[#E8B4BC]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-[#E8B4BC]">
                <Star size={40} fill="currentColor" />
              </div>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">Como foi sua experiência?</h2>
              <p className="text-white/40 mb-8 font-medium">Sua opinião é fundamental para mantermos nosso círculo acolhedor.</p>
              
              <div className="space-y-6 text-left">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-3 block">O quanto você se sentiu acolhida? (0-10)</label>
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#E8B4BC] transition-all font-bold">{n}</button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => setShowFeedback(false)}
                  className="w-full py-5 rounded-full bg-white text-black font-bold uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-all"
                >
                  Enviar Feedback
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
