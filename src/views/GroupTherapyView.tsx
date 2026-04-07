import { Brain, MessageCircle, Users, Calendar, CheckCircle2, Heart, Sparkles } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import PremiumLock from '../components/PremiumLock';

export default function GroupTherapyView({ onUpgrade }: { onUpgrade: () => void }) {
  const { isPremium } = useUser();
  const { theme } = useTheme();

  if (!isPremium) {
    return (
    <div className="px-6 py-10 sm:px-10 h-full flex flex-col bg-transparent text-white">
        <div className="mb-10">
          <p className="text-[10px] font-bold text-[#D81BFF] uppercase tracking-[0.4em] mb-2">Equilíbrio Emocional</p>
          <h2 className="text-4xl font-sans font-bold text-white mb-3 tracking-tighter">Sua Mente em <span className="text-[#D81BFF]">Paz</span></h2>
          <p className="text-sm font-bold text-[#B8B0C8] uppercase tracking-widest">Apoio psicológico em grupo e individual para sua jornada</p>
        </div>
        <PremiumLock 
          title="Terapia e Apoio Psicológico"
          description="Participe de sessões de terapia em grupo, tenha acesso a conteúdos de inteligência emocional e suporte direto com psicólogas."
          onUpgrade={onUpgrade}
        />
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
          {/* Next Session */}
          <div className="luxury-card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D81BFF]/5 rounded-full blur-[60px] -mr-10 -mt-10"></div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-2xl text-white tracking-tight">Próxima Sessão</h3>
              <span className="px-4 py-1.5 bg-[#D81BFF]/10 text-[#D81BFF] rounded-xl text-[10px] font-bold uppercase tracking-widest border border-[#D81BFF]/20">Ao Vivo</span>
            </div>
            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-3xl bg-white/5 overflow-hidden border border-white/10 shadow-2xl p-1">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200" alt="Psicóloga" className="w-full h-full object-cover rounded-2xl" referrerPolicy="no-referrer" />
              </div>
              <div>
                <p className="text-[10px] text-[#B8B0C8] font-bold uppercase tracking-widest mb-1">Sua Psicóloga</p>
                <p className="font-bold text-white text-xl tracking-tight">Dra. Beatriz Costa</p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-[#D81BFF]">Hoje às 19:30</p>
              </div>
            </div>
            <button className="w-full py-5 rounded-3xl bg-[#D81BFF] text-white font-bold uppercase tracking-widest text-[10px] shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
              <Users size={18} />
              Entrar na Sala de Grupo
            </button>
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
