import { Brain, MessageCircle, Users, Calendar, CheckCircle2, Heart, Sparkles } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import PremiumLock from '../components/PremiumLock';

export default function GroupTherapyView({ onUpgrade }: { onUpgrade: () => void }) {
  const { isPremium, scheduledSessions, setScheduledSessions } = useUser();
  const { theme } = useTheme();

  const handleReserve = () => {
    const newSession = {
      id: `session-${Date.now()}`,
      date: '15/04/2026',
      time: '19:30',
      topic: 'Meditação Guiada e Ansiedade'
    };
    setScheduledSessions([...scheduledSessions, newSession]);
  };

  if (!isPremium) {
    return (
      <div className="flex flex-col h-full relative bg-transparent text-white font-sans">
        <header className="px-6 sm:px-10 pt-10 pb-6 flex flex-col gap-4 shrink-0 backdrop-blur-xl border-b border-white/5 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl bg-gradient-to-br from-[#D81BFF] to-[#F8C1FF] text-white">
              <Brain size={28} />
            </div>
            <div>
              <h2 className="font-bold text-2xl text-white tracking-tighter">Sua Mente em <span className="text-[#D81BFF] italic">Paz</span></h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8B0C8] mt-0.5">Equilíbrio emocional para você</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-10 sm:px-10 space-y-6 hide-scrollbar bg-transparent">
          <div className="luxury-card p-6 opacity-40">
            <h3 className="text-xl font-bold mb-4">Próximas Sessões</h3>
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="h-32 bg-white/5 rounded-2xl border border-white/10" />
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-10 sm:px-10 shrink-0 backdrop-blur-xl border-t border-white/5">
          <PremiumLock 
            title="Terapia e Apoio Psicológico"
            description="Cuide da sua saúde mental com sessões exclusivas! Tenha acesso a encontros ao vivo com especialistas."
            onUpgrade={onUpgrade}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 sm:px-10 pb-32 bg-transparent min-h-full text-white font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D81BFF]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="mb-10 relative z-10">
        <p className="text-[10px] font-bold text-[#D81BFF] uppercase tracking-[0.4em] mb-2">Equilíbrio Emocional</p>
        <h2 className="text-4xl font-sans font-bold text-white mb-3 tracking-tighter">Sua Mente em <span className="text-[#D81BFF]">Paz</span></h2>
        <p className="text-sm font-bold text-[#B8B0C8] uppercase tracking-widest">Apoio psicológico em grupo e individual para sua jornada</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
        <div className="space-y-8">
          {/* Scheduling System */}
          <div className="luxury-card p-8 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D81BFF]/5 rounded-full blur-[60px] -mr-10 -mt-10"></div>
            <div className="text-center space-y-2 mb-4">
              <h3 className="text-2xl font-bold text-white tracking-tight">Próximas Sessões de Bem-Estar</h3>
              <p className="text-sm text-[#B8B0C8] font-medium">Agende sua participação nas sessões ao vivo</p>
            </div>

            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-3xl bg-white/5 overflow-hidden border border-white/10 shadow-2xl p-1">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200" alt="Psicóloga" className="w-full h-full object-cover rounded-2xl" referrerPolicy="no-referrer" />
              </div>
              <div>
                <p className="text-[10px] text-[#B8B0C8] font-bold uppercase tracking-widest mb-1">Sua Psicóloga</p>
                <p className="font-bold text-white text-xl tracking-tight">Dra. Beatriz Costa</p>
                <button className="text-[10px] font-bold uppercase tracking-widest mt-2 text-[#D81BFF] hover:text-white transition-colors">Ver Perfil</button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-[#D81BFF] uppercase tracking-widest mb-1">Próxima Disponível</p>
                    <h4 className="text-xl font-bold text-white tracking-tight">Meditação Guiada</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">📅 15/04</p>
                    <p className="text-sm font-bold text-white">⏰ 19:30</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-[#B8B0C8]" />
                  <span className="text-xs font-bold text-[#B8B0C8]">12 vagas disponíveis</span>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <p className="text-[10px] font-bold text-[#B8B0C8] uppercase tracking-widest mb-2">Temas abordados:</p>
                  <ul className="grid grid-cols-2 gap-2">
                    {['Meditação guiada', 'Ansiedade', 'Autoestima', 'Equilíbrio'].map(t => (
                      <li key={t} className="flex items-center gap-2 text-xs text-white/70">
                        <div className="w-1 h-1 rounded-full bg-[#D81BFF]" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={handleReserve}
                  className="w-full py-4 rounded-full bg-[#D81BFF] text-white font-bold uppercase tracking-widest text-[10px] shadow-2xl hover:scale-[1.02] transition-all mt-4"
                >
                  Reservar Minha Vaga
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white px-2">Suas Reservas</h4>
                {scheduledSessions.length === 0 ? (
                  <p className="text-xs text-[#B8B0C8] px-2 italic text-center py-4">Nenhuma sessão agendada no momento.</p>
                ) : (
                  scheduledSessions.map(s => (
                    <div key={s.id} className="p-4 rounded-2xl bg-white/5 border border-[#D81BFF]/30 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white text-sm">{s.topic}</p>
                        <p className="text-[10px] text-[#B8B0C8] font-bold uppercase tracking-widest">{s.date} às {s.time}</p>
                      </div>
                      <CheckCircle2 size={18} className="text-[#D81BFF]" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-5">
            <button className="luxury-card flex flex-col items-center justify-center gap-4 hover:border-[#D81BFF]/50 transition-all group shadow-2xl">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 text-[#B8B0C8] group-hover:bg-[#D81BFF] group-hover:text-white transition-all border border-white/10">
                <MessageCircle size={28} />
              </div>
              <span className="font-bold text-[#B8B0C8] text-[10px] uppercase tracking-widest group-hover:text-white transition-colors text-center">Chat Privado</span>
            </button>
            <button className="luxury-card flex flex-col items-center justify-center gap-4 hover:border-[#D81BFF]/50 transition-all group shadow-2xl">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 text-[#B8B0C8] group-hover:bg-[#D81BFF] group-hover:text-white transition-all border border-white/10">
                <Brain size={28} />
              </div>
              <span className="font-bold text-[#B8B0C8] text-[10px] uppercase tracking-widest group-hover:text-white transition-colors text-center">Exercícios Mentais</span>
            </button>
          </div>
        </div>

        {/* Weekly Topics */}
        <div className="space-y-6">
          <h3 className="font-bold text-2xl text-white mb-6 tracking-tight px-2">Temas da Semana</h3>
          <div className="space-y-5">
            {[
              { name: 'Compulsão Alimentar', desc: 'Como lidar com gatilhos emocionais', icon: Heart, color: '#D81BFF' },
              { name: 'Autoestima e Imagem', desc: 'Reconstruindo sua relação com o espelho', icon: Sparkles, color: '#F8C1FF' },
              { name: 'Ansiedade e Rotina', desc: 'Ferramentas práticas para o dia a dia', icon: Brain, color: '#D81BFF' },
            ].map((topic, idx) => (
              <div key={`topic-${topic.name}-${idx}`} className="luxury-card border-white/10 hover:border-[#D81BFF]/30 transition-all shadow-2xl flex items-center gap-5 group">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-white/5 text-[#B8B0C8] group-hover:bg-[#D81BFF] group-hover:text-white transition-all border border-white/10">
                  <topic.icon size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg tracking-tight text-white">{topic.name}</h4>
                  <p className="text-sm font-bold text-[#B8B0C8]">{topic.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
