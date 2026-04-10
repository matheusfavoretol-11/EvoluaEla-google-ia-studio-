import { Brain, MessageSquare, BookHeart, Activity, HeartHandshake } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import PremiumLock from '../components/PremiumLock';

export default function MindView({ onUpgrade }: { onUpgrade: () => void }) {
  const { isPremium } = useUser();
  const { theme } = useTheme();

  if (!isPremium) {
    return (
      <div className="flex flex-col h-full relative bg-transparent text-white font-sans">
        <header className="px-6 sm:px-10 pt-10 pb-6 flex flex-col gap-4 shrink-0 backdrop-blur-xl border-b border-white/5 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl bg-gradient-to-br from-[#D81BFF] to-[#F8C1FF] text-white">
              <Brain size={28} />
            </div>
            <div>
              <h2 className="font-bold text-2xl text-white tracking-tighter">Equilíbrio <span className="text-[#D81BFF] italic">Emocional</span></h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8B0C8] mt-0.5">Sua mente em primeiro lugar</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-10 sm:px-10 space-y-6 hide-scrollbar bg-transparent">
          <div className="luxury-card p-6 opacity-40">
            <h3 className="text-xl font-bold mb-4">Sessões Guiadas</h3>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-white/5 rounded-2xl border border-white/10" />
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-10 sm:px-10 shrink-0 backdrop-blur-xl border-t border-white/5">
          <PremiumLock 
            title="Sua Terapeuta Particular"
            description="Sessões guiadas, exercícios emocionais, diário e chat direto com uma terapeuta para cuidar da sua mente."
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
        <p className="text-[10px] font-bold text-[#D81BFF] uppercase tracking-[0.4em] mb-2">Saúde Mental</p>
        <h2 className="text-4xl font-sans font-bold text-white mb-3 tracking-tighter">Equilíbrio <span className="text-[#D81BFF]">Emocional</span></h2>
        <p className="text-sm font-bold text-[#B8B0C8] uppercase tracking-widest">Trate a ansiedade, autoestima, disciplina e bloqueios emocionais com especialistas.</p>
      </div>

      <div className="space-y-8 relative z-10">
        {/* Therapist Profile */}
        <div className="luxury-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D81BFF]/5 rounded-full blur-[60px] -mr-10 -mt-10"></div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-2xl text-white tracking-tight">Sua Terapeuta</h3>
            <span className="px-4 py-1.5 bg-[#D81BFF]/10 text-[#D81BFF] rounded-xl text-[10px] font-bold uppercase tracking-widest border border-[#D81BFF]/20">Online</span>
          </div>
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 rounded-3xl bg-white/5 overflow-hidden border border-white/10 shadow-2xl p-1">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" alt="Terapeuta" className="w-full h-full object-cover rounded-2xl" referrerPolicy="no-referrer" />
            </div>
            <div>
              <p className="font-bold text-white text-xl tracking-tight">Dra. Camila Costa</p>
              <p className="text-[10px] text-[#B8B0C8] font-bold uppercase tracking-widest mt-1">Psicóloga Clínica</p>
              <button className="text-[10px] font-bold uppercase tracking-widest mt-2 text-[#D81BFF] hover:text-white transition-colors">Ver Perfil</button>
            </div>
          </div>
          <button className="w-full py-5 rounded-2xl bg-white text-black font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-2xl">
            <MessageSquare size={18} />
            Chat com Terapeuta
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-5">
          <button className="luxury-card flex flex-col items-center justify-center gap-4 hover:border-[#D81BFF]/50 transition-all group shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 text-[#B8B0C8] group-hover:bg-[#D81BFF] group-hover:text-white transition-all border border-white/10">
              <BookHeart size={28} />
            </div>
            <span className="font-bold text-[#B8B0C8] text-[10px] uppercase tracking-widest group-hover:text-white transition-colors">Diário Emocional</span>
          </button>
          <button className="luxury-card flex flex-col items-center justify-center gap-4 hover:border-[#D81BFF]/50 transition-all group shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 text-[#B8B0C8] group-hover:bg-[#D81BFF] group-hover:text-white transition-all border border-white/10">
              <Activity size={28} />
            </div>
            <span className="font-bold text-[#B8B0C8] text-[10px] uppercase tracking-widest group-hover:text-white transition-colors">Evolução Mental</span>
          </button>
        </div>

        {/* Guided Sessions */}
        <div>
          <h3 className="font-bold text-2xl text-white mb-6 tracking-tight px-2">Sessões Guiadas</h3>
          <div className="space-y-5">
            {[
              { title: 'Lidando com a Ansiedade', duration: '15 min', icon: Brain, color: 'text-white', bg: 'bg-white/5' },
              { title: 'Construindo Autoestima', duration: '20 min', icon: HeartHandshake, color: 'text-white', bg: 'bg-[#D81BFF]' },
              { title: 'Desbloqueios Emocionais', duration: '30 min', icon: Activity, color: 'text-white', bg: 'bg-[#D81BFF]/20' },
            ].map((session, idx) => (
              <div key={`${session.title}-${idx}`} className="luxury-card p-6 border border-white/10 flex items-center gap-5 hover:border-[#D81BFF]/30 transition-all cursor-pointer group shadow-2xl">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${session.bg} ${session.color} group-hover:scale-110 transition-transform border border-white/10`}>
                  <session.icon size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-lg tracking-tight mb-1 group-hover:text-[#D81BFF] transition-colors">{session.title}</h4>
                  <p className="text-[10px] text-[#B8B0C8] font-bold uppercase tracking-widest">{session.duration} • Áudio guiado</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
